/**
 * router/index.js — Routes for the store.
 *
 * Every section of the store has its own URL, so the browser's back button, a
 * refresh and a shared link all behave the way visitors expect. Paths are in
 * Spanish to match the interface.
 *
 * Only the store map is bundled eagerly; every other view is loaded on demand.
 */
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import StoreMap from '../components/StoreMap.vue';
import { arcadeData } from '../data/arcadeData.js';

/**
 * The six console shelves are separate components because each carries its own
 * descriptive copy, but their routes differ only by slug — so they are
 * generated rather than written out six times.
 */
export const CONSOLES = [
  { slug: 'n64', component: () => import('../components/N64Shelf.vue') },
  { slug: 'gc', component: () => import('../components/GCShelf.vue') },
  { slug: 'wii', component: () => import('../components/WiiShelf.vue') },
  { slug: 'ps1', component: () => import('../components/PS1Shelf.vue') },
  { slug: 'ps2', component: () => import('../components/PS2Shelf.vue') },
  { slug: 'ps3', component: () => import('../components/PS3Shelf.vue') },
];

const routes = [
  {
    path: '/',
    name: 'store',
    component: StoreMap,
    // The isometric map owns the whole viewport and handles its own panning, so
    // the shell locks page scrolling while it is on screen.
    meta: { immersive: true },
  },

  ...CONSOLES.map(({ slug, component }) => ({
    path: `/consola/${slug}`,
    name: `console-${slug}`,
    component,
    props: (route) => ({ preselectedGame: route.query.juego ?? null }),
  })),

  {
    path: '/catalogo',
    name: 'catalog',
    component: () => import('../components/Catalog.vue'),
  },
  {
    path: '/nosotros/:seccion(historia|contacto|faq)?',
    name: 'about',
    component: () => import('../components/About.vue'),
    props: (route) => ({ section: route.params.seccion || null }),
  },
  {
    path: '/musica',
    name: 'music',
    component: () => import('../components/BaseMusic.vue'),
  },
  {
    path: '/revistas',
    name: 'magazine',
    component: () => import('../components/BaseMagazine.vue'),
  },
  {
    path: '/merch',
    name: 'merch',
    component: () => import('../components/MerchShelf.vue'),
    props: (route) => ({ preselectedId: route.query.producto ?? null }),
  },
  {
    path: '/museo',
    name: 'museum',
    component: () => import('../components/BaseMuseum.vue'),
  },
  {
    path: '/cuenta/:tab(pedidos|perfil|carrito)?',
    name: 'counter',
    component: () => import('../components/BaseCounter.vue'),
    props: (route) => ({ initialTab: route.params.tab || 'perfil' }),
    meta: { needsCart: true },
  },
  {
    path: '/arcade/:juego(pacman|donkeykong)',
    name: 'arcade',
    component: () => import('../components/BaseArcade.vue'),
    props: (route) => ({ show: true, ...arcadeData[route.params.juego] }),
  },

  // Anything unrecognised drops the visitor at the front door rather than on a
  // blank screen.
  { path: '/:pathMatch(.*)*', redirect: { name: 'store' } },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Going back should land where the visitor left off; a fresh view starts at
    // the top. `About` scrolls itself to the requested section.
    if (savedPosition) return savedPosition;
    if (to.params.seccion) return false;
    return { top: 0 };
  },
});

/*
 * The pixel-block wipe between sections lives in App.vue, but it has to run
 * around navigation. App registers the component instance here and the guards
 * below drive it, which keeps the transition out of every call site.
 */
let transition = null;

export const registerTransition = (instance) => {
  transition = instance;
};

/**
 * Cosmetic effects must never be able to block navigation, so both phases are
 * capped: if the overlay misbehaves, the route change proceeds regardless.
 */
const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

router.beforeEach(async (to, from) => {
  // No wipe on the very first paint — there is nothing to wipe away yet.
  if (!from.name || !transition) return true;
  try {
    await withTimeout(transition.cover(), 1200);
  } catch {
    // Swallow: a failed wipe is a visual glitch, not a reason to strand the
    // visitor on the page they were leaving.
  }
  return true;
});

router.afterEach(async (to, from) => {
  if (!from.name || !transition) return;
  // Let the incoming view paint underneath the cover before lifting it.
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));
  try {
    await withTimeout(transition.reveal(), 1200);
  } catch {
    // Same reasoning: never leave the overlay stuck over the new view.
  }
});

export default router;
