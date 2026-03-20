<template>
  <div class="gc-shelf-container">
    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>
    
    <div class="pattern-bg"></div>

    <div class="gc-content">
      <!-- Shelf Section (Left) -->
      <div class="shelf-wrapper">
        <div class="gc-shelf">
          <!-- Top Banner -->
          <div class="shelf-header">
            <div class="marquee-display">
              <img src="../assets/img/Logo GC.png" alt="GameCube Logo" class="shelf-logo" />
              <div class="shelf-title-container">
                <span class="title-nintendo">NINTENDO</span>
                <span class="title-gamecube">GAMECUBE<span class="title-tm">™</span></span>
              </div>
            </div>
          </div>
          
          <!-- Shelves Container -->
          <div class="shelf-body">
            <div class="shelf-row" v-for="(row, index) in shelves" :key="'row-'+index">
              <div class="game-item" v-for="(item, i) in row" :key="'item-'+index+'-'+i" :title="item.name" @click="selectItem(item)">
                <img :src="item.img" :alt="item.name" :class="{'hardware-box': item.isHardware, 'game-box': !item.isHardware, 'selected-box': selectedItem === item}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section (Right) -->
      <aside class="gc-info-panel">
        <div class="info-card">
          <!-- Vista de Item Específico -->
          <template v-if="selectedItem">
            <h2 class="info-title">{{ selectedItem.title || selectedItem.name }}</h2>
            <!-- VISTA MULTIMEDIA (Default) -->
            <div v-if="!showDetailsView" class="media-view-container">
              <p class="info-desc">
                {{ selectedItem.desc }}
              </p>

              <!-- Multimedia Gallery for Games -->
              <div class="media-gallery" v-if="selectedItem.media && (selectedItem.media.box3d || selectedItem.media.cart)">
                <h3 class="info-subtitle">Galería Multimedia</h3>
                <div class="gallery-grid">
                  <div class="gallery-item" v-if="selectedItem.media.box3d">
                    <img :src="selectedItem.media.box3d" alt="Box 3D" @click="openLightbox(selectedItem.media.box3d)" class="clickable-img" />
                    <span class="gallery-label">Caja Original</span>
                  </div>
                  <div class="gallery-item" v-if="selectedItem.media.cart">
                    <img :src="selectedItem.media.cart" alt="Game Disc" @click="openLightbox(selectedItem.media.cart)" class="clickable-img" />
                    <span class="gallery-label">Disco</span>
                  </div>
                </div>
              </div>

              <!-- Console Gallery -->
              <div class="console-gallery" v-if="selectedItem.isHardware && selectedItem.gallery">
                <h3 class="info-subtitle">Galería Multimedia</h3>
                <div class="console-gallery-grid">
                  <div class="console-gallery-item" v-for="(imgSrc, index) in selectedItem.gallery" :key="index">
                    <img :src="imgSrc" :alt="`GameCube Console Image ${index + 1}`" @click="openLightbox(imgSrc)" class="clickable-img" />
                  </div>
                </div>
              </div>

              <!-- Gameplay (Vista Previa de Video) -->
              <div class="video-preview" v-if="selectedItem.media && selectedItem.media.video">
                <h3 class="info-subtitle">Jugabilidad</h3>
                <div class="video-container">
                  <video 
                    :src="selectedItem.media.video" 
                    autoplay 
                    loop 
                    muted 
                    playsinline 
                    disablePictureInPicture
                  ></video>
                </div>
              </div>
            </div>

            <!-- VISTA DE DETALLES -->
            <div v-else class="details-view-container">
              <div class="expanded-details">
                <h3 class="info-subtitle">Ficha Técnica</h3>
                <div class="expanded-details-grid">
                  <p v-if="selectedItem.details"><strong>{{ selectedItem.isHardware ? 'Estado / Cond.' : 'Género' }}:</strong> <br> {{ selectedItem.details }}</p>
                  <p v-if="selectedItem.year"><strong>Año:</strong> <br> {{ selectedItem.year }}</p>
                  <p v-if="selectedItem.developer"><strong>Estudio:</strong> <br> {{ selectedItem.developer }}</p>
                  <p v-if="selectedItem.players"><strong>Jugadores:</strong> <br> {{ selectedItem.players }}</p>
                </div>
              </div>

              <div class="expanded-purchase" v-if="selectedItem.price">
                <div class="price-highlight expanded-price">
                  <span class="price-label">PRECIO</span>
                  <span class="price-value">{{ selectedItem.price }}</span>
                </div>
                <button class="buy-button expanded-buy" @click="$emit('add-to-cart', selectedItem)">COMPRAR</button>
              </div>
            </div>
          </template>

          <!-- Vista Global GameCube si no hay selección -->
          <template v-else>
            <h2 class="info-title">Nintendo GameCube</h2>
            <p class="info-desc">
              La Nintendo GameCube (oficialmente abreviada como NGC) es una consola de sexta generación fabricada por Nintendo. Destacó comercialmente por su diseño compacto, amigable y peculiar forma de cubo, que incluía un asa de transporte en su parte posterior. Su mando introdujo una disposición de botones asimétrica centrada en la ergonomía, siendo ampliamente considerado como uno de los controles más cómodos diseñados para la industria.
            </p>
  
            <h3 class="info-subtitle">Detalles técnicos</h3>
            <p class="info-text">
              Su arquitectura interna fue desarrollada en colaboración con IBM, integrando un potente procesador conocido como "Gekko". Para combatir la piratería y abandonar el costoso formato de cartucho, la GameCube fue la primera consola de Nintendo en adoptar medios ópticos, utilizando un formato propietario basado en el Mini-DVD (con capacidad de 1,5 GB). Aunque su rendimiento gráfico superaba al de consolas contemporáneas como la PlayStation 2, el limitado espacio de almacenamiento de sus discos supuso un reto para las desarrolladoras al adaptar juegos de gran envergadura.
            </p>
  
            <div class="info-footer">
              <p><strong>Año de lanzamiento:</strong> 2001</p>
              <p><strong>Unidades vendidas:</strong> 21,74 millones</p>
            </div>
          </template>
        </div>

        <!-- Botones GameCube con Aletas -->
        <div class="gc-tabs-container" v-if="selectedItem">
          <!-- Aleta A (Vista Multimedia) -->
          <div 
            class="gc-tab" 
            :class="{ active: !showDetailsView }" 
            @click="showDetailsView = false"
            title="Descripción General"
          >
            <div class="gc-btn btn-a" :class="{ pressed: !showDetailsView }">
              <span class="btn-letter">A</span>
            </div>
          </div>

          <!-- Aleta B (Vista Detalles) -->
          <div 
            class="gc-tab" 
            :class="{ active: showDetailsView }" 
            @click="showDetailsView = true"
            title="Ficha Técnica"
          >
            <div class="gc-btn btn-b" :class="{ pressed: showDetailsView }">
              <span class="btn-letter">B</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Lightbox Overlay -->
    <Transition name="fade">
      <div class="lightbox-overlay" v-if="lightboxImage" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox"><i class="fas fa-times"></i></button>
          <img :src="lightboxImage" alt="Expanded image" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['back', 'add-to-cart']);

