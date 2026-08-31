<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    default: () => [],
  },
  initialTab: {
    type: String,
    default: 'pedidos',
  },
});

const emit = defineEmits(['back', 'checkout', 'open-cart']);

const activeTab = ref(props.initialTab);

import { watch } from 'vue';
watch(
  () => props.initialTab,
  (newTab) => {
    activeTab.value = newTab;
  }
);

const shippingCost = 4990;
const shippingAddress = 'Av. Providencia 1550, Providencia, Santiago, Chile';

const formatPrice = (value) => {
  return '$' + value.toLocaleString('es-CL');
};

const subtotal = computed(() => {
  return props.cart.reduce((total, item) => total + item.priceNum * item.quantity, 0);
});

const cartTotal = computed(() => {
  if (props.cart.length === 0) return 0;
  return subtotal.value + shippingCost;
});

import BaseBackground from './BaseBackground.vue';
const ProfilePicture =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409012/ProfilePicture_auefjq.jpg';

// Sample orders for the demo account. Fictional, like the rest of the store —
// but written so the panel reads as a finished screen rather than a stub.
const orders = [
  {
    id: 'NR-2087',
    status: 'en_transito',
    date: '14/08/2026',
    address: 'Av. Providencia 1550, Providencia, Santiago',
    carrier: 'Correos Chile',
    tracking: 'CL884213097',
  },
  { id: 'NR-2064', status: 'entregado', date: '02/07/2026' },
  { id: 'NR-2031', status: 'entregado', date: '19/05/2026' },
];
</script>

