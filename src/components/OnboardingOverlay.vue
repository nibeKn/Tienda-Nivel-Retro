<template>
  <transition name="fade">
    <div v-if="isVisible" class="onboarding-overlay">
      <div class="xp-window">
        <div class="xp-title-bar">
          <div class="xp-title">
            <div class="xp-icon"></div>
            Nivel Retro: Controles {{ isMobile ? 'Táctiles' : 'de Ratón' }}
          </div>
          <div class="xp-controls">
            <span class="xp-btn min" aria-hidden="true"></span>
            <span class="xp-btn max" aria-hidden="true"></span>
            <button
              type="button"
              class="xp-btn close"
              aria-label="Cerrar la guía"
              @click="finishOnboarding"
            >
              ×
            </button>
          </div>
        </div>

        <div class="xp-body">
          <h2>¡Bienvenido a Nivel Retro!</h2>
          <p class="subtitle">Descubre cómo explorar nuestra tienda interactiva</p>

          <div class="tips-container">
            <div
              class="tip-card"
              v-for="(tip, index) in tips"
              :key="index"
              :style="{ animationDelay: `${index * 0.15}s` }"
            >
              <div class="tip-icon">
                <img :src="tip.icon" :alt="tip.title" class="tip-icon-img" />
              </div>
              <div class="tip-text">
                <h3>{{ tip.title }}.</h3>
                <p>{{ tip.desc }}</p>
              </div>
            </div>
          </div>

          <div class="btn-container">
            <button class="start-btn" @click="finishOnboarding">
              <div class="start-btn-inner">¡Entendido, a explorar!</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import icoHand1 from '../assets/ico/ico_hand1.png';
import icoGlass1 from '../assets/ico/ico_glass1.png';
import icoFurn1 from '../assets/ico/ico_furn1.png';

const emit = defineEmits(['finish']);

const isVisible = ref(false);

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const tips = isMobile
  ? [
      {
        icon: icoHand1,
        title: 'Desliza para moverte',
        desc: 'Toca y desliza el dedo por la pantalla para explorar toda la tienda.',
      },
      {
        icon: icoGlass1,
        title: 'Acércate',
        desc: 'Usa el gesto de pellizcar en la pantalla para ver los detalles de cerca.',
      },
      {
        icon: icoFurn1,
        title: 'Muebles interactivos',
        desc: 'Toca los muebles y estantes resaltados para ver nuestros catálogos.',
      },
    ]
  : [
      {
        icon: icoHand1,
        title: 'Arrastra para moverte',
        desc: 'Haz click y arrastra el ratón por el mapa para explorar toda la tienda.',
      },
      {
        icon: icoGlass1,
        title: 'Acércate',
        desc: 'Usa la rueda del ratón o el control de zoom para ver los detalles de cerca.',
      },
      {
        icon: icoFurn1,
        title: 'Muebles interactivos',
        desc: 'Haz click en los muebles y estantes resaltados para ver nuestros catálogos.',
      },
    ];

const finishOnboarding = () => {
  isVisible.value = false;
  localStorage.setItem('nivelRetroOnboarding', 'completed');
  emit('finish');
};

onMounted(() => {
  if (!localStorage.getItem('nivelRetroOnboarding')) {
    isVisible.value = true;
  }
});
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
}

.xp-window {
  background-color: #1e293b;
  border: 3px solid #3b82f6;
  border-radius: 8px 8px 0 0;
  width: 90%;
  max-width: 500px;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(59, 130, 246, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* For border radius */
  font-family: 'Press Start 2P', cursive;
}

.xp-title-bar {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #1e40af;
}

.xp-title {
  color: #f8fafc;
  font-size: 10px;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  margin-top: 3px;
}

.xp-icon {
  width: 14px;
  height: 12px;
  background-color: #f8fafc;
  border-top: 3px solid #1e3a8a;
  border-bottom: 3px solid #1e3a8a;
}

.xp-controls {
  display: flex;
  gap: 4px;
}

.xp-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #93c5fd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset -1px -1px 2px rgba(0, 0, 0, 0.3),
    inset 1px 1px 2px rgba(255, 255, 255, 0.3);
  padding: 0;
  background-color: #3b82f6;
  transition: background-color 0.2s;
}

.xp-btn:hover {
  background-color: #60a5fa;
}

.xp-btn.min::before {
  content: '';
  width: 10px;
  height: 2px;
  background-color: #f8fafc;
  margin-top: 8px;
}

.xp-btn.max::before {
  content: '';
  width: 10px;
  height: 8px;
  border: 1px solid #f8fafc;
  border-top-width: 2px;
}

.xp-btn.close {
  background-color: #ef4444;
  border-color: #fca5a5;
  color: white;
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
}

.xp-btn.close:hover {
  background-color: #f87171;
}

.xp-body {
  padding: 30px;
  background-color: #1e293b;
  color: #f8fafc;
}

.xp-body h2 {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  color: #fbbf24;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.4;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 35px;
}

.tip-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: rgba(15, 23, 42, 0.5);
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: slideIn 0.5s ease backwards;
}

.tip-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-icon-img {
  width: 100%;
  height: 100%;
  max-width: 48px;
  max-height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tip-text {
  flex: 1;
}

.tip-text h3 {
  margin: 0 0 10px 0;
  font-size: 0.8rem;
  color: #e2e8f0;
  line-height: 1.4;
}

.tip-text p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.65rem;
  line-height: 1.6;
}

.btn-container {
  text-align: center;
}

.start-btn {
  background: #0f172a;
  border: 2px solid #3b82f6;
  padding: 4px;
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  background: #1e293b;
}

.start-btn-inner {
  border: 2px dotted #60a5fa;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 4px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .xp-window {
    width: 95%;
    max-height: 90dvh;
  }
  .xp-body {
    padding: 20px 15px;
    overflow-y: auto;
  }
  .xp-body h2 {
    font-size: 1rem;
  }
  .subtitle {
    font-size: 0.65rem;
  }
  .tip-card {
    padding: 12px 15px;
    gap: 12px;
  }
  .tip-icon {
    width: 36px;
    height: 36px;
  }
  .tip-icon-img {
    max-width: 36px;
    max-height: 36px;
  }
  .tip-text h3 {
    font-size: 0.75rem;
  }
  .tip-text p {
    font-size: 0.6rem;
  }
  .start-btn-inner {
    padding: 8px 15px;
    font-size: 0.7rem;
  }
}
</style>
