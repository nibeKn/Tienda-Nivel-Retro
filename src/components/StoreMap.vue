<template>
  <div
    class="store-interactive-area"
    @mousedown="startDrag"
    @mousemove="handleMouseMove"
    @mouseup="endDrag"
    @mouseleave="onMouseLeave"
    @wheel.prevent="onWheel"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMoveHandler"
    @touchend="onTouchEnd"
  >
    <vue-particles id="tsparticles" :options="particlesOptions" class="particles-layer" />

    <transition name="tooltip-fade">
      <div
        v-if="hoveredStand && getHoveredTitle() && !isDragging"
        class="global-cursor-tooltip"
        :style="{ left: mouseX + 15 + 'px', top: mouseY + 15 + 'px' }"
      >
        {{ getHoveredTitle() }}
      </div>
    </transition>
    <nav class="mobile-category-bar mobile-only" @mousedown.stop @wheel.stop @touchstart.stop>
      <transition name="fade">
        <div class="scroll-indicator-left" v-show="canScrollCategoryLeft">
          <i class="fas fa-chevron-left"></i>
        </div>
      </transition>
      <transition name="fade">
        <div class="scroll-indicator-right" v-show="canScrollCategoryRight">
          <i class="fas fa-chevron-right"></i>
        </div>
      </transition>
      <div class="mobile-category-scroll" ref="categoryScrollRef" @scroll="handleCategoryScroll">
        <button class="mobile-category-btn" @click="$emit('navigate', 'n64')">
          <img :src="logoN64" alt="N64" class="mobile-cat-icon" />
          <span class="mobile-cat-name">N64</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'gc')">
          <img :src="logoGC" alt="GC" class="mobile-cat-icon" />
          <span class="mobile-cat-name">GC</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'wii')">
          <img :src="logoWii" alt="Wii" class="mobile-cat-icon" />
          <span class="mobile-cat-name">Wii</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'ps1')">
          <img :src="logoPS1" alt="PS1" class="mobile-cat-icon" />
          <span class="mobile-cat-name">PS1</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'ps2')">
          <img :src="logoPS2" alt="PS2" class="mobile-cat-icon" />
          <span class="mobile-cat-name">PS2</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'ps3')">
          <img :src="logoPS3" alt="PS3" class="mobile-cat-icon" />
          <span class="mobile-cat-name">PS3</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'merch')">
          <i class="fas fa-tshirt mobile-cat-icon" style="color: #ffb74d"></i>
          <span class="mobile-cat-name">MERCH</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'museum')">
          <i class="fas fa-landmark mobile-cat-icon" style="color: #64a0ff"></i>
          <span class="mobile-cat-name">MUSEO</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'music')">
          <i class="fas fa-music mobile-cat-icon" style="color: #f06292"></i>
          <span class="mobile-cat-name">MÚSICA</span>
        </button>
        <button class="mobile-category-btn" @click="$emit('navigate', 'magazine')">
          <i class="fas fa-book-open mobile-cat-icon" style="color: #4dd0e1"></i>
          <span class="mobile-cat-name">REVISTAS</span>
        </button>
      </div>
    </nav>

    <aside class="floating-menu desktop-only" @mousedown.stop @wheel.stop @touchstart.stop>
      <div class="sidebar-group">
        <h2 class="sidebar-title">NINTENDO</h2>
        <ul class="filter-list">
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'n64')"
              @mouseenter="hoveredStand = 'repisa_n64'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoN64" alt="N64" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">N64</span>
                <span class="btn-count">({{ counts.n64 }} juegos)</span>
              </div>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'gc')"
              @mouseenter="hoveredStand = 'repisa_gc'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoGC" alt="GC" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">GC</span>
                <span class="btn-count">({{ counts.gc }} juegos)</span>
              </div>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'wii')"
              @mouseenter="hoveredStand = 'repisa_wii'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoWii" alt="Wii" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">Wii</span>
                <span class="btn-count">({{ counts.wii }} juegos)</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div class="sidebar-group">
        <h2 class="sidebar-title">PLAYSTATION</h2>
        <ul class="filter-list">
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'ps1')"
              @mouseenter="hoveredStand = 'repisa_ps1'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoPS1" alt="PS1" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">PS1</span>
                <span class="btn-count">({{ counts.ps1 }} juegos)</span>
              </div>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'ps2')"
              @mouseenter="hoveredStand = 'repisa_ps2'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoPS2" alt="PS2" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">PS2</span>
                <span class="btn-count">({{ counts.ps2 }} juegos)</span>
              </div>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'ps3')"
              @mouseenter="hoveredStand = 'repisa_ps3'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><img :src="logoPS3" alt="PS3" class="console-logo"
              /></span>
              <div class="btn-text">
                <span class="btn-name">PS3</span>
                <span class="btn-count">({{ counts.ps3 }} juegos)</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div class="sidebar-group">
        <h2 class="sidebar-title">ESPECIALES</h2>
        <ul class="filter-list">
          <li>
            <button
              class="filter-btn museum-btn"
              @click="$emit('navigate', 'museum')"
              @mouseenter="hoveredStand = 'mueble_retro'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><i class="fas fa-landmark" style="color: #64a0ff; font-size: 1.1rem"></i
              ></span>
              <span class="btn-name">MUSEO</span>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'merch')"
              @mouseenter="hoveredStand = 'mueble_merch'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><i class="fas fa-tshirt" style="color: #ffb74d; font-size: 1.1rem"></i
              ></span>
              <span class="btn-name">MERCH</span>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'magazine')"
              @mouseenter="hoveredStand = 'mueble_revistas'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><i class="fas fa-book-open" style="color: #4dd0e1; font-size: 1.1rem"></i
              ></span>
              <span class="btn-name">REVISTAS</span>
            </button>
          </li>
          <li>
            <button
              class="filter-btn"
              @click="$emit('navigate', 'music')"
              @mouseenter="hoveredStand = 'mueble_musica'"
              @mouseleave="hoveredStand = null"
            >
              <span class="icon-placeholder"
                ><i class="fas fa-music" style="color: #f06292; font-size: 1.1rem"></i
              ></span>
              <span class="btn-name">MÚSICA</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <aside
      class="floating-recommendations desktop-only"
      @mousedown.stop
      @wheel.stop
      @touchstart.stop
    >
      <h2 class="sidebar-title">RECOMENDACIONES DE LA SEMANA:</h2>
      <transition name="fade" mode="out-in">
        <div class="recommendations-grid" :key="recommendedPageIndex">
          <div
            class="rec-game-box"
            v-for="rec in recommendedGames"
            :key="rec.name"
            @click="$emit('open-game', { view: rec.view, game: rec.name })"
          >
            <img
              :src="rec.box3d"
              :alt="rec.title"
              :title="rec.title"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </transition>
    </aside>

    <div class="zoom-control-container" @mousedown.stop @wheel.stop @touchstart.stop>
      <button type="button" class="zoom-btn" aria-label="Alejar" @click="zoomBy(-0.2)">
        <i class="fas fa-search-minus" aria-hidden="true"></i>
      </button>
      <input
        v-model.number="scale"
        type="range"
        class="zoom-slider"
        :min="scaleLimits.min"
        :max="scaleLimits.max"
        step="0.01"
        aria-label="Nivel de zoom de la tienda"
      />
      <button type="button" class="zoom-btn" aria-label="Acercar" @click="zoomBy(0.2)">
        <i class="fas fa-search-plus" aria-hidden="true"></i>
      </button>
    </div>

    <div
      class="store-image-container"
      :style="{ cursor: hoveredStand ? 'pointer' : isDragging ? 'grabbing' : 'grab' }"
    >
      <div class="store-layers-wrapper" :style="imageTransform" ref="wrapperRef">
        <img
          :src="basePlaceholderSrc"
          alt=""
          aria-hidden="true"
          :width="base.width"
          :height="base.height"
          class="store-layer base-layer base-placeholder"
          :class="{ loaded: baseHdLoaded }"
          draggable="false"
          decoding="async"
        />
        <img
          :src="baseHdSrc"
          :srcset="baseHdSrcSet"
          sizes="100vw"
          alt="Vista isométrica de la tienda Nivel Retro"
          :width="base.width"
          :height="base.height"
          class="store-layer base-layer base-hd"
          :class="{ loaded: baseHdLoaded }"
          draggable="false"
          fetchpriority="high"
          decoding="async"
          @load="onBaseHdLoad"
        />

        <template v-for="layer in interactiveLayers" :key="layer.id">
          <img
            :src="getLayerPlaceholder(layer.id)"
            alt=""
            aria-hidden="true"
            :width="getLayerSize(layer.id).width"
            :height="getLayerSize(layer.id).height"
            :style="getLayerStyle(layer.id)"
            :class="[
              'store-layer',
              'interactive-layer',
              'layer-placeholder',
              `layer-${layer.id}`,
              { hovered: hoveredStand === layer.id, 'hd-loaded': layerHdStatus[layer.id] },
            ]"
            draggable="false"
            decoding="async"
          />
          <!--
            HD layers only enter the DOM once the background has painted. Started
            any earlier they compete with it for bandwidth and push out the
            Largest Contentful Paint; the blurred placeholder above holds the
            composition until each one cross-fades in.
          -->
          <template v-if="baseHdLoaded">
            <img
              v-if="layer.type !== 'poster'"
              :src="getLayerHd(layer.id)"
              class="store-layer layer-hd"
              :class="{
                loaded: layerHdStatus[layer.id],
                hovered: hoveredStand === layer.id,
              }"
              :width="getLayerSize(layer.id).width"
              :height="getLayerSize(layer.id).height"
              :style="getLayerStyle(layer.id)"
              @load="onLayerHdLoad(layer.id)"
              :alt="layer.title"
              draggable="false"
              decoding="async"
            />
            <img
              v-else
              :src="getLayerHd(layer.id)"
              :alt="layer.title || layer.id"
              :width="getLayerSize(layer.id).width"
              :height="getLayerSize(layer.id).height"
              :style="getLayerStyle(layer.id)"
              decoding="async"
              :class="[
                'store-layer',
                'interactive-layer',
                'layer-hd',
                `layer-${layer.id}`,
                { hovered: hoveredStand === layer.id, loaded: layerHdStatus[layer.id] },
              ]"
              draggable="false"
              @load="onLayerHdLoad(layer.id)"
            />
          </template>
        </template>

        <div
          v-for="layer in interactiveLayers"
          :key="'hit-' + layer.id"
          :style="getHitZoneStyle(layer.id)"
          class="hit-zone"
          @mouseenter="onZoneEnter(layer.id)"
          @mouseleave="onZoneLeave"
          @click="onZoneClick(layer)"
        >
          <div
            v-if="!hasInteracted && layerHdStatus[layer.id]"
            class="hotspot-pulse"
            :class="'hotspot-' + layer.type"
          ></div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">Cargando tienda...</p>
          <div class="loading-bar">
            <div class="loading-bar-fill" :style="{ width: loadProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="lightbox-fade">
      <div v-if="activePoster" class="poster-lightbox-overlay" @click.self="closePoster">
        <div class="poster-lightbox-content">
          <button class="poster-lightbox-close" @click="closePoster" aria-label="Cerrar poster">
            <i class="fas fa-times"></i>
          </button>
          <img :src="activePosterHdSrc" :alt="activePoster" class="poster-lightbox-image" />
        </div>
      </div>
    </transition>
    <OnboardingOverlay @finish="handleOnboardingFinish" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useStoreMap } from '../composables/useStoreMap.js';
