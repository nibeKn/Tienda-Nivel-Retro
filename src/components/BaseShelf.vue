<template>
  <div class="base-shelf-container" :style="cssVars">
    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <BaseBackground :word="consoleName || 'CONSOLA'" />

    <div class="console-content">
      <div class="shelf-wrapper" :class="{ 'mobile-hidden': showMobileSheet }">
        <div class="console-shelf">
          <div class="shelf-header">
            <img :src="logoSrc" :alt="consoleName" class="shelf-logo" :style="computedLogoStyle" />
          </div>

          <div class="shelf-body">
            <div
              class="shelf-row"
              :class="{ 'hardware-row': row.some((i) => i.isHardware) }"
              v-for="(row, index) in shelves"
              :key="'row-' + index"
              :style="{ minHeight: getRowHeight(index) }"
            >
              <div
                class="game-item"
                v-for="(item, i) in row"
                :key="'item-' + index + '-' + i"
                :title="item.title || item.name"
                @click="selectItem(item)"
              >
                <img
                  :src="item.img"
                  :alt="item.name"
                  loading="lazy"
                  decoding="async"
                  :class="{
                    'hardware-box': item.isHardware,
                    'game-box': !item.isHardware,
                    'selected-box': selectedItem === item,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="console-info-panel" :class="{ 'mobile-sheet-open': showMobileSheet }">
        <div class="mobile-sheet-backdrop mobile-only" @click="closeMobileSheet"></div>
        <div class="info-card">
          <button
            class="mobile-close-btn mobile-only"
            @click="closeMobileSheet"
            v-if="selectedItem"
          >
            <i class="fas fa-times"></i>
          </button>
          <Transition name="fade-quick" mode="out-in">
            <div
              :key="selectedItem ? selectedItem.id || selectedItem.name : 'empty'"
              class="info-card-content"
            >
              <template v-if="selectedItem">
                <h2 class="info-title">{{ selectedItem.title || selectedItem.name }}</h2>
                <div v-if="!showDetailsView" class="media-view-container">
                  <p class="info-desc">{{ selectedItem.desc }}</p>

                  <div
                    class="media-gallery"
                    v-if="
                      selectedItem.media && (selectedItem.media.box3d || selectedItem.media.cart)
                    "
                  >
                    <h3 class="info-subtitle">Galería Multimedia</h3>
                    <div class="gallery-grid">
                      <div class="gallery-item" v-if="selectedItem.media.box3d">
                        <img
                          :src="selectedItem.media.box3d"
                          alt="Box 3D"
                          @click="openLightbox(selectedItem.media.box3d)"
                          class="clickable-img"
                        />
                        <span class="gallery-label">Caja Original</span>
                      </div>
                      <div class="gallery-item" v-if="selectedItem.media.cart">
                        <img
                          :src="selectedItem.media.cart"
                          alt="Cartridge Front"
                          @click="openLightbox(selectedItem.media.cart)"
                          class="clickable-img"
                        />
                        <span class="gallery-label">Cartucho / Disco</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="console-gallery"
                    v-if="selectedItem.isHardware && selectedItem.gallery"
                  >
                    <h3 class="info-subtitle">Galería Multimedia</h3>
                    <div class="console-gallery-grid">
                      <div
                        class="console-gallery-item"
                        v-for="(imgSrc, index) in selectedItem.gallery"
                        :key="index"
                      >
                        <img
                          :src="imgSrc"
                          :alt="`${consoleName} Console Image ${index + 1}`"
                          @click="openLightbox(imgSrc)"
                          class="clickable-img"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="video-preview" v-if="selectedItem.media && selectedItem.media.video">
                    <h3 class="info-subtitle">Jugabilidad</h3>
                    <div class="video-container">
                      <video
                        ref="videoPlayer"
                        :src="selectedItem.media.video"
                        autoplay
                        loop
                        :muted="isMuted"
                        playsinline
                        disablePictureInPicture
                      ></video>

                      <div class="video-controls">
                        <button class="mute-btn" @click="toggleMute">
                          <i
                            :class="
                              isMuted || videoVolume == 0
                                ? 'fas fa-volume-mute'
                                : 'fas fa-volume-up'
                            "
                          ></i>
                        </button>
                        <input
                          type="range"
                          class="volume-slider"
                          min="0"
                          max="1"
                          step="0.05"
                          v-model="videoVolume"
                          @input="updateVolume"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="details-view-container">
                  <div class="expanded-details">
                    <h3 class="info-subtitle">Ficha Técnica</h3>
                    <div class="expanded-details-grid">
                      <p v-if="selectedItem.details">
                        <strong
                          >{{ selectedItem.isHardware ? 'Estado / Cond.' : 'Género' }}:</strong
                        >
                        <br />
                        {{ selectedItem.details }}
                      </p>
                      <p v-if="selectedItem.year">
                        <strong>Año:</strong> <br />
                        {{ selectedItem.year }}
                      </p>
                      <p v-if="selectedItem.developer">
                        <strong>Estudio:</strong> <br />
                        {{ selectedItem.developer }}
                      </p>
                      <p v-if="selectedItem.players">
                        <strong>Jugadores:</strong> <br />
                        {{ selectedItem.players }}
                      </p>
                    </div>
                  </div>

                  <div class="expanded-purchase" v-if="selectedItem.price">
                    <div class="price-highlight expanded-price">
                      <span class="price-label">PRECIO</span>
                      <span class="price-value">{{ selectedItem.price }}</span>
                    </div>
                    <button
                      class="buy-button expanded-buy"
                      @click="$emit('add-to-cart', selectedItem)"
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              </template>

              <template v-else>
                <slot name="default-description"></slot>
              </template>
            </div>
          </Transition>
        </div>

        <!--
          The two controller face buttons switch the info card between the media
          view and the spec sheet, so they are real buttons: reachable by
          keyboard and announced with the section they open, not just the glyph.
        -->
        <div v-if="selectedItem" class="console-tabs-container">
          <button
            type="button"
            class="console-tab"
            :class="{ active: !showDetailsView }"
            :aria-pressed="!showDetailsView"
            aria-label="Ver descripción general"
            title="Descripción General"
            @click="setDetailsView(false)"
          >
            <span class="console-btn btn-primary" :class="{ pressed: !showDetailsView }">
              <span
                class="btn-letter"
                :class="{ 'is-square': buttonsConfig.primary.text === '□' }"
                aria-hidden="true"
                >{{ buttonsConfig.primary.text }}</span
              >
            </span>
          </button>

          <button
            type="button"
            class="console-tab"
            :class="{ active: showDetailsView }"
            :aria-pressed="showDetailsView"
            aria-label="Ver ficha técnica"
            title="Ficha Técnica"
            @click="setDetailsView(true)"
          >
            <span class="console-btn btn-secondary" :class="{ pressed: showDetailsView }">
              <span
                class="btn-letter"
                :class="{ 'is-square': buttonsConfig.secondary.text === '□' }"
                aria-hidden="true"
                >{{ buttonsConfig.secondary.text }}</span
              >
            </span>
          </button>
        </div>
      </aside>
    </div>

    <Transition name="fade">
      <div class="lightbox-overlay" v-if="lightboxImage" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">
            <i class="fas fa-times"></i>
          </button>
          <img :src="lightboxImage" alt="Expanded image" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import BaseBackground from './BaseBackground.vue';

