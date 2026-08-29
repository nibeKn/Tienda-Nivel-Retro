<template>
  <div class="merch-shelf-container">
    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <BaseBackground word="MERCH" />

    <div class="merch-layout">
      <aside class="merch-sidebar">
        <h3 class="sidebar-title">CATEGORIAS</h3>
        <ul class="sidebar-menu">
          <li>
            <button
              type="button"
              :class="{ active: activeSection === 'poleras' }"
              :aria-current="activeSection === 'poleras' ? 'true' : undefined"
              @click="selectSection('poleras')"
            >
              <i class="fas fa-tshirt" aria-hidden="true"></i> <span>POLERAS</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="{ active: activeSection === 'figuras' }"
              :aria-current="activeSection === 'figuras' ? 'true' : undefined"
              @click="selectSection('figuras')"
            >
              <i class="fas fa-user-astronaut" aria-hidden="true"></i> <span>FIGURAS</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="{ active: activeSection === 'peluches' }"
              :aria-current="activeSection === 'peluches' ? 'true' : undefined"
              @click="selectSection('peluches')"
            >
              <i class="fas fa-paw" aria-hidden="true"></i> <span>PELUCHES</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="{ active: activeSection === 'otros' }"
              :aria-current="activeSection === 'otros' ? 'true' : undefined"
              @click="selectSection('otros')"
            >
              <i class="fas fa-mug-hot" aria-hidden="true"></i>
              <span><span class="desktop-only">OTROS/</span>ACCESORIOS</span>
            </button>
          </li>
        </ul>
      </aside>
      <div class="merch-main" v-if="!activeSection">
        <div class="merch-grid">
          <div
            id="poleras"
            class="merch-card"
            @click="selectSection('poleras')"
            style="cursor: pointer"
          >
            <h2>POLERAS</h2>
            <div class="category-image">
              <img
                src="https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786409039/Poleras_dmoy3y.png"
                alt="Poleras"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div
            id="figuras"
            class="merch-card"
            @click="selectSection('figuras')"
            style="cursor: pointer"
          >
            <h2>FIGURAS</h2>
            <div class="category-image">
              <img
                src="https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786409036/Figuras_r2rpyu.png"
                alt="Figuras"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div
            id="peluches"
            class="merch-card"
            @click="selectSection('peluches')"
            style="cursor: pointer"
          >
            <h2>PELUCHES</h2>
            <div class="category-image">
              <img
                src="https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786409040/Peluches_t20t80.png"
                alt="Peluches"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div
            id="otros"
            class="merch-card"
            @click="selectSection('otros')"
            style="cursor: pointer"
          >
            <h2><span class="desktop-only">OTROS/</span>ACCESORIOS</h2>
            <div class="category-image">
              <img
                src="https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786409037/Otros_z2ggyv.png"
                alt="Otros/Accesorios"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div class="destacados-section">
          <h2>PRODUCTOS DESTACADOS</h2>
          <div class="destacados-scroll">
            <div
              class="destacado-card"
              v-for="(item, index) in destacados"
              :key="'dest-' + index"
              @click="navigateToFeatured(item)"
            >
              <div class="destacado-img-container">
                <img :src="item.mainImg" :alt="item.name" loading="lazy" decoding="async" />
              </div>
              <div class="destacado-info">
                <h4>{{ item.name }}</h4>
                <span class="destacado-price">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="category-detail-view" v-else>
        <div class="items-grid-panel" :class="{ 'mobile-hidden': selectedProduct }">
          <div
            class="grid-item"
            v-for="product in merchCategories[activeSection]"
            :key="product.id"
            :class="{ selected: selectedProduct && selectedProduct.id === product.id }"
            @click="selectProduct(product)"
          >
            <img :src="product.mainImg" :alt="product.name" loading="lazy" decoding="async" />
            <div class="grid-item-info mobile-only">
              <h4>{{ product.name }}</h4>
              <span>{{ formatPrice(product.price) }}</span>
            </div>
          </div>
        </div>

        <div class="product-detail-panel" v-if="selectedProduct">
          <div class="mobile-detail-header mobile-only">
            <button class="mobile-back-btn" @click="selectedProduct = null">
              <i class="fas fa-chevron-left"></i> Volver a categorias
            </button>
          </div>
          <div class="detail-gallery-area">
            <button
              type="button"
              class="main-image-box"
              :aria-label="`Ampliar imagen de ${selectedProduct.name}`"
              @click="openGallery"
            >
              <img :src="activeMainImg" alt="" />
            </button>
            <div class="thumbnail-list">
              <img
                v-for="(thumb, idx) in selectedProduct.gallery"
                :key="idx"
                :src="thumb"
                :alt="`${selectedProduct.name} — imagen ${idx + 1}`"
                loading="lazy"
                decoding="async"
                class="thumb-img"
                :class="{ 'active-thumb': activeMainImg === thumb }"
                @click.stop="setActiveImg(thumb, idx)"
              />
            </div>
          </div>

          <div class="detail-info-area">
            <h3>{{ selectedProduct.name }}</h3>
            <p class="detail-desc">{{ selectedProduct.desc }}</p>
            <span class="detail-price">{{ formatPrice(selectedProduct.price) }}</span>

            <div class="detail-actions">
              <div class="qty-selector">
                <span class="qty-label">CANTIDAD</span>
                <div class="qty-controls">
                  <button @click="qty > 1 ? qty-- : null"><i class="fas fa-minus"></i></button>
                  <span class="qty-number">{{ qty }}</span>
                  <button @click="qty++"><i class="fas fa-plus"></i></button>
                </div>
              </div>
              <button class="add-cart-btn" @click="addToCart(selectedProduct)">
                AÑADIR AL CARRITO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="isGalleryOpen" class="gallery-modal" @click.self="closeGallery">
        <button class="modal-close-btn" @click="closeGallery">
          <i class="fa-solid fa-times"></i>
        </button>
        <button class="modal-nav-btn prev" @click.stop="prevGalleryImg">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="modal-img-container" @click.stop>
          <img
            :src="selectedProduct.gallery[currentGalleryIndex]"
            :alt="selectedProduct.name"
            decoding="async"
          />
        </div>

        <button class="modal-nav-btn next" @click.stop="nextGalleryImg">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import BaseBackground from './BaseBackground.vue';
