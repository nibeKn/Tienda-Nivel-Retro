<h1 align="center">Nivel Retro</h1>

<p align="center">
  Una tienda de videojuegos de los 2000 recreada como un entorno isométrico explorable.
</p>

<p align="center">
  <a href="https://tienda-nivel-retro.netlify.app/"><strong>Ver demo en vivo →</strong></a>
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Vue Router" src="https://img.shields.io/badge/Vue_Router-5-42b883?logo=vue.js&logoColor=white">
  <img alt="CSS vanilla" src="https://img.shields.io/badge/CSS-vanilla-264de4">
  <img alt="Licencia MIT" src="https://img.shields.io/badge/licencia-MIT-blue">
</p>

> **English:** An interactive single-page app that recreates a 2000s video game
> store as an explorable isometric scene. Built with Vue 3 and Vite, with no UI
> framework — the layered scene, the pan/zoom navigation and every component are
> hand-written CSS. The interface and content are in Spanish.

---

## Qué es

No es una landing con un catálogo. Es una tienda que se recorre: el visitante
entra a una escena isométrica construida por capas, la desplaza y hace zoom, y al
acercarse a una estantería entra a la sección correspondiente.

El resultado es un catálogo navegable de seis consolas (Nintendo 64, GameCube,
Wii, PS1, PS2 y PS3) montado sobre una metáfora espacial en vez de un menú.

**Es un proyecto de portfolio.** Los productos, precios, pedidos y el proceso de
compra son simulados; no hay pasarela de pago ni backend.

## Características

- **Escena isométrica navegable** — paneo con mouse y con el dedo, zoom con rueda
  y con gesto de pellizco, con límites recalculados según el nivel de zoom.
- **Carga progresiva por capas** — cada mueble y estantería empieza como una
  miniatura borrosa y se sustituye por su versión en alta resolución cuando
  termina de descargar, coordinada por un manifiesto de posiciones.
- **Zonas interactivas** — las estanterías responden al cursor con `clip-path`
  recortado a la silueta del mueble, no a un rectángulo.
- **Catálogo detallado** — fichas técnicas, galerías de cajas 3D, discos y
  cartuchos, y vídeo de cada título.
- **Carrito funcional** — cantidades, totales, código promocional y resumen de
  compra, resuelto con un composable reutilizable.
- **Secciones temáticas** — arcades enlazados, museo de consolas, reproductor de
  música, hemeroteca de revistas y sección de merchandising.
- **Onboarding contextual** — la primera visita recibe una guía de gestos
  distinta en escritorio y en móvil.

## Stack

| Herramienta | Rol |
|---|---|
| **Vue 3** (Composition API, `<script setup>`) | Componentes y estado |
| **Vue Router 5** | Una URL por sección, con carga diferida por ruta |
| **Vite 8** | Build, servidor de desarrollo y plugin propio de preload |
| **CSS3 puro** | Maquetación isométrica, animaciones y transiciones |
| **tsParticles** | Partículas ambientales de la escena |
| **ESLint + Prettier** | Linting y formato (`eslint.config.js` plano) |

Sin Tailwind, sin Bootstrap y sin librería de componentes: todo el diseño está
escrito a mano.

## Arquitectura

```
src/
├── components/
│   ├── StoreMap.vue        Escena isométrica, capas, zonas y navegación
│   ├── BaseShelf.vue       Estantería genérica; las 6 consolas la configuran
│   ├── Base*.vue           Vistas temáticas (arcade, museo, música, revistas…)
│   └── …
├── composables/
│   ├── useStoreMap.js      Paneo, zoom, pinch, parallax y límites
│   ├── useCart.js          Carrito, totales y promociones
│   └── useNavigation.js    Traduce claves de sección a rutas
├── router/
│   └── index.js            Rutas, carga diferida y transición entre vistas
├── data/                   Catálogos de juegos y merchandising
└── assets/
    └── imagenes-tienda/    Capas de la tienda + layers-manifest.json
```

Tres decisiones que vale la pena destacar:

**Cada sección tiene su propia URL.** `/consola/ps2`, `/museo`, `/nosotros/faq`
o `/arcade/pacman` se pueden compartir, recargar y recorrer con el botón atrás
del navegador. La transición de bloques entre secciones vive en los guards del
router, así que ninguna vista tiene que orquestarla. Salvo el mapa de la tienda,
todas las rutas se cargan bajo demanda.

**Las estanterías comparten un solo componente.** `BaseShelf.vue` recibe colores,
espaciados, logo y configuración de botones por props, y el contenido descriptivo
por slot. `N64Shelf.vue` y sus cinco hermanos son sólo configuración.

**La escena se describe en un manifiesto.** `layers-manifest.json` guarda la
posición, el tamaño y el placeholder de cada capa, así que añadir un mueble a la
tienda es añadir una entrada al JSON, no tocar el CSS.

### Sobre las imágenes del catálogo