<template>
  <div class="counter-view">
    <BaseBackground word="RECEPCION" />

    <button class="back-btn" @click="emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <div class="counter-layout">
      <div class="left-sidebar">
        <button
          class="nav-btn"
          :class="{ active: activeTab === 'perfil' }"
          @click="activeTab = 'perfil'"
        >
          <div class="btn-icon"><i class="fas fa-user"></i></div>
          <span class="btn-text">PERFIL</span>
          <div class="btn-icon-right"><i class="far fa-user"></i></div>
        </button>

        <button
          class="nav-btn"
          :class="{ active: activeTab === 'carrito' }"
          @click="activeTab = 'carrito'"
        >
          <span class="btn-text">CARRITO ACTUAL</span>
          <div class="btn-icon-right"><i class="fas fa-shopping-cart"></i></div>
        </button>

        <button
          class="nav-btn"
          :class="{ active: activeTab === 'pedidos' }"
          @click="activeTab = 'pedidos'"
        >
          <span class="btn-text">MIS PEDIDOS</span>
          <div class="btn-icon-right"><i class="fas fa-box"></i></div>
        </button>
      </div>
      <div class="monitor-container">
        <div class="monitor-screen">
          <div class="monitor-header">
            <h2 v-if="activeTab === 'pedidos'">MIS PEDIDOS</h2>
            <h2 v-if="activeTab === 'perfil'">MI PERFIL</h2>
            <h2 v-if="activeTab === 'carrito'">CARRITO ACTUAL</h2>
          </div>

          <div class="monitor-content">
            <template v-if="activeTab === 'pedidos'">
              <div v-for="order in orders" :key="order.id" class="order-card" :class="order.status">
                <div class="order-card-header">
                  <div class="order-title">
                    PEDIDO #{{ order.id }}:
                    <span class="status-text">{{
                      order.status === 'en_transito' ? 'EN CAMINO' : 'ENTREGADO'
                    }}</span>
                  </div>
                  <div class="order-date">({{ order.date }})</div>
                </div>
                <div v-if="order.status === 'en_transito'" class="order-tracking">
                  <div class="timeline">
                    <div class="line">
                      <div class="progress-line" style="width: 75%"></div>
                    </div>
                    <div class="points">
                      <div class="point done">
                        <i class="fas fa-check-circle"></i><span>PAGO CONFIRMADO</span>
                      </div>
                      <div class="point done">
                        <i class="fas fa-check-circle"></i><span>PREPARANDO</span>
                      </div>
                      <div class="point active">
                        <i class="fas fa-truck truck-icon"></i><span>EN TRÁNSITO</span>
                      </div>
                      <div class="point pending">
                        <div class="circle-empty"></div>
                        <span>ENTREGADO</span>
                      </div>
                    </div>
                  </div>
                  <div class="tracking-details">
                    <div class="t-col">
                      <div class="lbl">Dirección de Envío:</div>
                      <div class="val">{{ order.address }}</div>
                    </div>
                    <div class="t-col">
                      <div class="lbl">Transportista:</div>
                      <div class="val">{{ order.carrier }}</div>
                    </div>
                    <div class="t-col">
                      <div class="lbl">Seguimiento:</div>
                      <div class="val">{{ order.tracking }}</div>
                      <button class="live-track-btn">VER SEGUIMIENTO EN VIVO</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="activeTab === 'perfil'">
              <div class="profile-view">
                <img
                  :src="ProfilePicture"
                  alt="Avatar del usuario"
                  class="profile-img"
                  loading="lazy"
                  decoding="async"
                />
                <h3>JUGADOR_01</h3>
                <p>Miembro desde: Marzo 2026</p>
                <div class="p-details">
                  <div class="pt-item"><span>Email:</span> anonimo@correo.com</div>
                  <div class="pt-item"><span>Puntos Actuales:</span> 19,906</div>
                </div>
                <button class="edit-btn">ACTUALIZAR DATOS</button>
              </div>
            </template>
            <template v-if="activeTab === 'carrito'">
              <div class="cart-view">
                <div v-if="cart.length === 0" class="empty-msg">
                  Tu carrito está vacío. No hay artículos para procesar.
                </div>
                <div v-else class="cart-items-list">
                  <div class="c-item" v-for="item in cart" :key="item.name">
                    <img
                      :src="item.img || item.mainImg"
                      :alt="item.name"
                      class="c-item-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="c-info">
                      <div class="c-name">{{ item.name }}</div>
                      <div class="c-qty">Cantidad: {{ item.quantity }}</div>
                    </div>
                    <div class="c-price">{{ formatPrice(item.priceNum * item.quantity) }}</div>
                  </div>
                  <div class="shipping-details-section">
                    <h4>INFORMACIÓN DE DESPACHO</h4>
                    <div class="shipping-address-box">
                      <i class="fas fa-truck"></i>
                      <div class="address-text">
                        <span class="addr-label">Enviar a:</span>
                        <span class="addr-val">{{ shippingAddress }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="cart-resume-monitor">
                    <div class="resume-row">
                      <span>Subtotal Productos:</span>
                      <span>{{ formatPrice(subtotal) }}</span>
                    </div>
                    <div class="resume-row">
                      <span>Costo de Envío:</span>
                      <span>{{ formatPrice(shippingCost) }}</span>
                    </div>
                    <div class="resume-row total-row">
                      <strong>TOTAL A PAGAR:</strong>
                      <span class="highlight">{{ formatPrice(cartTotal) }}</span>
                    </div>
                  </div>
                  <div class="checkout-footer">
                    <button class="checkout-final-btn" @click="emit('checkout')">
                      <i class="fas fa-credit-card"></i> PROCEDER AL PAGO FINAL
                    </button>
                    <p class="secure-text">
                      <i class="fas fa-lock"></i> Pago procesado de forma segura
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="right-sidebar">
        <div class="summary-card avatar-card">
          <div class="sc-title">TU AVATAR DE PERFIL:</div>
          <div class="avatar-info">
            <div class="avatar-img-container">
              <img :src="ProfilePicture" alt="Avatar" class="avatar-img" />
            </div>
            <div class="avatar-text">
              <div class="av-name">JUGADOR_01</div>
              <div class="av-points">
                Puntos actuales:<br /><span class="points-val">$19.906</span>
              </div>
            </div>
          </div>
          <button class="action-btn">EDITAR DATOS</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.counter-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 140px);
  background-color: #0d1526;
  color: #f8fafc;
  overflow: hidden;
  position: relative;
  z-index: 2;
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
  z-index: 100;
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

.counter-layout {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding: 60px 40px;
  position: relative;
  z-index: 10;
  overflow-y: auto;
}

/* Left Sidebar */
.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 250px;
}