import { merchCategories, destacados } from '../data/merchData.js';

const props = defineProps({
  preselectedId: { type: String, default: null },
});

const emit = defineEmits(['back', 'add-to-cart']);

const formatPrice = (value) => {
  if (typeof value === 'number') {
    return '$' + value.toLocaleString('es-CL');
  }
  return value;
};

const activeSection = ref(null);
const selectedProduct = ref(null);
const qty = ref(1);

const selectSection = (cat) => {
  if (activeSection.value === cat) {
    activeSection.value = null;
    selectedProduct.value = null;
    activeMainImg.value = '';
  } else {
    activeSection.value = cat;
    if (merchCategories[cat] && merchCategories[cat].length > 0) {
      if (window.innerWidth > 768) {
        selectedProduct.value = merchCategories[cat][0];
        activeMainImg.value = merchCategories[cat][0].mainImg;
        activeGalleryIdx.value = 0;
      } else {
        selectedProduct.value = null;
      }
    }
  }
  qty.value = 1;
};

const addToCart = (product) => {
  emit('add-to-cart', { ...product, quantity: qty.value });
};

// Modal Gallery Lightbox State
const isGalleryOpen = ref(false);
const currentGalleryIndex = ref(0);

// Active main image state - separate from product data to avoid mutation-based resizing
const activeMainImg = ref('');
const activeGalleryIdx = ref(0);

const selectProduct = (product) => {
  selectedProduct.value = product;
  qty.value = 1;
  activeMainImg.value = product.mainImg;
  activeGalleryIdx.value = 0;
};

const findItemById = (id) => {
  for (const cat in merchCategories) {
    const found = merchCategories[cat].find((item) => item.id === id);
    if (found) return { category: cat, item: found };
  }
  return null;
};