const libretroGC = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_GameCube/master/Named_Boxarts/';

const selectedItem = ref(null);
const lightboxImage = ref(null);
const showDetailsView = ref(false);

const selectItem = (item) => {
  selectedItem.value = item;
  showDetailsView.value = false;
};

const openLightbox = (imgSrc) => {
  lightboxImage.value = imgSrc;
};

const closeLightbox = () => {
  lightboxImage.value = null;
};

const shelves = ref([
  [
    { 
      name: 'Zelda: The Wind Waker', desc: 'Una épica aventura por un mundo inundado. Destaca por su hermoso apartado gráfico cel-shading y una inolvidable banda sonora.', detailsTitle: 'Género', details: 'Aventura / Acción', year: '2002', developer: 'Nintendo EAD', players: '1 Jugador', price: '$80.000', 
      img: 'https://images.launchbox-app.com//8d018e6c-9754-49bb-859a-749ef63ddc09.jpg',
      media: { box3d: 'https://images.launchbox-app.com//6549e045-bd01-4982-9308-c9f3a1acc4d6.png', cart: 'https://images.launchbox-app.com//af78b849-a63d-4806-aeca-2b1a7c04715a.png', video: '/src/assets/videos/GC/Legend of Zelda, The - The Wind Waker (USA).mp4' }
    },
    { 
      name: 'Pikmin 2', desc: 'Lidera a unas curiosas criaturas planta para recolectar tesoros en un planeta alienígena. Estrategia en tiempo real única.', detailsTitle: 'Género', details: 'Estrategia en tiempo real', year: '2004', developer: 'Nintendo EAD', players: '1-2 Jugadores', price: '$65.000', 
      img: 'https://images.launchbox-app.com//06275055-3633-4207-bf83-b8cad124d04e.jpg',
      media: { box3d: 'https://images.launchbox-app.com//a988faa6-450a-48ed-9bdf-b75ac502c7fd.png', cart: 'https://images.launchbox-app.com//eb84137f-7ce4-4a2f-9189-5d5c03637ccb.png', video: '/src/assets/videos/GC/Pikmin 2 (USA).mp4' }
    },
    { 
      name: 'Super Mario Sunshine', desc: 'Mario viaja a la paradisíaca Isla Delfino pero es incriminado. Ayudado por F.L.U.D.D., deberá limpiar la isla completa con agua.', detailsTitle: 'Género', details: 'Plataformas 3D', year: '2002', developer: 'Nintendo EAD', players: '1 Jugador', price: '$70.000', 
      img: 'https://images.launchbox-app.com//c953705e-44d3-40f7-ba2b-7dee1b84a768.jpg',
      media: { box3d: 'https://images.launchbox-app.com//68ba6164-3fcd-4b93-be4d-5608aac01118.png', cart: 'https://images.launchbox-app.com//0f71a42f-ab8a-425b-bff0-74b06e844a4f.png', video: '/src/assets/videos/GC/Super Mario Sunshine (USA).mp4' }
    },
    { 
      name: 'Super Smash Bros. Melee', desc: 'El rey de los juegos de lucha plataformeros. Un título de culto absoluto en el componente competitivo con físicas frenéticas.', detailsTitle: 'Género', details: 'Lucha / Party', year: '2001', developer: 'HAL Laboratory', players: '1-4 Jugadores', price: '$120.000', 
      img: 'https://images.launchbox-app.com//6a50a9dc-ac31-440d-ab12-6c322c7ceed0.jpg',
      media: { box3d: 'https://images.launchbox-app.com//bc1471f7-0124-4b38-a88f-e650f73156af.png', cart: 'https://images.launchbox-app.com//273a9b53-79e4-4899-b254-03157ee749dc.png', video: '/src/assets/videos/GC/Super Smash Bros. Melee (USA).mp4' }
    }
  ],
  [
    { 
      name: 'Mario Party 4', desc: 'La clásica serie de tableros de Mario debuta en GameCube con mini-juegos más creativos, gráficos mejorados y uso de objetos en 3D.', detailsTitle: 'Género', details: 'Party Game', year: '2002', developer: 'Hudson Soft', players: '1-4 Jugadores', price: '$55.000', 
      img: 'https://images.launchbox-app.com//adcd0147-858e-4450-bb1b-9168966d2128.jpg',
      media: { box3d: 'https://images.launchbox-app.com//84021eea-7e7d-45e5-ba85-3507d1514d12.png', cart: 'https://images.launchbox-app.com//dbc01198-d6c8-4985-97ac-67b26b352fd3.png', video: '/src/assets/videos/GC/Mario Party 4 (USA).mp4' }
    },
    { 
      name: 'Super Monkey Ball', desc: 'Controla a un mono en una esfera transparente, inclinando el escenario para llevarlo a la meta. Increíblemente adictivo y exigente.', detailsTitle: 'Género', details: 'Party / Puzzle', year: '2001', developer: 'Amusement Vision', players: '1-4 Jugadores', price: '$35.000', 
      img: 'https://images.launchbox-app.com//0b53e4c6-fe74-460e-a236-26d335563f90.png',
      media: { box3d: 'https://images.launchbox-app.com//6f8a9784-2fcd-432a-816e-2ea102f60bf3.png', cart: 'https://images.launchbox-app.com//a3d4c831-4df6-461c-b10e-d89c631bf714.png', video: '/src/assets/videos/GC/Super Monkey Ball (USA).mp4' }
    },
    { 
      name: 'Mario Kart Double Dash', desc: 'La revolución del karting donde ¡dos personajes van en un mismo coche! Permite lanzar objetos y cambiar pilotos en medio de la carrera.', detailsTitle: 'Género', details: 'Carreras Arcade', year: '2003', developer: 'Nintendo EAD', players: '1-4 Jugadores', price: '$90.000', 
      img: 'https://images.launchbox-app.com//0db38719-5ccc-4710-b416-ddc25eb4332b.jpg',
      media: { box3d: 'https://images.launchbox-app.com//e234aa6b-4099-401f-bdbf-460e436c23ad.png', cart: 'https://images.launchbox-app.com//84f2b8fe-32bf-4dec-b4c2-08664f088271.png', video: '/src/assets/videos/GC/Mario Kart - Double Dash!! (USA).mp4' }
    },
    { 
      name: 'Luigi\'s Mansion', desc: 'El hermano miedoso de Mario se convierte en protagonista para atrapar fantasmas en una siniestra mansión. Título de lanzamiento de GameCube.', detailsTitle: 'Género', details: 'Acción / Aventura', year: '2001', developer: 'Nintendo EAD', players: '1 Jugador', price: '$75.000', 
      img: 'https://images.launchbox-app.com//06fbb90c-cb64-4d1f-8c48-c5e117c7fe67.jpg',
      media: { box3d: 'https://images.launchbox-app.com//63e19fe1-bd1e-4a92-8a4d-c63a60cc60d2.png', cart: 'https://images.launchbox-app.com//fcb4fab3-ba1e-46fe-ae5d-c3cda91b1e22.png', video: '/src/assets/videos/GC/Luigi\'s Mansion (USA).mp4' }
    }
  ],
  [
    { 
      name: 'Donkey Kong Jungle Beat', desc: 'Un salvaje y rítmico juego de plataformas diseñado originalmente para jugarse con los Bongós DK.', detailsTitle: 'Género', details: 'Plataformas Rítmico', year: '2004', developer: 'Nintendo EAD Tokyo', players: '1-2 Jugadores', price: '$40.000', 
      img: 'https://images.launchbox-app.com//f3024d40-f1f4-49f1-9641-cf6dbed20747.jpg',
      media: { box3d: 'https://images.launchbox-app.com//d18b85f3-beec-4d96-9d3e-b2b3804b14a4.png', cart: 'https://images.launchbox-app.com//3914698d-ff3e-48ca-9405-8f1faaa718b4.png', video: '/src/assets/videos/GC/Donkey Kong Jungle Beat (USA).mp4' }
    },
    { 
      name: 'Super Mario Strikers', desc: 'El frenético fútbol sin reglas del Reino Champiñón, donde los placajes severos y remates increíbles son la orden del día.', detailsTitle: 'Género', details: 'Fútbol Arcade', year: '2005', developer: 'Next Level Games', players: '1-4 Jugadores', price: '$65.000', 
      img: 'https://images.launchbox-app.com//786d32bd-ab4a-45c3-acb6-32ac5666c242.jpg',
      media: { box3d: 'https://images.launchbox-app.com//7be33efc-95a2-4861-bf96-96250cd23937.png', cart: 'https://images.launchbox-app.com//ac5255fd-35fa-441f-b9b3-e4202cc0c998.png', video: '/src/assets/videos/GC/Super Mario Strikers (USA).mp4' }
    },
    { 
      name: 'Viewtiful Joe', desc: 'Un juego de acción beat \'em up con estilo cel-shading espectacular donde controlas a un héroe amante del cine con la capacidad de controlar el tiempo.', detailsTitle: 'Género', details: 'Acción / Beat \'em up', year: '2003', developer: 'Capcom', players: '1 Jugador', price: '$50.000', 
      img: 'https://images.launchbox-app.com//f273334d-89d8-4c16-80f8-76082b7a73d6.jpg',
      media: { box3d: 'https://images.launchbox-app.com//a58cab26-4ff4-4da7-9b4b-8cfe23789e57.png', cart: 'https://images.launchbox-app.com//2907e10e-38a2-4bea-a60a-7b91613f0031.png', video: '/src/assets/videos/GC/Viewtiful Joe (USA).mp4' }
    },
    { 
      name: 'The Legend Of Zelda Twilight Princess', desc: 'Una aventura oscura y madura donde Link puede transformarse en lobo. Explora un reino invadido por el crepúsculo y salva a Hyrule.', detailsTitle: 'Género', details: 'Acción / Aventura', year: '2006', developer: 'Nintendo EAD', players: '1 Jugador', price: '$95.000', 
      img: 'https://images.launchbox-app.com//74c9cf0e-f788-49e0-90a3-b67f9ad28b6d.jpg',
      media: { box3d: 'https://images.launchbox-app.com//a6b372e5-d59b-4381-b23c-2c63fd88b364.png', cart: 'https://images.launchbox-app.com//a721520d-1ae9-4a7d-9a79-f450ab07d004.png', video: '/src/assets/videos/GC/Legend of Zelda, The - Twilight Princess (USA).mp4' }
    }
  ]
]);
</script>

