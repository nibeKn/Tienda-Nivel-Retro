/**
 * arcadeData.js — Content for the two playable arcade cabinets in the store.
 *
 * Keyed by the `:juego` route param, so `/arcade/pacman` reads `arcadeData.pacman`.
 */
const pacmanLogo =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786409011/PACMAN_gl2ql4.png';
const dkLogo =
  'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto,w_500/v1786408999/DONKEYKONG_fhqbvn.png';

export const arcadeData = {
  pacman: {
    title: 'PAC-MAN',
    year: '1980',
    themeColor: '#fbbf24',
    playUrl: 'https://freepacman.org/',
    images: ['https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025247/nivel-retro/migrated/01.gif'],
    videoUrl: 'https://res.cloudinary.com/dabfglubl/video/upload/v1776811828/PacMan_ngaxlr.mp4',
    logoUrl: pacmanLogo,
    details: {
      'Plataforma Original': 'Arcade (Namco)',
      'Género': 'Persecución / Laberinto',
      'Impacto': 'Primer fenómeno cultural de los videojuegos.',
      'Legado': 'Introdujo mecánicas de IA en los enemigos y un icono universal.',
    },
    history: [
      'Lanzado en 1980 por Namco y diseñado por Toru Iwatani, <strong>Pac-Man</strong> es uno de los videojuegos más icónicos e influyentes de todos los tiempos. Revolucionó la industria alejándose de los "space shooters" comunes de la época y creando un nuevo género basado en mecánicas de persecución dentro de un laberinto.',
      'Su diseño simple pero adictivo, su protagonista con forma de pizza a la que le falta una rebanada, y sus carismáticos fantasmas (Blinky, Pinky, Inky y Clyde) lo convirtieron en el primer gran fenómeno cultural de la historia de los videojuegos, atrayendo a una audiencia masiva y demostrando que el medio podía ser universal.',
    ],
  },
  donkeykong: {
    title: 'DONKEY KONG',
    year: '1981',
    themeColor: '#ef4444',
    playUrl: 'https://freekong.org/',
    images: ['https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1788025623/nivel-retro/migrated/01-17fa4370.gif'],
    videoUrl: 'https://res.cloudinary.com/dabfglubl/video/upload/v1776811834/Donkey_Kong_qvkele.mp4',
    logoUrl: dkLogo,
    details: {
      'Plataforma Original': 'Arcade (Nintendo)',
      'Género': 'Plataformas',
      'Impacto': 'Primer gran éxito de Nintendo en Norteamérica.',
      'Legado':
        'Introdujo a Mario (entonces Jumpman) y Donkey Kong, dos de los personajes más icónicos de los videojuegos.',
    },
    history: [
      'Lanzado por Nintendo en 1981, <strong>Donkey Kong</strong> fue la creación revolucionaria de Shigeru Miyamoto y marcó un antes y un después en los videojuegos. Fue uno de los primeros juegos de plataformas jamás creados y el título que introdujo al mundo a dos de los personajes más famosos de la historia: Mario (originalmente conocido como "Jumpman") y el gigante gorila Donkey Kong.',
      'Su éxito masivo rescató a Nintendo of America de la quiebra financiera y estableció el patrón para innumerables juegos de plataformas posteriores. Con sus barriles rodantes, múltiples niveles distintivos y una breve narrativa visual que daba contexto a la jugabilidad, Donkey Kong sentó las bases para el imperio global de los videojuegos de Nintendo.',
    ],
  },
};