const props = defineProps({
  consoleId: { type: String, default: '' },
  consoleName: { type: String, default: '' },
  shelfColor: { type: String, default: '#334155' },
  logoSrc: { type: String, default: '' },
  logoStyle: {
    type: Object,
    default: () => ({}),
  },
  gamesData: { type: Array, default: () => [] },
  shelfSpacing: { type: String, default: '140px' },
  rowHeights: {
    type: Array,
    default: () => [],
    // Array of strings for row heights. Ex: ['200px', '180px']
    // If not defined, fallback to shelfSpacing
  },
  buttonsConfig: {
    type: Object,
    default: () => ({
      primary: { text: 'A', color: '#1e56b8' },
      secondary: { text: 'B', color: '#00a84b' },
    }),
  },
  preselectedGame: { type: String, default: null },
});

defineEmits(['back', 'add-to-cart']);

const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);
  R = R < 255 ? R : 255;
  R = R < 0 ? 0 : R;
  G = G < 255 ? G : 255;
  G = G < 0 ? 0 : G;
  B = B < 255 ? B : 255;
  B = B < 0 ? 0 : B;
  let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);
  return '#' + RR + GG + BB;
};

const computedLogoStyle = computed(() => {
  if (!props.logoStyle) return {};
  const style = { ...props.logoStyle };

  const propertiesToScale = [
    'height',
    'width',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
  ];

  propertiesToScale.forEach((prop) => {
    if (style[prop] && typeof style[prop] === 'string' && style[prop].endsWith('px')) {
      const val = parseFloat(style[prop]);
      style[prop] = `calc(${val} * var(--m-scale, 1px))`;
    }
  });

  return style;
});

