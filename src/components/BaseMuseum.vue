<template>
  <div class="museum-page">
    <BaseBackground word="MUSEUM" />
    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <h1 class="page-title">MUSEO DE CONSOLAS (8-16 BITS)</h1>

    <div class="museum-layout">
      <div class="cabinet-wrapper">
        <div class="glass-cabinet">
          <div class="glass-reflection"></div>

          <div class="console-grid">
            <div
              v-for="consoleItem in consoles"
              :key="consoleItem.id"
              class="console-slot"
              :class="{ active: selectedConsole.id === consoleItem.id }"
              @click="selectConsole(consoleItem)"
            >
              <img
                :src="consoleItem.boxArt"
                :alt="consoleItem.name"
                class="slot-box-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div class="shelf-divider horizontal"></div>
          <div class="shelf-divider vertical"></div>
        </div>
      </div>
      <div class="info-wrapper" v-if="selectedConsole">
        <div class="info-box showcase-box">
          <img
            :src="selectedConsole.logoImg"
            class="console-logo"
            :class="selectedConsole.id + '-logo'"
            alt="Logo"
          />
          <img :src="selectedConsole.heroImg" class="console-hero" alt="Console" />
        </div>
        <div class="info-box specs-box">
          <h3 class="specs-title">{{ selectedConsole.name.toUpperCase() }}</h3>
          <ul class="tech-specs-list-inline">
            <li><strong>Lanzamiento:</strong> {{ selectedConsole.techSheet.lanzamiento }}</li>
            <li><strong>Unidades Vendidas:</strong> {{ selectedConsole.techSheet.ventas }}</li>
            <li><strong>Juego más vendido:</strong> {{ selectedConsole.techSheet.masVendido }}</li>
            <li><strong>Procesador:</strong> {{ selectedConsole.techSheet.cpu }}</li>
          </ul>
        </div>
        <div class="info-box juegos-box">
          <h3 class="box-title">JUEGOS ICÓNICOS</h3>
          <div class="games-row">
            <div
              v-for="(game, idx) in selectedConsole.iconicGames"
              :key="idx"
              class="game-item"
              @click="openGameModal(game)"
            >
              <img
                :src="game.cover"
                :alt="game.title"
                class="game-cover-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div class="info-box curioso-box">
          <h3 class="box-title">DATO CURIOSO</h3>
          <p class="curioso-text">{{ selectedConsole.dato }}</p>
        </div>
      </div>
    </div>
    <div v-if="isGameModalOpen" class="game-modal-overlay" @click="closeGameModal">
      <div class="game-modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeGameModal">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-left">
          <img :src="selectedGame.cover" :alt="selectedGame.title" class="modal-game-cover" />
        </div>
        <div class="modal-right">
          <h2 class="modal-game-title">{{ selectedGame.title }}</h2>
          <p class="modal-game-desc">{{ selectedGame.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseBackground from './BaseBackground.vue';

defineEmits(['back']);

const consoles = [
  {
    id: 'nes',
    name: 'Nintendo Entertainment System',
    bits: '8 BITS',
    boxArt:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409024/NESBOX_yq1spd.png',
    heroImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409027/NESCONSOLE_zytu2g.png',
    logoImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025111/nivel-retro/migrated/3840px-NES_logo-svg.png',
    dato: '¿Sabías que el bigote y el overol de Mario no fueron una elección estética? Se diseñaron así para que su cara y brazos fueran reconocibles con las limitaciones técnicas de los 8-bits de la época.',
    techSheet: {
      lanzamiento: '1983 (Japón) / 1985 (EE.UU)',
      ventas: '61.91 millones',
      masVendido: 'Super Mario Bros. (40.24M)',
      cpu: 'Ricoh 2A03 (8-bit @ 1.79 MHz)',
    },
    iconicGames: [
      {
        title: 'Super Mario Bros. 3',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025112/nivel-retro/migrated/500ae7d7-0c4a-41bf-a91c-747623e894a5.jpg',
        desc: 'Aventura de plataformas legendaria. Introdujo el traje de mapache y múltiples mundos interactivos llenos de secretos mágicos.',
      },
      {
        title: 'The Legend of Zelda',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025112/nivel-retro/migrated/ec033ea5-6d1e-4997-b755-c7cdf4efd19d.jpg',
        desc: 'El nacimiento de un mito. Ofreció exploración no lineal revolucionaria en la mítica tierra de Hyrule para rescatar a Zelda.',
      },
      {
        title: 'Metroid',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025112/nivel-retro/migrated/2e885701-3972-483a-b06f-35952ab570fd.jpg',
        desc: 'Samus Aran viaja al planeta Zebes en este clásico oscuro y atmosférico que junto a Castlevania, definió el género metroidvania.',
      },
      {
        title: 'Mega Man 2',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/49efb7ec-6ad8-4d35-aeeb-d1654dd6f8bb.png',
        desc: 'Uno de los grandes hitos de los 8 bits. Destaca por su impecable diseño de niveles y su memorable banda sonora inolvidable.',
      },
    ],
  },
  {
    id: 'snes',
    name: 'Super Nintendo',
    bits: '16 BITS',
    boxArt:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409027/SNESBOX_bia3cy.png',
    heroImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409029/SNESCONSOLE_a5lso7.png',
    logoImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/Logo_SNES.png',
    dato: 'El procesador de sonido de la SNES fue diseñado por Ken Kutaragi de Sony. Esta colaboración fue el primer paso de Sony en la industria, lo que eventualmente llevaría a la creación de la PlayStation.',
    techSheet: {
      lanzamiento: '1990 (Japón) / 1991 (EE.UU)',
      ventas: '49.10 millones',
      masVendido: 'Super Mario World (20.61M)',
      cpu: 'Ricoh 5A22 (16-bit @ 3.58 MHz)',
    },
    iconicGames: [
      {
        title: 'Super Mario World',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/c5bf5cab-7ae6-4280-84ca-65761ac96361.jpg',
        desc: 'La gran evolución de Mario con Yoshi. Gráficos vibrantes de 16 bits, y un vasto mapa mundial interconectado.',
      },
      {
        title: 'The Legend of Zelda: A Link to the Past',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/r2_e698dfae-11dd-429d-81e1-fc0d32e5f39b.jpg',
        desc: 'Obra maestra absoluta de los 16 BITS. Define la estructura moderna de los juegos de aventuras, las mazmorras y los viajes entre mundos paralelos.',
      },
      {
        title: 'Chrono Trigger',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/5db08b42-02db-4a10-b073-6a44abf60720.jpg',
        desc: 'Posiblemente el RPG definitivo. Creado por un Dream Team de Japón, destaca con sus múltiples finales y combates con viaje en el tiempo.',
      },
      {
        title: 'Donkey Kong Country',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025142/nivel-retro/migrated/de45a6fe-0418-4b04-8c5f-5595f6a9bfa7.png',
        desc: 'Gráficos prerrenderizados revolucionarios cortesía de Rareware, acompañado por una banda sonora espectacular (David Wise) y plataformas retantes.',
      },
    ],
  },
  {
    id: 'genesis',
    name: 'Sega Mega Drive (Genesis)',
    bits: '16 BITS',
    boxArt:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409021/MEGADRIVEBOX_p0ueql.png',
    heroImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409023/MEGADRIVECONSOLE_acdxbz.png',
    logoImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409023/MEGADRIVELOGO_sxobfs.png',
    dato: '¿Sabías que se llama "Genesis" en EE.UU. solo porque el nombre "Mega Drive" ya estaba registrado por otra empresa allí? En el resto del mundo mantuvo su nombre original.',
    techSheet: {
      lanzamiento: '1988 (Japón) / 1989 (EE.UU)',
      ventas: '~30.75 millones',
      masVendido: 'Sonic the Hedgehog 2 (6.03M)',
      cpu: 'Motorola 68000 (16-bit @ 7.6 MHz)',
    },
    iconicGames: [
      {
        title: 'Shinobi III',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025143/nivel-retro/migrated/f0466b83-b8f7-4aac-af83-e93e73800b62.png',
        desc: 'Acción ninja fluida y trepidante con ataques cuerpo a cuerpo letales. Uno de los pináculos del género de acción 2D de la consola.',
      },
      {
        title: 'Gunstar Heroes',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025143/nivel-retro/migrated/dce3611a-3072-4f24-b8f4-c7dad2c5996d.jpg',
        desc: 'El legendario título de Treasure que empujó el límite técnico y gráfico con frenética acción tipo shooter cooperativo que la Mega Drive hizo posible.',
      },
      {
        title: 'Streets of Rage 2',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025143/nivel-retro/migrated/facb83d3-5f29-4003-9f13-24d0e5ab4218.jpg',
        desc: 'Para muchos el mejor Beat em Up de la historia, inmortalizando el género con una jugabilidad adictiva y música excepcional compositor de Yuzo Koshiro.',
      },
      {
        title: 'Sonic the Hedgehog 2',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025144/nivel-retro/migrated/3d7745d5-3c90-4678-b0af-8d4e98959bbc.png',
        desc: 'La consagración del veloz erizo azul, quien ahora acompañado por su fiel amigo Tails introdujo el revolucionario "Spin Dash" a los gamers de la época.',
      },
    ],
  },
  {
    id: 'sms',
    name: 'SEGA Master System',
    bits: '8 BITS',
    boxArt:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409019/MASTERSYSTEMBOX_jxpatf.png',
    heroImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409021/MASTERSYSTEMCONSOLE_amuc1b.png',
    logoImg:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025743/nivel-retro/migrated/3840px-Master_System_Logo-svg-9f1a2b3c.webp',
    dato: 'La Master System ostenta el récord mundial de la consola con mayor tiempo de permanencia en el mercado, gracias a su inmensa popularidad en Brasil, donde se ha vendido por más de 30 años.',
    techSheet: {
      lanzamiento: '1985 (Japón) / 1986 (EE.UU)',
      ventas: '13 millones',
      masVendido: 'Alex Kidd in Miracle World',
      cpu: 'Zilog Z80 (8-bit @ 3.58 MHz)',
    },
    iconicGames: [
      {
        title: 'Alex Kidd',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025144/nivel-retro/migrated/e9a25f89-4489-48db-a4d1-ed95fbeaef07.jpg',
        desc: 'La mascota original de SEGA protagoniza un simpático y curioso clásico de plataformas y motocicletas donde las peleas de jefes se juegan al Yan Ken Pon.',
      },
      {
        title: 'Phantasy Star',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025144/nivel-retro/migrated/feceac87-80fb-4828-a2a9-eb36e7828804.jpg',
        desc: 'Un ambicioso e impecable juego de rol con combates épicos y exploración de mazmorras fluidas simuladas en falso 3D, muy avanzado para una consola de 8 bits.',
      },
      {
        title: 'Sonic the Hedgehog',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025144/nivel-retro/migrated/d8617c40-e3f8-4dc2-a0ba-e907e0346109.jpg',
        desc: 'Demostró que Master System estaba a la altura exprimiendo el procesador con un diseño de mundos hermosos y jugabilidad ajustada a los controles.',
      },
      {
        title: 'Wonder Boy III',
        cover:
          'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025144/nivel-retro/migrated/717b630c-d030-42a5-8a44-4fb4f681bb6a.jpg',
        desc: "The Dragon's Trap ofrece un nivel de mapa semiabierto integrado a un rol de acción profunda, algo técnicamente increíble para este sistema.",
      },
    ],
  },
];

const selectedConsole = ref(consoles[0]);
const selectedGame = ref(null);
const isGameModalOpen = ref(false);

const selectConsole = (c) => {
  selectedConsole.value = c;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

.museum-page {
  min-height: auto;
  background-color: #0d1526;
  color: #e2e8f0;
  font-family: 'Roboto', sans-serif;
  padding: 40px 40px 15px 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
  margin-top: 5px;
  margin-bottom: 35px;
  text-align: center;
  letter-spacing: 1px;
}

.museum-layout {
  display: grid;
  grid-template-columns: 550px 1fr;
  gap: 40px;
  width: 95%;
  max-width: 1700px;
  align-items: start;
}

/* Left Side - Cabinet */
.cabinet-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-btn {
  background: #334155;
  border: 2px solid #64748b;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 10;
  transition:
    background 0.2s,
    transform 0.2s;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

.nav-btn:hover {
  background: #475569;
  transform: scale(1.1);
}

.nav-btn.prev {
  left: 20px;
}

.nav-btn.next {
  right: 20px;
}

.glass-cabinet {
  flex: 1;
  background: linear-gradient(180deg, #c5d4e2 0%, #abc1d5 100%);
  border: 22px solid #e2e8f0;
  border-radius: 40px;
  position: relative;
  width: 550px;
  height: 640px;
  flex-shrink: 0;
  box-shadow:
    inset 0 10px 25px rgba(0, 0, 0, 0.2),
    0 25px 50px rgba(0, 0, 0, 0.5);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.glass-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 255, 255, 0) 65%,
    rgba(255, 255, 255, 0.15) 100%
  );
  border-radius: 18px;
  pointer-events: none;
  z-index: 4;
}

.console-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 5;
  gap: 15px;
}

.console-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  transition: all 0.3s ease;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
}

.console-slot.active {
  box-shadow: 0 0 25px 8px rgba(255, 255, 255, 0.75);
  border: 4px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.15);
}

