<template>
  <div class="wii-shelf-container">
    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>
    
    <div class="pattern-bg"></div>

    <div class="wii-content">
      <!-- Shelf Section (Left) -->
      <div class="shelf-wrapper">
        <div class="wii-shelf">
          <!-- Top Banner -->
          <div class="shelf-header">
            <div class="marquee-display-wii">
              <img src="../assets/img/Logo Wii.png" alt="Wii Logo" class="shelf-logo" />
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
      <aside class="wii-info-panel">
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
                    <img :src="imgSrc" :alt="`Wii Console Image ${index + 1}`" @click="openLightbox(imgSrc)" class="clickable-img" />
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
            <h2 class="info-title">Nintendo Wii</h2>
            <p class="info-desc">
              La Wii es una videoconsola de séptima generación producida por Nintendo. Representó un cambio de paradigma en la estrategia de la compañía, alejándose de la carrera por la máxima potencia gráfica para enfocarse en la innovación de la interfaz de usuario. Fue un fenómeno cultural global que logró expandir el mercado de los videojuegos, atrayendo a un público demográfico inusualmente amplio, desde jugadores tradicionales hasta niños y adultos mayores.
            </p>
  
            <h3 class="info-subtitle">Detalles técnicos</h3>
            <p class="info-text">
              Su principal innovación tecnológica fue su mando inalámbrico, el Wii Remote, un dispositivo similar a un control remoto de televisión equipado con acelerómetros para la detección de movimiento en tres dimensiones y un puntero óptico infrarrojo. A nivel de arquitectura de hardware, utilizaba un procesador IBM "Broadway", siendo esencialmente una versión overclockeada y refinada de la GameCube. Debido a esto, fue la única consola de su generación en no ofrecer soporte nativo para gráficos en alta definición (HD), aunque incluía retrocompatibilidad total por hardware con los juegos y accesorios de su predecesora.
            </p>
  
            <div class="info-footer">
              <p><strong>Año de lanzamiento:</strong> 2006</p>
              <p><strong>Unidades vendidas:</strong> 101,63 millones</p>
            </div>
          </template>
        </div>

        <!-- Botones GameCube con Aletas -->
        <div class="wii-tabs-container" v-if="selectedItem">
          <!-- Aleta A (Vista Multimedia) -->
          <div 
            class="wii-tab" 
            :class="{ active: !showDetailsView }" 
            @click="showDetailsView = false"
            title="Descripción General"
          >
            <div class="wii-btn btn-a" :class="{ pressed: !showDetailsView }">
              <span class="btn-letter">1</span>
            </div>
          </div>

          <!-- Aleta B (Vista Detalles) -->
          <div 
            class="wii-tab" 
            :class="{ active: showDetailsView }" 
            @click="showDetailsView = true"
            title="Ficha Técnica"
          >
            <div class="wii-btn btn-b" :class="{ pressed: showDetailsView }">
              <span class="btn-letter">2</span>
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