import layersManifest from '../assets/imagenes-tienda/layers-manifest.json';
import OnboardingOverlay from './OnboardingOverlay.vue';

const logoN64 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409002/Logo_N64_ybarvo.png';
const logoGC =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409001/Logo_GC_i0ofez.png';
const logoWii =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409007/Logo_Wii_fzhptx.png';
const logoPS1 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409004/Logo_PS1_whzrqj.png';
const logoPS2 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409005/Logo_PS2_qrl8a4.png';
const logoPS3 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_220/v1786409006/Logo_PS3_bcf3a0.png';

import { n64Games, gcGames, wiiGames, ps1Games, ps2Games, ps3Games } from '../data/gamesData.js';

const getGameCount = (games) => games.flat().filter((g) => !g.isHardware).length;
const counts = {
  n64: getGameCount(n64Games),
  gc: getGameCount(gcGames),
  wii: getGameCount(wiiGames),
  ps1: getGameCount(ps1Games),
  ps2: getGameCount(ps2Games),
  ps3: getGameCount(ps3Games),
};

import posterCrashHd from '../assets/posters/crash-bandicoot.webp';
import posterEarthwormHd from '../assets/posters/earthworm-jim.webp';
import posterMetalgearHd from '../assets/posters/metal-gear-solid.webp';
import posterSonicHd from '../assets/posters/sonic.webp';
import posterZeldawindHd from '../assets/posters/zelda-wind-waker.webp';

