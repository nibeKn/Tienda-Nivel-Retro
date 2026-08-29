<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo-section">
        <RouterLink :to="{ name: 'store' }" aria-label="Nivel Retro — ir a la tienda">
          <img
            src="https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_400/v1786409010/Nivel_Retro_1_t5qg6m.png"
            alt=""
            class="footer-logo"
            loading="lazy"
            decoding="async"
          />
        </RouterLink>
      </div>

      <div class="footer-center-section">
        <nav class="footer-links-row" aria-label="Enlaces del pie de página">
          <RouterLink :to="{ name: 'about', params: { seccion: 'historia' } }"
            >NUESTRA HISTORIA</RouterLink
          >
          <RouterLink :to="{ name: 'about', params: { seccion: 'contacto' } }">CONTACTO</RouterLink>
          <RouterLink :to="{ name: 'about', params: { seccion: 'faq' } }"
            >PREGUNTAS FRECUENTES</RouterLink
          >
          <RouterLink :to="{ name: 'counter', params: { tab: 'pedidos' } }" class="highlight-link"
            >ESTADO DE PEDIDO</RouterLink
          >
        </nav>
        <div class="footer-bottom">
          <p>&copy; 2026 Nivel Retro. Todos los derechos reservados.</p>
        </div>
      </div>

      <div class="footer-social-section">
        <div class="social-icons">
          <span v-for="social in socials" :key="social.name" class="social-icon">
            <svg :viewBox="social.viewBox" class="social-svg" aria-hidden="true" focusable="false">
              <path :d="social.path" fill="currentColor" />
            </svg>
          </span>
        </div>
        <h3 class="social-heading">SÍGUENOS</h3>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';

// Decorative only. This is a mock storefront with no real accounts behind it, so
// the icons are rendered as inert marks rather than links to nowhere — and they
// stay out of the accessibility tree instead of announcing themselves as
// actionable. Inline SVG rather than Font Awesome's brand set, which pulled a
// 106 KB webfont for these three glyphs alone.
const socials = [
  {
    name: 'Facebook',
    viewBox: '0 0 320 512',
    path: 'M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z',
  },
  {
    name: 'Instagram',
    viewBox: '0 0 448 512',
    path: 'M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
  },
  {
    name: 'TikTok',
    viewBox: '0 0 448 512',
    path: 'M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z',
  },
];
</script>

<style scoped>
.footer {
  background-color: #0c1627;
  color: #8ca3c3;
  padding: 15px 40px;
  font-family: 'Roboto', sans-serif;
  z-index: 50;
  position: relative;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-logo-section {
  flex: 1;
}

.footer-logo {
  max-width: 140px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.footer-center-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-links-row {
  display: flex;
  gap: 60px;
  justify-content: center;
  flex-wrap: nowrap; /* Asegura una sola fila */
}

.footer-links-row a {
  color: #8ca3c3;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  /* Lifts the tap target to the 24px minimum without changing the layout. */
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 6px 4px;
}

.footer-links-row a:focus-visible {
  outline: 2px solid #fbd38d;
  outline-offset: 2px;
  border-radius: 4px;
}

.footer-links-row a:hover {
  color: #cbd5e1;
}

.footer-bottom {
  text-align: center;
  font-size: 0.75rem;
  /* #64748b only reached 3.81:1 against #0c1627; this clears AA at 5.23:1. */
  color: #7b8ba3;
}
.footer-bottom p {
  margin: 0;
}

.footer-social-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-svg {
  width: 1em;
  height: 1em;
  display: block;
}

/* Inert marks, so no pointer cursor and no hover affordance promising a click
   that does not exist. */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #1e293b;
  color: #cbd5e1;
  border-radius: 50%;
  font-size: 0.95rem;
}

.social-heading {
  color: #f1f5f9;
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.highlight-link {
  color: #f1f5f9 !important;
}

/* --- Mobile Responsive --- */
@media (max-width: 768px) {
  .footer {
    padding: 10px 5px 8px; /* Reducido drásticamente para menor altura */
  }

  .footer-logo-section {
    display: none;
  }

  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .footer-center-section {
    display: contents;
  }

  .footer-social-section {
    order: 1;
    flex: 0 0 auto;
    margin-right: 12px;
  }

  .social-heading {
    display: none;
  }

  .social-icons {
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
  }

  .social-icon {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }

  .footer-links-row {
    order: 2;
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: column;
    gap: 4px 12px;
    align-items: center;
  }

  .footer-links-row a {
    font-size: 0.65rem;
    white-space: nowrap;
    text-align: center;
    line-height: 1;
  }

  .footer-bottom {
    order: 3;
    width: 100%;
    margin-top: 8px;
    font-size: 0.55rem;
    text-align: center;
  }
}
</style>