const cssVars = computed(() => {
  const getDarkerColor = (hex) => {
    if (!hex) return '#1e293b';
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    // Calculate relative luminance
    const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;

    if (luminance > 0.7) {
      // Very light color (like #e2e8f0). Darken significantly
      return shadeColor(hex, -65);
    } else if (luminance > 0.4) {
      // Medium color. Darken moderately
      return shadeColor(hex, -35);
    } else {
      // Already dark. Darken slightly for better contrast on white card
      return shadeColor(hex, -15);
    }
  };

  return {
    '--shelf-color': props.shelfColor,
    '--shelf-inner': shadeColor(props.shelfColor, -25),
    '--shelf-border': shadeColor(props.shelfColor, -15),
    '--shelf-shadow': shadeColor(props.shelfColor, -45),
    '--btn-primary': props.buttonsConfig.primary.color,
    '--btn-secondary': props.buttonsConfig.secondary.color,
    '--btn-primary-text':
      props.buttonsConfig.primary.textColor || shadeColor(props.buttonsConfig.primary.color, -50),
    '--btn-secondary-text':
      props.buttonsConfig.secondary.textColor ||
      shadeColor(props.buttonsConfig.secondary.color, -50),
    '--subtitle-color': getDarkerColor(props.shelfColor),
  };
});

const selectedItem = ref(null);
const lightboxImage = ref(null);
const showDetailsView = ref(false);
const showMobileSheet = ref(false);

const videoPlayer = ref(null);
const isMuted = ref(true);
const videoVolume = ref(0.2);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (videoPlayer.value) {
    videoPlayer.value.muted = isMuted.value;
    if (!isMuted.value && videoVolume.value == 0) {
      videoVolume.value = 0.5;
      videoPlayer.value.volume = 0.5;
    }
  }
};

const updateVolume = () => {
  isMuted.value = videoVolume.value == 0;
  if (videoPlayer.value) {
    videoPlayer.value.muted = isMuted.value;
    videoPlayer.value.volume = videoVolume.value;
  }
};

const selectItem = (item) => {
  selectedItem.value = item;
  showDetailsView.value = false;
  showMobileSheet.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  nextTick(() => {
    if (videoPlayer.value) {
      const player = Array.isArray(videoPlayer.value) ? videoPlayer.value[0] : videoPlayer.value;
      if (player) {
        player.muted = isMuted.value;
        player.volume = videoVolume.value;
        if (typeof player.play === 'function') {
          player.play().catch(() => {});
        }
      }
    }
  });
};

const openLightbox = (imgSrc) => {
  lightboxImage.value = imgSrc;
};