.slot-box-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.6));
  transition: transform 0.2s;
  z-index: 2;
}

.console-slot:hover .slot-box-img {
  transform: scale(1.05);
}

.shelf-divider {
  position: absolute;
  background: linear-gradient(
    to right,
    rgba(230, 240, 250, 0.6),
    rgba(255, 255, 255, 1),
    rgba(230, 240, 250, 0.6)
  );
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.shelf-divider.horizontal {
  top: 50%;
  left: 20px;
  right: 20px;
  height: 12px;
  transform: translateY(-50%);
  border-radius: 6px;
}

.shelf-divider.vertical {
  left: 50%;
  top: 20px;
  bottom: 20px;
  width: 12px;
  transform: translateX(-50%);
  border-radius: 6px;
  background: linear-gradient(
    to bottom,
    rgba(230, 240, 250, 0.6),
    rgba(255, 255, 255, 1),
    rgba(230, 240, 250, 0.6)
  );
}

/* Right Side - Info Panels */
.info-wrapper {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  grid-template-rows: 390px 230px;
  gap: 20px;
  height: 640px;
  flex-shrink: 0;
}

.info-box {
  background: #0d1526;
  border: 1px solid #1e293b;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.showcase-box {
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #1e293b;
  z-index: 5;
}

.console-logo {
  position: absolute;
  top: 25px;
  left: 25px;
  max-width: 250px;
  max-height: 80px;
  object-fit: contain;
  opacity: 0.95;
}

.sms-logo {
  max-width: 220px;
}

.console-hero {
  max-width: 85%;
  max-height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7));
  margin-top: 20px;
}

