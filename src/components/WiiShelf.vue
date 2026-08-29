<template>
  <BaseShelf
    console-id="wii"
    console-name="NINTENDO WII"
    shelf-color="#e2e8f0"
    :logo-src="logoWii"
    :logo-style="{ height: '220px', marginTop: '0px', filter: 'none' }"
    :games-data="wiiGames"
    shelf-spacing="200px"
    :row-heights="['140px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: '1', color: '#d8d8d8', textColor: '#888888' },
      secondary: { text: '2', color: '#d8d8d8', textColor: '#888888' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">Nintendo Wii</h2>
      <p class="info-desc">
        La Wii es una videoconsola de séptima generación producida por Nintendo. Representó un
        cambio de paradigma en la estrategia de la compañía, alejándose de la carrera por la máxima
        potencia gráfica para enfocarse en la innovación de la interfaz de usuario. Fue un fenómeno
        cultural global que logró expandir el mercado de los videojuegos, atrayendo a un público
        demográfico inusualmente amplio, desde jugadores tradicionales hasta niños y adultos
        mayores.
      </p>

      <h3 class="info-subtitle">Detalles técnicos</h3>
      <p class="info-text">
        Su principal innovación tecnológica fue su mando inalámbrico, el Wii Remote, un dispositivo
        similar a un control remoto de televisión equipado con acelerómetros para la detección de
        movimiento en tres dimensiones y un puntero óptico infrarrojo. A nivel de arquitectura de
        hardware, utilizaba un procesador IBM "Broadway", siendo esencialmente una versión
        overclockeada y refinada de la GameCube. Debido a esto, fue la única consola de su
        generación en no ofrecer soporte nativo para gráficos en alta definición (HD), aunque
        incluía retrocompatibilidad total por hardware con los juegos y accesorios de su
        predecesora.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 2006</p>
        <p><strong>Unidades vendidas:</strong> 101,63 millones</p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { wiiGames } from '../data/gamesData.js';
const logoWii =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409017/WiiShelf_bemj3o.png';

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
  color: #4f5154;
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
</style>