const closeLightbox = () => {
  lightboxImage.value = null;
};

const closeMobileSheet = () => {
  showMobileSheet.value = false;
  if (videoPlayer.value) {
    const player = Array.isArray(videoPlayer.value) ? videoPlayer.value[0] : videoPlayer.value;
    if (player && typeof player.pause === 'function') {
      player.pause();
    }
  }
};

const setDetailsView = (val) => {
  if (val === true && !showDetailsView.value) {
    if (videoPlayer.value) {
      const player = Array.isArray(videoPlayer.value) ? videoPlayer.value[0] : videoPlayer.value;
      if (player && typeof player.pause === 'function') {
        player.pause();
      }
    }
  }
  showDetailsView.value = val;
};

const getRowHeight = (index) => {
  if (props.rowHeights && props.rowHeights.length > index) {
    return props.rowHeights[index];
  }
  return props.shelfSpacing;
};

const shelves = ref([]);
watch(
  () => props.gamesData,
  (newVal) => {
    shelves.value = newVal || [];
  },
  { immediate: true }
);

onMounted(() => {
  checkPreselected(props.preselectedGame);
});

watch(
  () => props.preselectedGame,
  (newVal) => {
    checkPreselected(newVal);
  }
);

const checkPreselected = (name) => {
  if (!name) {
    selectedItem.value = null;
    return;
  }
  for (const row of shelves.value) {
    const match = row.find((g) => g.name === name);
    if (match) {
      selectItem(match);
      break;
    }
  }
};
</script>

<style scoped>
.base-shelf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px);
  background-color: #0f172a;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.console-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  gap: 60px;
  z-index: 1;
  align-items: stretch;
}

.shelf-wrapper {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
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
  z-index: 100;
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

.console-shelf {
  position: relative;
  z-index: 1;
  width: 650px;
  height: auto;
  min-height: 850px; /* Base height for all shelves to look consistent even if empty */
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.3));
}

.console-info-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.info-card {
  flex: 1;
  margin-bottom: 2px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 8px solid var(--shelf-color);
  font-family: 'Roboto', sans-serif;
  color: #334155;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 5;
}

.info-card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.info-title {
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  color: #1e293b;
  margin-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

.info-desc {
  font-size: 1.1rem;
  margin-bottom: 5px;
  text-align: justify;
}

.info-subtitle {
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  color: var(--subtitle-color);
  margin-bottom: 5px;
}

.media-gallery {
  margin-top: -10px;
  margin-bottom: -15px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.gallery-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  min-height: 180px;
  background: transparent;
  border: none;
}

.gallery-item img {
  width: 100%;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.25));
  transition: transform 0.3s;
}

.gallery-item:hover img {
  transform: translateY(-5px) scale(1.05);
}

.gallery-label {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.console-gallery {
  margin-top: 20px;
  margin-bottom: 20px;
}

.console-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.console-gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #334155;
  background: #fff;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.console-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 5px;
  transition: transform 0.3s;
}

.console-gallery-item:hover img {
  transform: scale(1.1);
}

.video-preview {
  margin-top: -15px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #334155;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
}

.video-container video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.video-controls {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  padding: 8px 15px;
  border-radius: 12px 0 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.3s;
}

.mute-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  display: flex;
  justify-content: center;
}

.mute-btn:hover {
  color: #38bdf8;
}

.volume-slider {
  width: 60px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  height: 4px;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #38bdf8;
}

.console-tabs-container {
  position: absolute;
  top: 90px;
  right: -100px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.console-tab {
  border: none;
  font: inherit;
  color: inherit;
  width: 85px;
  height: 65px;
  background-color: #cbd5e1;
  border-radius: 0 35px 35px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 18px;
  cursor: pointer;
  box-shadow:
    inset 4px 4px 6px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.5),
    3px 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateX(-20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.console-tab.active {
  background-color: #ffffff;
  box-shadow: 6px 4px 15px rgba(0, 0, 0, 0.15);
  transform: translateX(0);
  z-index: 6;
}

.console-tab.active::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 0;
  width: 40px;
  height: 100%;
  background-color: #ffffff;
  z-index: -1;
}

.console-tab:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 3px;
}

