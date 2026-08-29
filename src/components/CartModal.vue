<template>
  <Transition name="fade">
    <div class="cart-overlay" v-if="show" @click="$emit('close')">
      <div class="cart-modal" @click.stop>
        <div class="cart-header">
          <h2><i class="fas fa-shopping-cart"></i> Tu Carrito</h2>
          <button class="close-cart-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="cart-body" v-if="cart.length > 0">
          <div class="cart-items">
            <div class="cart-item" v-for="item in cart" :key="item.name">
              <img
                :src="item.img"
                :alt="item.name"
                class="cart-item-img"
                loading="lazy"
                decoding="async"
              />
              <div class="cart-item-details">
                <h4 class="cart-item-name">{{ item.name }}</h4>
                <p class="cart-item-price">{{ formatPrice(item.priceNum) }} c/u</p>
                <div class="cart-item-controls">
                  <button
                    class="qty-btn"
                    :aria-label="`Quitar una unidad de ${item.name}`"
                    title="Disminuir"
                    @click="$emit('update-quantity', item.name, -1)"
                  >
                    <i class="fas fa-minus" aria-hidden="true"></i>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    :disabled="item.quantity >= MAX_QUANTITY_PER_PRODUCT"
                    :aria-label="`Añadir una unidad de ${item.name}`"
                    :title="
                      item.quantity >= MAX_QUANTITY_PER_PRODUCT
                        ? `Máximo ${MAX_QUANTITY_PER_PRODUCT} unidades`
                        : 'Aumentar'
                    "
                    @click="$emit('update-quantity', item.name, 1)"
                  >
                    <i class="fas fa-plus" aria-hidden="true"></i>
                  </button>
                </div>
                <p v-if="item.quantity >= MAX_QUANTITY_PER_PRODUCT" class="qty-limit-note">
                  Máximo {{ MAX_QUANTITY_PER_PRODUCT }} unidades por producto
                </p>
              </div>
              <div class="cart-item-subtotal">
                <button
                  @click="$emit('remove-from-cart', item.name)"
                  class="remove-btn"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <div class="subtotal-container">
                  <span class="subtotal-label">Subtotal</span>
                  <span class="subtotal-value">{{
                    formatPrice(item.priceNum * item.quantity)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-empty" v-else>
          <i class="fas fa-box-open"></i>
          <p>Tu carrito está vacío</p>
          <button class="continue-shopping-btn" @click="$emit('close')">Seguir Comprando</button>
        </div>

        <div class="cart-footer" v-if="cart.length > 0">
          <div class="promo-code-container" v-if="!appliedPromo">
            <input
              type="text"
              v-model="promoInput"
              placeholder="Código promocional"
              class="promo-input"
              @keyup.enter="handleApplyPromo"
            />
            <button class="promo-btn" @click="handleApplyPromo">Aplicar</button>
          </div>
          <div class="promo-applied-container" v-else>
            <i class="fas fa-tags" style="color: #fbbf24"></i>
            <span>¡Código NIVEL_RETRO aplicado (-20%)!</span>
          </div>

          <div class="cart-total-container">
            <span class="total-label">TOTAL:</span>
            <div class="total-values">
              <span class="total-old" v-if="appliedPromo">{{ formatPrice(cartTotal) }}</span>
              <span class="total-value">{{ formatPrice(cartFinalTotal) }}</span>
            </div>
          </div>
          <button class="checkout-btn" @click="$emit('checkout')">Finalizar Compra</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

import { MAX_QUANTITY_PER_PRODUCT } from '../composables/useCart.js';

defineProps({
  show: Boolean,
  cart: { type: Array, default: () => [] },
  cartTotal: { type: Number, default: 0 },
  cartFinalTotal: { type: Number, default: 0 },
  appliedPromo: { type: String, default: null },
  formatPrice: { type: Function, default: (value) => String(value) },
});

const emit = defineEmits([
  'close',
  'checkout',
  'update-quantity',
  'remove-from-cart',
  'apply-promo',
]);

const promoInput = ref('');

const handleApplyPromo = () => {
  if (promoInput.value.trim()) {
    emit('apply-promo', promoInput.value);
  }
};
</script>

<style scoped>
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
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
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
  transition:
    color 0.2s,
    transform 0.2s;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-left: 6px solid #3b82f6;
}

.cart-item-img {
  width: 75px;
  height: auto;
  max-height: 100px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
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
  background-color: #1e293b;
  border: 1px solid #334155;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
}

.qty-btn:hover {
  background-color: #3b82f6;
  border-color: #60a5fa;
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-limit-note {
  margin: 6px 0 0;
  font-size: 0.75rem;
  color: #fbbf24;
}

.qty-value {
  font-weight: bold;
  font-size: 1.2rem;
  min-width: 25px;
  text-align: center;
  font-family: 'Oswald', sans-serif;
  color: #fff;
}

.cart-item-subtotal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 90px;
  border-left: 1px solid #334155;
  padding-left: 15px;
}

.subtotal-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.remove-btn {
  background-color: #e11d48;
  border: none;
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(225, 29, 72, 0.3);
}

.remove-btn:hover {
  background-color: #be123c;
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 6px 10px rgba(225, 29, 72, 0.4);
}

.subtotal-label {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: -2px;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.subtotal-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  color: #10b981;
  font-weight: bold;
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
  color: #334155;
}

.cart-empty p {
  font-size: 1.6rem;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 30px;
  color: #64748b;
  text-transform: uppercase;
}

.continue-shopping-btn {
  background-color: #334155;
  border: 2px solid #475569;
  color: #e2e8f0;
  padding: 14px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-family: 'Oswald', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}

.continue-shopping-btn:hover {
  background-color: #475569;
  border-color: #64748b;
  color: #fff;
  transform: translateY(-2px);
}

.cart-footer {
  padding: 25px 40px 25px 20px;
  background-color: #0d1526;
  border-top: 2px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.3);
}

