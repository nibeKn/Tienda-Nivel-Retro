<template>
  <Transition name="fade">
    <div class="arcade-overlay" v-if="show">
      <BaseBackground word="ARCADE" />

      <button class="back-btn" @click="$emit('close')">
        <i class="fas fa-arrow-left"></i> Volver a la Tienda
      </button>

      <div class="arcade-cabinet-container">
        <div class="arcade-cabinet-frame" :style="{ borderColor: themeColor }">
          <div class="arcade-cabinet-inner">
            <div class="arcade-header">
              <h2 class="pixel-text">
                <slot name="icon-left"></slot>
                <img v-if="logoUrl" :src="logoUrl" :alt="title" class="game-logo" />
                <span v-else class="game-title">{{ title }}</span>
                <span class="game-year">({{ year }})</span>
                <slot name="icon-right"></slot>
              </h2>
              <hr class="header-divider" />
            </div>

            <div class="arcade-main-content">
              <div class="crt-container">
                <div class="crt-bezel">
                  <div class="crt-screen">
                    <div class="scanlines"></div>
                    <div class="video-placeholder">
                      <video v-if="videoUrl" autoplay muted loop playsinline class="screen-video">
                        <source :src="videoUrl" type="video/mp4" />
                      </video>
                      <img v-else :src="images[0]" alt="Game Screenshot" class="screen-img" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-area">
                <h3 class="info-title pixel-text">DATOS & LEGADO</h3>
                <ul class="details-list">
                  <li v-for="(value, key) in details" :key="key">
                    <span class="detail-key">{{ key }}:</span>
                    <span class="detail-value">{{ value }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="arcade-footer">
              <a
                :href="playUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="pixel-btn play-btn"
              >
                JUGAR AHORA
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import BaseBackground from './BaseBackground.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    default: '',
  },
  details: {
    type: Object,
    default: () => ({}),
  },
  videoUrl: {
    type: String,
    default: '',
  },
  logoUrl: {
    type: String,
    default: '',
  },
  history: {
    type: Array,
    default: () => [],
  },
  playUrl: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: () => [],
  },
  themeColor: {
    type: String,
    default: '#fbbf24',
  },
});

defineEmits(['close']);
</script>

<style scoped>
.arcade-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0f172a;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pixel-text {
  font-family: 'Press Start 2P', cursive;
  line-height: 1.5;
}

.arcade-cabinet-container {
  width: 90%;
  max-width: 950px;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 10;
}

.arcade-cabinet-frame {
  background-color: #c04828;
  padding: 15px;
  border-radius: 20px;
  border: 10px solid #8c3018;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
}

.arcade-cabinet-inner {
  background-color: #111;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5);
}

.arcade-header {
  text-align: center;
}

.game-logo {
  height: 70px;
  max-width: 400px;
  object-fit: contain;
  vertical-align: middle;
  filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
}

.game-title {
  color: #ffcc00;
  font-size: 2.2rem;
  text-shadow:
    4px 4px 0 #ef4444,
    6px 6px 0 #000;
  letter-spacing: -2px;
}

.game-year {
  color: #fff;
  font-size: 1.5rem;
  margin-left: 15px;
  vertical-align: middle;
}

.header-divider {
  border: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #444, transparent);
  margin-top: 20px;
}

.arcade-main-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
}

.crt-container {
  background-color: #111;
  padding: 15px;
  border-radius: 15px;
  border: 4px solid #333;
  box-shadow: inset 0 0 30px #000;
}

.crt-bezel {
  background-color: #000;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #222;
  position: relative;
  overflow: hidden;
}

.crt-screen {
  aspect-ratio: 4/3;
  background-color: #050505;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 5;
  background-size:
    100% 4px,
    3px 100%;
  pointer-events: none;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: contrast(1.2) brightness(1.1);
}

.screen-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-title {
  color: #fff;
  font-size: 1.2rem;
  letter-spacing: 1px;
  border-bottom: 2px solid #ef4444;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-key {
  display: block;
  color: #ffcc00;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.detail-value {
  color: #fff;
  font-size: 1.05rem;
  line-height: 1.6;
}

.arcade-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pixel-btn {
  font-family: 'Press Start 2P', cursive;
  text-decoration: none;
  padding: 20px 50px;
  font-size: 1.5rem;
  color: #fff;
  background-color: #ef4444;
  border: 4px solid #000;
  border-radius: 12px;
  box-shadow:
    0 6px 0 #8c3018,
    0 10px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.1s;
  cursor: pointer;
}

.pixel-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.pixel-btn:active {
  transform: translateY(4px);
  box-shadow:
    0 2px 0 #8c3018,
    0 5px 10px rgba(0, 0, 0, 0.5);
}

.back-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: #1e293b;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #3b82f6;
  transform: translateX(-5px);
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 850px) {
  .arcade-overlay {
    position: fixed;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 20px 40px 20px;
    gap: 20px;
    box-sizing: border-box;
  }
  .arcade-overlay :deep(.pattern-bg) {
    height: 100% !important;
  }

  .back-btn {
    position: relative;
    top: 0;
    left: 0;
    align-self: flex-start;
    padding: 8px 15px;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .arcade-main-content {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .arcade-cabinet-container {
    width: 100%;
    max-width: 330px;
    margin: 0;
  }

  .arcade-cabinet-inner {
    padding: 15px;
    gap: 15px;
  }

  .arcade-header h2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .game-logo {
    height: auto;
    max-height: 60px;
    max-width: 100%;
    margin: 0 auto;
  }

  .game-year {
    margin-left: 0;
    font-size: 1rem;
  }

  .info-area {
    gap: 10px;
  }

  .info-title {
    font-size: 1rem;
    margin-bottom: 5px;
    padding-bottom: 5px;
  }

  .details-list {
    gap: 8px;
  }

  .detail-key {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }

  .detail-value {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .pixel-btn.play-btn {
    text-align: center;
    line-height: 2;
    padding: 12px 15px;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    display: block;
  }
}
</style>
