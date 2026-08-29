<template>
  <BaseShelf
    console-id="n64"
    console-name="NINTENDO 64"
    shelf-color="#349c4f"
    :logo-src="logoN64"
    :logo-style="{ height: '90px', marginTop: '0px' }"
    :games-data="n64Games"
    shelf-spacing="140px"
    :row-heights="['140px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: 'A', color: '#1e56b8' },
      secondary: { text: 'B', color: '#00a84b' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">Nintendo 64</h2>
      <p class="info-desc">
        La Nintendo 64 (comúnmente abreviada como N64) es una videoconsola de sobremesa de quinta
        generación producida por Nintendo. Su desarrollo representó el gran salto de la compañía
        hacia los entornos tridimensionales (3D). Fue pionera en la industria al popularizar el uso
        del joystick analógico mediante su peculiar mando con forma de tridente, lo que permitió un
        control de cámara y movimiento preciso en títulos revolucionarios que sentaron las bases del
        diseño 3D moderno.
      </p>

      <h3 class="info-subtitle n64-color">Detalles técnicos</h3>
      <p class="info-text">
        A nivel de hardware, la consola destacaba por su unidad central de procesamiento de 64 bits,
        desarrollada en conjunto con Silicon Graphics. A diferencia de sus principales competidores,
        Nintendo optó por mantener el formato de cartucho ROM (Game Pak). Esta decisión garantizaba
        tiempos de carga prácticamente nulos y disuadía la piratería, pero limitaba drásticamente la
        capacidad de almacenamiento (hasta 64 MB), lo que dificultaba la inclusión de texturas de
        alta resolución, audio de calidad CD y secuencias de video pre-renderizadas.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 1996</p>
        <p><strong>Unidades vendidas:</strong> 32,93 millones</p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { n64Games } from '../data/gamesData.js';
const logoN64 =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409008/N64SHELF_epbhkl.png';

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
  margin-bottom: 5px;
}
.n64-color {
  color: #349c4f;
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

/* Fix N64 boxes sticking out & alignment */
:deep(.game-box) {
  max-width: calc(190 * var(--m-scale, 1px)) !important;
  max-height: calc(160 * var(--m-scale, 1px));
  object-fit: contain;
}
:deep(.hardware-box) {
  max-width: calc(210 * var(--m-scale, 1px)) !important;
}
:deep(.shelf-row) {
  justify-content: center !important;
  gap: calc(15 * var(--m-scale, 1px));
}
</style>
