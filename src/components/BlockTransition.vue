<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const BLOCK_SIZE = 60;
const cols = ref(0);
const rows = ref(0);
const blocks = ref([]);

const isActive = ref(false); // Whether the overlay is visible at all
const animationPhase = ref('idle'); // 'idle' | 'covering' | 'covered' | 'revealing'

const recalc = () => {
  // Never fall to zero: a 0x0 viewport would build an empty grid, and an empty
  // grid schedules no timers — leaving cover()/reveal() permanently pending.
  cols.value = Math.max(1, Math.ceil(window.innerWidth / BLOCK_SIZE));
  rows.value = Math.max(1, Math.ceil(window.innerHeight / BLOCK_SIZE));
  const total = cols.value * rows.value;
  blocks.value = Array.from({ length: total }, (_, i) => ({ id: i, visible: false }));
};

onMounted(() => {
  recalc();
  window.addEventListener('resize', recalc);
});

onUnmounted(() => {
  window.removeEventListener('resize', recalc);
});

// Shuffle helper for random stagger order
const shuffleIndices = (n) => {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Phase 1: Animate blocks IN (cover the screen).
 * Returns a Promise that resolves when all blocks are visible.
 */
const cover = () => {
  return new Promise((resolve) => {
    isActive.value = true;
    animationPhase.value = 'covering';
    const total = blocks.value.length;
    const staggerTotalMs = 350; // All blocks appear within this window
    const order = shuffleIndices(total);

    // Reset all to invisible first
    blocks.value.forEach((b) => (b.visible = false));

    let resolved = false;
    const settle = () => {
      if (resolved) return;
      resolved = true;
      animationPhase.value = 'covered';
      resolve();
    };
    // The router awaits this promise, so it must settle even if the per-block
    // timers never run.
    setTimeout(settle, staggerTotalMs + 400);
    order.forEach((blockIdx, i) => {
      const delay = (i / total) * staggerTotalMs;
      setTimeout(() => {
        if (blocks.value[blockIdx]) blocks.value[blockIdx].visible = true;
        // Resolve when last block becomes visible
        if (i === total - 1) {
          // Small extra buffer to ensure the last block renders
          setTimeout(settle, 80);
        }
      }, delay);
    });
  });
};

/**
 * Phase 2: Animate blocks OUT (reveal the new content).
 */
const reveal = () => {
  return new Promise((resolve) => {
    animationPhase.value = 'revealing';
    const total = blocks.value.length;
    const staggerTotalMs = 350;
    const order = shuffleIndices(total);

    let resolved = false;
    const settle = () => {
      if (resolved) return;
      resolved = true;
      isActive.value = false;
      animationPhase.value = 'idle';
      resolve();
    };
    setTimeout(settle, staggerTotalMs + 400);
    order.forEach((blockIdx, i) => {
      const delay = (i / total) * staggerTotalMs;
      setTimeout(() => {
        if (blocks.value[blockIdx]) blocks.value[blockIdx].visible = false;
        if (i === total - 1) {
          setTimeout(settle, 80);
        }
      }, delay);
    });
  });
};

defineExpose({ cover, reveal });
</script>

<template>
  <div class="bt-overlay" v-show="isActive">
    <div class="bt-grid" :style="{ gridTemplateColumns: `repeat(${cols}, ${BLOCK_SIZE}px)` }">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="bt-block"
        :class="{ 'bt-block--visible': block.visible }"
      />
    </div>
  </div>
</template>

<style scoped>
.bt-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  overflow: hidden;
}

.bt-grid {
  display: grid;
  width: 100%;
  height: 100%;
}

.bt-block {
  width: 60px;
  height: 60px;
  background-color: #0a0a0a;
  opacity: 0;
  transition: opacity 0.12s ease-in-out;
  will-change: opacity;
}

.bt-block--visible {
  opacity: 1;
}
</style>