.specs-box {
  justify-content: center;
  background-color: #1e293b;
  position: relative;
  z-index: 5;
}

.specs-title {
  color: #fbbf24;
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 10px;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.tech-specs-list-inline {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.8;
}

.tech-specs-list-inline li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 0;
}

.tech-specs-list-inline li:last-child {
  border-bottom: none;
}

.tech-specs-list-inline strong {
  color: #a5f3fc;
  margin-right: 8px;
}

.curioso-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #1e293b;
  position: relative;
  z-index: 5;
  padding-top: 15px;
}

.box-title {
  font-family: 'Oswald', sans-serif;
  color: #fbbf24;
  font-size: 1.4rem;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.curioso-text {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.juegos-box {
  display: flex;
  flex-direction: column;
  background-color: #1e293b;
  position: relative;
  z-index: 5;
  padding-top: 15px;
}

.games-row {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
  margin-top: 0;
}

.game-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
  cursor: pointer;
  overflow: visible;
  height: 100%;
}

.game-item:hover {
  transform: translateY(-8px);
}

.game-cover-img {
  width: auto;
  height: 100%;
  max-width: 100%;
  max-height: 130px;
  object-fit: contain;
  filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.6));
  border-radius: 4px;
}

/* Responsiveness */
@media (max-width: 1400px) {
  .museum-layout {
    grid-template-columns: 1fr;
  }
  .glass-cabinet {
    height: 700px;
  }
  .info-wrapper {
    height: auto;
  }
  .console-logo {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 20px;
  }
  .showcase-box {
    flex-direction: column;
    padding: 30px;
  }
  .games-row {
    height: 160px;
  }
}
@media (max-width: 768px) {
  .museum-page {
    padding: 15px;
  }

  .back-btn {
    position: static;
    margin: 10px 0 0 0;
    align-self: flex-start;
  }

  .page-title {
    font-size: 1.6rem;
    margin-top: 15px;
    margin-bottom: 25px;
    line-height: 1.2;
  }

  .glass-cabinet {
    width: 100%;
    height: 400px;
    border-width: 12px;
    padding: 15px;
  }

  .shelf-divider.horizontal {
    left: 10px;
    right: 10px;
  }

  .shelf-divider.vertical {
    top: 10px;
    bottom: 10px;
  }

  .info-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: auto;
    gap: 15px;
  }

  .showcase-box {
    padding: 20px 15px;
  }

  .console-hero {
    max-height: 160px;
    width: 100%;
    object-fit: contain;
  }

  .console-logo {
    max-height: 40px;
  }

  .games-row {
    flex-wrap: wrap;
    height: auto;
    gap: 15px;
  }
  .game-item {
    min-width: 45%;
    height: 100px;
  }
}

/* Game Modal */
.game-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-modal-content {
  background: #0d1526;
  border: 1px solid #1e293b;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  padding: 40px;
  display: flex;
  gap: 40px;
  max-width: 900px;
  width: 90%;
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #1e293b;
  color: #e2e8f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-modal-btn:hover {
  background: #fbbf24;
  color: #000;
  transform: scale(1.1);
}

.modal-left {
  flex: 0 0 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-game-cover {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.7);
}

.modal-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-game-title {
  font-family: 'Oswald', sans-serif;
  color: #fbbf24;
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 20px;
  line-height: 1.1;
  text-transform: uppercase;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.6);
}

.modal-game-desc {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .game-modal-content {
    flex-direction: column;
    padding: 30px;
  }
}

/* Console Spec Modal */
.console-spec-modal {
  max-width: 800px;
}

.modal-console-img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7));
}

.tech-specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.8;
}

.tech-specs-list li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
}

.tech-specs-list li:last-child {
  border-bottom: none;
}

.tech-specs-list strong {
  color: #a5f3fc;
  margin-right: 10px;
}
</style>
