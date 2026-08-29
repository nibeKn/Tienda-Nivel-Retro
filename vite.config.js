import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * The isometric store background is the page's Largest Contentful Paint, but it
 * is referenced from inside a Vue component — so the browser cannot discover it
 * until the bundle has downloaded, parsed and rendered. This plugin reads the
 * hashed filename out of the build and preloads it straight from the HTML,
 * letting the download start alongside the JavaScript instead of after it.
 */
function preloadStoreBackground() {
  let base = '/';

  return {
    name: 'preload-store-background',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {});
      const find = (pattern) => files.find((file) => pattern.test(file));

      // Mirror the srcset declared on the <img> so the preload picks the same
      // candidate the renderer will; preloading a single width would download
      // the background twice on every device that resolves to another one.
      const widths = [
        [find(/assets\/base-1400-[\w-]+\.webp$/), 1400],
        [find(/assets\/base-2200-[\w-]+\.webp$/), 2200],
        [find(/assets\/base-(?!1400|2200)[\w-]+\.webp$/), 3200],
      ].filter(([file]) => Boolean(file));

      if (widths.length === 0) return;

      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            imagesrcset: widths.map(([file, w]) => `${base}${file} ${w}w`).join(', '),
            imagesizes: '100vw',
            fetchpriority: 'high',
          },
          injectTo: 'head',
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), preloadStoreBackground()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate vendor chunk for Vue runtime
          if (id.includes('node_modules/vue') || id.includes('node_modules/@vue')) {
            return 'vendor';
          }
          // Separate data chunk for game/merch catalogs
          if (id.includes('src/data/')) {
            return 'data';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Only inline assets smaller than 4 KB; anything larger stays a separate,
    // cacheable request instead of a base64 blob inside the JS bundle.
    assetsInlineLimit: 4096,
  },
});
