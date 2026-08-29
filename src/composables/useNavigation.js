/**
 * useNavigation.js — Section navigation.
 *
 * The store addresses its sections by short keys ('n64', 'merch', 'museum'…):
 * the map's hotspots, the mobile category bar and the navbar all speak that
 * vocabulary. This translates those keys into routes so no component has to
 * know the URL scheme.
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/** Section key → route name. */
const SECTION_ROUTES = {
  n64: 'console-n64',
  gc: 'console-gc',
  wii: 'console-wii',
  ps1: 'console-ps1',
  ps2: 'console-ps2',
  ps3: 'console-ps3',
  music: 'music',
  magazine: 'magazine',
  merch: 'merch',
  museum: 'museum',
  counter: 'counter',
  catalog: 'catalog',
};

export function useNavigation() {
  const router = useRouter();
  const route = useRoute();

  const currentView = computed(() => route.name);
  const isImmersive = computed(() => route.meta.immersive === true);

  const goToSection = (key) => {
    const name = SECTION_ROUTES[key];
    if (name) router.push({ name });
  };

  const goHome = () => router.push({ name: 'store' });

  const goToAbout = (seccion) => router.push({ name: 'about', params: { seccion: seccion || '' } });

  const goToCounter = (tab = 'perfil') => router.push({ name: 'counter', params: { tab } });

  const goToArcade = (juego) => router.push({ name: 'arcade', params: { juego } });

  /**
   * Deep-link to a single item. Games live on a console shelf, merchandise in
   * the merch aisle; both open with the item already selected.
   */
  const goToGame = (view, game) => {
    if (view === 'merch') {
      return router.push({ name: 'merch', query: { producto: game } });
    }
    const name = SECTION_ROUTES[view];
    if (name) router.push({ name, query: { juego: game } });
  };

  const checkout = (showCartRef) => {
    if (showCartRef) showCartRef.value = false;
    return goToCounter('carrito');
  };

  return {
    currentView,
    isImmersive,
    goToSection,
    goHome,
    goToAbout,
    goToCounter,
    goToArcade,
    goToGame,
    checkout,
  };
}