const navigateToFeatured = (itemOrId) => {
  let targetItem = null;
  let targetCategory = null;

  if (typeof itemOrId === 'string') {
    const found = findItemById(itemOrId);
    if (found) {
      targetItem = found.item;
      targetCategory = found.category;
    }
  } else {
    targetItem = itemOrId;
    const prefix = targetItem.id.split('-')[0];
    const categoryMap = {
      polera: 'poleras',
      figura: 'figuras',
      peluche: 'peluches',
      otro: 'otros',
    };
    targetCategory = categoryMap[prefix];
  }

  if (targetCategory && targetItem) {
    activeSection.value = targetCategory;
    selectProduct(targetItem);
  }
};

const setActiveImg = (thumb, idx) => {
  activeMainImg.value = thumb;
  activeGalleryIdx.value = idx;
};

const openGallery = () => {
  currentGalleryIndex.value = activeGalleryIdx.value;
  isGalleryOpen.value = true;
};

const closeGallery = () => {
  isGalleryOpen.value = false;
};

const nextGalleryImg = () => {
  if (!selectedProduct.value) return;
  const max = selectedProduct.value.gallery.length - 1;
  if (currentGalleryIndex.value < max) {
    currentGalleryIndex.value++;
  } else {
    currentGalleryIndex.value = 0;
  }
};

const prevGalleryImg = () => {
  if (!selectedProduct.value) return;
  if (currentGalleryIndex.value > 0) {
    currentGalleryIndex.value--;
  } else {
    currentGalleryIndex.value = selectedProduct.value.gallery.length - 1;
  }
};

const handleKeydown = (e) => {
  if (!isGalleryOpen.value) return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') nextGalleryImg();
  if (e.key === 'ArrowLeft') prevGalleryImg();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (props.preselectedId) {
    navigateToFeatured(props.preselectedId);
  }
});

// The route keeps this component mounted when only `?producto=` changes, so the
// selection has to follow the prop rather than only the initial mount.
watch(
  () => props.preselectedId,
  (id) => {
    if (id) navigateToFeatured(id);
  }
);

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.merch-shelf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: #0f172a;
  position: relative;
  overflow: hidden;
  width: 100%;
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

.merch-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  align-items: start;
  margin-top: 90px;
  padding: 0 40px 40px 40px;
  gap: 30px;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}

.merch-layout::-webkit-scrollbar {
  width: 8px;
}
.merch-layout::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 4px;
}
.merch-layout::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 4px;
}

/* Sidebar */
.merch-sidebar {
  background-color: #1e293b;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
}

.sidebar-title {
  font-family: 'Oswald', sans-serif;
  color: #94a3b8;
  font-size: 1.1rem;
  letter-spacing: 1px;
  margin-bottom: 20px;
  border-bottom: 1px solid #334155;
  padding-bottom: 10px;
  text-align: center;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-menu li button {
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  text-decoration: none;
  padding: 20px 10px;
  border-radius: 12px;
  transition: all 0.2s;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid transparent;
}

.sidebar-menu li button:hover,
.sidebar-menu li button.active {
  background-color: #111827;
  color: #fbbf24;
  border: 1px solid #fbbf24;
  box-shadow: inset 0 0 10px rgba(251, 191, 36, 0.1);
}

.sidebar-menu li a i {
  font-size: 3rem;
  margin-bottom: 5px;
  width: auto;
}

/* Main Content */
.merch-main {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
}

.merch-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-height: 0;
}

.merch-card {
  background-color: #2a3a50;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  border: 1px solid #334155;
  height: 350px; /* Further shortened to crop just below images */
  min-height: 0;
}

.merch-card h2 {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
}

.category-image {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  background-color: transparent;
  min-height: 0;
}

.category-image img {
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.category-image:hover img {
  transform: scale(1.02);
}

/* Destacados Section */
.destacados-section {
  margin-top: 25px;
  background-color: #1e293b;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #334155;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.destacados-section h2 {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.6rem;
  margin-top: 0;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.destacados-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-top: 15px;
  padding-bottom: 15px;
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}

.destacados-scroll::-webkit-scrollbar {
  height: 8px;
}

.destacados-scroll::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 4px;
}

