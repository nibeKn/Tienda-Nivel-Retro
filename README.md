# Tienda Nivel Retro

¡Bienvenido a **Tienda Nivel Retro**! Un nostálgico viaje virtual a la época dorada de los videojuegos.

## Temática
**Tienda Nivel Retro** no es solo un catálogo plano de juegos; es una experiencia interactiva diseñada para rescatar la magia de vitrinear en tu tienda física favorita un viernes por la tarde durante la era de los 2000s. 

A través de un entorno visual isométrico 3D, puedes pasear (hacer paneo y zoom) por diferentes estantes dinámicos, seleccionar tus consolas preferidas, inspeccionar las cajas originales, leer detalles técnicos inmersivos y agregar títulos clásicos a tu carrito de compras interactivo.

### Características Principales
- **Exploración Isométrica Interactiva:** Haz paneo y zoom a través de una tienda 3D dinámica construida usando un sistema de capas (Layers).
- **Estantes Personalizados:** Catálogos completos, fichas técnicas y galerías multimedia (Caja 3D y Discos/Cartuchos) de las siguientes consolas clásicas:
  - Nintendo 64
  - Nintendo GameCube
  - Nintendo Wii
  - PlayStation 1
  - PlayStation 2
  - PlayStation 3
- **Modo Día/Noche:** Un elegante Switch Neumórfico en la cabecera que altera globalmente la estética de la tienda entera, incluyendo el azul cinematográfico de los estantes y las marquesinas asíncronas de fondo.
- **Carrito de Compras:** Un sistema de simulación e-commerce que lleva cuenta de tus títulos agregados, el precio total simulado e interactúa progresivamente con el stock por unidad.
- **Galería Lightbox:** Visualiza en pantalla completa el BoxArt y discos en alta resolución oscureciendo el fondo con un filtro envolvente.

---

## Tecnologías Usadas
Este proyecto está construido mediante un sólido stack Front-End reactivo, puramente enfocado en el rendimiento y estilo estético sin dependencias UI externas pesadas.

- **[Vue 3](https://vuejs.org/) (Composition API):** Motor lógico y sistema de enrutamiento basado en estados de componentes (Single Page Application SPA) que gestiona ágilmente tus interacciones.
- **[Vite](https://vitejs.dev/):** Herramienta de construcción y servidor de desarrollo ultra rápido que compila eficientemente de manera transparente.
- **HTML5 & Vanilla CSS3:** Maquetación isométrica, animaciones, filtros complejos de `drop-shadow` reactivos, Neumorfismo (`box-shadow` insets) e interacciones nativas con transiciones puras de componentes fluidas; sin bibliotecas adicionales (como Tailwind ni Bootstrap).
- **JavaScript (ES6+):** Lógica del carrito, interactividad en la selección de consolas y acceso asíncrono robusto a tu base de datos estática `gamesData.js`.
- **FontAwesome:** Sistema de vectores importados como clases para botones, cabeceras, e interfaces sutiles UI/UX.

---

## Instrucciones de Uso

Sigue estos pasos para poder instalar, ejecutar y aportar al proyecto de la Tienda Nivel Retro en tu entorno local.

### Prerrequisitos
- Tener instalado **[Node.js](https://nodejs.org/)** y `npm` (Node Package Manager) en tu sistema operativo.

### 1. Clonar el repositorio y Cargar Carpetas
Sitúate con tu terminal en la carpeta principal del archivo `package.json` o usa tu IDE como VS Code.

### 2. Instalar dependencias
Abre tu consola/terminal en la raíz del proyecto y ejecuta el siguiente comando para escanear y bajar todos los paquetes base (Vue, Vite):
```bash
npm install
```

### 3. Ejecutar el Servidor de Desarrollo
Una vez instalados los paquetes, compila de forma local e inicia el servidor en modo desarrollo inyectando los recambios interactivos continuos:
```bash
npm run dev
```

### 4. Navegar la Tienda Local
- Al lanzar tu script local, en tu terminal aparecerá una dirección url de Host (por defecto `http://localhost:5173/`). Dale Ctrl+Clic en tu terminal o navegador web.
- **Tips de Navegación:**
  - Mantén pulsado el **Clic Izquierdo del ratón** sobre la tienda principal y **arrastra** para hacer un paneo infinito en 2D sobre la imagen isométrica; también usa la **rueda de ratón** para el zoom inteligente centralizado.
  - Pulsa sobre los **Stands 3D vibrantes** en el piso central de la tienda; o bien utiliza los botones responsivos de la **Barra lateral izquierda** para navegar rápidamente a una consola en concreto de manera directa.
  - Toca el interruptor de sol/luna (`Toggle UI`) en el extremo derecho de la cabecera para transicionar al impactante Modo Nocturno global y navegar con luces bajas por las cajas de Nintendo e insignias de Sony.
  - Intercambia las aletas `A` (Media) y `B` (Detalle Teórico) en las vistas de estante individual de cualquier consola si deseas explorar en detalle lo asombroso de la época Y2k!