const emit = defineEmits(['navigate', 'open-game', 'navigate-arcade', 'navigate-about']);

const {
  scale,
  isDragging,
  hasDraggedStore,
  hoveredStand,
  isZooming,
  triggerEntryAnimation,
  startDrag,
  onDrag,
  endDrag,
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseMoveParallax,
  imageTransform,
  scaleLimits,
} = useStoreMap();

const mouseX = ref(0);
const mouseY = ref(0);

const categoryScrollRef = ref(null);
const canScrollCategoryLeft = ref(false);
const canScrollCategoryRight = ref(true);

const handleCategoryScroll = () => {
  if (!categoryScrollRef.value) return;
  const el = categoryScrollRef.value;
  canScrollCategoryLeft.value = el.scrollLeft > 0;
  canScrollCategoryRight.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
};

const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  onMouseMoveParallax(e);
  onDrag(e);
};

const getHoveredTitle = () => {
  const layer = interactiveLayers.find((l) => l.id === hoveredStand.value);
  return layer ? layer.title : '';
};

// Particles Configuration
const particlesOptions = computed(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  return {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: { events: { onHover: { enable: false }, resize: true } },
    particles: {
      color: { value: '#fbbf24' },
      links: { enable: false },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: isMobile ? 150 : 40 },
      opacity: { value: 0.6, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
      shape: { type: 'circle' },
      size: { value: isMobile ? { min: 0.5, max: 1.5 } : { min: 1, max: 3 } },
    },
    detectRetina: true,
  };
});

