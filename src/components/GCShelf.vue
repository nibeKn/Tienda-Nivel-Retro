<template>
  <BaseShelf
    console-id="gc"
    console-name="NINTENDO GAMECUBE"
    shelf-color="#5A3B8C"
    :logo-src="logoGC"
    :logo-style="{ height: '110px', marginLeft: '20px' }"
    :games-data="gcGames"
    shelf-spacing="140px"
    :row-heights="['100px', '140px', '140px', '140px']"
    :buttons-config="{
      primary: { text: 'A', color: '#00a84b', textColor: '#007635' },
      secondary: { text: 'B', color: '#e6192b', textColor: '#8c0c16' },
    }"
    :preselected-game="preselectedGame"
    @back="$emit('back')"
    @add-to-cart="$emit('add-to-cart', $event)"
  >
    <template #default-description>
      <h2 class="info-title">Nintendo GameCube</h2>
      <p class="info-desc">
        La Nintendo GameCube (oficialmente abreviada como NGC) es una consola de sexta generación
        fabricada por Nintendo. Destacó comercialmente por su diseño compacto, amigable y peculiar
        forma de cubo, que incluía un asa de transporte en su parte posterior. Su mando introdujo
        una disposición de botones asimétrica centrada en la ergonomía, siendo ampliamente
        considerado como uno de los controles más cómodos diseñados para la industria.
      </p>

      <h3 class="info-subtitle">Detalles técnicos</h3>
      <p class="info-text">
        Su arquitectura interna fue desarrollada en colaboración con IBM, integrando un potente
        procesador conocido como "Gekko". Para combatir la piratería y abandonar el costoso formato
        de cartucho, la GameCube fue la primera consola de Nintendo en adoptar medios ópticos,
        utilizando un formato propietario basado en el Mini-DVD (con capacidad de 1,5 GB). Aunque su
        rendimiento gráfico superaba al de consolas contemporáneas como la PlayStation 2, el
        limitado espacio de almacenamiento de sus discos supuso un reto para las desarrolladoras al
        adaptar juegos de gran envergadura.
      </p>

      <div class="info-footer">
        <p><strong>Año de lanzamiento:</strong> 2001</p>
        <p><strong>Unidades vendidas:</strong> 21,74 millones</p>
      </div>
    </template>
  </BaseShelf>
</template>

<script setup>
import BaseShelf from './BaseShelf.vue';
import { gcGames } from '../data/gamesData.js';
const logoGC =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409000/GCSHELF_cggrfc.png';

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