<style scoped>
.gc-shelf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px);
  background-color: #f1f5f9; /* Gris claro */
  position: relative;
  overflow: hidden; /* CORTA el patrón de fondo, pero deja que el navegador haga el scroll */
  width: 100%;
}

.gc-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  gap: 60px;
  z-index: 1;
  align-items: stretch; /* Asegura que ambas columnas tengan la misma altura */
}

.shelf-wrapper {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
}

/* Background Pattern (Nintendo GameCube repitiendose) */
.pattern-bg {
  position: absolute;
  top: -100vh;
  left: -100vw;
  width: 300vw;
  height: 300vh;
  background-image: url("data:image/svg+xml,%3Csvg width='350' height='120' viewBox='0 0 350 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dy='.3em' font-family='Arial, sans-serif' font-size='26' font-weight='800' fill='%23cbd5e1' text-anchor='middle'%3ENINTENDO GAMECUBE%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 350px 120px;
  z-index: 0;
  opacity: 0.8;
  transform: rotate(-38deg);
  animation: bgMove 25s linear infinite;
}

@keyframes bgMove {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 220px 0;
  }
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
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #3b82f6; /* Hover azul vivo */
  transform: translateX(-5px);
}

.gc-shelf {
  position: relative;
  z-index: 1;
  width: 650px;
  height: 850px;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 25px 35px rgba(0,0,0,0.3));
}

