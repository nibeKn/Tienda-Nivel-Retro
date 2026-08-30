<h1 align="center">Nivel Retro</h1>

<p align="center">
  A 2000s video game store, rebuilt as an explorable isometric world.
</p>

<p align="center">
  <a href="https://tienda-nivel-retro.netlify.app/"><strong>View live demo →</strong></a>
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Vue Router" src="https://img.shields.io/badge/Vue_Router-5-42b883?logo=vue.js&logoColor=white">
  <img alt="Vanilla CSS" src="https://img.shields.io/badge/CSS-vanilla-264de4">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue">
</p>

> **Note:** the site's interface and content are in Spanish. This document is in
> English so the project is easy to review for anyone.

---

## What it is

Not a landing page with a product grid. It's a store you walk through: you arrive
in a layered isometric scene, pan and zoom around it, and stepping up to a shelf
takes you into that section.

The result is a browsable catalogue of six consoles — Nintendo 64, GameCube, Wii,
PS1, PS2 and PS3 — built on a spatial metaphor instead of a menu.

**This is a portfolio project.** Products, prices, orders and the checkout flow
are simulated. There is no payment gateway and no backend.

## Features

- **Navigable isometric scene** — pan with a mouse or a finger, zoom with the
  wheel or a pinch gesture, with bounds recalculated for the current zoom level.
- **Progressive layer loading** — every shelf and cabinet starts as a blurred
  thumbnail and cross-fades to its full-resolution version once it downloads,
  coordinated by a position manifest.
- **Shaped hit zones** — shelves respond to the cursor through a `clip-path`
  traced to the furniture's silhouette, not a bounding box.
- **Detailed catalogue** — spec sheets, galleries of 3D boxes, discs and
  cartridges, plus gameplay video for each title.
- **Working cart** — quantities capped at 10 per product, running totals, a promo
  code and an order summary, all handled by a reusable composable.
- **Themed sections** — arcade cabinets, a console museum, a music player, a
  magazine archive and a merchandise aisle.
- **Contextual onboarding** — first-time visitors get a gesture guide that differs
  between desktop and mobile.

## Stack

| Tool                                          | Role                                             |
| --------------------------------------------- | ------------------------------------------------ |
| **Vue 3** (Composition API, `<script setup>`) | Components and state                             |
| **Vue Router 5**                              | One URL per section, with per-route lazy loading |
| **Vite 8**                                    | Build, dev server, and a custom preload plugin   |
| **Plain CSS3**                                | Isometric layout, animations and transitions     |
| **tsParticles**                               | Ambient particles in the scene                   |
| **ESLint + Prettier**                         | Linting and formatting (flat `eslint.config.js`) |

No Tailwind, no Bootstrap, no component library — every piece of the design is
hand-written.

## Architecture

```
src/
├── components/
│   ├── StoreMap.vue        Isometric scene, layers, hit zones, navigation
│   ├── BaseShelf.vue       Generic shelf; the 6 consoles configure it
│   ├── Base*.vue           Themed views (arcade, museum, music, magazines…)
│   └── …
├── composables/
│   ├── useStoreMap.js      Pan, zoom, pinch, parallax and bounds
│   ├── useCart.js          Cart, totals, quantity ceiling and promos
│   └── useNavigation.js    Translates section keys into routes
├── router/
│   └── index.js            Routes, lazy loading, inter-view transition
├── data/                   Game and merchandise catalogues
└── assets/
    └── imagenes-tienda/    Store layers + layers-manifest.json
```

Three decisions worth calling out:

**Every section has its own URL.** `/consola/ps2`, `/museo`, `/nosotros/faq` and
`/arcade/pacman` can be shared, refreshed, and walked back through with the
browser's back button. The block-wipe transition between sections lives in the
router guards, so no view has to orchestrate it — and those guards time it out,
so a misbehaving animation can never strand a visitor mid-navigation. Every route
except the store map loads on demand.

**The shelves share one component.** `BaseShelf.vue` takes colours, spacing, logo
and button configuration as props, and its descriptive copy through a slot.
`N64Shelf.vue` and its five siblings are configuration only.

**The scene is described by a manifest.** `layers-manifest.json` holds each
layer's position, size and placeholder, so adding a new piece of furniture means
adding a JSON entry rather than touching CSS. The same manifest supplies the
intrinsic dimensions that keep layout shift near zero.

## Running the project

Requires Node.js `^20.19.0` or `>=22.12.0` (what Vite 8 expects).

```bash
git clone https://github.com/nibeKn/Tienda-Nivel-Retro.git
```

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at `http://localhost:5173/`.

## Disclaimer

A personal portfolio project. Non-commercial, and unconnected to any real store.

- The products, prices, stock, orders and users shown on the site are
  **fictional**. No payments are processed and no data is collected from anyone.
- Nintendo, PlayStation, Nintendo 64, GameCube, Wii, and the names, logos and box
  arts of the games shown are **trademarks of their respective owners**. They
  appear here illustratively and educationally, without authorisation from or
  sponsorship by those holders.
- If you hold rights to any of this material and would like it removed, please
  open an issue on the repository.

## License

The **source code** is published under the [MIT license](LICENSE): you may use,
modify and redistribute it while keeping the copyright notice and attribution.