// Loading state
const isLoading = ref(true);
const loadProgress = ref(0);
const wrapperRef = ref(null);

const manifest = layersManifest.layers;
const base = manifest.base;

const allImages = import.meta.glob('../assets/imagenes-tienda/*.webp', {
  eager: true,
  import: 'default',
});

const getImagePath = (filename) => {
  const key = `../assets/imagenes-tienda/${filename}`;
  return allImages[key] || '';
};

// Base layer sources
const basePlaceholderSrc = computed(() => getImagePath(base.placeholder));
const baseHdSrc = computed(() => getImagePath(base.file));

// The background ships at three widths, so a phone downloads ~87 KB of artwork
// where a desktop takes the full 451 KB.
const baseHdSrcSet = computed(() =>
  [
    `${getImagePath('base-1400.webp')} 1400w`,
    `${getImagePath('base-2200.webp')} 2200w`,
    `${getImagePath(base.file)} 3200w`,
  ].join(', ')
);
const baseHdLoaded = ref(false);

// Layer HD loading status
const layerHdStatus = reactive({});

const getLayerPlaceholder = (layerId) => {
  const info = manifest[layerId];
  return info ? getImagePath(info.placeholder) : '';
};

// Intrinsic dimensions let the browser reserve the right box before the image
// arrives, which keeps the layered store from shifting as each layer decodes.
const getLayerSize = (layerId) => {
  const info = manifest[layerId];
  return { width: info?.width ?? 0, height: info?.height ?? 0 };
};

const getLayerHd = (layerId) => {
  const info = manifest[layerId];
  return info ? getImagePath(info.file) : '';
};

const interactiveLayers = [
  {
    id: 'mueble_retro',
    action: 'museum',
    title: 'Museo de Consolas (8-16 bits)',
    type: 'furniture',
  },
  { id: 'mueble_counter', action: 'counter', title: 'Recepción / Cuenta', type: 'furniture' },
  { id: 'mueble_musica', action: 'music', title: 'Rack de Discos y OSTs', type: 'furniture' },
  { id: 'mueble_revistas', action: 'magazine', title: 'Revistas Club Nintendo', type: 'furniture' },
  { id: 'mueble_merch', action: 'merch', title: 'Catálogo de Merchandise', type: 'furniture' },
  {
    id: 'cartel_retro',
    action: 'about:historia',
    title: 'Nivel Retro — Nuestra Historia',
    type: 'furniture',
  },
  {
    id: 'arcade_donkeykong',
    action: 'arcade:donkeykong',
    title: 'Donkey Kong Arcade',
    type: 'furniture',
  },
  { id: 'arcade_pacman', action: 'arcade:pacman', title: 'PAC-MAN Arcade', type: 'furniture' },
  { id: 'repisa_ps1', action: 'ps1', title: 'Catálogo de PlayStation 1', type: 'furniture' },
  { id: 'repisa_ps2', action: 'ps2', title: 'Catálogo de PlayStation 2', type: 'furniture' },
  { id: 'repisa_ps3', action: 'ps3', title: 'Catálogo de PlayStation 3', type: 'furniture' },
  { id: 'repisa_n64', action: 'n64', title: 'Catálogo de Nintendo 64', type: 'furniture' },
  { id: 'repisa_gc', action: 'gc', title: 'Catálogo de GameCube', type: 'furniture' },
  { id: 'repisa_wii', action: 'wii', title: 'Catálogo de Wii', type: 'furniture' },
  { id: 'poster_crash', action: 'poster:crash', title: 'Poster — Crash Bandicoot', type: 'poster' },
  {
    id: 'poster_earthworm',
    action: 'poster:earthworm',
    title: 'Poster — Earthworm Jim',
    type: 'poster',
  },
  {
    id: 'poster_metalgear',
    action: 'poster:metalgear',
    title: 'Poster — Metal Gear Solid',
    type: 'poster',
  },
  { id: 'poster_sonic', action: 'poster:sonic', title: 'Poster — Sonic', type: 'poster' },
  {
    id: 'poster_zeldawind',
    action: 'poster:zeldawind',
    title: 'Poster — Zelda Wind Waker',
    type: 'poster',
  },
];

