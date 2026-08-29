<template>
  <div class="magazine-layout">
    <BaseBackground word="REVISTAS" />

    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <h1 class="page-title">REVISTAS CLUB NINTENDO</h1>
    <div class="rack-container">
      <div class="wood-rack">
        <div class="shelves-area desktop-only">
          <div class="shelf" v-for="shelfIndex in [0, 1]" :key="'d-' + shelfIndex">
            <div class="shelf-bg"></div>
            <div
              class="magazine-slot"
              v-for="mag in getShelvedMagazines(shelfIndex, 4)"
              :key="mag.url"
              @click="openMagazine(mag)"
            >
              <img :src="getImgSrc(mag.file)" :alt="mag.file" />
              <div class="glare"></div>
            </div>
            <div class="shelf-lip"></div>
          </div>
        </div>
        <div class="shelves-area mobile-only">
          <div class="shelf" v-for="shelfIndex in [0, 1, 2, 3]" :key="'m-' + shelfIndex">
            <div class="shelf-bg"></div>
            <div
              class="magazine-slot"
              v-for="mag in getShelvedMagazines(shelfIndex, 2)"
              :key="mag.url"
              @click="openMagazine(mag)"
            >
              <img :src="getImgSrc(mag.file)" :alt="mag.file" />
              <div class="glare"></div>
            </div>
            <div class="shelf-lip"></div>
          </div>
        </div>
        <div class="doors-area">
          <div class="sliding-door left-door"><div class="handle"></div></div>
          <div class="sliding-door right-door"><div class="handle"></div></div>
        </div>
      </div>
    </div>
    <Transition name="zoom">
      <div v-if="zoomedMag && !isReading" class="zoom-overlay" @click="closeZoom">
        <button type="button" class="zoomed-content" @click.stop="startReading">
          <img
            :src="getImgSrc(zoomedMag.file)"
            :alt="`Portada de ${zoomedMag.file}`"
            class="zoomed-img"
            decoding="async"
          />
          <span class="read-prompt">
            <i class="fas fa-book-open" aria-hidden="true"></i>
            <span>Haz clic para leer</span>
          </span>
        </button>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="isReading" class="reader-overlay">
        <div class="reader-header">
          <h2 class="reader-title">Modo Lectura: Club Nintendo</h2>
          <button class="close-reader-btn" @click="stopReading">
            <i class="fas fa-times"></i> CERRAR VISOR
          </button>
        </div>
        <div class="reader-iframe-container">
          <iframe
            :src="`https://archive.org/embed/${zoomedMag.url}`"
            width="100%"
            height="100%"
            frameborder="0"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseBackground from './BaseBackground.vue';

defineEmits(['back']);

const magazines = [
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408381/Club_Nintendo_A%C3%B1o_09_N%C2%BA_02_Sudam%C3%A9rica_adiw6p.jpg',
    url: 'club-nintendo-ano-09-no-02-colombia',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408382/Club_Nintendo_A%C3%B1o_10_N_11_Sudam%C3%A9rica_kl6nna.jpg',
    url: 'club-nintendo-ano-10-n-11-sudamerica',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408383/Club_Nintendo_A%C3%B1o_11_N_04_Sudam%C3%A9rica_cqrh7x.jpg',
    url: 'club-nintendo-ano-11-n-04-sudamerica',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408388/Club_Nintendo_A%C3%B1o_12_N%C2%BA_12_Sudam%C3%A9rica_hiarv5.jpg',
    url: 'club-nintendo-ano-12-n-12-sudamerica',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408383/Club_Nintendo_A%C3%B1o_13_N_08_Sudam%C3%A9rica_vxh08v.jpg',
    url: 'club-nintendo-ano-13-n-08-sudamerica',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408384/Club_Nintendo_A%C3%B1o_14_N%C2%BA_10_Chile_agoxdu.jpg',
    url: 'club-nintendo-ano-14-no-10-chile',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408386/Club_Nintendo_A%C3%B1o_16_N_12_Chile_qup1wg.jpg',
    url: 'club-nintendo-ano-16-n-12-chile',
  },
  {
    file: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408388/Club_Nintendo_A%C3%B1o_17_N%C2%BA_12_Chile_ic5aa1.jpg',
    url: 'club-nintendo-ano-17-n-12-chile',
  },
];

const zoomedMag = ref(null);
const isReading = ref(false);

const getImgSrc = (fileName) => {
  if (fileName.startsWith('http')) return fileName;
  return new URL(`../assets/clubnintendo/${fileName}`, import.meta.url).href;
};

