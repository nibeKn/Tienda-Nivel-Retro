<template>
  <BaseShelf
    console-id="ps1"
    console-name="PLAYSTATION"
    shelf-color="#9ca3af"
    :logo-src="logoPS1"
    :logo-style="{ height: '90px', marginTop: '0px', filter: 'none' }"
    :games-data="ps1Games"
    shelf-spacing="160px"
    :row-heights="['150px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: '□', color: '#2a2a2e', textColor: '#e84bb2' },
      secondary: { text: '✕', color: '#2a2a2e', textColor: '#6e8cfa' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">PlayStation</h2>
      <p class="info-desc">
        La PlayStation (conocida también como PS1 o PSX) es una videoconsola de sobremesa de quinta
        generación desarrollada y comercializada por Sony Computer Entertainment. Marcó la exitosa
        entrada de Sony en la industria de los videojuegos, revolucionando el mercado al popularizar
        el formato óptico sobre los cartuchos, lo que atrajo a múltiples desarrolladores gracias a
        sus bajos costos de manufactura y regalías más accesibles.
      </p>

      <h3 class="info-subtitle">Detalles técnicos</h3>
      <p class="info-text">
        El sistema estaba basado en una arquitectura de 32 bits enfocada en el procesamiento de
        polígonos tridimensionales. Su adopción del CD-ROM (con una capacidad de hasta 700 MB)
        brindó a los desarrolladores un espacio de almacenamiento masivo para la época. Esto
        permitió la implementación de bandas sonoras con calidad de estudio (CD-Audio), actuación de
        voz extensa y la inclusión de cinemáticas de video de movimiento completo (FMV),
        características que definieron el estilo narrativo de los juegos de finales de los años 90.
        Posteriormente, introdujo el mando DualShock, estandarizando la configuración de dos
        joysticks analógicos con retroalimentación de vibración.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 1994 (Japón) / 1995 (USA y Europa)</p>
        <p><strong>Unidades vendidas:</strong> 102,49 millones</p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { ps1Games } from '../data/gamesData.js';
const logoPS1 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409014/PS1SHELF_qht2xm.png';

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
  color: #616161;
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

/* Fix PS1 boxes sticking out, alignment & spacing */
:deep(.game-box) {
  max-width: calc(140 * var(--m-scale, 1px)) !important;
  max-height: calc(140 * var(--m-scale, 1px));
  object-fit: contain;
}
:deep(.shelf-row) {
  justify-content: center !important;
  gap: calc(10 * var(--m-scale, 1px));
}
</style>