const libretroWii = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Wii/master/Named_Boxarts/';

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
      name: 'New Super Mario Bros. Wii', desc: '¡El regreso triunfal de Mario a las plataformas 2D con modo cooperativo para 4 jugadores! Atraviesa mundos vibrantes usando nuevos ítems como el traje de hélice.', detailsTitle: 'Género', details: 'Plataformas 2D', year: '2009', developer: 'Nintendo EAD', players: '1-4 Jugadores', price: '$45.000', 
      img: 'https://images.launchbox-app.com//bb1e4403-13e8-4611-af08-d94083dbc230.png',
      media: { box3d: 'https://images.launchbox-app.com//81b4755d-8068-4013-b176-9b13464f5359.png', cart: 'https://images.launchbox-app.com//d51d70f5-7332-4feb-b6ce-2d19a3fccdbe.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031186/New_Super_Mario_Bros._Wii_USA_En_Fr_Es_Rev_2_uhbtgu.mp4' }
    },
    { 
      name: 'Mario Kart Wii', desc: 'Siente la velocidad con el Wii Wheel. Incluye un enorme plantel de personajes y circuitos clásicos junto a la gran novedad: ¡las motocicletas!', detailsTitle: 'Género', details: 'Carreras Arcade', year: '2008', developer: 'Nintendo EAD', players: '1-4 Jugadores', price: '$50.000', 
      img: 'https://images.launchbox-app.com//48d25208-91e4-4e2d-89d7-6c3359313528.jpg',
      media: { box3d: 'https://images.launchbox-app.com//2a1760af-8570-40cb-8782-2920119c734f.png', cart: 'https://images.launchbox-app.com//47d85a57-297a-4852-8472-13e170dac3d9.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031201/Mario_Kart_Wii_USA_En_Fr_Es_lwhfaa.mp4' }
    },
    { 
      name: 'Metroid Prime 3: Corruption', desc: 'Samus Aran regresa para cerrar su épica trilogía. Usa el Wii Remote para apuntar con precisión absoluta mientras combates la corrupción de Phazon.', detailsTitle: 'Género', details: 'FPA / Acción / Aventura', year: '2007', developer: 'Retro Studios', players: '1 Jugador', price: '$40.000', 
      img: 'https://images.launchbox-app.com//4d46980a-5f8f-4c52-a993-ab45f9bea4f9.jpg',
      media: { box3d: 'https://images.launchbox-app.com//a30058dd-0b49-4390-ad9c-3ac8093e8610.png', cart: 'https://images.launchbox-app.com//47a78d1b-5d94-4961-bef4-2c3e236ef3ea.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031197/Metroid_Prime_3_-_Corruption_USA_b9vzdy.mp4' }
    },
    { 
      name: 'The Legend of Zelda: Skyward Sword', desc: 'Descubre los orígenes de la Espada Maestra en esta épica aventura por las nubes. Combates realistas con detección 1:1 gracias al Wii MotionPlus.', detailsTitle: 'Género', details: 'Acción / Aventura', year: '2011', developer: 'Nintendo EAD', players: '1 Jugador', price: '$60.000', 
      img: 'https://images.launchbox-app.com//158911e9-23ba-45cd-acbb-1270d3252ca8.png',
      media: { box3d: 'https://images.launchbox-app.com//cc3d5f80-264a-4942-b5b8-a5431ea4ffc5.png', cart: 'https://gamesdb-images.launchbox.gg/r2_9f8ceff8-3a35-45b1-8237-105b02028f93.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031183/Legend_of_Zelda_The_-_Skyward_Sword_USA_En_Fr_Es_Rev_2_feryfj.mp4' }
    }
  ],
  [
    { 
      name: 'Super Mario Galaxy', desc: 'La reinvención definitiva de las plataformas 3D. Viaja a través de planetoides con gravedad variable en una odisea espacial sin precedentes.', detailsTitle: 'Género', details: 'Plataformas 3D', year: '2007', developer: 'Nintendo EAD Tokyo', players: '1-2 Jugadores', price: '$55.000', 
      img: 'https://images.launchbox-app.com//7a1a4534-4a67-468d-b218-397293981bf5.jpg',
      media: { box3d: 'https://images.launchbox-app.com//c61fafb1-bb9d-4e9b-9207-4ff4f48fc6be.png', cart: 'https://images.launchbox-app.com//da9bea87-791c-4f80-896f-d073955ef9bc.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031195/Super_Mario_Galaxy_USA_En_Fr_Es_dgg8ka.mp4' }
    },
    { 
      name: 'Wii Sports Resort', desc: '¡Bienvenido a la Isla Wuhu! Disfruta de una colección de deportes perfeccionados con la precisión del Wii MotionPlus, desde esgrima hasta arquería.', detailsTitle: 'Género', details: 'Simulación / Deportivo', year: '2009', developer: 'Nintendo EAD', players: '1-4 Jugadores', price: '$35.000', 
      img: 'https://images.launchbox-app.com//307075fe-7a34-4c3b-8b8a-b1d525ee6694.jpg',
      media: { box3d: 'https://images.launchbox-app.com//c4e1c1f0-9098-40c2-b502-c3e85e4e0f05.png', cart: 'https://images.launchbox-app.com//f585b75e-934e-45ea-a0fe-29ca6bbce972.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031190/Wii_Sports_Resort_USA_En_Fr_Es_Rev_1_z417cr.mp4' }
    },
    { 
      name: 'Epic Mickey', desc: 'Utiliza el poder de la pintura y el disolvente para restaurar el Mundo del Páramo. Una visión oscura y artística del universo de Walt Disney.', detailsTitle: 'Género', details: 'Aventura / Plataformas', year: '2010', developer: 'Junction Point', players: '1 Jugador', price: '$30.000', 
      img: 'https://images.launchbox-app.com//75dad23f-9996-4c3b-b0fe-8e2fdde660a7.jpg',
      media: { box3d: 'https://images.launchbox-app.com//28f6fac3-c401-439e-8e23-cf74d546c534.png', cart: 'https://images.launchbox-app.com//1d394685-745f-4120-8920-db6337c73033.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031183/Disney_Epic_Mickey_USA_En_Fr_Es_d5a8tk.mp4' }
    },
    { 
      name: 'No More Heroes', desc: 'Acompaña a Travis Touchdown en su ascenso para convertirse en el asesino número uno. Estilo visual punk, humor ácido y combates con Beam Katana.', detailsTitle: 'Género', details: 'Acción / Hack and Slash', year: '2007', developer: 'Grasshopper Manufacture', players: '1 Jugador', price: '$40.000', 
      img: 'https://images.launchbox-app.com//be2f6e29-316b-4c51-81c4-092c776f4d5a.jpg',
      media: { box3d: 'https://images.launchbox-app.com//26ec9eb3-e742-4b68-b5f4-affdead2ef2f.png', cart: 'https://images.launchbox-app.com//3715806d-af2c-49d8-bd85-f277f8a9f567.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031197/No_More_Heroes_USA_En_Fr_Es_otbw2d.mp4' }
    }
  ],
  [
    { 
      name: 'Super Paper Mario', desc: 'Una aventura que desafía las dimensiones. Cambia entre el 2D y el 3D para resolver puzles y descubrir secretos en una de las historias más profundas de Mario.', detailsTitle: 'Género', details: 'Plataformas / RPG', year: '2007', developer: 'Intelligent Systems', players: '1 Jugador', price: '$35.000', 
      img: 'https://images.launchbox-app.com//5c0ffd3f-c840-488b-95a5-92e9306b3d2c.jpg',
      media: { box3d: 'https://images.launchbox-app.com//2e8ef862-5fc8-4ad4-9222-273b1c672440.png', cart: 'https://images.launchbox-app.com//4c09a41e-7d30-4944-96fa-b3a0f182d04e.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031188/Super_Paper_Mario_USA_Rev_2_yj8upz.mp4' }
    },
    { 
      name: 'Kirby Epic Yarn', desc: 'Kirby ha sido transportado a un mundo de hilos y telas. Una experiencia visualmente deslumbrante y relajante con una jugabilidad llena de ingenio.', detailsTitle: 'Género', details: 'Plataformas', year: '2010', developer: 'Good-Feel / HAL Lab', players: '1-2 Jugadores', price: '$25.000', 
      img: 'https://images.launchbox-app.com//31fa4b76-5261-4cdb-b914-7bd50648bb5a.jpg',
      media: { box3d: 'https://images.launchbox-app.com//64e7d550-719b-4508-9efd-11a28d1f4599.png', cart: 'https://images.launchbox-app.com//e2c951d7-cf80-4f49-9bce-71737c4eeb38.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031191/Kirby_s_Epic_Yarn_USA_En_Fr_Es_b1pore.mp4' }
    },
    { 
      name: 'Mario Party 8', desc: 'La fiesta llega a las pantallas panorámicas. Girar, agitar y apuntar con el Wii Remote en una gala llena de mini-juegos locos y tableros temáticos.', detailsTitle: 'Género', details: 'Party Game', year: '2007', developer: 'Hudson Soft', players: '1-4 Jugadores', price: '$35.000', 
      img: 'https://images.launchbox-app.com//3a375b62-3bb3-4d0f-b055-e647e5e7bbd4.jpg',
      media: { box3d: 'https://images.launchbox-app.com//ce7a21b4-4870-4861-a926-a36cf8994b7d.png', cart: 'https://images.launchbox-app.com//c00d84a2-345e-428c-a705-18c8b859710c.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031185/Mario_Party_8_USA_Asia_Rev_2_t5e4kk.mp4' }
    },
    { 
      name: 'Animal Crossing: City Folk', desc: 'Vive la vida a tu ritmo en tu propio pueblo. Ahora puedes tomar el bus hacia la gran ciudad para ir de compras, ir al teatro o visitar a tus amigos.', detailsTitle: 'Género', details: 'Simulación de vida', year: '2008', developer: 'Nintendo EAD', players: '1 Jugador', price: '$45.000', 
      img: 'https://images.launchbox-app.com//4e05331d-51e5-415d-9da6-c0f3185c82d2.jpg',
      media: { box3d: 'https://images.launchbox-app.com//460bd00c-25f8-4403-ae6d-c76c13647efb.png', cart: 'https://images.launchbox-app.com//d9209e88-fb85-4ce7-81aa-07299e2d57a9.png', video: 'https://res.cloudinary.com/dabfglubl/video/upload/v1774031179/Animal_Crossing_-_City_Folk_USA_Asia_En_Fr_Es_Rev_1_in6hhz.mp4' }
    }
  ]
]);
</script>