const getShelvedMagazines = (shelfIndex, count = 4) => {
  return magazines.slice(shelfIndex * count, shelfIndex * count + count);
};

const openMagazine = (mag) => {
  zoomedMag.value = mag;
};

const closeZoom = () => {
  zoomedMag.value = null;
};

const startReading = () => {
  isReading.value = true;
};

const stopReading = () => {
  isReading.value = false;
  zoomedMag.value = null; // Volver al mueble directamente
};
</script>

<style scoped>
.magazine-layout {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #0d1526;
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

.page-title {
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 35px;
  text-align: center;
  letter-spacing: 1px;
}

/* --- RACK CONTAINER --- */
.rack-container {
  flex: 1;
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;

  /* Wood Texture Variables - Oak/Pine natural tone */
  --wood-color: #e3c08d;
  --wood-pattern-v: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05 0.001' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  --wood-pattern-h: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.001 0.05' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.wood-rack {
  width: 900px;
  height: 800px;
  background-color: var(--wood-color);
  background-image:
    linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%), var(--wood-pattern-v);
  border: 12px solid #c9a67a;
  border-bottom: 24px solid #a37d57;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.9),
    inset 0 0 50px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.shelves-area {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.shelf {
  flex: 1;
  display: flex;
  position: relative;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 0 10px;
  border-bottom: 14px solid #b5926b;
  box-shadow: inset 0 -20px 40px rgba(0, 0, 0, 0.3);
}

.shelf-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 20%);
  pointer-events: none;
}

.shelf-lip {
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 32px;
  background-color: var(--wood-color);
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%),
    var(--wood-pattern-h);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.magazine-slot {
  width: 175px;
  height: 235px;
  margin-bottom: 1px; /* Para que quede detras del labio */
  position: relative;
  z-index: 5;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: bottom center;
}

.magazine-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 3px -3px 15px rgba(0, 0, 0, 0.6);
}

.glare {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 40%);
  pointer-events: none;
}

.magazine-slot:hover {
  transform: translateY(-20px) scale(1.1) rotate(2deg);
  z-index: 20;
}

.magazine-slot:hover img {
  box-shadow: 5px -5px 25px rgba(0, 0, 0, 0.8);
}

/* --- PUERTAS CORREDIZAS --- */
.doors-area {
  height: 200px;
  background-color: #8c6742;
  background-image: var(--wood-pattern-h);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.6);
}

.sliding-door {
  width: 52%;
  height: 100%;
  background-color: var(--wood-color);
  background-image:
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%),
    var(--wood-pattern-h);
  border: 1px solid rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.left-door {
  left: 0;
  z-index: 2;
}

.right-door {
  right: 0;
  z-index: 1;
}

.handle {
  width: 20px;
  height: 90px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  box-shadow:
    inset 4px 4px 10px rgba(0, 0, 0, 0.5),
    inset -1px -1px 3px rgba(255, 255, 255, 0.1),
    1px 1px 0px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.left-door .handle {
  left: 30px;
}
.right-door .handle {
  right: 30px;
}

/* --- MODALES / VISORES --- */

.zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.zoomed-content {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  display: block;
}

.zoomed-content:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 6px;
  border-radius: 6px;
}

.zoomed-content:hover {
  transform: scale(1.02);
}

.zoomed-img {
  height: 70vh;
  max-height: 800px;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  border: 2px solid #fbbf24;
}

.read-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #fbbf24;
  color: #000;
  padding: 10px 25px;
  border-radius: 20px;
  font-weight: bold;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4);
  white-space: nowrap;
}

.reader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0f172a;
  z-index: 300;
  display: flex;
  flex-direction: column;
}

.reader-header {
  height: 60px;
  background: #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #334155;
}

.reader-title {
  color: #e2e8f0;
  font-family: 'Oswald', sans-serif;
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: 1px;
}

.close-reader-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-reader-btn:hover {
  background: #dc2626;
}

.reader-iframe-container {
  flex: 1;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animaciones */
.zoom-enter-active,
.zoom-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* MOBILE RESPONSIVE */
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: flex;
  }
  .desktop-only {
    display: none !important;
  }

  .back-btn {
    position: static;
    margin: 20px 0 0 20px;
    align-self: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .wood-rack {
    width: 95%;
    height: auto;
    min-height: 800px;
  }

  .shelf {
    min-height: 180px;
  }

  .magazine-slot {
    width: 120px;
    height: 160px;
  }

  .doors-area {
    height: 100px;
  }
}
</style>
