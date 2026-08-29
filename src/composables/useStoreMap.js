/**
 * useStoreMap.js — Isometric store map composable
 *
 * Handles pan, zoom, hover state, and the layer system using manifest positions.
 * Hit zones are handled with HTML elements + clip-path polygon in StoreMap.vue.
 */
import { ref, computed, watch, onScopeDispose } from 'vue';

export function useStoreMap() {
  const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;
  const scale = ref(getIsMobile() ? 0.9 : 0.7); // Will be modified by triggerEntryAnimation on first load
  const panX = ref(0);
  const panY = ref(0);
  const isDragging = ref(false);
  const hasDraggedStore = ref(false);
  const hoveredStand = ref(null);

  // Drag origin and pinch distance tracking (non-rendered state)
  const startX = ref(0);
  const startY = ref(0);
  const lastPinchDist = ref(0);

  const isAnimatingEntry = ref(false);

  const triggerEntryAnimation = () => {
    isAnimatingEntry.value = false;
    scale.value = getIsMobile() ? 0.5 : 0.3;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isAnimatingEntry.value = true;
        scale.value = getIsMobile() ? 0.9 : 0.7;

        setTimeout(() => {
          isAnimatingEntry.value = false;
        }, 2500);
      });
    });
  };

  const parallaxX = ref(0);
  const parallaxY = ref(0);

  const onMouseMoveParallax = (e) => {
    if (isDragging.value) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const diffX = e.clientX - centerX;
    const diffY = e.clientY - centerY;

    // Apply a very small factor so the parallax is subtle
    parallaxX.value = -diffX * 0.03;
    parallaxY.value = -diffY * 0.03;
  };

  const isZooming = ref(false);

  const zoomToLayer = (layerId, manifest, baseWidth, baseHeight) => {
    return new Promise((resolve) => {
      const info = manifest[layerId];
      if (!info || !manifest.base) {
        resolve();
        return;
      }

      isZooming.value = true;

      const cx = (info.x - manifest.base.x + info.width / 2) / manifest.base.width;
      const cy = (info.y - manifest.base.y + info.height / 2) / manifest.base.height;

      scale.value = 1.35; // Target scale

      panX.value = (0.5 - cx) * baseWidth;
      panY.value = (0.5 - cy) * baseHeight;

      setTimeout(() => {
        isZooming.value = false;
        resolve();
      }, 1000);
    });
  };

  const startDrag = (e) => {
    isDragging.value = true;
    hasDraggedStore.value = false;
    startX.value = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY.value = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onDrag = (e) => {
    if (!isDragging.value) return;
    hasDraggedStore.value = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = clientX - startX.value;
    const dy = clientY - startY.value;

    panX.value += dx / scale.value;
    panY.value += dy / scale.value;

    enforcePanLimits();

    startX.value = clientX;
    startY.value = clientY;
  };

  const endDrag = () => {
    isDragging.value = false;
    setTimeout(() => (hasDraggedStore.value = false), 50);
  };

  // Tracked in a ref rather than read inside a computed: `window.innerWidth` is
  // not reactive, so a computed over it would cache the first result forever
  // and leave the zoom limits stale after a rotate or resize.
  const isMobileViewport = ref(getIsMobile());

  const scaleLimits = computed(() =>
    isMobileViewport.value ? { min: 1.1, max: 4.0 } : { min: 0.3, max: 1.5 }
  );

  const onWheel = (e) => {
    e.preventDefault();
    const zoomFactor = -e.deltaY * 0.001;
    const limits = scaleLimits.value;
    const newScale = Math.min(Math.max(limits.min, scale.value + zoomFactor), limits.max);
    scale.value = Number(newScale.toFixed(2));
    enforcePanLimits();
  };

  const enforcePanLimits = () => {
    if (typeof window === 'undefined') return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // The image is `width: 100%; height: auto`, so at scale = 1 it spans the
    // viewport width. PAN_ENVELOPE_RATIO is a tuning value, not the artwork's
    // true aspect ratio (the base layer is ~0.82) — it was dialled in by hand
    // against how the shelves sit in frame, so changing it changes the feel.
    const PAN_ENVELOPE_RATIO = 2160 / 3840;
    const imgWidth = viewportWidth;
    const imgHeight = viewportWidth * PAN_ENVELOPE_RATIO;

    let limitX = (imgWidth - viewportWidth / scale.value) / 2;
    let limitY = (imgHeight - viewportHeight / scale.value) / 2;

    // Strictly lock horizontal to image bounds (prevent left/right edges from entering)
    limitX = Math.max(0, limitX);

    // For vertical, increase the mobility limit significantly.
    // Adding half the viewport height as a buffer allows users to pan
    // past the strict image bounds to comfortably see the top/bottom shelves.
    limitY = Math.abs(limitY) + (viewportHeight / scale.value) * 0.5;

    panX.value = Math.max(-limitX, Math.min(limitX, panX.value));
    panY.value = Math.max(-limitY, Math.min(limitY, panY.value));
  };

  watch(scale, enforcePanLimits);

  const onViewportResize = () => {
    isMobileViewport.value = getIsMobile();
    enforcePanLimits();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onViewportResize);
    onScopeDispose(() => window.removeEventListener('resize', onViewportResize));
  }

  const getDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      startDrag(e);
    } else if (e.touches.length === 2) {
      isDragging.value = false;
      lastPinchDist.value = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging.value) {
      onDrag(e);
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getDistance(e.touches[0], e.touches[1]);
      if (lastPinchDist.value > 0) {
        const pinchDelta = (dist - lastPinchDist.value) * 0.005;
        const limits = scaleLimits.value;
        const newScale = Math.min(Math.max(limits.min, scale.value + pinchDelta), limits.max);
        scale.value = Number(newScale.toFixed(2));
        enforcePanLimits();
      }
      lastPinchDist.value = dist;
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) {
      lastPinchDist.value = 0;
    }
    if (e.touches.length === 0) {
      endDrag();
    }
  };

  const imageTransform = computed(() => {
    let transition = 'transform 0.15s ease-out';
    if (isDragging.value) {
      transition = 'none';
    } else if (isZooming.value) {
      transition = 'transform 1s ease-in-out';
    } else if (isAnimatingEntry.value) {
      transition = 'transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)'; // Smooth and cinematic
    }

    return {
      transform: `scale(${scale.value}) translate(${panX.value + parallaxX.value}px, ${panY.value + parallaxY.value}px)`,
      transition,
      cursor: isDragging.value ? 'grabbing' : 'grab',
    };
  });

  return {
    scale,
    panX,
    panY,
    isDragging,
    hasDraggedStore,
    hoveredStand,
    isZooming,
    isAnimatingEntry,
    triggerEntryAnimation,
    startDrag,
    onDrag,
    endDrag,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseMoveParallax,
    zoomToLayer,
    imageTransform,
    scaleLimits,
  };
}
