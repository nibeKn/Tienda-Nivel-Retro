<script setup>
import { onMounted, useTemplateRef } from 'vue';
import { useCart } from './composables/useCart.js';
import { useNavigation } from './composables/useNavigation.js';
import { registerTransition } from './router/index.js';

import NavBar from './components/NavBar.vue';
import CartModal from './components/CartModal.vue';
import Footer from './components/Footer.vue';
import BlockTransition from './components/BlockTransition.vue';

const {
  cart,
  showCart,
  showToast,
  toastMessage,
  cartTotal,
  cartFinalTotal,
  appliedPromo,
  cartItemCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  formatPrice,
  applyPromo,
} = useCart();

const { currentView, isImmersive, goToSection, goHome, goToAbout, goToArcade, goToGame, checkout } =
  useNavigation();

// The router drives the pixel-block wipe between sections, so it needs a handle
// on the overlay that lives here.
const blockTransition = useTemplateRef('blockTransition');
onMounted(() => registerTransition(blockTransition.value));

const handleCheckout = () => {
  if (cart.value.length === 0) return;
  checkout(showCart);
};
</script>

<template>
  <div class="app-container" :class="{ 'app-locked': isImmersive }">
    <NavBar
      :current-view="currentView"
      :cart-item-count="cartItemCount"
      @open-cart="showCart = true"
    />

    <!-- Promo Bar / Marquee -->
    <div class="promo-bar">
      <div class="promo-content">
        <div class="marquee-group">
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
        </div>
        <div class="marquee-group" aria-hidden="true">
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
          <span
            >INGRESANDO EL CÓDIGO <strong style="color: #fbbf24">NIVEL_RETRO</strong> OBTÉN UN 20%
            DE DESCUENTO EN TU PRIMERA COMPRA</span
          >
        </div>
      </div>
    </div>

    <main class="main-layout">
      <!--
        Every section is a route. Props that come from the URL are declared by
        the route itself; the handlers below are the shell-level concerns each
        view can raise, and views ignore the ones they do not emit.
      -->
      <RouterView v-slot="{ Component, route }">
        <component
          :is="Component"
          v-bind="route.meta.needsCart ? { cart } : {}"
          @back="goHome"
          @close="goHome"
          @add-to-cart="addToCart"
          @open-cart="showCart = true"
          @checkout="handleCheckout"
          @navigate="goToSection"
          @navigate-arcade="goToArcade"
          @navigate-about="goToAbout"
          @open-game="(payload) => goToGame(payload.view, payload.game)"
        />
      </RouterView>
    </main>

    <CartModal
      :show="showCart"
      :cart="cart"
      :cart-total="cartTotal"
      :cart-final-total="cartFinalTotal"
      :applied-promo="appliedPromo"
      :format-price="formatPrice"
      @close="showCart = false"
      @checkout="handleCheckout"
      @update-quantity="(name, delta) => updateQuantity(name, delta)"
      @remove-from-cart="removeFromCart"
      @apply-promo="applyPromo"
    />

    <Footer />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification" role="status" aria-live="polite">
        <div class="toast-content">
          <i class="fas fa-check-circle toast-icon" aria-hidden="true"></i>
          <span class="toast-text">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>

    <BlockTransition ref="blockTransition" />
  </div>
</template>

<style>
/* Fonts and icon CSS are linked from index.html so they never block the first
   render; importing them here would serialise them behind the CSS bundle. */
body {
  margin: 0;
  padding: 0;
  background-color: #1a273b;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #1a273b;
  color: #e2e8f0;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
}

.app-locked {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* --- Promo Bar --- */
.promo-bar {
  background-color: #0f172a;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #1e293b;
  display: flex;
  position: relative;
  z-index: 99;
}

.promo-content {
  display: flex;
  width: max-content;
}

.marquee-group {
  display: flex;
  gap: 50px;
  padding-right: 50px;
  animation: marquee 35s linear infinite;
}

.marquee-group span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
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

/* Toast Notification Styles */
.toast-notification {
  position: fixed;
  top: 90px;
  right: 30px;
  z-index: 10000;
  pointer-events: none;
}

.toast-content {
  background-color: #0f172a;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(59, 130, 246, 0.2);
  min-width: 280px;
  max-width: 450px;
}

.toast-icon {
  color: #10b981;
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.4));
}

.toast-text {
  color: #f1f5f9;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Toast Transitions */
.toast-enter-active {
  animation: toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  animation: toast-out 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

@keyframes toast-in {
  from {
    transform: translateX(120%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(120%) scale(0.8);
    opacity: 0;
  }
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .toast-notification {
    top: 70px;
    right: 10px;
    left: 10px;
  }

  .toast-content {
    min-width: auto;
    max-width: 100%;
    padding: 12px 16px;
  }
}
</style>
