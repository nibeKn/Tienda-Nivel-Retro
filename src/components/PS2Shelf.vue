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
              <div class="shelf-title-container">
                <span class="title-playstation">PlayStation<span class="title-ps2-dot">®</span>2</span>
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
                    <img :src="imgSrc" :alt="`PlayStation Console Image ${index + 1}`" @click="openLightbox(imgSrc)" class="clickable-img" />
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

          <!-- Vista Global PlayStation 2 si no hay selección -->
          <template v-else>
            <h2 class="info-title">PlayStation 2</h2>
            <p class="info-desc">
              La PlayStation 2 (abreviada PS2) es la consola de sexta generación producida por Sony y el sistema de videojuegos doméstico más exitoso comercialmente en la historia del entretenimiento interactivo. Su prolongado ciclo de vida estuvo respaldado por un catálogo de software inmenso que abarcó todos los géneros posibles, consolidándose como el centro de entretenimiento multimedia definitivo en millones de hogares.
            </p>

            <h3 class="info-subtitle">Detalles técnicos</h3>
            <p class="info-text">
              El núcleo de la consola era un procesador personalizado de 128 bits denominado Emotion Engine. Su ventaja técnica y comercial más significativa fue la integración nativa de una unidad lectora de DVD-ROM. En la época de su lanzamiento, la consola funcionaba también como un reproductor de películas en DVD muy asequible, lo que impulsó exponencialmente sus ventas. Adicionalmente, incorporaba un subsistema interno que le otorgaba retrocompatibilidad por hardware con casi la totalidad del catálogo de juegos de la PlayStation original.
            </p>

            <div class="info-footer">
              <p><strong>Año de lanzamiento:</strong> 2000</p>
              <p><strong>Unidades vendidas:</strong> Más de 155 millones (algunas estimaciones recientes apuntan a 160 millones)</p>
            </div>
          </template>

        </div>

        <!-- Botones PlayStation con Aletas -->
        <div class="gc-tabs-container" v-if="selectedItem">
          <!-- Aleta □ (Vista Multimedia) -->
          <div 
            class="gc-tab" 
            :class="{ active: !showDetailsView }" 
            @click="showDetailsView = false"
            title="Descripción General"
          >
            <div class="gc-btn btn-a" :class="{ pressed: !showDetailsView }">
              <span class="btn-letter">□</span>
            </div>
          </div>

          <!-- Aleta ✕ (Vista Detalles) -->
          <div 
            class="gc-tab" 
            :class="{ active: showDetailsView }" 
            @click="showDetailsView = true"
            title="Ficha Técnica"
          >
            <div class="gc-btn btn-b" :class="{ pressed: showDetailsView }">
              <span class="btn-letter">✕</span>
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
      name: 'Grand Theft Auto: San Andreas', desc: 'El mundo abierto definitivo de los 2000. Recorre el estado de San Andreas como CJ en una épica historia de pandillas, traición y supervivencia.', details: 'Acción / Mundo Abierto', year: '2004', developer: 'Rockstar North', players: '1-2 Jugadores', price: '$90.000', 
      img: 'https://images.launchbox-app.com//56b5479a-bba5-43d6-b458-0fcd00bf10ba.png',
      media: { box3d: 'https://images.launchbox-app.com//54377eb1-fa31-4278-bb1e-56ca552e0b08.png', cart: 'https://images.launchbox-app.com//25129bda-7947-4a3c-bec7-d80907b62dc4.png', video: '/src/assets/videos/ps2/Grand Theft Auto - San Andreas (USA) (v3.00).mp4' }
    },
    { 
      name: 'God of War II', desc: 'Kratos desafía al Olimpo en esta brutal secuela. Combate épico a escala titánica con una de las mejores narrativas de la era PS2.', details: 'Acción / Hack and Slash', year: '2007', developer: 'SCE Santa Monica', players: '1 Jugador', price: '$85.000', 
      img: 'https://images.launchbox-app.com//2b06034c-9d15-4bdd-8e20-b564027cd957.jpg',
      media: { box3d: 'https://images.launchbox-app.com//bd7e8288-1e2f-4d88-8c6e-495e41cdb8d2.png', cart: 'https://images.launchbox-app.com//4c64ba67-6bbc-4264-89cc-0ab9b489c02d.png', video: '/src/assets/videos/ps2/God of War II (USA).mp4' }
    },
    { 
      name: 'Silent Hill 2', desc: 'La obra maestra del terror psicológico. James Sunderland recibe una carta de su esposa fallecida que lo lleva de regreso a Silent Hill.', details: 'Survival Horror', year: '2001', developer: 'Konami / Team Silent', players: '1 Jugador', price: '$120.000', 
      img: 'https://images.launchbox-app.com//c4007fff-9166-4389-83b6-e338c2278a29.jpg',
      media: { box3d: 'https://images.launchbox-app.com//f8dbb6c7-fb1e-4043-a8d1-ee0d8ba0dbb2.png', cart: 'https://images.launchbox-app.com//6b03fe0e-e562-4484-93d2-6bad8f2a1330.png', video: '/src/assets/videos/ps2/Silent Hill 2 (USA) (En,Ja,Fr,De,Es,It) (v2.01).mp4' }
    },
    { 
      name: 'Pro Evolution Soccer 2008', desc: 'El simulador de fútbol que dominó una era. Jugabilidad táctica, pases precisos y la emoción del fútbol real en cada partido.', details: 'Deportes / Fútbol', year: '2007', developer: 'Konami', players: '1-4 Jugadores', price: '$35.000', 
      img: 'https://images.launchbox-app.com//808ba41a-1c0b-4d0f-b057-37685c03d7ca.jpg',
      media: { box3d: 'https://images.launchbox-app.com//46ff22c6-3db4-48cf-939e-f370dc758d59.png', cart: 'https://images.launchbox-app.com//689d40c1-d913-433b-bb12-2beed927313d.png', video: '/src/assets/videos/ps2/PES 2008 - Pro Evolution Soccer (USA).mp4' }
    }
  ],
  [
    { 
      name: 'Burnout 3: Takedown', desc: 'Velocidad extrema y destrucción total. El juego de carreras arcade más adrenalínico donde chocar es tan divertido como ganar.', details: 'Carreras / Arcade', year: '2004', developer: 'Criterion Games', players: '1-2 Jugadores', price: '$50.000', 
      img: 'https://images.launchbox-app.com//58b3d988-8d18-4f56-a1c3-d87ca0808918.jpg',
      media: { box3d: 'https://images.launchbox-app.com//2b32c01b-f7de-4d29-b587-fdca6b8ea991.png', cart: 'https://images.launchbox-app.com//074c3463-1672-4191-bdf1-90b0cf28c14b.png', video: '/src/assets/videos/ps2/Burnout 3 - Takedown (USA).mp4' }
    },
    { 
      name: 'Need for Speed: Most Wanted', desc: 'Conviértete en el corredor más buscado. Carreras ilegales, persecuciones policiales cinematográficas y un extenso mundo abierto por dominar.', details: 'Carreras / Mundo Abierto', year: '2005', developer: 'EA Canada', players: '1-2 Jugadores', price: '$55.000', 
      img: 'https://images.launchbox-app.com//1ca80c9b-5ade-4655-93c4-3dab49b0e0e7.jpg',
      media: { box3d: 'https://images.launchbox-app.com//f58f4e7c-7bc2-4d1c-8cd9-a032815ea801.png', cart: 'https://images.launchbox-app.com//d1a409a4-d29b-4de3-b003-a5a981172b3c.png', video: '/src/assets/videos/ps2/Need for Speed - Most Wanted (USA) (v2.00).mp4' }
    },
    { 
      name: 'Ratchet & Clank', desc: 'La dupla más carismática de PlayStation. Plataformas 3D con un arsenal de armas absurdas y planetas enteros por explorar.', details: 'Plataformas / Acción', year: '2002', developer: 'Insomniac Games', players: '1 Jugador', price: '$60.000', 
      img: 'https://images.launchbox-app.com//85d0d853-1edf-4086-a5b5-281edcb3f9ac.jpg',
      media: { box3d: 'https://images.launchbox-app.com//869ca65c-dc01-459b-b6a3-0a72c089d309.png', cart: 'https://images.launchbox-app.com//03c0c663-f1f1-4fbb-adb1-91a44d755eff.png', video: '/src/assets/videos/ps2/Ratchet & Clank (USA) (En,Fr,De,Es,It).mp4' }
    },
    { 
      name: 'Guitar Hero III: Legends of Rock', desc: 'El fenómeno musical que conquistó al mundo. Toma la guitarra y domina los riffs más legendarios del rock en escenarios épicos.', details: 'Ritmo / Musical', year: '2007', developer: 'Neversoft', players: '1-2 Jugadores', price: '$45.000', 
      img: 'https://images.launchbox-app.com//eeb2d4fc-0eef-4138-8714-0e236e317052.jpg',
      media: { box3d: 'https://images.launchbox-app.com//69fc9413-2c44-4914-86c4-e0f9e64345ce.png', cart: 'https://images.launchbox-app.com//dba9d2bd-6aad-4afb-8f5c-608beb118e16.png', video: '/src/assets/videos/ps2/Guitar Hero III - Legends of Rock (USA).mp4' }
    }
  ],
  [
    { 
      name: 'Metal Gear Solid 3: Snake Eater', desc: 'La precuela definitiva de la saga. Sobrevive en la jungla soviética durante la Guerra Fría en una historia de espionaje inolvidable.', details: 'Acción / Sigilo', year: '2004', developer: 'Konami', players: '1 Jugador', price: '$80.000', 
      img: 'https://images.launchbox-app.com//e8fb6be7-937e-4147-b64c-2002381bf024.jpg',
      media: { box3d: 'https://images.launchbox-app.com//3bc4200f-00bc-44db-8a73-09ff0d45584e.png', cart: 'https://images.launchbox-app.com//b0bb419e-3076-4615-a140-143c742df081.png', video: '/src/assets/videos/ps2/Metal Gear Solid 3 - Snake Eater (USA).mp4' }
    },
    { 
      name: 'Killzone', desc: 'La respuesta de PlayStation al shooter bélico. Una guerra futurista contra los Helghast con intensos combates tácticos en primera persona.', details: 'FPS / Acción', year: '2004', developer: 'Guerrilla Games', players: '1-2 Jugadores', price: '$40.000', 
      img: 'https://images.launchbox-app.com//e61ccc2c-d8d5-4181-9196-0a2348d44b5e.jpg',
      media: { box3d: 'https://images.launchbox-app.com//e2e3be0c-132b-4ce8-9ee1-90dd08837541.png', cart: 'https://images.launchbox-app.com//581b1a06-24b0-479c-a065-698335af6f75.png', video: '/src/assets/videos/ps2/Killzone (USA).mp4' }
    },
    { 
      name: 'Kingdom Hearts II', desc: 'La fusión perfecta entre Disney y Final Fantasy. Sora regresa para enfrentar a la Organización XIII en mundos mágicos e inolvidables.', details: 'Acción RPG', year: '2005', developer: 'Square Enix', players: '1 Jugador', price: '$75.000', 
      img: 'https://images.launchbox-app.com//1c8b27cb-a5a0-419e-b369-f050752f3e07.jpg',
      media: { box3d: 'https://images.launchbox-app.com//cd72b7cb-2712-4eba-92c5-f737212817e3.png', cart: 'https://images.launchbox-app.com//8587a7cd-511a-4d05-a917-e29d15f8f6e9.png', video: '/src/assets/videos/ps2/Kingdom Hearts II (USA).mp4' }
    },
    { 
      name: 'Grand Theft Auto: Vice City', desc: 'Bienvenido a los 80. Motos, neón y una banda sonora legendaria en la ciudad más estilosa del crimen organizado.', details: 'Acción / Mundo Abierto', year: '2002', developer: 'Rockstar North', players: '1 Jugador', price: '$70.000', 
      img: 'https://images.launchbox-app.com//9ab89a02-8481-495f-b16b-f669573a34a0.jpg',
      media: { box3d: 'https://images.launchbox-app.com//380bd625-be55-473c-8d4c-f4d8a7490380.png', cart: 'https://images.launchbox-app.com//7cafc5b1-77b8-4431-b2e4-73c67b7187e2.png', video: '/src/assets/videos/ps2/Grand Theft Auto - Vice City (USA) (v4.00).mp4' }
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

/* Background Pattern (PlayStation repitiendose) */
.pattern-bg {
  position: absolute;
  top: -100vh;
  left: -100vw;
  width: 300vw;
  height: 300vh;
  background-image: url("data:image/svg+xml,%3Csvg width='260' height='120' viewBox='0 0 260 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dy='.3em' font-family='Arial, sans-serif' font-size='26' font-weight='800' fill='%23cbd5e1' text-anchor='middle'%3EPLAYSTATION 2%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 260px 120px;
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
  border-left: 8px solid #1a1a1a;
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
  color: #1a1a1a;
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

/* Botón □ (Rosa/Magenta PlayStation) */
.btn-a {
  background-color: #2a2a2e;
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.5),
    inset 2px 2px 5px rgba(255,255,255,0.15),
    2px 3px 4px rgba(0,0,0,0.3);
}

/* Botón ✕ (Azul PlayStation) */
.btn-b {
  background-color: #2a2a2e;
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.5),
    inset 2px 2px 5px rgba(255,255,255,0.15),
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
  color: #e84bb2; /* Rosa/Magenta PlayStation */
  text-shadow: 0 0 6px rgba(232, 75, 178, 0.5);
  font-size: 2.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.btn-b .btn-letter {
  color: #6e8cfa; /* Azul PlayStation */
  text-shadow: 0 0 6px rgba(110, 140, 250, 0.5);
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
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

/* Top Banner matching the PlayStation 2 image */
.shelf-header {
  background-color: #1a1a1a;
  height: 140px;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 18px 10px 18px;
  border: none;
  box-shadow: 
    inset 0 4px 6px rgba(255, 255, 255, 0.08), 
    inset 0 -4px 6px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 2;
}

.marquee-display {
  background-color: #2d2d2d;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px solid #3a3a3a;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 -1px 3px rgba(255, 255, 255, 0.05);
}

.shelf-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-playstation {
  color: #c0c0c0;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 3.2rem;
  font-weight: 300;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(200, 200, 200, 0.15);
  line-height: 1;
}

.title-ps2-dot {
  font-size: 1.2rem;
  vertical-align: super;
  margin: 0 1px;
}

/* Shelf Body */
.shelf-body {
  flex: 1;
  background-color: #1a1a1a; /* Dark PS2 interior */
  border-left: 20px solid #2d2d2d; /* Side walls */
  border-right: 20px solid #2d2d2d;
  border-top: 15px solid #111111; /* Shadow directly under header */
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.7);
}

/* Horizontal Shelves */
.shelf-row {
  flex: 1;
  border-bottom: 32px solid #2d2d2d; /* Physical shelf floor */
  box-shadow: 0 15px 15px -10px rgba(0,0,0,0.6); 
  position: relative;
  display: flex;
  align-items: flex-end; /* Grounded on the border-bottom */
  justify-content: space-around;
  padding: 15px 8px 0 8px;
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
  width: 130px;
  height: 185px;
  object-fit: contain;
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
  border-bottom: 50px solid #2d2d2d; /* Base of the stand is thicker */
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