/* Info Panel Styles */
.gc-info-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-card {
  flex: 1; /* Ocupa el 100% de la altura disponible */
  margin-bottom: 2px; /* Resta 2 píxeles de altura visual al contenedor alineado */
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-left: 8px solid #5A3B8C;
  font-family: 'Roboto', sans-serif;
  color: #334155;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 5; /* Asegura que el panel quede por encima de las aletas */
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
  color: #5A3B8C;
  margin-bottom: 5px;
}

.info-text {
  font-size: 1.05rem;
  margin-bottom: 5px;
  text-align: justify;
}

.info-footer {
  margin-top: auto; /* Empuja el footer hacia el final de la tarjeta */
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

/* Multimedia Gallery */
.media-gallery {
  margin-top: -10px; /* Pull it closer to game description */
  margin-bottom: -15px; /* Pull video preview closer */
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
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.25));
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

/* Console Gallery */
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
  background: #fff; /* White background for transparent product shots */
  height: 120px;
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

/* Video Preview Styles (Jugabilidad) */
.video-preview {
  margin-top: -15px; /* Corrected syntax error and tightened spacing */
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #334155;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  position: relative;
}

.video-container video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* -- Aleta Lateral (Fin) -- */
.gc-info-panel {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* -- Botones de Control GameCube y Aletas -- */
.gc-tabs-container {
  position: absolute;
  top: 90px; 
  right: -100px; /* Más a la derecha */
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* Sin z-index, sus hijos definen la profundidad */
}

.gc-tab {
  width: 85px; /* Más ancho para asomar bien */
  height: 65px;
  background-color: #cbd5e1; /* Color inactivo, sombra detrás */
  border-radius: 0 35px 35px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Botones hacia la derecha */
  padding-right: 18px;
  cursor: pointer;
  box-shadow: inset 4px 4px 6px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.5), 3px 4px 8px rgba(0,0,0,0.15);
  transform: translateX(-20px); /* Oculto cuando inactivo */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1; /* DETRÁS del info-card (z-index 5) */
}

