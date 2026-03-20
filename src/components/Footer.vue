<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo-section">
        <img src="../assets/img/Nivel Retro 1.png" alt="Nivel Retro Logo" class="footer-logo" />
      </div>
      
      <div class="footer-center-section">
        <div class="footer-links-row">
          <a href="#">Contacto</a>
          <a href="#">Nuestra historia</a>
          <a href="#">Estado de pedido</a>
          <a href="#">Preguntas Frecuentes</a>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Nivel Retro. Todos los derechos reservados.</p>
        </div>
      </div>

      <div class="footer-social-section">
        <div class="social-icons">
          <a href="#" class="social-icon" title="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-icon" title="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
        <h3 class="social-heading">SÍGUENOS</h3>
      </div>
    </div>
  </footer>
</template>

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
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
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
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-links-row a {
  color: #8ca3c3;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.95rem; /* slightly larger to match image */
  font-weight: 500;
}

.footer-links-row a:hover {
  color: #cbd5e1;
}

.footer-bottom {
  text-align: center;
  font-size: 0.75rem; 
  color: #64748b; /* darker color like image */
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

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; 
  height: 32px;
  background-color: #1e293b; 
  color: #cbd5e1;
  border-radius: 50%;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.social-icon:hover {
  background-color: #3b82f6; 
  color: white;
  transform: translateY(-2px);
}

.social-heading {
  color: #f1f5f9;
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