.cart-total-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.total-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-old {
  font-size: 1.2rem;
  color: #ef4444;
  text-decoration: line-through;
  font-family: 'Oswald', sans-serif;
  margin-bottom: -5px;
}

.total-value {
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  color: #10b981;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.promo-code-container {
  display: flex;
  gap: 10px;
}

.promo-input {
  flex: 1;
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #f1f5f9;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
}

.promo-input:focus {
  outline: none;
  border-color: #fbbf24;
}

.promo-btn {
  background-color: #fbbf24;
  border: none;
  color: #0f172a;
  font-weight: bold;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.promo-btn:hover {
  background-color: #f59e0b;
  transform: scale(1.05);
}

.promo-applied-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(251, 191, 36, 0.1);
  padding: 12px 15px;
  border-radius: 8px;
  color: #fbbf24;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.checkout-btn {
  background-color: #10b981;
  border: none;
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 6px 20px rgba(16, 185, 129, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.checkout-btn:hover {
  background-color: #059669;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.5);
}

.checkout-btn:active {
  transform: translateY(-1px);
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .cart-modal {
    max-width: 100%;
  }

  .cart-header {
    padding: 15px 20px;
  }

  .cart-header h2 {
    font-size: 1.4rem;
  }

  .cart-body {
    padding: 15px;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px;
  }

  .cart-item-img {
    width: 60px;
  }

  .cart-item-subtotal {
    flex-direction: row;
    width: 100%;
    border-left: none;
    border-top: 1px solid #334155;
    padding-left: 0;
    padding-top: 10px;
    min-width: auto;
    align-items: center;
  }

  .cart-footer {
    padding: 15px 20px;
  }

  .total-value {
    font-size: 2rem;
  }

  .checkout-btn {
    font-size: 1.4rem;
    padding: 16px;
  }
}
</style>