.nav-btn {
  background-color: #2e3b55;
  border: 3px solid #1a273b;
  border-radius: 12px;
  padding: 20px 15px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.nav-btn:hover {
  transform: translateY(-2px);
  background-color: #3b4b6b;
}

.nav-btn.active {
  border-color: #fbd38d;
  box-shadow:
    0 0 15px rgba(251, 211, 141, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
}

.nav-btn.active .btn-text {
  color: #fbd38d;
}

.btn-icon,
.btn-icon-right {
  font-size: 1.8rem;
}

.btn-text {
  flex: 1;
  margin-left: 15px;
  text-transform: uppercase;
  line-height: 1.1;
}

/* Center Monitor */
.monitor-container {
  width: 950px;
  height: 650px;
  background-color: transparent;
  border-radius: 15px;
  padding: 0;
  box-shadow: none;
  position: relative;
}

.monitor-screen {
  background-color: #0d1526;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.monitor-header {
  padding: 25px;
  background-color: #161f31;
  border-bottom: 1px solid #1e293b;
}

.monitor-header h2 {
  margin: 0;
  color: white;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 1px;
  font-size: 1.8rem;
}

.monitor-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Order Cards */
.order-card {
  background-color: #273759;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #3b4d6b;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.entregado .status-text {
  color: #4ade80;
}
.en_transito .status-text {
  color: #facc15;
}

.order-date {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Tracking Timeline */
.order-tracking {
  margin-top: 25px;
}

.timeline {
  position: relative;
  margin: 20px 10px 30px;
}

.line {
  height: 4px;
  background-color: #475569;
  border-radius: 2px;
  width: 100%;
  position: absolute;
  top: 15px;
  left: 0;
  z-index: 1;
}

.progress-line {
  height: 100%;
  background-color: #eab308;
  border-radius: 2px;
}

.points {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
}

.point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #cbd5e1;
}

.point.done i {
  color: #4ade80;
  font-size: 28px;
  background: #1a2639;
  border-radius: 50%;
}
.point.active i {
  color: #eab308;
  font-size: 32px;
  background: #1a2639;
  border-radius: 50%;
  padding: 0 4px;
}

.circle-empty {
  width: 24px;
  height: 24px;
  border: 3px solid #94a3b8;
  border-radius: 50%;
  background: #1a2639;
}

.tracking-details {
  display: flex;
  background-color: #1a2639;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #3b4d6b;
  gap: 20px;
}

.t-col {
  flex: 1;
  font-size: 0.85rem;
}

.t-col .lbl {
  color: #94a3b8;
  margin-bottom: 5px;
}
.t-col .val {
  color: #f1f5f9;
  font-weight: bold;
}

.live-track-btn {
  margin-top: 10px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #475569;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}
.live-track-btn:hover {
  background: #334155;
  color: white;
}

/* Profile View */
.profile-view {
  text-align: center;
  color: #e2e8f0;
}
.profile-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid #3b82f6;
  margin-bottom: 20px;
  border-radius: 8px;
}
.profile-view h3 {
  font-family: 'Oswald';
  font-size: 2.2rem;
  margin: 0 0 10px;
}
.p-details {
  margin: 30px auto;
  max-width: 300px;
  text-align: left;
  background: #273759;
  padding: 20px;
  border-radius: 8px;
}
.pt-item {
  margin-bottom: 10px;
}
.pt-item span {
  color: #94a3b8;
  display: inline-block;
  width: 120px;
}
.edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* Cart View */
.empty-msg {
  text-align: center;
  padding: 50px;
  color: #94a3b8;
  font-size: 1.2rem;
  font-family: 'Oswald', sans-serif;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.c-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1e293b;
  padding: 12px 0;
  gap: 15px;
}

.c-item-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 4px;
}

.c-info {
  flex: 1;
}

.c-name {
  font-weight: bold;
  font-size: 1.1rem;
  font-family: 'Oswald', sans-serif;
  color: #e2e8f0;
}
.c-qty {
  color: #94a3b8;
  font-size: 0.85rem;
}
.c-price {
  font-weight: bold;
  color: #fbd38d;
  font-size: 1.2rem;
  font-family: 'Oswald', sans-serif;
}

.shipping-details-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px dashed #1e293b;
}

.shipping-details-section h4 {
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.shipping-address-box {
  background-color: #161f31;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #1e293b;
}

.shipping-address-box i {
  color: #3b82f6;
  font-size: 1.3rem;
}

.address-text {
  display: flex;
  flex-direction: column;
}

.addr-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
}

.addr-val {
  font-size: 0.95rem;
  color: #f1f5f9;
  font-weight: 500;
}

.cart-resume-monitor {
  margin-top: 25px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: #94a3b8;
}

.total-row {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #334155;
  font-size: 1.6rem;
  color: #e2e8f0;
}

.total-row .highlight {
  color: #10b981;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.checkout-footer {
  margin-top: 30px;
  text-align: center;
  padding-bottom: 20px;
}