.gc-tab.active {
  background-color: #ffffff; /* Mismo color que info-card */
  box-shadow: 6px 4px 15px rgba(0,0,0,0.15); /* Sombra hacia afuera */
  transform: translateX(0); /* Aleta seleccionada sale más */
  z-index: 6; /* SOBRE del info-card (z-index 5) */
}

/* Pseudo-elemento extendido hacia la izquierda para conectar sin huecos y tapar sombra */
.gc-tab.active::before {
  content: '';
  position: absolute;
  left: -30px; 
  top: 0;
  width: 40px;
  height: 100%;
  background-color: #ffffff;
  z-index: -1; 
}

.gc-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  border: 1px solid rgba(0,0,0,0.15);
  transition: transform 0.1s, box-shadow 0.1s;
}

/* Efecto de plástico 3D con luz radial cruzada */
.gc-btn::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%);
  pointer-events: none;
}

/* Botón A (Verde) */
.btn-a {
  background-color: #00a84b;
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.4),
    inset 2px 2px 5px rgba(255,255,255,0.4),
    2px 3px 4px rgba(0,0,0,0.3);
}

/* Botón B (Rojo) */
.btn-b {
  background-color: #e6192b;
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.4),
    inset 2px 2px 5px rgba(255,255,255,0.4),
    2px 3px 4px rgba(0,0,0,0.3);
}