const recommendedGamesPool = [
  {
    view: 'gc',
    name: 'The Legend Of Zelda Twilight Princess',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025244/nivel-retro/migrated/a6b372e5-d59b-4381-b23c-2c63fd88b364.png',
    title: 'Zelda Twilight Princess',
  },
  {
    view: 'gc',
    name: 'Super Mario Strikers',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025245/nivel-retro/migrated/7be33efc-95a2-4861-bf96-96250cd23937.png',
    title: 'Super Mario Strikers',
  },
  {
    view: 'ps2',
    name: 'Metal Gear Solid 3: Snake Eater',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/3bc4200f-00bc-44db-8a73-09ff0d45584e.png',
    title: 'Metal Gear Solid 3',
  },
  {
    view: 'ps2',
    name: 'Guitar Hero III: Legends of Rock',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/69fc9413-2c44-4914-86c4-e0f9e64345ce.png',
    title: 'Guitar Hero III',
  },
  {
    view: 'ps3',
    name: 'The Last of Us',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/a4e83ba3-f4dc-4f1c-83c3-35cce554b7e1.png',
    title: 'The Last of Us',
  },
  {
    view: 'wii',
    name: 'Super Mario Galaxy',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/c61fafb1-bb9d-4e9b-9207-4ff4f48fc6be.png',
    title: 'Super Mario Galaxy',
  },
  {
    view: 'wii',
    name: 'Mario Kart Wii',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/2a1760af-8570-40cb-8782-2920119c734f.png',
    title: 'Mario Kart Wii',
  },
  {
    view: 'ps2',
    name: 'God of War II',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025246/nivel-retro/migrated/bd7e8288-1e2f-4d88-8c6e-495e41cdb8d2.png',
    title: 'God of War II',
  },
  {
    view: 'gc',
    name: 'Super Smash Bros. Melee',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025247/nivel-retro/migrated/bc1471f7-0124-4b38-a88f-e650f73156af.png',
    title: 'Super Smash Bros. Melee',
  },
  {
    view: 'ps3',
    name: 'Red Dead Redemption',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025247/nivel-retro/migrated/4f91a4b6-d6c1-44b6-8d6b-4170b7d860a5.png',
    title: 'Red Dead Redemption',
  },
  {
    view: 'gc',
    name: "Luigi's Mansion",
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025247/nivel-retro/migrated/63e19fe1-bd1e-4a92-8a4d-c63a60cc60d2.png',
    title: "Luigi's Mansion",
  },
  {
    view: 'ps2',
    name: 'Burnout 3: Takedown',
    box3d:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025247/nivel-retro/migrated/2b32c01b-f7de-4d29-b587-fdca6b8ea991.png',
    title: 'Burnout 3: Takedown',
  },
];

const recommendedPageIndex = ref(0);
const recommendedGames = computed(() => {
  const start = recommendedPageIndex.value * 6;
  return recommendedGamesPool.slice(start, start + 6);
});

let rotationInterval = null;
let revealFailsafe = null;

// Poster Lightbox
const activePoster = ref(null);
const posterHdMap = {
  poster_crash: posterCrashHd,
  poster_earthworm: posterEarthwormHd,
  poster_metalgear: posterMetalgearHd,
  poster_sonic: posterSonicHd,
  poster_zeldawind: posterZeldawindHd,
};

const activePosterHdSrc = computed(() => {
  return activePoster.value ? posterHdMap[activePoster.value] || '' : '';
});

const openPoster = (posterId) => {
  activePoster.value = posterId;
};

const closePoster = () => {
  activePoster.value = null;
};

