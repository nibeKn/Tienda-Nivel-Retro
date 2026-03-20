<template>
  <div class="about-container">
    <div class="header-banner">
      <button class="back-btn" @click="$emit('back')"><i class="fas fa-arrow-left"></i> VOLVER A LA TIENDA</button>
      <h1>NUESTRA HISTORIA, CONTACTO Y FAQS</h1>
    </div>

    <div class="content-wrapper">
      <section id="historia" class="about-section">
        <h2 class="section-title text-center">Nuestra Historia: Presiona Start</h2>
        <div class="history-content">
          <div class="text-block">
            <h3>El nivel donde la nostalgia cobra vida</h3>
            <p>¿Recuerdas la emoción de entrar a tu tienda de videojuegos favorita un viernes por la tarde? Ese momento en el que caminabas por los pasillos, maravillándote con las cajas de Nintendo 64 y leyendo la contraportada de ese título de PlayStation que tanto querías. En Nivel Retro, nacimos exactamente de ese sentimiento. Queríamos rescatar la magia de vitrinear y devolverle el encanto a la búsqueda de tus juegos favoritos.</p>
            
            <h3>Construyendo nuestro propio refugio</h3>
            <p>Cansados de los catálogos en línea fríos y aburridos, decidimos diseñar y visualizar nuestro propio espacio virtual. Hemos cuidado cada rincón de esta tienda interactiva para que se sienta como un viaje en el tiempo a la era dorada del Y2K. Aquí no solo haces clics; aquí recorres pasillos, exploras estanterías organizadas por consola y te reencuentras con las joyas físicas que marcaron a toda una generación de gamers.</p>
            
            <h3>Nuestra misión</h3>
            <p>Ya sea que busques revivir tus tardes de GameCube, completar tu colección de PS2 o simplemente llevarte una polera de tu saga favorita, nuestro objetivo es simple: preservar la historia del formato físico y celebrar la cultura que nos formó.</p>

            <p class="highlight-text">Toma el mando, recorre nuestra tienda y prepárate para volver a jugar. ¡Bienvenido al siguiente nivel!</p>
          </div>
          <div class="image-block">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" alt="Retro Gaming Setup" class="history-img" />
          </div>
        </div>
      </section>

      <section id="contacto" class="about-section dark-bg">
        <h2 class="section-title text-center">Contáctanos</h2>
        <div class="contact-form-container">
          <form @submit.prevent="submitContact" class="contact-form">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text" id="name" required placeholder="Tu nombre..." />
            </div>
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input type="email" id="email" required placeholder="tuemail@ejemplo.com" />
            </div>
            <div class="form-group">
              <label for="message">Mensaje</label>
              <textarea id="message" rows="5" required placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" class="submit-btn"><i class="fas fa-paper-plane"></i> ENVIAR MENSAJE</button>
          </form>
        </div>
      </section>

      <section id="faq" class="about-section">
        <h2 class="section-title text-center">Preguntas Frecuentes</h2>
        <div class="faq-container">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ active: activeFaq === index }">
            <button class="faq-question" @click="toggleFaq(index)">
              <span>{{ faq.question }}</span>
              <i class="fas fa-chevron-down faq-icon"></i>
            </button>
            <div class="faq-answer-wrapper">
              <p class="faq-answer">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  section: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['back']);

const activeFaq = ref(null);

const faqs = [
  { question: "¿Venden juegos físicos u originales?", answer: "Sí, todos nuestros juegos son formatos físicos, 100% originales y son rigurosamente testeados antes de ser publicados en la tienda." },
  { question: "¿Hacen envíos a todo el país?", answer: "Hacemos envíos a todas las regiones mediante agencias de correos certificados, asegurando que tu juego llegue en perfectas condiciones y bien embalado." },
  { question: "¿Tienen garantía los juegos retro?", answer: "Ofrecemos una garantía de 30 días para cubrir cualquier falla mecánica o de lectura de fábrica. No cubre mala manipulación." },
  { question: "¿Compran consolas y juegos usados?", answer: "Sí, evaluamos tu colección de consolas y juegos retro, y la podemos recibir en parte de pago o comprarla directamente. Escríbenos por el formulario de contacto para más detalles." },
  { question: "¿Los juegos vienen con su manual original?", answer: "En la descripción de cada juego detallamos específicamente qué incluye (caja, manual, insertos). Nuestro objetivo es ser lo más transparentes posible con el estado de cada joya." }
];

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const submitContact = () => {
  alert('¡Mensaje enviado! Te responderemos a la brevedad.');
};

const scrollToSection = (sectionId) => {
  if (!sectionId) return;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  if (props.section) {
    setTimeout(() => {
      scrollToSection(props.section);
    }, 100);
  }
});

watch(() => props.section, (newSection) => {
  if (newSection) {
    scrollToSection(newSection);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.about-container {
  font-family: 'Roboto', sans-serif;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #0f172a;
}

.header-banner {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 30px 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 3px solid #3b82f6;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.back-btn {
  background-color: #334155;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background-color: #475569;
  transform: translateX(-3px);
}

.header-banner h1 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  color: #f1f5f9;
  letter-spacing: 1px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 60px;
}

.about-section {
  padding: 60px 40px;
}

.dark-bg {
  background-color: #1e293b;
  border-radius: 12px;
  margin: 0 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.section-title {
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  color: #fbbf24;
  margin-top: 0;
  margin-bottom: 40px;
  border-bottom: 2px solid #334155;
  padding-bottom: 10px;
}

.text-center {
  text-align: center;
  border-bottom: none;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.text-block {
  width: 100%;
}

.text-block h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #3b82f6;
  margin-top: 0;
  margin-bottom: 20px;
}

.text-block p {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #cbd5e1;
  margin-bottom: 30px;
}

.highlight-text {
  font-weight: 700;
  color: #fbbf24 !important;
  font-size: 1.5rem !important;
  padding-top: 15px;
}

.image-block {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  border: 4px solid #334155;
}

.history-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-block:hover .history-img {
  transform: scale(1.05);
}

.contact-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #94a3b8;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #475569;
  background-color: #0f172a;
  color: #f1f5f9;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 1px;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item {
  background-color: #1e293b;
  border-radius: 10px;
  border: 1px solid #334155;
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #f1f5f9;
  font-family: 'Roboto', sans-serif;
  font-size: 1.15rem;
  font-weight: bold;
  text-align: left;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.faq-icon {
  color: #94a3b8;
  transition: transform 0.3s;
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
  color: #3b82f6;
}

.faq-answer-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.faq-item.active .faq-answer-wrapper {
  max-height: 200px; 
}

.faq-answer {
  padding: 0 25px 25px 25px;
  margin: 0;
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
