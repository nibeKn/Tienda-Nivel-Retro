/**
 * useCart.js — Shopping cart composable
 *
 * Encapsulates all cart logic: add, remove, quantities, total and toast.
 */
import { ref, computed } from 'vue';

/**
 * Ceiling on how many units of one product the cart will hold. Enforced here
 * rather than in the views so no entry point can bypass it: the shelves add one
 * unit at a time, the merch aisle adds a chosen amount, and the cart modal
 * steps the value up and down.
 */
export const MAX_QUANTITY_PER_PRODUCT = 10;

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

  /**
   * Prices arrive in two shapes: the game catalogue stores formatted strings
   * ('$120.000') while the merch catalogue stores plain numbers (25000).
   */
  const parsePrice = (price) => {
    if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
    if (!price) return 0;
    return parseInt(String(price).replace(/[^0-9]/g, ''), 10) || 0;
  };

  const formatPrice = (value) => {
    return '$' + value.toLocaleString('es-CL');
  };

  /**
   * Adds a product, honouring `product.quantity` when the caller supplies one
   * (the merch aisle does) and defaulting to a single unit otherwise. Returns
   * the number of units actually added, which is 0 once the cap is reached.
   */
  const addToCart = (product) => {
    const requested = Math.max(1, Math.floor(Number(product.quantity) || 1));
    const existing = cart.value.find((p) => p.name === product.name);
    const current = existing ? existing.quantity : 0;
    const room = MAX_QUANTITY_PER_PRODUCT - current;

    if (room <= 0) {
      triggerToast(`Ya tienes el máximo de ${MAX_QUANTITY_PER_PRODUCT} unidades de este producto.`);
      return 0;
    }

    const added = Math.min(requested, room);

    if (existing) {
      existing.quantity = current + added;
    } else {
      cart.value.push({
        ...product,
        quantity: added,
        priceNum: parsePrice(product.price),
      });
    }

    if (added < requested) {
      triggerToast(`Máximo ${MAX_QUANTITY_PER_PRODUCT} unidades por producto.`);
    } else {
      triggerToast(`¡${product.name} agregado al carrito!`);
    }

    return added;
  };

  const removeFromCart = (productName) => {
    cart.value = cart.value.filter((p) => p.name !== productName);
  };

  const updateQuantity = (productName, delta) => {
    const item = cart.value.find((p) => p.name === productName);
    if (!item) return;

    const next = item.quantity + delta;

    if (next <= 0) {
      removeFromCart(productName);
      return;
    }

    if (next > MAX_QUANTITY_PER_PRODUCT) {
      item.quantity = MAX_QUANTITY_PER_PRODUCT;
      triggerToast(`Máximo ${MAX_QUANTITY_PER_PRODUCT} unidades por producto.`);
      return;
    }

    item.quantity = next;
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
