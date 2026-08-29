<template>
  <BaseShelf
    console-id="ps3"
    console-name="PLAYSTATION 3"
    shelf-color="#1a5ab5"
    :logo-src="logoPS3"
    :logo-style="{ height: '80px', marginTop: '0px' }"
    :games-data="ps3Games"
    shelf-spacing="180px"
    :row-heights="['140px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: '□', color: '#2a2a2e', textColor: '#e84bb2' },
      secondary: { text: '✕', color: '#2a2a2e', textColor: '#6e8cfa' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">PlayStation 3</h2>
      <p class="info-desc">
        La PlayStation 3 (abreviada PS3) es una videoconsola de séptima generación desarrollada por
        Sony. Fue el sistema que integró la marca PlayStation en la era del entretenimiento en alta
        definición (HD) y estableció el ecosistema digital moderno de la compañía mediante el
        lanzamiento de la PlayStation Network (PSN). Aunque enfrentó dificultades comerciales en sus
        primeros años debido a su elevado precio de lanzamiento, logró recuperarse gracias a un
        catálogo de juegos exclusivos de gran aclamación crítica.
      </p>

      <h3 class="info-subtitle">Detalles técnicos</h3>
      <p class="info-text">
        Su arquitectura interna giraba en torno al Cell Broadband Engine, un microprocesador
        codesarrollado por Sony, Toshiba e IBM. Aunque ofrecía un rendimiento computacional
        asombroso, su diseño asimétrico resultó ser extremadamente complejo para los desarrolladores
        de software de terceros. Fue una consola pionera al integrar de fábrica una unidad lectora
        óptica de Blu-ray Disc, lo que le permitía reproducir películas en alta definición y ofrecía
        hasta 50 GB de almacenamiento para juegos. Además, fue el primer sistema de Sony en incluir
        salida de video HDMI (resolución hasta 1080p) y un disco duro interno estándar para
        almacenamiento y actualizaciones.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 2006</p>
        <p><strong>Unidades vendidas:</strong> 87,4 millones</p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { ps3Games } from '../data/gamesData.js';
const logoPS3 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409016/PS3SHELF_ruokdz.png';

defineProps({
  preselectedGame: { type: String, default: null },
});
defineEmits(['back', 'add-to-cart']);
</script>

<style scoped>
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
  color: #1a5ab5;
  margin-bottom: 5px;
}
.info-text {
  font-size: 1.05rem;
  margin-bottom: 5px;
  text-align: justify;
}
.info-footer {
  margin-top: auto;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.info-footer p {
  margin: 8px 0;
  font-size: 1.1rem;
}
.info-footer strong {
  color: #1e293b;
}

/* Fix PS3 boxes sticking out, alignment & spacing */
:deep(.game-box) {
  max-width: calc(140 * var(--m-scale, 1px)) !important;
  max-height: calc(170 * var(--m-scale, 1px));
  object-fit: contain;
}
:deep(.shelf-row) {
  justify-content: center !important;
  gap: calc(10 * var(--m-scale, 1px));
}
</style>
