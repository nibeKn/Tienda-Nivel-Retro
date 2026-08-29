import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import Particles from '@tsparticles/vue3';

createApp(App)
  .use(router)
  .use(Particles, {
    // The particle engine is decorative, so its ~50 KB of plugins are pulled in
    // as a separate chunk instead of riding along in the initial bundle.
    init: async (engine) => {
      const { loadSlim } = await import('@tsparticles/slim');
      await loadSlim(engine);
    },
  })
  .mount('#app');