.destacados-scroll::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 4px;
}

.destacado-card {
  background-color: #fff;
  border-radius: 12px;
  min-width: 180px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.destacado-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.destacado-img-container {
  height: 130px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.destacado-img-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.destacado-info {
  padding: 8px 10px;
  text-align: center;
  background-color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.destacado-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
}

.destacado-price {
  color: #212c42;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: bold;
}

/* Category Detail View */
.category-detail-view {
  display: flex;
  gap: 30px;
  flex: 1;
  min-height: 0;
  max-height: 100%; /* Important for internal scrolling */
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.items-grid-panel {
  flex: 1;
  background-color: #1e293b;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  align-content: start;
}

.grid-item {
  background-color: #ffffff; /* White background forced */
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  aspect-ratio: 1; /* Strict square format */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; /* Prevent border/padding modifying dimension */
  box-shadow:
    inset 0 0 0 2px transparent,
    0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 0; /* Ensures content doesn't push height */
  min-width: 0; /* Ensures content doesn't push width */
}

.grid-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 2px transparent,
    0 8px 15px rgba(0, 0, 0, 0.2);
}

.grid-item.selected {
  /* Dynamic border substituted with inset box-shadow ensuring 0 size distortion */
  box-shadow:
    inset 0 0 0 4px #fbbf24,
    0 5px 15px rgba(251, 191, 36, 0.4);
}

.product-detail-panel {
  width: 450px;
  background-color: #1e293b;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  overflow-y: auto;
}

.detail-gallery-area {
  display: flex;
  gap: 15px;
  height: 380px;
}

.main-image-box {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font: inherit;
  cursor: zoom-in;
  min-width: 0;
}

.main-image-box:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 3px;
}

.main-image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80px;
  flex-shrink: 0;
}

.thumb-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #334155;
  transition: border-color 0.2s;
  background-color: #fff;
}

.thumb-img:hover {
  border-color: #94a3b8;
}

.detail-info-area {
  display: flex;
  flex-direction: column;
  gap: 5px; /* Reduced from 10px */
}

.detail-info-area h3 {
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  margin: 0;
  letter-spacing: 0.5px;
}

.detail-desc {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0 0 4px 0; /* Reduced from 10px */
}

.detail-price {
  color: #fbbf24;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px; /* Reduced from 20px */
}

.detail-actions {
  display: flex;
  gap: 20px;
  margin-top: 10px; /* Changed from auto to a fixed small margin */
}

.qty-selector {
  display: flex;
  flex-direction: column;
  gap: 3px; /* Reduced from 5px */
}

.qty-label {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.qty-controls {
  display: flex;
  align-items: center;
  background-color: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
}

.qty-controls button {
  background: transparent;
  border: none;
  color: #fff;
  width: 36px;
  height: 44px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-controls button:hover {
  background-color: #334155;
}

.qty-number {
  color: #fff;
  font-weight: bold;
  width: 30px;
  text-align: center;
  font-size: 1.1rem;
}

.add-cart-btn {
  flex: 1;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
}

.add-cart-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.5);
}

/* Lightbox Carousel CSS */
.gallery-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.2s ease;
}

.modal-close-btn {
  position: absolute;
  top: 30px;
  right: 40px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  transition:
    transform 0.2s,
    color 0.2s;
}

.modal-close-btn:hover {
  transform: scale(1.2);
  color: #fbbf24;
}

