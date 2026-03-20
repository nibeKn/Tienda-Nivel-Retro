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
              <img src="../assets/img/Logo PS1.png" alt="PlayStation Logo" class="shelf-logo" />
              <div class="shelf-title-container">
                <span class="title-playstation">PlayStation</span>
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

          <!-- Vista Global PlayStation si no hay selección -->
          <template v-else>
            <h2 class="info-title">PlayStation</h2>
            <p class="info-desc">
              La PlayStation (conocida también como PS1 o PSX) es una videoconsola de sobremesa de quinta generación desarrollada y comercializada por Sony Computer Entertainment. Marcó la exitosa entrada de Sony en la industria de los videojuegos, revolucionando el mercado al popularizar el formato óptico sobre los cartuchos, lo que atrajo a múltiples desarrolladores gracias a sus bajos costos de manufactura y regalías más accesibles.
            </p>

            <h3 class="info-subtitle">Detalles técnicos</h3>
            <p class="info-text">
              El sistema estaba basado en una arquitectura de 32 bits enfocada en el procesamiento de polígonos tridimensionales. Su adopción del CD-ROM (con una capacidad de hasta 700 MB) brindó a los desarrolladores un espacio de almacenamiento masivo para la época. Esto permitió la implementación de bandas sonoras con calidad de estudio (CD-Audio), actuación de voz extensa y la inclusión de cinemáticas de video de movimiento completo (FMV), características que definieron el estilo narrativo de los juegos de finales de los años 90. Posteriormente, introdujo el mando DualShock, estandarizando la configuración de dos joysticks analógicos con retroalimentación de vibración.
            </p>

            <div class="info-footer">
              <p><strong>Año de lanzamiento:</strong> 1994 (Japón) / 1995 (USA y Europa)</p>
              <p><strong>Unidades vendidas:</strong> 102,49 millones</p>
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
      name: 'Metal Gear Solid', desc: 'Una obra maestra del espionaje táctico. Infiltra una base militar nuclear como Solid Snake en una experiencia cinematográfica inolvidable.', details: 'Acción / Sigilo', year: '1998', developer: 'Konami', players: '1 Jugador', price: '$85.000', 
      img: 'https://gamesdb-images.launchbox.gg/r2_d810b36e-fd9e-435f-9e1b-32ef76459e66.jpg',
      media: { box3d: 'https://images.launchbox-app.com//41570f73-a665-49eb-9803-cbc196bc7b6f.png', cart: 'https://images.launchbox-app.com//e2cfb4a5-df51-4a29-8324-9c5de6689057.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Metal_Gear_Solid___1998___Konami.mp4' }
    },
    { 
      name: 'Final Fantasy VII', desc: 'El RPG que definió una generación. Acompaña a Cloud Strife y AVALANCHE en su lucha contra la corporación Shinra y la amenaza de Sephiroth.', details: 'RPG', year: '1997', developer: 'Square', players: '1 Jugador', price: '$120.000', 
      img: 'https://gamesdb-images.launchbox.gg/r2_809dbd84-313e-4408-94f3-726899fe26c4.jpg',
      media: { box3d: 'https://images.launchbox-app.com//86364003-e46b-446b-a429-bd51b28eaffc.png', cart: 'https://images.launchbox-app.com//b3bda860-0ef2-461e-b1ff-91869f22958e.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Final_Fantasy_VII___1997___Sony_Computer_Entertainment.mp4' }
    },
    { 
      name: 'Gran Turismo', desc: 'El simulador de conducción definitivo. Colecciona y personaliza cientos de autos reales en circuitos fieles a la realidad.', details: 'Carreras / Simulación', year: '1998', developer: 'Polyphony Digital', players: '1-2 Jugadores', price: '$70.000', 
      img: 'https://gamesdb-images.launchbox.gg/r2_22314dd3-9d06-48e4-85fc-c71d22a273fa.png',
      media: { box3d: 'https://images.launchbox-app.com//65e7ce33-e0c6-4d17-ac0d-4aa6531c9c55.png', cart: 'https://images.launchbox-app.com//f04f5e0a-e494-46e0-94f6-043143a86320.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Gran_Turismo___1998___Sony_Computer_Entertainment.mp4' }
    },
    { 
      name: 'Crash Bandicoot', desc: 'El marsupial más carismático de PlayStation. Corre, salta y gira a través de islas tropicales para detener los planes del Dr. Neo Cortex.', details: 'Plataformas', year: '1996', developer: 'Naughty Dog', players: '1 Jugador', price: '$65.000', 
      img: 'https://gamesdb-images.launchbox.gg/r2_9e84384c-d2b1-4ffa-a771-055eb16f0f4e.jpg',
      media: { box3d: 'https://images.launchbox-app.com//1f781f02-54a5-4792-acb9-e31361123526.png', cart: 'https://images.launchbox-app.com//d9070a16-161f-4d69-b1b0-5a0074d665af.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Crash_Bandicoot___1996___Sony_Computer_Entertainment.mp4' }
    }
  ],
  [
    { 
      name: 'Tekken 3', desc: 'El rey de los juegos de lucha en PlayStation. Combates rápidos, un extenso roster de personajes y modos de juego adictivos.', details: 'Lucha', year: '1998', developer: 'Namco', players: '1-2 Jugadores', price: '$55.000', 
      img: 'https://gamesdb-images.launchbox.gg/r2_a96204cb-2a26-46e9-80f6-598153d70046.png',
      media: { box3d: 'https://gamesdb-images.launchbox.gg/r2_11d73073-c64f-4071-8b5e-791352f1791f.png', cart: 'https://gamesdb-images.launchbox.gg/r2_0c68270d-1477-4dbd-9178-7df42511a018.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Tekken_3___1998___Namco_Limited.mp4' }
    },
    { 
      name: 'PaRappa The Rapper', desc: 'El primer gran juego de ritmo. Rapea junto a PaRappa en etapas musicales hilarantes con un estilo visual de papel recortado único.', details: 'Ritmo / Musical', year: '1997', developer: 'NanaOn-Sha', players: '1 Jugador', price: '$75.000', 
      img: 'https://images.launchbox-app.com//112d19f2-890d-4d7c-947e-caee5fa2fb31.png',
      media: { box3d: 'https://images.launchbox-app.com//4bb8eaf5-0174-4af4-ae71-6629657566ae.png', cart: 'https://gamesdb-images.launchbox.gg/r2_b7ff75f1-f9a0-498b-9d99-293857e0334c.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/PaRappa_the_Rapper___1997___Sony_Computer_Entertainment.mp4' }
    },
    { 
      name: 'Twisted Metal 4', desc: 'Combate vehicular caótico y desenfrenado. Elige tu vehículo y destruye a todos tus rivales en arenas repletas de explosiones.', details: 'Combate Vehicular', year: '1999', developer: '989 Studios', players: '1-2 Jugadores', price: '$45.000', 
      img: 'https://images.launchbox-app.com//9d2dc753-3564-4320-8ef2-ca436b23bd95.jpg',
      media: { box3d: 'https://images.launchbox-app.com//128ec6f2-e105-4726-b297-d422f5ae087d.png', cart: 'https://images.launchbox-app.com//8e54073a-c1ec-48aa-bbb4-8994b0385926.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Twisted_Metal_4___1999___989_Studios.mp4' }
    },
    { 
      name: 'Spyro the Dragon', desc: 'Un encantador dragón púrpura en una aventura de plataformas 3D. Rescata a los dragones cristalizados y recupera las gemas robadas.', details: 'Plataformas 3D', year: '1998', developer: 'Insomniac Games', players: '1 Jugador', price: '$60.000', 
      img: 'https://images.launchbox-app.com//425fc3f4-29d7-4862-b494-d3afbfc36c34.png',
      media: { box3d: 'https://images.launchbox-app.com//a5f3093e-c741-47cd-9b8e-a7b2533fbdd8.png', cart: 'https://images.launchbox-app.com//144cf23a-1a90-4f85-9043-ab55f28544c9.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Spyro_the_Dragon___1998___Sony_Computer_Entertainment.mp4' }
    }
  ],
  [
    { 
      name: 'MediEvil', desc: 'El caballero Sir Daniel Fortesque resucita para enfrentar al malvado hechicero Zarok. Acción y humor oscuro en un mundo gótico encantador.', details: 'Acción / Aventura', year: '1998', developer: 'SCE Cambridge', players: '1 Jugador', price: '$70.000', 
      img: 'https://images.launchbox-app.com//03f15946-1988-4f6e-a9c0-48c1aa8f93be.jpg',
      media: { box3d: 'https://images.launchbox-app.com//ed7b25f9-3f8a-4e66-a498-ee40748cf0a4.png', cart: 'https://gamesdb-images.launchbox.gg/r2_cf6a1be2-fb0c-4456-8f25-89e35094017a.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/MediEvil___1998___Sony_Computer_Entertainment.mp4' }
    },
    { 
      name: 'Ace Combat 3: Electrosphere', desc: 'Combate aéreo futurista con una narrativa ramificada. Pilota cazas avanzados en un conflicto corporativo ambientado en el año 2040.', details: 'Simulación Aérea', year: '2000', developer: 'Namco', players: '1 Jugador', price: '$50.000', 
      img: 'https://images.launchbox-app.com//da1d3ac2-cb33-420d-993d-660bef446259.png',
      media: { box3d: 'https://images.launchbox-app.com//dd7b25a6-135b-49b6-838a-609b36a2790f.png', cart: 'https://images.launchbox-app.com//a9d981e2-037c-4436-bf5a-06588293113f.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Ace_Combat_3__Electrosphere___2000___Namco_Limited.mp4' }
    },
    { 
      name: 'Dino Crisis', desc: 'Survival horror con dinosaurios del creador de Resident Evil. Explora una isla de investigación invadida por criaturas prehistóricas.', details: 'Survival Horror', year: '1999', developer: 'Capcom', players: '1 Jugador', price: '$80.000', 
      img: 'https://images.launchbox-app.com//c2270543-c5db-4b5b-ae18-2a005714761c.jpg',
      media: { box3d: 'https://images.launchbox-app.com//92334ae4-9af7-4166-9165-85ac8ebddf13.png', cart: 'https://images.launchbox-app.com//b608d983-b442-40e5-a8c3-f8f1f9ef06a4.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Dino_Crisis___1999___Capcom_Co___Ltd_.mp4' }
    },
    { 
      name: 'Rayman', desc: 'El clásico de plataformas 2D de Ubisoft. Recorre mundos coloridos y surrealistas para liberar a los Electoons y derrotar al malvado Mr. Dark.', details: 'Plataformas 2D', year: '1995', developer: 'Ubisoft', players: '1 Jugador', price: '$40.000', 
      img: 'https://images.launchbox-app.com//2db70fad-1e03-459e-ab80-3ba0012bba15.jpg',
      media: { box3d: 'https://gamesdb-images.launchbox.gg/r2_6ca09eec-97d3-4fd9-89a2-964babc5eba2.png', cart: 'https://images.launchbox-app.com//9d0c2c4c-7f54-47f1-8f9a-f6adee7ea4cd.png', video: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Video/Formated/Rayman___1995___Ubisoft.mp4' }
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
  background-image: url("data:image/svg+xml,%3Csvg width='220' height='120' viewBox='0 0 220 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dy='.3em' font-family='Arial, sans-serif' font-size='26' font-weight='800' fill='%23cbd5e1' text-anchor='middle'%3EPLAYSTATION%3C/text%3E%3C/svg%3E");
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
  border-left: 8px solid #9e9e9e;
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
  color: #616161;
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

/* Top Banner matching the PlayStation image */
.shelf-header {
  background-color: #b0b0b0;
  height: 140px;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 18px 10px 18px;
  border: none;
  box-shadow: 
    inset 0 4px 6px rgba(255, 255, 255, 0.3), 
    inset 0 -4px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}

.marquee-display {
  background-color: #c2c2c2;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px solid #a8a8a8;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 -1px 3px rgba(255, 255, 255, 0.3);
}

.shelf-logo {
  height: 140px;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
}

.shelf-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.title-playstation {
  color: #5a5a5a;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 3.2rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.4);
  line-height: 1;
}

/* Shelf Body */
.shelf-body {
  flex: 1;
  background-color: #7a7a7a; /* Dark gray PS1 interior */
  border-left: 20px solid #9e9e9e; /* Side walls */
  border-right: 20px solid #9e9e9e;
  border-top: 15px solid #6a6a6a; /* Shadow directly under header */
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
}

/* Horizontal Shelves */
.shelf-row {
  flex: 1;
  border-bottom: 32px solid #9e9e9e; /* Physical shelf floor */
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
  width: 130px;
  height: 140px;
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
  border-bottom: 50px solid #9e9e9e; /* Base of the stand is thicker */
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