.console-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.console-btn::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.15) 100%
  );
  pointer-events: none;
}

.btn-primary {
  background-color: var(--btn-primary);
  box-shadow:
    inset -2px -2px 5px rgba(0, 0, 0, 0.4),
    inset 2px 2px 5px rgba(255, 255, 255, 0.4),
    2px 3px 4px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background-color: var(--btn-secondary);
  box-shadow:
    inset -2px -2px 5px rgba(0, 0, 0, 0.4),
    inset 2px 2px 5px rgba(255, 255, 255, 0.4),
    2px 3px 4px rgba(0, 0, 0, 0.3);
}

.console-btn.pressed {
  box-shadow:
    inset -1px -1px 3px rgba(0, 0, 0, 0.3),
    inset 1px 1px 3px rgba(255, 255, 255, 0.3),
    1px 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateY(2px) translateX(1px);
}

.btn-letter {
  font-family: 'Arial Rounded MT Bold', 'Verdana', sans-serif;
  font-size: 1.4rem;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.btn-letter.is-square {
  font-size: 2.5rem;
  transform: translateY(-7px);
}

.btn-primary .btn-letter {
  color: var(--btn-primary-text);
}
.btn-secondary .btn-letter {
  color: var(--btn-secondary-text);
}

.media-view-container,
.details-view-container {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease;
}

.details-view-container {
  flex: 1;
  gap: 30px;
  margin-top: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.expanded-details {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 6px solid #334155;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.expanded-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.expanded-details-grid p {
  margin: 0;
  font-size: 1.1rem;
  color: #475569;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.expanded-details-grid strong {
  color: #1e293b;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.expanded-purchase {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.expanded-price {
  padding: 20px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.price-label {
  color: #94a3b8;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  font-size: 0.85rem;
  margin-bottom: 2px;
}
.price-value {
  color: #ffffff;
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.buy-button {
  background: #e11d48;
  color: white;
  border: none;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(225, 29, 72, 0.4);
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.buy-button:hover {
  background: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(225, 29, 72, 0.5);
}

/* Shelf Top Banner */
.shelf-header {
  background-color: var(--shelf-color);
  height: 130px;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  border: 5px solid var(--shelf-border);
  border-bottom: none;
  box-shadow:
    inset 0 12px 20px rgba(255, 255, 255, 0.25),
    inset 0 -10px 15px rgba(0, 0, 0, 0.15);
}

.shelf-logo {
  height: calc(110 * var(--m-scale, 1px));
  filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.4));
}

.shelf-title {
  color: #ffffff;
  font-family: 'Arial Black', Impact, sans-serif;
  font-size: 3.2rem;
  margin: 0;
  letter-spacing: 1px;
  text-shadow:
    2px 2px 0px rgba(0, 0, 0, 0.2),
    4px 4px 6px rgba(0, 0, 0, 0.4);
}

/* Shelf Body */
.shelf-body {
  flex: 1;
  background-color: var(--shelf-inner);
  border-left: 20px solid var(--shelf-color);
  border-right: 20px solid var(--shelf-color);
  border-top: 15px solid var(--shelf-shadow);
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
}

.shelf-row {
  flex: 1;
  border-bottom: 32px solid var(--shelf-color);
  box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.6);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 15px;
  padding: 25px 15px 0 15px;
}

.shelf-row:last-child {
  border-bottom: 50px solid var(--shelf-color);
  border-radius: 0 0 8px 8px;
}

.shelf-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
  pointer-events: none;
}

.game-item {
  margin-bottom: -5px;
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.game-item:hover {
  transform: translateY(-15px) scale(1.1) rotateY(0deg);
  z-index: 10;
}

.game-box {
  height: 100%; /* Height controlled mostly by shelf-spacing / image ratio */
  max-height: calc(100% + 5px); /* Let it fill the shelf row */
  width: auto;
  max-width: 200px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: -8px 10px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transform: perspective(500px) rotateY(-5deg);
  transition: transform 0.3s;
}

/* Specific heights are generally scaled well via flex layout, but let's assure images fit */
.game-item img {
  max-height: 180px; /* Default max limit */
  display: block;
}

.game-item:hover .game-box {
  transform: perspective(500px) rotateY(0deg);
}

.hardware-box {
  height: 160px;
  max-height: none !important;
  width: auto;
  max-width: 220px;
  object-fit: contain;
  background-color: transparent;
  box-shadow: none;
  filter: drop-shadow(-8px 10px 10px rgba(0, 0, 0, 0.5));
  border-radius: 6px;
  border: none;
  transition: transform 0.3s;
}

.game-item:hover .hardware-box {
  transform: scale(1.05);
}

.selected-box {
  outline: 4px solid #ffffff;
  outline-offset: 4px;
  border-radius: 6px;
  transform: translateY(-15px) scale(1.1) rotateY(0deg) !important;
  z-index: 20 !important;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))
    drop-shadow(-8px 10px 10px rgba(0, 0, 0, 0.5)) !important;
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}
.lightbox-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.lightbox-close {
  position: absolute;
  top: -40px;
  right: -40px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  transition:
    transform 0.2s,
    color 0.2s;
}
.lightbox-close:hover {
  transform: scale(1.1);
  color: #e11d48;
}
.clickable-img {
  cursor: zoom-in;
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
}