.checkout-final-btn {
  width: 100%;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 20px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: all 0.2s;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.checkout-final-btn:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.secure-text {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Right Sidebar */
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 260px;
}

.summary-card {
  background: #0d1526;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: relative;
}

.sc-title {
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.avatar-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.avatar-img-container {
  width: 60px;
  height: 60px;
  background-color: #1e293b;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid #3b82f6;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.av-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.av-points {
  color: #94a3b8;
  font-size: 0.85rem;
}
.points-val {
  color: #fbd38d;
  font-weight: bold;
}

.cart-info {
  margin-bottom: 20px;
}
.total-text {
  font-size: 1.1rem;
  margin-top: 5px;
}
.total-val {
  color: #fbd38d;
  font-weight: bold;
}

.action-btn {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  background-color: #3b4b6b;
  color: #e2e8f0;
  border: 1px solid #4a5d85;
  transition: all 0.2s;
  margin-bottom: 10px;
}
.action-btn:last-child {
  margin-bottom: 0;
}
.action-btn:hover {
  background-color: #4a5d85;
}

.highlight-btn {
  background-color: #8b5cf6;
  color: white;
  border: none;
  background: linear-gradient(180deg, #6d42da, #4a27a0);
}
.highlight-btn:hover {
  background: linear-gradient(180deg, #7c4df2, #562db4);
}

/* Custom Scrolls */
.monitor-content::-webkit-scrollbar {
  width: 8px;
}
.monitor-content::-webkit-scrollbar-track {
  background: #0f172a;
}
.monitor-content::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .counter-view {
    height: auto;
    overflow: clip;
    flex: none;
  }

  .counter-view :deep(.pattern-bg) {
    height: 100% !important;
  }

  .back-btn {
    top: 15px;
    left: 15px;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .counter-layout {
    flex-direction: column;
    padding: 70px 10px 20px 10px;
    gap: 15px;
    justify-content: flex-start;
    align-items: center;
    overflow-y: visible;
  }

  .right-sidebar {
    display: none !important;
  }

  .left-sidebar {
    width: 100%;
    max-width: 500px;
    flex-direction: row;
    gap: 5px;
  }

  .nav-btn {
    flex: 1;
    padding: 6px 2px;
    font-size: 0.75rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0;
  }

  .btn-icon,
  .btn-icon-right {
    display: none;
  }

  .btn-text {
    flex: none;
    margin-left: 0;
    margin-top: 0;
    line-height: 1.1;
    text-align: center;
  }

  .monitor-container {
    width: 100%;
    max-width: 500px;
    height: auto;
    min-height: auto;
  }

  /* ======== Monitor Container Base ======== */
  .monitor-screen {
    padding: 15px 10px;
  }
  .monitor-header h2 {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  /* ======== Orders Section ======== */
  .order-card {
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
  }
  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  .order-tracking {
    padding: 15px 10px;
    margin-top: 15px;
  }

  .timeline {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 5px;
    margin: 15px 0;
  }
  .timeline .line {
    width: 3px;
    height: calc(100% - 40px);
    top: 20px;
    left: 20px;
    right: auto;
  }
  .timeline .progress-line {
    width: 100% !important;
    height: 75%;
  }
  .timeline .points {
    flex-direction: column;
    gap: 25px;
    width: 100%;
  }
  .point {
    flex-direction: row;
    gap: 15px;
    align-items: center;
    width: 100%;
    text-align: left;
  }

  .tracking-details {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    box-sizing: border-box;
  }
  .t-col {
    width: 100%;
  }
  .live-track-btn {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }

  /* ======== Profile Section ======== */
  .profile-img {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }
  .profile-view h3 {
    font-size: 1.5rem;
  }
  .p-details {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pt-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 0;
  }
  .pt-item span {
    width: auto;
  }
  .edit-btn {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    margin-top: 10px;
  }

  /* ======== Cart Section ======== */
  .cart-items-list {
    gap: 15px;
  }
  .c-item {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 15px 10px;
    flex-wrap: nowrap;
  }
  .c-item-img {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
  .c-info {
    flex: 1;
    min-width: 0;
  }
  .c-name {
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .c-price {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .shipping-details-section {
    padding: 15px;
  }
  .shipping-address-box {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  .address-text {
    flex-direction: column;
    gap: 5px;
  }

  .cart-resume-monitor {
    padding: 15px;
  }
  .resume-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .total-row {
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px dashed #475569;
  }

  .checkout-footer {
    padding: 0;
    margin-top: 20px;
  }
  .checkout-final-btn {
    width: 100%;
    padding: 15px;
    font-size: 1.1rem;
  }
}
</style>
