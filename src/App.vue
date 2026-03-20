<script setup>
import { ref, computed } from 'vue';
import N64Shelf from './components/N64Shelf.vue';
import GCShelf from './components/GCShelf.vue';
import WiiShelf from './components/WiiShelf.vue';
import PS1Shelf from './components/PS1Shelf.vue';
import PS2Shelf from './components/PS2Shelf.vue';
import PS3Shelf from './components/PS3Shelf.vue';
import Catalog from './components/Catalog.vue';
import About from './components/About.vue';
import Footer from './components/Footer.vue';

const currentView = ref('store');

const cart = ref([]);
const showCart = ref(false);

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
};

const formatPrice = (value) => {
  return '$' + value.toLocaleString('es-CL');
};

const addToCart = (product) => {
  const existing = cart.value.find(p => p.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1, priceNum: parsePrice(product.price) });
  }
  alert(`¡${product.name} agregado al carrito!`);
};

const removeFromCart = (productName) => {
  cart.value = cart.value.filter(p => p.name !== productName);
};

const updateQuantity = (productName, delta) => {
  const item = cart.value.find(p => p.name === productName);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(productName);
  }
};

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.priceNum * item.quantity), 0);
});

const checkout = () => {
  if (cart.value.length === 0) return;
  alert('Gracias por tu compra');
  cart.value = [];
  showCart.value = false;
};

const selectedGameName = ref(null);

const goToGame = (view, gameName) => {
  selectedGameName.value = gameName;
  currentView.value = view;
};

const goToN64 = () => {
  currentView.value = 'n64';
  selectedGameName.value = null;
};

const goToGC = () => {
  currentView.value = 'gc';
  selectedGameName.value = null;
};

const goToWii = () => {
  currentView.value = 'wii';
  selectedGameName.value = null;
};

const goToPS1 = () => {
  currentView.value = 'ps1';
  selectedGameName.value = null;
};

const goToPS2 = () => {
  currentView.value = 'ps2';
  selectedGameName.value = null;
};

const goToPS3 = () => {
  currentView.value = 'ps3';
  selectedGameName.value = null;
};

const goBack = () => {
  currentView.value = 'store';
  selectedGameName.value = null;
};

const goToCatalog = () => {
  currentView.value = 'catalog';
  selectedGameName.value = null;
};

const targetAboutSection = ref(null);
const hoveredStand = ref(null);
const isNightMode = ref(false);

const goToAbout = (section) => {
  currentView.value = 'about';
  targetAboutSection.value = section;
};

const recommendedGames = [
  { view: 'gc', name: 'The Legend Of Zelda Twilight Princess', box3d: 'https://images.launchbox-app.com//a6b372e5-d59b-4381-b23c-2c63fd88b364.png', title: 'Zelda Twilight Princess' },
  { view: 'gc', name: 'Super Mario Strikers', box3d: 'https://images.launchbox-app.com//7be33efc-95a2-4861-bf96-96250cd23937.png', title: 'Super Mario Strikers' },
  { view: 'ps2', name: 'Metal Gear Solid 3: Snake Eater', box3d: 'https://images.launchbox-app.com//3bc4200f-00bc-44db-8a73-09ff0d45584e.png', title: 'Metal Gear Solid 3' },
  { view: 'ps2', name: 'Guitar Hero III: Legends of Rock', box3d: 'https://images.launchbox-app.com//69fc9413-2c44-4914-86c4-e0f9e64345ce.png', title: 'Guitar Hero III' },
  { view: 'ps3', name: 'The Last of Us', box3d: 'https://images.launchbox-app.com//a4e83ba3-f4dc-4f1c-83c3-35cce554b7e1.png', title: 'The Last of Us' },
  { view: 'wii', name: 'Super Mario Galaxy', box3d: 'https://images.launchbox-app.com//c61fafb1-bb9d-4e9b-9207-4ff4f48fc6be.png', title: 'Super Mario Galaxy' }
];

const scale = ref(0.7);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