.modal-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 3rem;
  padding: 20px 30px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-nav-btn.prev {
  left: 40px;
}
.modal-nav-btn.next {
  right: 40px;
}
.modal-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-img-container {
  max-width: 80vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-img-container img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.merch-layout {
  position: relative;
  z-index: 10;
}

/* MOBILE RESPONSIVE */
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: flex;
  }
  .desktop-only {
    display: none !important;
  }

  .back-btn {
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    margin: 15px;
    align-self: flex-start;
  }

  .merch-layout {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin-top: 0;
    gap: 0;
  }

  /* 1. Barra de Navegación Superior (Sidebar transformado) */
  .merch-sidebar {
    display: flex;
    position: static;
    box-shadow: none;
    padding: 0;
    background: transparent;
    border-radius: 0;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
  .sidebar-title {
    display: none;
  }
  .sidebar-menu {
    flex-direction: row;
    width: 100%;
    justify-content: space-evenly;
    gap: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #334155;
  }
  .sidebar-menu li {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .sidebar-menu li button {
    font-family: inherit;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 5px;
    padding: 10px 5px;
    font-size: 0.8rem;
    border: none;
    background: transparent;
    border-radius: 0;
    color: #94a3b8;
  }
  .sidebar-menu li a i {
    font-size: 1.5rem;
  }
  .sidebar-menu li button:hover,
  .sidebar-menu li button.active {
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: #fbbf24;
    border-bottom: 2px solid #fbbf24;
  }

  /* 2. Vista por Defecto */
  .merch-grid {
    display: none;
  }

  .destacados-section {
    margin: 15px;
    background-color: transparent;
    box-shadow: none;
    border: none;
    padding: 0;
  }
  .destacados-scroll {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    overflow: visible;
    padding: 0;
  }
  .destacado-card {
    min-width: 0;
    margin: 0;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .destacado-img-container {
    height: 120px;
    background-color: #ffffff;
  }

  /* 3. Grilla de Productos por Categoría (Imagen 1) */
  .category-detail-view {
    flex-direction: column;
    gap: 0;
  }
  .items-grid-panel {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 15px;
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
  }
  .grid-item {
    aspect-ratio: auto;
    flex-direction: column;
    padding: 15px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    justify-content: flex-start;
  }
  .grid-item img {
    height: 120px;
    object-fit: contain;
    margin-bottom: 10px;
  }
  .grid-item-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }
  .grid-item-info h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.2;
    font-family: 'Roboto', sans-serif;
  }
  .grid-item-info span {
    font-size: 1.1rem;
    font-weight: bold;
    color: #1e293b;
  }
  .grid-item.selected {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .mobile-hidden {
    display: none !important;
  }

  /* 4. Detalle de Producto a Pantalla Completa (Imagen 2) */
  .product-detail-panel {
    position: static;
    width: 100%;
    height: auto;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    padding: 0 15px 20px 15px;
    box-sizing: border-box;
    overflow-y: visible;
    animation: fadeIn 0.3s ease;
  }

  /* Header Detalle Móvil */
  .mobile-detail-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #334155;
  }
  .mobile-back-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .mobile-title {
    color: #fff;
    font-family: 'Oswald', sans-serif;
    font-size: 1.2rem;
    letter-spacing: 1px;
    border-bottom: 2px solid #fbbf24;
    padding-bottom: 2px;
  }

  /* Galería (Imagen 2) */
  .detail-gallery-area {
    display: flex;
    flex-direction: row;
    height: 200px;
    gap: 15px;
    margin-bottom: 15px;
  }
  .main-image-box {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 10px;
    height: 100%;
  }
  .main-image-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .thumbnail-list {
    width: 60px;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding-right: 5px;
  }
  .thumb-img {
    width: 100%;
    height: 60px;
    border-radius: 8px;
    border-width: 1px;
  }

  /* Información del Producto */
  .detail-info-area {
    display: flex;
    flex-direction: column;
    overflow: visible;
  }
  .detail-info-area h3 {
    font-size: 1.3rem;
    margin-bottom: 5px;
  }
  .detail-desc {
    font-size: 0.85rem;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .detail-price {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #fbbf24;
    font-weight: bold;
  }
  .detail-actions {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 15px;
    background: transparent;
    padding: 0;
  }
  .qty-selector {
    flex-direction: column;
    gap: 5px;
  }
  .qty-controls {
    border-color: #475569;
  }
  .qty-controls button {
    height: 40px;
    width: 35px;
  }
  .qty-number {
    font-size: 1.1rem;
    width: 30px;
  }
  .add-cart-btn {
    height: 50px;
    font-size: 1rem;
    border-radius: 8px;
    flex: 1;
  }
}
</style>