const getLayerStyle = (layerId) => {
  const info = manifest[layerId];
  if (!info) return {};
  const left = ((info.x - base.x) / base.width) * 100;
  const top = ((info.y - base.y) / base.height) * 100;
  const width = (info.width / base.width) * 100;
  const height = (info.height / base.height) * 100;

  return {
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
    zIndex: getLayerZIndex(layerId),
  };
};

// Hit zones use the same dimensions as the layer images
const getHitZoneStyle = (layerId) => {
  const style = getLayerStyle(layerId);
  return {
    ...style,
    zIndex: 100, // Hit zones always on top
  };
};

// Z-index based on layer order: furniture first, then posters on top
const layerOrder = [
  'poster_crash',
  'poster_earthworm',
  'poster_metalgear',
  'poster_sonic',
  'poster_zeldawind',
  'mueble_retro',
  'mueble_counter',
  'mueble_musica',
  'mueble_revistas',
  'mueble_merch',
  'cartel_retro',
  'arcade_pacman',
  'arcade_donkeykong',
  'repisa_ps1',
  'repisa_ps2',
  'repisa_ps3',
  'repisa_n64',
  'repisa_gc',
  'repisa_wii',
];
const getLayerZIndex = (layerId) => {
  const idx = layerOrder.indexOf(layerId);
  return idx >= 0 ? idx + 2 : 1; // +2 because base = 1
};

const onZoneEnter = (layerId) => {
  if (!isDragging.value) {
    hoveredStand.value = layerId;
  }
};

const onZoneLeave = () => {
  hoveredStand.value = null;
};

const hasInteracted = ref(localStorage.getItem('nivelRetroHotspots') === 'true');

const onZoneClick = async (layer) => {
  if (!hasInteracted.value) {
    hasInteracted.value = true;
    localStorage.setItem('nivelRetroHotspots', 'true');
  }

  if (isDragging.value || hasDraggedStore.value || isZooming.value) return;

  const action = layer.action;
  if (action.startsWith('poster:')) {
    openPoster(layer.id);
  } else {
    if (action.startsWith('arcade:')) {
      emit('navigate-arcade', action.split(':')[1]);
    } else if (action.startsWith('about:')) {
      emit('navigate-about', action.split(':')[1]);
    } else {
      emit('navigate', action);
    }
  }
};

const zoomBy = (delta) => {
  scale.value = Math.min(
    Math.max(scaleLimits.value.min, scale.value + delta),
    scaleLimits.value.max
  );
};

const onMouseLeave = () => {
  endDrag();
  hoveredStand.value = null;
};

const onTouchMoveHandler = (e) => {
  if (e.touches.length >= 2) {
    e.preventDefault();
  }
  onTouchMove(e);
};

const onboardingFinished = ref(!!localStorage.getItem('nivelRetroOnboarding'));

const handleOnboardingFinish = () => {
  onboardingFinished.value = true;
  if (!isLoading.value) {
    triggerEntryAnimation();
  }
};

// The store is presentable as soon as the background is sharp: every shelf and
// furniture layer already renders its low-resolution placeholder immediately and
// cross-fades to HD through `layerHdStatus`. Blocking the loading screen on all
// ~20 HD layers meant holding the first paint hostage to ~2.2 MB of artwork that
// the progressive swap was built to stream in anyway.
let revealed = false;

const revealStore = () => {
  if (revealed) return;
  revealed = true;

  loadProgress.value = 100;

  setTimeout(() => {
    isLoading.value = false;

    if (onboardingFinished.value) {
      triggerEntryAnimation();
    }

    rotationInterval = setInterval(() => {
      recommendedPageIndex.value =
        (recommendedPageIndex.value + 1) % Math.ceil(recommendedGamesPool.length / 6);
    }, 10000);
  }, 300);
};

const onBaseHdLoad = () => {
  baseHdLoaded.value = true;
  revealStore();
};

onUnmounted(() => {
  if (rotationInterval) clearInterval(rotationInterval);
  if (revealFailsafe) clearTimeout(revealFailsafe);
});

const onLayerHdLoad = (layerId) => {
  layerHdStatus[layerId] = true;
};

onMounted(() => {
  loadProgress.value = 10;
  setTimeout(handleCategoryScroll, 100);
  // Safety net: a stalled or blocked background image must never strand the
  // visitor on the loading screen.
  revealFailsafe = setTimeout(revealStore, 8000);
});
</script>