.gc-btn.pressed {
  box-shadow: 
    inset -1px -1px 3px rgba(0,0,0,0.3),
    inset 1px 1px 3px rgba(255,255,255,0.3),
    1px 1px 2px rgba(0,0,0,0.2);
  transform: translateY(2px) translateX(1px);
}

.btn-letter {
  font-family: 'Arial Rounded MT Bold', 'Verdana', sans-serif;
  font-size: 1.4rem;
  font-weight: bold;
  pointer-events: none;
}

.btn-a .btn-letter {
  color: #007635; /* Relieve oscuro tallado */
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.4);
}

.btn-b .btn-letter {
  color: #8c0c16; /* Relieve oscuro tallado */
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.4);
}

/* -- Vistas Intercambiables -- */
.media-view-container {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease;
}

.details-view-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  animation: fadeIn 0.4s ease;
  gap: 30px;
  margin-top: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.expanded-details {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 6px solid #334155;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
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
}

.expanded-price .price-value {
  font-size: 2.2rem;
}

.expanded-buy {
  padding: 20px;
  font-size: 1.5rem;
}

.price-highlight {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  flex: 1;
}

.price-label {
  color: #94a3b8;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.price-value {
  color: #ffffff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  line-height: 1;
}

.buy-button {
  background: #e11d48; /* Rojo vibrante */
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
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

.buy-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(225, 29, 72, 0.4);
}

/* Responsive ajustes */
@media (max-width: 1200px) {
  .expanded-details-grid {
    grid-template-columns: 1fr;
  }
}