const startDrag = (e) => {
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  const dx = e.clientX - startX.value;
  const dy = e.clientY - startY.value;
  
  // Dividimos por la escala para que el paneo se sienta 1:1 independiente del zoom
  panX.value += dx / scale.value;
  panY.value += dy / scale.value;
  
  startX.value = e.clientX;
  startY.value = e.clientY;
};

const endDrag = () => {
  isDragging.value = false;
};

const onWheel = (e) => {
  if (currentView.value !== 'store') return;
  e.preventDefault();
  const zoomFactor = -e.deltaY * 0.001;
  const newScale = Math.min(Math.max(0.4, scale.value + zoomFactor), 1.5);
  scale.value = Number(newScale.toFixed(2));
};

const imageTransform = computed(() => {
  return {
    transform: `scale(${scale.value}) translate(${panX.value}px, ${panY.value}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.1s ease-out',
    cursor: isDragging.value ? 'grabbing' : 'grab'
  };
});
</script>

<template>
  <div class="app-container" :class="{ 'app-locked': currentView === 'store' }">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar-left" @click="goBack">
         <img src="./assets/img/Nivel Retro 2.png" alt="Nivel Retro" class="navbar-logo" />
      </div>
      <nav class="navbar-right-menu">
        <ul>
          <li class="theme-switch-wrapper">
            <label class="theme-switch" title="Alternar Modo Día/Noche">
              <input type="checkbox" v-model="isNightMode" />
              <div class="slider round">
                 <div class="slider-thumb">
                    <i class="fas fa-sun sun-icon" v-if="!isNightMode"></i>
                    <template v-else>
                      <i class="fas fa-moon moon-icon"></i>
                      <span class="star-icon s1">✦</span>
                      <span class="star-icon s2">✦</span>
                      <span class="star-icon s3">✦</span>
                    </template>
                 </div>
              </div>
            </label>
          </li>
          <li><a href="#" :class="{ active: currentView === 'store' }" @click.prevent="goBack">TIENDA</a></li>
          <li><a href="#" :class="{ active: currentView === 'catalog' }" @click.prevent="goToCatalog">CATÁLOGO</a></li>
          <li><a href="#" class="account-link"><i class="fas fa-user"></i> CUENTA</a></li>
          <li><a href="#" class="cart-link" @click.prevent="showCart = true"><i class="fas fa-shopping-cart"></i> CARRITO <span v-if="cart.length" class="cart-badge">{{ cart.reduce((acc, item) => acc + item.quantity, 0) }}</span></a></li>
        </ul>
      </nav>
    </header>

    <!-- Barra pequeña -->
    <div class="sub-navbar">
      <p><i class="fas fa-star"></i> Explora nuestra tienda - Haz click en un stand para ver nuestras categorías</p>
    </div>

    <div class="main-layout">
      <!-- Main Content (Área de la tienda 3D isómetrica) -->
      <template v-if="currentView === 'store'">
        <main class="store-interactive-area" :class="{ 'night-mode': isNightMode }"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
              @wheel="onWheel">
          
        <!-- Sidebar Menu Flotante -->
        <aside class="floating-menu" @mousedown.stop @wheel.stop>
          <h2 class="sidebar-title">CATEGORÍAS:</h2>
          <ul class="filter-list">
            <li>
              <button class="filter-btn" @click="goToN64" @mouseenter="hoveredStand = 'n64'" @mouseleave="hoveredStand = null">
                 <span class="icon-placeholder"><img src="./assets/img/Logo N64.png" alt="N64" class="console-logo" /></span> N64
              </button>
            </li>
            <li>
              <button class="filter-btn" @click="goToGC" @mouseenter="hoveredStand = 'gc'" @mouseleave="hoveredStand = null">
                 <span class="icon-placeholder"><img src="./assets/img/Logo GC.png" alt="GC" class="console-logo" /></span> GC
              </button>
            </li>
            <li>
              <button class="filter-btn" @click="goToWii" @mouseenter="hoveredStand = 'wii'" @mouseleave="hoveredStand = null">
                 <span class="icon-placeholder"><img src="./assets/img/Logo Wii.png" alt="Wii" class="console-logo" /></span> Wii
              </button>
            </li>

            <li>
              <button class="filter-btn" @click="goToPS1" @mouseenter="hoveredStand = 'ps1'" @mouseleave="hoveredStand = null">
                 <span class="icon-placeholder"><img src="./assets/img/Logo PS1.png" alt="PS1" class="console-logo" /></span> PS1
              </button>
            </li>
            <li>
              <button class="filter-btn" @click="goToPS2" @mouseenter="hoveredStand = 'ps2'" @mouseleave="hoveredStand = null">
                <span class="icon-placeholder"><img src="./assets/img/Logo PS2.png" alt="PS2" class="console-logo" /></span> PS2
              </button>
            </li>
            <li>
              <button class="filter-btn" @click="goToPS3" @mouseenter="hoveredStand = 'ps3'" @mouseleave="hoveredStand = null">
                 <span class="icon-placeholder"><img src="./assets/img/Logo PS3.png" alt="PS3" class="console-logo" /></span> PS3
              </button>
            </li>
          </ul>
        </aside>

        <!-- Sidebar Recomendaciones Flotante -->
        <aside class="floating-recommendations" @mousedown.stop @wheel.stop>
          <h2 class="sidebar-title">RECOMENDACIONES DE LA SEMANA:</h2>
          <div class="recommendations-grid">
            <div class="rec-game-box" v-for="rec in recommendedGames" :key="rec.name" @click="goToGame(rec.view, rec.name)">
              <img :src="rec.box3d" :alt="rec.title" :title="rec.title" />
            </div>
          </div>
        </aside>

          <!-- Zoom Control Flotante -->
          <div class="zoom-control-container" @mousedown.stop @wheel.stop>
            <i class="fas fa-search-minus"></i>
            <input type="range" class="zoom-slider" min="0.4" max="1.5" step="0.01" v-model.number="scale" />
            <i class="fas fa-search-plus"></i>
          </div>

          <!-- Imagen de la tienda interactiva por capas -->
          <div class="store-image-container">
             <div class="store-layers-wrapper" :style="imageTransform" draggable="false">
               <img src="./assets/imagenes-tienda/Tienda Base.png" alt="Interior Tienda Retro Base" class="store-layer base-layer" draggable="false" />
               <img src="./assets/imagenes-tienda/Deco1.png" class="store-layer" draggable="false" />
               
               <img src="./assets/imagenes-tienda/Cartel1.png" class="store-layer poster" draggable="false" />
               <img src="./assets/imagenes-tienda/Cartel2.png" class="store-layer poster" draggable="false" />
               <img src="./assets/imagenes-tienda/Cartel3.png" class="store-layer poster" draggable="false" />
               <img src="./assets/imagenes-tienda/Cartel4.png" class="store-layer poster" draggable="false" />
               
               <img src="./assets/imagenes-tienda/Stand1.png" class="store-layer stand stand-1" :class="{ 'simulated-hover': hoveredStand === 'ps1' }" draggable="false" @click.stop="goToPS1" title="Ver catálogo de PlayStation 1" />
               <img src="./assets/imagenes-tienda/Stand2.png" class="store-layer stand stand-2" :class="{ 'simulated-hover': hoveredStand === 'ps2' }" draggable="false" @click.stop="goToPS2" title="Ver catálogo de PlayStation 2" />
               <img src="./assets/imagenes-tienda/Stand3.png" class="store-layer stand stand-3" :class="{ 'simulated-hover': hoveredStand === 'ps3' }" draggable="false" @click.stop="goToPS3" title="Ver catálogo de PlayStation 3" />
               <img src="./assets/imagenes-tienda/Stand4.png" class="store-layer stand stand-4" :class="{ 'simulated-hover': hoveredStand === 'n64' }" draggable="false" @click.stop="goToN64" title="Ver catálogo de Nintendo 64" />
               <img src="./assets/imagenes-tienda/Stand5.png" class="store-layer stand stand-5" :class="{ 'simulated-hover': hoveredStand === 'gc' }" draggable="false" @click.stop="goToGC" title="Ver catálogo de Nintendo GameCube" />
               <img src="./assets/imagenes-tienda/Stand6.png" class="store-layer stand stand-6" :class="{ 'simulated-hover': hoveredStand === 'wii' }" draggable="false" @click.stop="goToWii" title="Ver catálogo de Nintendo Wii" />
             </div>
          </div>
        </main>
      </template>

      <!-- Vista del estante N64 -->
      <template v-else-if="currentView === 'n64'">
        <N64Shelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del estante GC -->
      <template v-else-if="currentView === 'gc'">
        <GCShelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del estante Wii -->
      <template v-else-if="currentView === 'wii'">
        <WiiShelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del estante PS1 -->
      <template v-else-if="currentView === 'ps1'">
        <PS1Shelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del estante PS2 -->
      <template v-else-if="currentView === 'ps2'">
        <PS2Shelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del estante PS3 -->
      <template v-else-if="currentView === 'ps3'">
        <PS3Shelf @back="goBack" @add-to-cart="addToCart" :preselectedGame="selectedGameName" :isNightMode="isNightMode" />
      </template>

      <!-- Vista del catálogo global -->
      <template v-else-if="currentView === 'catalog'">
        <Catalog @back="goBack" @open-game="(payload) => goToGame(payload.view, payload.game)" />
      </template>

      <!-- Vista de Nosotros (Historia, Contacto, FAQ) -->
      <template v-else-if="currentView === 'about'">
        <About @back="goBack" :section="targetAboutSection" />
      </template>

    </div>

    <!-- Cart Modal -->
    <Transition name="fade">
      <div class="cart-overlay" v-if="showCart" @click="showCart = false">
        <div class="cart-modal" @click.stop>
          <div class="cart-header">
            <h2><i class="fas fa-shopping-cart"></i> Tu Carrito</h2>
            <button class="close-cart-btn" @click="showCart = false"><i class="fas fa-times"></i></button>
          </div>
          
          <div class="cart-body" v-if="cart.length > 0">
            <div class="cart-items">
              <div class="cart-item" v-for="item in cart" :key="item.name">
                <img :src="item.img" :alt="item.name" class="cart-item-img" />
                <div class="cart-item-details">
                  <h4 class="cart-item-name">{{ item.name }}</h4>
                  <p class="cart-item-price">{{ formatPrice(item.priceNum) }} c/u</p>
                  <div class="cart-item-controls">
                    <button @click="updateQuantity(item.name, -1)" class="qty-btn" title="Disminuir"><i class="fas fa-minus"></i></button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.name, 1)" class="qty-btn" title="Aumentar"><i class="fas fa-plus"></i></button>
                  </div>
                </div>
                <div class="cart-item-subtotal">
                  <button @click="removeFromCart(item.name)" class="remove-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
                  <div class="subtotal-container">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-value">{{ formatPrice(item.priceNum * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-empty" v-else>
            <i class="fas fa-box-open"></i>
            <p>Tu carrito está vacío</p>
            <button class="continue-shopping-btn" @click="showCart = false">Seguir Comprando</button>
          </div>

          <div class="cart-footer" v-if="cart.length > 0">
            <div class="cart-total-container">
              <span class="total-label">TOTAL:</span>
              <span class="total-value">{{ formatPrice(cartTotal) }}</span>
            </div>
            <button class="checkout-btn" @click="checkout">Finalizar Compra</button>
          </div>
        </div>
      </div>
    </Transition>
    <Footer @navigate="goToAbout" />
  </div>
</template>

<style>
/* Reset and fonts - global styles for this component */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  margin: 0;
  padding: 0;
  background-color: #1a273b;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #1a273b; /* Dark blue background from the image */
  color: #e2e8f0;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
}

.app-locked {
  height: 100vh;
  overflow: hidden;
}

/* --- Navbar --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #212c42; /* Updated navbar color based on image */
  padding: 0 30px;
  height: 70px;
  border-bottom: 2px solid #2a3a50;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navbar-logo {
  height: 48px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
  cursor: pointer;
  transition: opacity 0.2s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.navbar-right-menu ul {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.navbar-right-menu a {
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s, border-bottom 0.2s;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
}

.navbar-right-menu a:hover, .navbar-right-menu a.active {
  color: #fbd38d;
  border-bottom: 2px solid #fbd38d;
}

.navbar-right-menu a i {
  font-size: 1.1rem;
}

/* --- Theme Switch Toggle (Neumorphic Day/Night) --- */
.theme-switch-wrapper {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.theme-switch {
  display: inline-block;
  height: 38px;
  position: relative;
  width: 80px;
  margin: 0;
}

.theme-switch input {
  display: none;
}

.slider {
  background-color: #f1f5f9;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  border-radius: 38px;
  box-shadow: inset 2px 4px 6px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8);
}

.slider-thumb {
  position: absolute;
  height: 30px;
  width: 30px;
  left: 4px;
  bottom: 4px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 2px 4px 6px rgba(0,0,0,0.15), -1px -1px 3px rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

input:checked + .slider {
  background-color: #0b1120;
  box-shadow: inset 3px 5px 8px rgba(0,0,0,0.7), inset -2px -2px 5px rgba(255,255,255,0.05);
}

input:checked + .slider .slider-thumb {
  transform: translateX(42px); /* 80 - 30 - 8 = 42px movement */
  background-color: #273759;
  box-shadow: 2px 4px 6px rgba(0,0,0,0.6), -1px -1px 3px rgba(255,255,255,0.05);
}

.sun-icon {
  color: #fbbf24;
  font-size: 18px;
}

.moon-icon {
  color: #f8fafc;
  font-size: 15px;
  margin-right: 4px;
  text-shadow: 0 0 4px rgba(255,255,255,0.6);
}

.star-icon {
  position: absolute;
  color: #fef08a; /* Amarillo suave */
  opacity: 0.9;
  user-select: none;
}
.star-icon.s1 { top: 4px; left: 16px; font-size: 6px; }
.star-icon.s2 { top: 12px; right: 4px; font-size: 8px; }
.star-icon.s3 { bottom: 6px; left: 8px; font-size: 7px; }

/* --- Sub Navbar --- */
.sub-navbar {
  background-color: #141f2e;
  color: #cbd5e1;
  text-align: center;
  padding: 10px 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 2px solid #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sub-navbar p {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.sub-navbar i {
  color: #fbbf24;
}

/* --- Main Layout --- */
.main-layout {
  display: flex;
  flex: 1;
  padding: 0;
}

.app-locked .main-layout {
  overflow: hidden;
}

/* --- Zoom Control --- */
.zoom-control-container {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #94a3b8;
}

.zoom-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 150px;
  height: 6px;
  background: #334155;
  border-radius: 3px;
  outline: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fbbf24;
  cursor: pointer;
  transition: transform 0.1s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.zoom-control-container i {
  font-size: 1.1rem;
}

/* --- Menu Flotante (Sidebar) --- */
.floating-menu {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 180px; /* Increased from 170px to accommodate larger icons and text */
  background-color: #212c42; /* Azul oscuro */
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 20px 15px;
  box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-title {
  font-size: 0.95rem;
  color: #e2e8f0;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 18px; /* Incremented from 12px for better spacing with larger icons */
  font-size: 1.05rem; /* Slightly larger text */
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.filter-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.icon-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 35px;
  flex-shrink: 0;
}

.console-logo {
  width: 100%;
  height: auto;
  max-height: 90px;
  object-fit: contain;
}

/* --- Menu Flotante Derecho (Recomendaciones) --- */
.floating-recommendations {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 220px;
  background-color: #212c42; /* Azul oscuro */
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 20px 15px;
  box-shadow: -4px 6px 15px rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.floating-recommendations .sidebar-title {
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 5px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.rec-game-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  transition: transform 0.2s, background-color 0.2s;
  cursor: pointer;
}

.rec-game-box:hover {
  transform: scale(1.05) translateY(-2px);
  background-color: rgba(255, 255, 255, 0.05);
}

.rec-game-box img {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
}

/* --- Main Interactive Area --- */
.store-interactive-area {
  flex: 1;
  background-color: #f8f9ff;
  position: relative;
  display: flex;
  align-items: center; /* Centrado para no desfasar el paneo */
  justify-content: center;
  height: 100%;
  overflow: hidden; /* Evita que panear el mouse cree barras de scroll del navegador */
  user-select: none; /* Previene la selección accidental del menú o la imagen */
  transition: background-color 0.4s ease; /* Transición suave del modo día a noche */
}

.store-interactive-area.night-mode {
  background-color: #0f172a; /* Azul oscuro */
}

.store-image-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-layers-wrapper {
  width: 100%;
  position: relative;
  display: block;
  transform-origin: center center;
}

.store-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* Deja pasar los eventos de drag del contenedor padre */
  user-select: none;
}

.store-layer.base-layer {
  position: relative; /* Otorga las dimensiones físicas al contenedor wrapper */
  height: auto;
  display: block;
}

.store-layer.stand {
  pointer-events: auto; /* Reactiva los clics en los stands */
  cursor: pointer;
  transition: filter 0.2s ease;
  width: 18.24%; /* 912px / 5000px natural scale */
  height: auto;
}

.store-layer.stand:hover,
.store-layer.stand.simulated-hover {
  filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
}

/* Coordenadas Isométricas Responsivas de cada Consola */
.stand-1 { left: 37.5%; top: 35.0%; z-index: 10; } /* PS1  (Fila atras, medio) */
.stand-2 { left: 50.7%; top: 43.2%; z-index: 11; } /* PS2  (Fila atras, derecha) */
.stand-3 { left: 63.2%; top: 51.2%; z-index: 16; } /* PS3  (Fila frente, derecha) */
.stand-4 { left: 18.0%; top: 48.0%; z-index: 10; } /* N64  (Fila atras, izq) */
.stand-5 { left: 31.2%; top: 57.0%; z-index: 15; } /* GC   (Fila frente, izq) */
.stand-6 { left: 44.5%; top: 66.0%; z-index: 20; } /* Wii  (Fila frente, medio) */

/* --- Cart Modal --- */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.cart-modal {
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: #1e293b;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0,0,0,0.6);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cart-header {
  padding: 25px 40px 25px 20px;
  border-bottom: 2px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0f172a;
}

.cart-header h2 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.close-cart-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.6rem;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.close-cart-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 40px 20px 20px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background-color: #334155;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  gap: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  border-left: 6px solid #3b82f6;
}

.cart-item-img {
  width: 75px;
  height: auto;
  max-height: 100px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-item-name {
  margin: 0 0 5px 0;
  font-size: 1.15rem;
  font-family: 'Oswald', sans-serif;
  color: #f1f5f9;
  line-height: 1.2;
}

.cart-item-price {
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  color: #94a3b8;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.qty-btn {
  background-color: #475569;
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.qty-btn:hover {
  background-color: #64748b;
}

.qty-value {
  font-weight: bold;
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

.cart-item-subtotal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 90px;
  border-left: 1px solid #475569;
  padding-left: 15px;
}

.subtotal-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.remove-btn {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #ef4444;
  color: white;
}

.subtotal-label {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: -2px;
}

.subtotal-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  color: #10b981;
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.cart-empty i {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 1.4rem;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 30px;
  color: #94a3b8;
}

.continue-shopping-btn {
  background-color: #3b82f6;
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.continue-shopping-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.cart-footer {
  padding: 25px 40px 25px 20px;
  background-color: #0f172a;
  border-top: 2px solid #334155;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-total-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #e2e8f0;
  text-transform: uppercase;
}

.total-value {
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  color: #10b981;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.checkout-btn {
  background-color: #10b981;
  border: none;
  color: white;
  padding: 18px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;
  letter-spacing: 1px;
}

.checkout-btn:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
}

.cart-badge {
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
  margin-left: 5px;
}
</style>