<style scoped>
/* --- Main Interactive Area --- */
.store-interactive-area {
  flex: 1;
  background-color: #0f172a;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  user-select: none;
  transition: background-color 0.4s ease;
  touch-action: none; /* Prevent browser default gestures */
}

/* --- Store Layers --- */
.store-image-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-layers-wrapper {
  width: 100%;
  position: relative;
  display: block;
  transform-origin: center center;
}

.store-layer {
  user-select: none;
  pointer-events: none;
}

/* --- Base Layer: Placeholder + HD --- */
.store-layer.base-layer {
  width: 100%;
  height: auto;
  display: block;
}

.store-layer.base-layer.base-placeholder {
  position: relative;
  filter: blur(8px);
  transition: opacity 0.6s ease;
}

.store-layer.base-layer.base-placeholder.loaded {
  opacity: 0;
  pointer-events: none;
}

.store-layer.base-layer.base-hd {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.store-layer.base-layer.base-hd.loaded {
  opacity: 1;
}

/* --- Interactive Layers: Placeholder + HD --- */
.store-layer.interactive-layer {
  object-fit: contain;
}

/* Placeholder: visible, blurred, fades out when HD loads */
.store-layer.interactive-layer.layer-placeholder {
  filter: blur(4px);
  transition:
    filter 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.5s ease;
}

.store-layer.interactive-layer.layer-placeholder.hd-loaded {
  opacity: 0;
  pointer-events: none;
}

/* HD: invisible until loaded, then fades in */
.store-layer.interactive-layer.layer-hd {
  opacity: 0;
  transition:
    filter 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.5s ease;
}

.store-layer.interactive-layer.layer-hd.loaded {
  opacity: 1;
}

/* Hover effect for furniture: brightness glow + subtle lift + expanded shadow */
.store-layer.interactive-layer.hovered:not([class*='poster_']),
.store-layer.layer-hd.hovered:not([class*='poster_']) {
  filter: brightness(1.18) drop-shadow(0 0 14px rgba(255, 255, 255, 0.4))
    drop-shadow(-10px 15px 12px rgba(0, 0, 0, 0.25));
  transform: translateY(-4px);
}

/* Base realistic shadow for furniture (isometric light from top-right) */
.store-layer.interactive-layer:not(.hovered):not([class*='poster_']),
.store-layer.layer-hd:not(.hovered):not([class*='poster_']) {
  filter: brightness(1) drop-shadow(-6px 10px 8px rgba(0, 0, 0, 0.35))
    drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.25));
  transform: translateY(0);
}

/* Hover effect for posters: glow + slight scale + wall shadow */
.store-layer.interactive-layer.hovered[class*='poster_'],
.store-layer.layer-hd.hovered[class*='poster_'] {
  filter: brightness(1.12) drop-shadow(0 0 18px rgba(139, 92, 246, 0.6))
    drop-shadow(-3px 6px 6px rgba(0, 0, 0, 0.2));
  transform: scale(1.04);
}

/* Base subtle shadow for posters on the wall */
.store-layer.interactive-layer:not(.hovered)[class*='poster_'],
.store-layer.layer-hd:not(.hovered)[class*='poster_'] {
  filter: brightness(1) drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.3));
  transform: translateY(0);
}

/* Override hover for placeholder layers that have HD loaded — keep them invisible */
.store-layer.interactive-layer.layer-placeholder.hd-loaded.hovered {
  opacity: 0;
}

/* --- Hit Zones & Interactions --- */
.hit-zone {
  cursor: pointer;
  /* Uncomment below to see hit zones for debugging */
  /* background: rgba(255, 0, 0, 0.3); */
}

.hotspot-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.hotspot-furniture {
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 12px #ffffff;
}