/* --- Mobile Responsive Rules --- */
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }

  .base-shelf-container {
    overflow: clip;
    min-height: auto;
    flex: none;
  }

  .base-shelf-container :deep(.pattern-bg) {
    height: 100% !important;
  }

  .console-content {
    flex-direction: column;
    padding: 20px 0;
    gap: 20px;
    align-items: center;
    justify-content: center;
    flex: 1;
    --m-scale: calc(95vw / 650);
  }

  .back-btn {
    position: relative;
    top: auto;
    left: auto;
    align-self: flex-start;
    margin: 15px 15px 0 15px;
    padding: 8px 12px;
    font-size: 0.95rem;
    z-index: 90;
  }

  /* Make the shelf fluid and proportional */
  .shelf-wrapper {
    width: 100%;
    justify-content: center;
  }

  .shelf-wrapper.mobile-hidden {
    display: none;
  }

  .console-shelf {
    width: 95vw;
    min-height: calc(850 * var(--m-scale));
  }

  .shelf-header {
    height: calc(130 * var(--m-scale));
    gap: calc(25 * var(--m-scale));
    border-width: calc(5 * var(--m-scale));
  }

  .shelf-title {
    font-size: calc(51.2 * var(--m-scale));
    text-shadow:
      calc(2 * var(--m-scale)) calc(2 * var(--m-scale)) 0px rgba(0, 0, 0, 0.2),
      calc(4 * var(--m-scale)) calc(4 * var(--m-scale)) calc(6 * var(--m-scale)) rgba(0, 0, 0, 0.4);
  }

  .shelf-body {
    border-left-width: calc(20 * var(--m-scale));
    border-right-width: calc(20 * var(--m-scale));
    border-top-width: calc(15 * var(--m-scale));
  }

  .shelf-row {
    min-height: 0 !important;
    border-bottom-width: calc(32 * var(--m-scale));
    padding: calc(25 * var(--m-scale)) calc(15 * var(--m-scale)) 0 calc(15 * var(--m-scale));
    gap: calc(15 * var(--m-scale));
  }

  .shelf-row:last-child {
    border-bottom-width: calc(50 * var(--m-scale));
  }

  .shelf-row::before {
    height: calc(30 * var(--m-scale));
  }

  .game-item {
    margin-bottom: calc(-5 * var(--m-scale));
  }

  .game-item:hover {
    transform: translateY(calc(-15 * var(--m-scale))) scale(1.1) rotateY(0deg);
  }

  .game-box {
    max-width: calc(200 * var(--m-scale));
  }

  .game-item img {
    max-height: calc(180 * var(--m-scale));
  }

  .hardware-box {
    height: calc(160 * var(--m-scale));
    max-width: calc(220 * var(--m-scale)) !important;
  }

  .selected-box {
    outline-width: calc(4 * var(--m-scale));
    outline-offset: calc(4 * var(--m-scale));
    transform: translateY(calc(-15 * var(--m-scale))) scale(1.1) rotateY(0deg) !important;
  }

  /* ===== Mobile Info Panel (Replaces shelf, full-page scroll) ===== */

  .shelf-wrapper.mobile-hidden {
    display: none;
  }

  .mobile-sheet-backdrop {
    display: none; /* No backdrop needed, shelf is replaced */
  }

  .console-info-panel {
    display: none;
    width: 100%;
    position: static;
    z-index: auto;
    pointer-events: auto;
    background: transparent;
  }

  .console-info-panel.mobile-sheet-open {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: mobileSlideIn 0.3s ease;
  }

  @keyframes mobileSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .info-card {
    position: relative;
    width: 85vw;
    height: auto;
    max-height: none; /* No clipping, content flows naturally */
    margin: 0 auto;
    padding: 24px 20px 20px;
    background: #ffffff !important;
    color: #1e293b !important;
    border-radius: 16px;
    border-left: 6px solid var(--shelf-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: visible; /* Full content visible, page scrolls */
    opacity: 1;
    pointer-events: auto;
    z-index: 5;
  }

  .mobile-close-btn {
    position: absolute;
    top: -10px;
    right: 10px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #334155;
    font-size: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mobile-close-btn:active {
    background: #e2e8f0;
  }

  .info-title {
    font-size: 1.6rem;
    color: #1e293b;
    padding-right: 50px;
    margin-top: 0;
    margin-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
  }

  .info-desc {
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.65;
    text-align: justify;
  }

  .info-subtitle {
    font-size: 1.3rem;
    margin-top: 12px;
  }

  .gallery-grid,
  .console-gallery-grid {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
  }

  .gallery-item {
    min-height: 140px;
  }

  .gallery-item img,
  .console-gallery-item img {
    max-height: 120px;
  }

  .video-container {
    max-height: 200px;
  }

  .video-container video {
    max-height: 180px;
  }

  .expanded-details-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .expanded-details-grid p {
    font-size: 0.95rem;
    padding: 10px;
  }

  .price-highlight {
    margin-top: 12px;
  }

  .buy-button {
    width: 100%;
    padding: 14px;
    font-size: 1.1rem;
  }

  /* Tabs at the bottom */
  .console-tabs-container {
    position: static;
    transform: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    z-index: 1;
    pointer-events: auto;
    opacity: 1;
    margin-top: -20px;
  }

  .console-tab {
    width: 45px;
    height: 55px;
    border-radius: 0 0 22px 22px;
    background-color: #cbd5e1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    transform: translateY(0);
    box-shadow:
      inset -2px -4px 5px rgba(0, 0, 0, 0.1),
      inset 2px -2px 5px rgba(255, 255, 255, 0.5),
      0 6px 10px rgba(0, 0, 0, 0.2);
    pointer-events: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .console-tab.active {
    background-color: #ffffff;
    transform: translateY(12px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  .console-tab.active::before {
    display: none;
  }

  .console-btn {
    width: 34px;
    height: 34px;
  }

  .btn-letter {
    font-size: 1.1rem;
  }

  .btn-letter.is-square {
    font-size: 1.3rem;
    transform: translateY(-2px);
  }

  .lightbox-close {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 10;
  }
}
</style>