/* Top Banner matching the GameCube image */
.shelf-header {
  background-color: #5A3B8C;
  height: 160px;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px 12px 20px;
  border: none;
  box-shadow: 
    inset 0 10px 15px rgba(255, 255, 255, 0.15), 
    inset 0 -6px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.marquee-display {
  background-color: #1a1a1b; /* Dark metallic background */
  
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 3px solid #3a3a3c;
  border-bottom-color: #222;
  border-right-color: #222;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.9), 
    0 5px 8px rgba(0, 0, 0, 0.5);
}

.shelf-logo {
  height: 200px;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
}

.shelf-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 5px;
}

.title-nintendo {
  color: #a3a3a3;
  font-family: 'Arial', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.55em;
  margin-left: 0.2em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
  line-height: 1;
  margin-bottom: 2px;
}

.title-gamecube {
  color: #f1f5f9;
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 2.8rem;
  letter-spacing: 1.5px;
  text-shadow: 
    0 2px 0 #94a3b8,
    2px 4px 6px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.title-tm {
  font-size: 1rem;
  font-family: Arial, sans-serif;
  font-weight: normal;
  letter-spacing: 0;
  margin-left: 5px;
  margin-top: 6px;
  color: #a3a3a3;
  text-shadow: none;
}

/* Shelf Body */
.shelf-body {
  flex: 1;
  background-color: #39245c; /* Darker green inside */
  border-left: 20px solid #5A3B8C; /* Side walls */
  border-right: 20px solid #5A3B8C;
  border-top: 15px solid #2a1645; /* Shadow directly under header */
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.6);
}

/* Horizontal Shelves */
.shelf-row {
  flex: 1;
  border-bottom: 32px solid #5A3B8C; /* Physical shelf floor */
  box-shadow: 0 15px 15px -10px rgba(0,0,0,0.6); 
  position: relative;
  display: flex;
  align-items: flex-end; /* Grounded on the border-bottom */
  justify-content: space-around;
  padding: 25px 15px 0 15px; /* Added 25px at top for breathing room below upper shelf */
}

.game-item {
  margin-bottom: -5px; /* Slight overlap with the shelf border to avoid subpixel gaps */
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
  width: 125px;
  height: 175px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: -8px 10px 15px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.15);
  transform: perspective(500px) rotateY(-5deg); /* Slight 3D tilt */
  transition: transform 0.3s;
}

.game-item:hover .game-box {
  transform: perspective(500px) rotateY(0deg);
}

.hardware-box {
  height: 140px;
  width: auto; /* Permite que la caja se ajuste a la forma exacta de la imagen */
  max-width: 220px;
  object-fit: contain; /* Full image visible */
  background-color: transparent; /* No more white background */
  box-shadow: none; /* No more boxy shadow if transparent */
  filter: drop-shadow(-8px 10px 10px rgba(0,0,0,0.5)); /* Shadow that follows PNG shape */
  border-radius: 6px; /* Bordes ligeramente redondeados como los juegos */
  border: none;
  transition: transform 0.3s;
}

.game-item:hover .hardware-box {
  transform: scale(1.05); /* Hardware has no rotation pop, just scale */
}

.selected-box {
  outline: 4px solid #ffffff;
  outline-offset: 4px;
  border-radius: 6px; /* Asegura que el outline sea redondeado */
  transform: translateY(-15px) scale(1.1) rotateY(0deg) !important;
  z-index: 20 !important;
  filter: drop-shadow(0 0 15px rgba(255,255,255,0.8)) drop-shadow(-8px 10px 10px rgba(0,0,0,0.5)) !important;
}

.shelf-row:last-child {
  border-bottom: 50px solid #5A3B8C; /* Base of the stand is thicker */
  border-radius: 0 0 8px 8px; /* Curve bottom edges slightly */
}

/* Inner top shadows on each row to simulate depth below each shelf */
.shelf-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  pointer-events: none;
}

/* Lightbox Overlay Styles */
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
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
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
  transition: transform 0.2s, color 0.2s;
}

.lightbox-close:hover {
  transform: scale(1.1);
  color: #e11d48;
}

.clickable-img {
  cursor: zoom-in;
}

/* Transitions and Animations for Lightbox */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

@media (max-width: 768px) {
  .lightbox-close {
    top: -40px;
    right: 0;
  }
}
</style>
