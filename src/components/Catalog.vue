<template>
  <div class="catalog-container">
    <div class="catalog-header">
      <h2>Catálogo</h2>
      <button class="back-btn" @click="$emit('back')">
        <i class="fas fa-arrow-left"></i> Volver a la Tienda
      </button>
    </div>

    <div class="catalog-controls">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" v-model="searchQuery" placeholder="Buscar juegos por nombre..." />
      </div>

      <div class="filters">
        <select v-model="playerFilter" class="player-select">
          <option value="">Todos los jugadores</option>
          <option value="1">1 Player</option>
          <option value="2">2 Players</option>
          <option value="4">4 Players</option>
        </select>
      </div>
    </div>

    <div class="quick-nav">
      <button
        v-for="c in consoles"
        :key="c.name"
        @click="scrollToSection(c.sectionId)"
        class="quick-nav-btn"
      >
        {{ c.name.replace('Merchandising: ', '') }}
      </button>
    </div>

    <div class="catalog-content">
      <div
        v-for="consoleData in filteredConsoles"
        :key="consoleData.name"
        :id="'section-' + consoleData.sectionId"
        class="console-section"
      >
        <h3 class="console-title">{{ consoleData.name }}</h3>
        <div class="games-grid">
          <div
            v-for="game in consoleData.games"
            :key="game.id || game.name"
            class="game-card"
            @click="$emit('open-game', { view: consoleData.view, game: game.id || game.name })"
          >
            <img
              :src="game.media?.box3d || game.img || game.mainImg"
              :alt="game.name"
              class="game-thumbnail"
              loading="lazy"
              decoding="async"
            />
            <div class="game-info">
              <span class="game-title">{{ game.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredConsoles.length === 0" class="no-results">
        <p>No se encontraron productos que coincidan con "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { gcGames, ps2Games, ps3Games, wiiGames, n64Games, ps1Games } from '../data/gamesData.js';
import { merchCategories } from '../data/merchData.js';

defineEmits(['back', 'open-game']);

const searchQuery = ref('');
const playerFilter = ref('');

const scrollToSection = (sectionId) => {
  const el = document.getElementById('section-' + sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Flatten the game arrays since they are nested arrays of shelves
const flattenGames = (shelvesArray) => {
  return shelvesArray.reduce((acc, row) => acc.concat(row), []);
};

const consoles = [
  { name: 'Nintendo 64', view: 'n64', sectionId: 'n64', games: flattenGames(n64Games) },
  { name: 'Nintendo GameCube', view: 'gc', sectionId: 'gc', games: flattenGames(gcGames) },
  { name: 'Nintendo Wii', view: 'wii', sectionId: 'wii', games: flattenGames(wiiGames) },
  { name: 'PlayStation 1', view: 'ps1', sectionId: 'ps1', games: flattenGames(ps1Games) },
  { name: 'PlayStation 2', view: 'ps2', sectionId: 'ps2', games: flattenGames(ps2Games) },
  { name: 'PlayStation 3', view: 'ps3', sectionId: 'ps3', games: flattenGames(ps3Games) },
  {
    name: 'Merchandising: Poleras',
    view: 'merch',
    sectionId: 'merch-poleras',
    games: merchCategories.poleras,
  },
  {
    name: 'Merchandising: Figuras',
    view: 'merch',
    sectionId: 'merch-figuras',
    games: merchCategories.figuras,
  },
  {
    name: 'Merchandising: Peluches',
    view: 'merch',
    sectionId: 'merch-peluches',
    games: merchCategories.peluches,
  },
  {
    name: 'Merchandising: Otros',
    view: 'merch',
    sectionId: 'merch-otros',
    games: merchCategories.otros,
  },
];

const filteredConsoles = computed(() => {
  const lowerQuery = searchQuery.value.toLowerCase();

  return consoles
    .map((c) => {
      let filteredGames = c.games;

      // Filter by search query
      if (lowerQuery) {
        filteredGames = filteredGames.filter((g) => g.name.toLowerCase().includes(lowerQuery));
      }

      // Filter by player count
      if (playerFilter.value) {
        filteredGames = filteredGames.filter((g) => {
          if (!g.players) return false;
          const p = g.players.toLowerCase();
          if (playerFilter.value === '1') {
            return p.includes('1 jugador') || p.includes('1-');
          } else if (playerFilter.value === '2') {
            return p.includes('2 jugador') || p.includes('-2') || p.includes('1-4');
          } else if (playerFilter.value === '4') {
            return p.includes('4 jugador') || p.includes('-4');
          }
          return false;
        });
      }

      return {
        ...c,
        games: filteredGames,
      };
    })
    .filter((c) => c.games.length > 0);
});
</script>

<style scoped>
.catalog-container {
  width: 100%;
  height: 100%;
  background-color: #1a273b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow-y: auto;
  box-sizing: border-box;
}

.catalog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  border-bottom: 2px solid #334155;
  padding-bottom: 15px;
}

.catalog-header h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  margin: 0;
  color: #fbd38d;
  letter-spacing: 1px;
}

.back-btn {
  position: absolute;
  left: 0;
  background-color: #fbbf24;
  color: #0f172a;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f59e0b;
  transform: translateX(-5px);
}

.catalog-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 10px 20px;
}

.search-bar i {
  color: #94a3b8;
  font-size: 1.2rem;
  margin-right: 15px;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 1.1rem;
  outline: none;
  font-family: 'Roboto', sans-serif;
}

.search-bar input::placeholder {
  color: #64748b;
}

.filters {
  display: flex;
  align-items: center;
}

.player-select {
  background-color: #212c42;
  color: #e2e8f0;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 1.1rem;
  outline: none;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
}

.quick-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.quick-nav-btn {
  background-color: #1e293b;
  color: #94a3b8;
  border: 2px solid #334155;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.quick-nav-btn:hover {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.console-section {
  margin-bottom: 40px;
}

.console-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #f1f5f9;
  border-left: 4px solid #fbbf24;
  padding-left: 15px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.game-card {
  background-color: #212c42;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  border-color: #fbbf24;
}

.game-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.game-info {
  padding: 15px;
  text-align: center;
  background-color: #1e293b;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #94a3b8;
  padding: 50px 0;
}

/* --- Mobile Responsive --- */
@media (max-width: 768px) {
  .catalog-container {
    padding: 15px;
  }

  .catalog-header {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 15px;
  }

  .catalog-header h2 {
    font-size: 2rem;
  }

  .back-btn {
    position: relative;
    left: auto;
    padding: 8px 12px;
    font-size: 0.95rem;
    align-self: flex-start;
  }

  .catalog-controls {
    flex-direction: column;
    gap: 10px;
  }

  .search-bar {
    width: 100%;
    padding: 8px 15px;
    box-sizing: border-box;
  }

  .search-bar input {
    font-size: 1rem;
    width: 100%;
  }

  .filters {
    width: 100%;
  }

  .player-select {
    width: 100%;
    font-size: 1rem;
    padding: 8px 15px;
    box-sizing: border-box;
  }

  .quick-nav {
    gap: 8px;
    margin-bottom: 20px;
    justify-content: center;
  }

  .quick-nav-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .console-title {
    font-size: 1.4rem;
    margin-bottom: 15px;
  }

  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 15px;
  }

  .game-thumbnail {
    height: 140px;
    padding: 10px;
  }

  .game-info {
    padding: 10px;
  }

  .game-title {
    font-size: 0.8rem;
  }
}
</style>
