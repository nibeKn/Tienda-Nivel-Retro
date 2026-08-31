<template>
  <header class="navbar">
    <RouterLink
      :to="{ name: 'store' }"
      class="navbar-left"
      aria-label="Nivel Retro — ir a la tienda"
    >
      <img :src="logoSrc" alt="" class="navbar-logo" />
    </RouterLink>

    <button
      class="hamburger"
      :class="{ open: menuOpen }"
      :aria-expanded="menuOpen"
      aria-controls="navbar-menu"
      aria-label="Menú de navegación"
      @click="menuOpen = !menuOpen"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!--
      Real links, not `href="#"` handlers: they can be focused, opened in a new
      tab and middle-clicked, and RouterLink marks the active section itself.
    -->
    <nav
      id="navbar-menu"
      class="navbar-right-menu"
      :class="{ 'menu-open': menuOpen }"
      aria-label="Principal"
    >
      <ul>
        <li>
          <RouterLink :to="{ name: 'store' }" exact-active-class="active" @click="closeMenu"
            >TIENDA</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'catalog' }" active-class="active" @click="closeMenu"
            >CATÁLOGO</RouterLink
          >
        </li>
        <li>
          <RouterLink
            :to="{ name: 'counter' }"
            class="account-link"
            active-class="active"
            @click="closeMenu"
          >
            <i class="fas fa-user" aria-hidden="true"></i> CUENTA
          </RouterLink>
        </li>
        <li>
          <button type="button" class="cart-link" @click="openCart">
            <i class="fas fa-shopping-cart" aria-hidden="true"></i> CARRITO
            <span v-if="cartItemCount" class="cart-badge">{{ cartItemCount }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <button
      type="button"
      class="mobile-cart-btn"
      :aria-label="`Abrir carrito${cartItemCount ? ` (${cartItemCount} artículos)` : ''}`"
      @click="$emit('open-cart')"
    >
      <i class="fas fa-shopping-cart" aria-hidden="true"></i>
      <span v-if="cartItemCount" class="cart-badge mobile-badge">{{ cartItemCount }}</span>
    </button>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const logoSrc =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409011/Nivel_Retro_2_vyuak4.png';

defineProps({
  cartItemCount: { type: Number, default: 0 },
});

const emit = defineEmits(['open-cart']);

const menuOpen = ref(false);

const closeMenu = () => {
  menuOpen.value = false;
};

const openCart = () => {
  closeMenu();
  emit('open-cart');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #212c42;
  padding: 0 30px;
  height: 70px;
  border-bottom: 2px solid #2a3a50;
  position: relative;
  z-index: 9999;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
}

.navbar-logo {
  height: 48px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
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

.navbar-right-menu a,
.navbar-right-menu button {
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.95rem;
  transition:
    color 0.2s,
    border-bottom 0.2s;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
}

.navbar-right-menu a:hover,
.navbar-right-menu button:hover,
.navbar-right-menu a.active {
  color: #fbd38d;
  border-bottom: 2px solid #fbd38d;
}

.navbar-right-menu a:focus-visible,
.navbar-right-menu button:focus-visible {
  outline: 2px solid #fbd38d;
  outline-offset: 4px;
  border-radius: 4px;
}

.navbar-right-menu a i,
.navbar-right-menu button i {
  font-size: 1.1rem;
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

/* Hamburger */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 110;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #e2e8f0;
  margin: 5px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile Cart Button */
.mobile-cart-btn {
  display: none;
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 1.3rem;
  cursor: pointer;
  position: relative;
  padding: 8px;
}

.mobile-badge {
  position: absolute;
  top: 2px;
  right: 0;
  font-size: 0.65rem;
  padding: 1px 5px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar {
    padding: 0 15px;
    height: 60px;
  }

  .navbar-logo {
    height: 36px;
  }

  .hamburger {
    display: block;
    order: -1;
  }

  .navbar-left {
    order: 0;
    flex: 1;
    justify-content: center;
  }

  .mobile-cart-btn {
    display: block;
    order: 1;
  }

  .navbar-right-menu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 200px;
    height: 100vh;
    background-color: #0f172a;
    transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 105;
    padding-top: 70px;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.6);
  }

  .navbar-right-menu.menu-open {
    left: 0;
  }

  .navbar-right-menu ul {
    flex-direction: column;
    gap: 0;
    padding: 0 15px;
  }

  .navbar-right-menu li {
    border-bottom: 1px solid #1e293b;
  }

  .navbar-right-menu a,
  .navbar-right-menu button {
    padding: 14px 10px;
    font-size: 0.95rem;
    border-bottom: none;
  }

  .navbar-right-menu a:hover,
  .navbar-right-menu button:hover,
  .navbar-right-menu a.active {
    border-bottom: none;
    background-color: rgba(251, 211, 141, 0.1);
    border-radius: 8px;
  }

  .navbar-right-menu .cart-link {
    display: flex;
  }
}
</style>