Las ~380 fotos de producto y carátulas se sirven desde el Cloudinary propio del
proyecto, no desde los sitios donde se encontraron originalmente. Enlazarlas en
caliente consumía ancho de banda de tiendas que nunca lo autorizaron, y dejaba el
catálogo a merced de que cualquiera de esos hosts rotara una URL. Todas se
entregan con `f_auto,q_auto`, así que el navegador recibe WebP o AVIF según lo
que soporte, en la resolución que corresponde.

## Rendimiento

La escena es el producto, así que el trabajo estuvo en servir la misma imagen
pesando mucho menos, no en recortarla.

| | Antes | Después |
|---|---|---|
| Peso total de la página | 11.761 KB | **1.549 KB** |
| Largest Contentful Paint | 49,5 s | **10,7 s** |
| First Contentful Paint | 4,0 s | **2,2 s** |
| Speed Index | 4,0 s | **2,5 s** |
| Cumulative Layout Shift | 0,047 | **0,006** |

Y las cuatro categorías de Lighthouse:

| Categoría | Antes | Después |
|---|---|---|
| Rendimiento | 65 | **71** |
| Accesibilidad | 79 | **100** |
| Buenas prácticas | — | **96** |
| SEO | — | **100** |

<sub>Lighthouse 12, perfil móvil con throttling simulado, sobre el build de producción.</sub>

Qué se hizo:

- **Imágenes servidas al tamaño en que se usan.** El fondo se emite en tres
  anchos (1400/2200/3200) y se declara con `srcset`, así que un teléfono descarga
  87 KB donde un escritorio toma 451 KB. Las capas se reencodearon a WebP q82:
  indistinguibles al máximo zoom, a menos de la mitad del peso.
- **El LCP se descubre desde el HTML.** Un plugin de Vite lee el nombre hasheado
  del fondo tras el build e inyecta su `<link rel="preload" imagesrcset>`, para
  que la descarga arranque junto al JavaScript y no después de que Vue monte.
- **App shell en `index.html`.** La pantalla de carga se pinta en el primer
  frame, antes de parsear el bundle, en lugar de dejar una página en blanco.
- **Nada bloquea el render.** Las fuentes y los iconos se cargan como `preload`
  promovido a hoja de estilo; antes eran `@import` dentro del CSS empaquetado, lo
  que los encadenaba detrás del bundle.
- **Las capas HD entran después del fondo**, para no competir por ancho de banda
  con el elemento que define el LCP.
- **Dimensiones intrínsecas en cada capa**, tomadas del manifiesto, que es lo que
  llevó el CLS a 0,006.
- **Los tres iconos de marca son SVG inline**, lo que eliminó un webfont de
  106 KB que existía sólo para ellos.

En accesibilidad, lo que llevó la categoría de 79 a 100: los controles que eran
`<div>` con `@click` pasaron a ser `<button>` reales —alcanzables por teclado y
con nombre accesible—, la navegación usa enlaces de verdad en vez de `href="#"`,
el slider de zoom se etiquetó, y se corrigieron los contrastes y las áreas de
toque que no llegaban al mínimo de 24 px.

El techo real está en los ~800 KB de ilustración original de la tienda. Bajar de
ahí significaría degradar el arte, que es justamente lo que sostiene el proyecto.

## Ejecutar el proyecto

Requiere Node.js `^20.19.0` o `>=22.12.0` (lo que exige Vite 8).

```bash
git clone https://github.com/nibeKn/Tienda-Nivel-Retro.git
```

```bash
npm install
```

```bash
npm run dev
```

El servidor de desarrollo queda en `http://localhost:5173/`.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm run lint:fix` | Corrige automáticamente lo que se pueda |
| `npm run format` | Formatea con Prettier |


## Aviso legal

Proyecto personal de portfolio, sin fines comerciales y sin relación con ninguna
tienda real.

- Los productos, precios, stock, pedidos y usuarios que aparecen en el sitio son
  **ficticios**. No se procesan pagos ni se recogen datos de nadie.
- Nintendo, PlayStation, Nintendo 64, GameCube, Wii, y los nombres, logotipos y
  carátulas de los videojuegos mostrados son **marcas registradas de sus
  respectivos propietarios**. Se usan de forma ilustrativa y educativa, sin
  autorización ni patrocinio de dichos titulares.
- Si eres titular de alguno de los materiales y quieres que se retire, abre un
  issue en el repositorio.

## Licencia

El **código fuente** se publica bajo licencia [MIT](LICENSE): puedes usarlo,
modificarlo y redistribuirlo manteniendo el aviso de copyright y la atribución.

Las **ilustraciones originales** de la tienda (`src/assets/imagenes-tienda/`,
`src/assets/posters/` y `src/assets/ico/`) son © 2026 nibeKn, todos los derechos
reservados, y quedan fuera de la licencia MIT: no se autoriza su reutilización en
otros proyectos.