.hotspot-poster {
  background-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 12px #8b5cf6;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

/* --- Particles Layer --- */
.particles-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* --- Global Tooltip --- */
.global-cursor-tooltip {
  position: fixed;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Roboto', sans-serif;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* --- Zoom Control --- */
.zoom-btn {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}

.zoom-btn:focus-visible {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
  border-radius: 4px;
}

.zoom-control-container {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #94a3b8;
}

.zoom-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 150px;
  height: 6px;
  background: #334155;
  border-radius: 3px;
  outline: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fbbf24;
  cursor: pointer;
  transition: transform 0.1s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.zoom-control-container i {
  font-size: 1.1rem;
}

/* --- Floating Menu (Sidebar) --- */
.floating-menu {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 145px;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 15px 10px;
  box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Custom scrollbar for sidebar */
.floating-menu::-webkit-scrollbar {
  width: 6px;
}
.floating-menu::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.floating-menu::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 8px;
  border-bottom: 1px solid #334155;
}

.sidebar-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sidebar-title {
  font-size: 0.8rem;
  color: #e2e8f0;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.btn-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.btn-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: inherit;
}

.btn-count {
  font-size: 0.65rem;
  font-weight: 400;
  color: #64748b;
}

.filter-btn:hover .btn-count {
  color: #94a3b8;
}

.filter-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.icon-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 25px;
  flex-shrink: 0;
}

.console-logo {
  width: 100%;
  height: auto;
  max-height: 90px;
  object-fit: contain;
}

/* --- Floating Recommendations (Right Sidebar) --- */
.floating-recommendations {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 165px;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 15px 10px;
  box-shadow: -4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.floating-recommendations .sidebar-title {
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.4;
  margin-bottom: 2px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.rec-game-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  transition:
    transform 0.2s,
    background-color 0.2s;
  cursor: pointer;
}

.rec-game-box:hover {
  transform: scale(1.05) translateY(-2px);
  background-color: rgba(255, 255, 255, 0.05);
}

.rec-game-box img {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
}

/* --- Loading Overlay --- */
.loading-overlay {
  position: absolute;
  inset: 0;
  background-color: #0f172a;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #334155;
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #94a3b8;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.loading-bar {
  width: 200px;
  height: 6px;
  background-color: #1e293b;
  border-radius: 3px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- Poster Lightbox --- */
.poster-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  backdrop-filter: blur(6px);
}

.poster-lightbox-content {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.poster-lightbox-image {
  max-width: 90vw;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(139, 92, 246, 0.15);
  animation: poster-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes poster-appear {
  from {
    transform: scale(0.85) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.poster-lightbox-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(15, 23, 42, 0.9);
  color: #f1f5f9;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1001;
}

.poster-lightbox-close:hover {
  background-color: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 0.6);
  transform: scale(1.1);
}

/* Lightbox transitions */
.lightbox-fade-enter-active {
  transition: opacity 0.3s ease;
}
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* --- Mobile Utilities --- */
.mobile-only {
  display: none;
}

/* --- Mobile Responsive --- */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-category-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    display: flex;
    flex-direction: row;
    background-color: #252b43;
    border-bottom: 2px solid #1a1f35;
  }

  .scroll-indicator-left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to left, rgba(37, 43, 67, 0) 0%, rgba(37, 43, 67, 1) 60%);
    color: #cbd5e1;
    pointer-events: none;
    z-index: 10;
  }

  .scroll-indicator-right {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, rgba(37, 43, 67, 0) 0%, rgba(37, 43, 67, 1) 60%);
    color: #cbd5e1;
    pointer-events: none;
    z-index: 10;
  }

  .mobile-category-scroll {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding: 10px 15px;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
  }

  .mobile-category-scroll::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome/Safari */
  }

  .mobile-category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #e2e8f0;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 0.8rem;
    cursor: pointer;
    min-width: 50px;
    flex-shrink: 0;
    gap: 5px;
  }

  .mobile-cat-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .poster-lightbox-close {
    top: 10px;
    right: 10px;
    width: 38px;
    height: 38px;
  }

  .poster-lightbox-content {
    max-width: 100%;
    max-height: 100%;
  }

  .poster-lightbox-image {
    max-width: 95vw;
    max-height: 85vh;
  }

  .global-cursor-tooltip {
    display: none !important;
  }

  .zoom-control-container {
    bottom: 25px;
    right: 25px;
    padding: 6px 10px;
    gap: 8px;
    border-radius: 8px;
  }

  .zoom-slider {
    width: 80px;
    height: 4px;
  }

  .zoom-control-container i {
    font-size: 0.85rem;
  }

  .store-layers-wrapper,
  .store-layer {
  }

  .store-layer.interactive-layer:not(.hovered),
  .store-layer.layer-hd:not(.hovered) {
    filter: none !important;
  }

  .store-layer.interactive-layer.hovered:not([class*='poster_']),
  .store-layer.layer-hd.hovered:not([class*='poster_']) {
    filter: brightness(1.15) !important;
    transform: translateY(-3px) scale(1.01);
  }

  .store-layer.interactive-layer.hovered[class*='poster_'],
  .store-layer.layer-hd.hovered[class*='poster_'] {
    filter: brightness(1.15) !important;
    transform: scale(1.015);
  }

  .hotspot-pulse {
    width: 3px;
    height: 3px;
  }
}
</style>
