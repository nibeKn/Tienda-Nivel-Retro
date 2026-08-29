/**
 * useCart.js — Shopping cart composable
 *
 * Encapsulates all cart logic: add, remove, quantities, total and toast.
 */
import { ref, computed } from 'vue';

export function useCart() {
  const cart = ref([]);
  const showCart = ref(false);

  const showToast = ref(false);
  const toastMessage = ref('');
  let toastTimer = null;

  const triggerToast = (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.value = message;
    showToast.value = true;
    toastTimer = setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  const formatPrice = (value) => {
    return '$' + value.toLocaleString('es-CL');
  };

  const addToCart = (product) => {
    const existing = cart.value.find((p) => p.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1, priceNum: parsePrice(product.price) });
    }
    triggerToast(`¡${product.name} agregado al carrito!`);
  };

  const removeFromCart = (productName) => {
    cart.value = cart.value.filter((p) => p.name !== productName);
  };

  const updateQuantity = (productName, delta) => {
    const item = cart.value.find((p) => p.name === productName);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) removeFromCart(productName);
    }
  };

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.priceNum * item.quantity, 0);
  });

  const appliedPromo = ref(null);

  const cartFinalTotal = computed(() => {
    let total = cartTotal.value;
    if (appliedPromo.value === 'nivel_retro') {
      total = Math.floor(total * 0.8);
    }
    return total;
  });

  const applyPromo = (code) => {
    if (code.trim().toLowerCase() === 'nivel_retro') {
      appliedPromo.value = 'nivel_retro';
      triggerToast('¡Código NIVEL_RETRO aplicado! 20% de descuento.');
      return true;
    } else {
      triggerToast('Código promocional inválido.');
      return false;
    }
  };

  const cartItemCount = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  return {
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
    parsePrice,
    triggerToast,
    applyPromo,
  };
}