<style scoped>
.wii-shelf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px);
  background-color: #f1f5f9; /* Gris claro */
  position: relative;
  overflow: hidden; /* CORTA el patrón de fondo, pero deja que el navegador haga el scroll */
  width: 100%;
}

.wii-content {
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

/* Background Pattern (Nintendo Wii repitiendose) */
.pattern-bg {
  position: absolute;
  top: -100vh;
  left: -100vw;
  width: 300vw;
  height: 300vh;
  background-image: url("data:image/svg+xml,%3Csvg width='220' height='120' viewBox='0 0 220 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dy='.3em' font-family='Arial, sans-serif' font-size='26' font-weight='800' fill='%23cbd5e1' text-anchor='middle'%3ENINTENDO WII%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 220px 120px;
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

.wii-shelf {
  position: relative;
  z-index: 1;
  width: 650px;
  height: 850px;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 25px 35px rgba(0,0,0,0.3));
}

/* Info Panel Styles */
.wii-info-panel {
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
  border-left: 8px solid #eeeeee;
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
  color: #cbd5e1;
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
.wii-info-panel {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* -- Botones de Control GameCube y Aletas -- */
.wii-tabs-container {
  position: absolute;
  top: 90px; 
  right: -100px; /* Más a la derecha */
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* Sin z-index, sus hijos definen la profundidad */
}

.wii-tab {
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

.wii-tab.active {
  background-color: #ffffff; /* Mismo color que info-card */
  box-shadow: 6px 4px 15px rgba(0,0,0,0.15); /* Sombra hacia afuera */
  transform: translateX(0); /* Aleta seleccionada sale más */
  z-index: 6; /* SOBRE del info-card (z-index 5) */
}

/* Pseudo-elemento extendido hacia la izquierda para conectar sin huecos y tapar sombra */
.wii-tab.active::before {
  content: '';
  position: absolute;
  left: -30px; 
  top: 0;
  width: 40px;
  height: 100%;
  background-color: #ffffff;
  z-index: -1; 
}

.wii-btn {
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
.wii-btn::before {
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

/* Botón 1 (Plateado Wiimote) */
.btn-a {
  background: radial-gradient(circle at 38% 35%, #f0f0f0 0%, #d8d8d8 30%, #bfbfbf 60%, #a8a8a8 100%);
  box-shadow: 
    inset -2px -2px 4px rgba(0,0,0,0.25),
    inset 2px 2px 4px rgba(255,255,255,0.8),
    2px 3px 5px rgba(0,0,0,0.3);
  border: 1px solid #a0a0a0;
}

/* Botón 2 (Plateado Wiimote) */
.btn-b {
  background: radial-gradient(circle at 38% 35%, #f0f0f0 0%, #d8d8d8 30%, #bfbfbf 60%, #a8a8a8 100%);
  box-shadow: 
    inset -2px -2px 4px rgba(0,0,0,0.25),
    inset 2px 2px 4px rgba(255,255,255,0.8),
    2px 3px 5px rgba(0,0,0,0.3);
  border: 1px solid #a0a0a0;
}

.wii-btn.pressed {
  box-shadow: 
    inset 2px 2px 5px rgba(0,0,0,0.3),
    inset -1px -1px 3px rgba(255,255,255,0.4),
    1px 1px 2px rgba(0,0,0,0.15);
  transform: translateY(2px) translateX(1px);
}

.btn-letter {
  font-family: 'Arial Rounded MT Bold', 'Verdana', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  pointer-events: none;
}

.btn-a .btn-letter {
  color: #888888;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}

.btn-b .btn-letter {
  color: #888888;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
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
  background-color: #eeeeee;
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

.marquee-display-wii {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shelf-logo {
  height: 200px;
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

.title-wii {
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
  background-color: #eeeeee; /* Darker green inside */
  border-left: 20px solid #eeeeee; /* Side walls */
  border-right: 20px solid #eeeeee;
  border-top: 15px solid #eeeeee; /* Shadow directly under header */
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.6);
}

/* Horizontal Shelves */
.shelf-row {
  flex: 1;
  border-bottom: 32px solid #eeeeee; /* Physical shelf floor */
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
  border-bottom: 50px solid #eeeeee; /* Base of the stand is thicker */
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
