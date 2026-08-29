<template>
  <BaseShelf
    console-id="ps2"
    console-name="PLAYSTATION 2"
    shelf-color="#1a1a1a"
    :logo-src="logoPS2"
    :logo-style="{ height: '90px', marginTop: '0px' }"
    :games-data="ps2Games"
    shelf-spacing="200px"
    :row-heights="['100px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: '□', color: '#2a2a2e', textColor: '#e84bb2' },
      secondary: { text: '✕', color: '#2a2a2e', textColor: '#6e8cfa' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">PlayStation 2</h2>
      <p class="info-desc">
        La PlayStation 2 (abreviada PS2) es la consola de sexta generación producida por Sony y el
        sistema de videojuegos doméstico más exitoso comercialmente en la historia del
        entretenimiento interactivo. Su prolongado ciclo de vida estuvo respaldado por un catálogo
        de software inmenso que abarcó todos los géneros posibles, consolidándose como el centro de
        entretenimiento multimedia definitivo en millones de hogares.
      </p>

      <h3 class="info-subtitle">Detalles técnicos</h3>
      <p class="info-text">
        El núcleo de la consola era un procesador personalizado de 128 bits denominado Emotion
        Engine. Su ventaja técnica y comercial más significativa fue la integración nativa de una
        unidad lectora de DVD-ROM. En la época de su lanzamiento, la consola funcionaba también como
        un reproductor de películas en DVD muy asequible, lo que impulsó exponencialmente sus
        ventas. Adicionalmente, incorporaba un subsistema interno que le otorgaba
        retrocompatibilidad por hardware con casi la totalidad del catálogo de juegos de la
        PlayStation original.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 2000</p>
        <p>
          <strong>Unidades vendidas:</strong> Más de 155 millones (algunas estimaciones recientes
          apuntan a 160 millones)
        </p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { ps2Games } from '../data/gamesData.js';
const logoPS2 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409015/PS2SHELF_xntmxs.png';

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
  color: #1a1a1a;
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
