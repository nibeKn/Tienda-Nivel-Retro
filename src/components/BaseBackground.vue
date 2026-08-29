<template>
  <div class="pattern-bg" :style="bgStyle"></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
});

const patternWidth = computed(() => Math.max(200, props.word.length * 17 + 80));

const bgStyle = computed(() => {
  const w = patternWidth.value;
  const svg = `<svg width="${w}" height="120" viewBox="0 0 ${w} 120" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dy=".3em" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#e2e8f0" text-anchor="middle">${props.word}</text></svg>`;
  return {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`,
    backgroundSize: `${w}px 120px`,
  };
});
</script>

<style scoped>
.pattern-bg {
  position: absolute;
  top: -100vh;
  left: -100vw;
  width: 300vw;
  height: 300vh;
  background-repeat: repeat;
  z-index: 0;
  opacity: 0.15;
  transform: rotate(-38deg);
  animation: bgMove 250s linear infinite;
  pointer-events: none;
}

@keyframes bgMove {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 0;
  }
}
</style>
