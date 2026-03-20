<template>
  <div class="catalog-container">
    <div class="catalog-header">
      <h2>Catálogo</h2>
      <button class="back-btn" @click="$emit('back')"><i class="fas fa-arrow-left"></i> Volver a Tienda</button>
    </div>
    
    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input type="text" v-model="searchQuery" placeholder="Buscar juegos por nombre..." />
    </div>

    <div class="catalog-content">
      <div v-for="(consoleData, index) in filteredConsoles" :key="consoleData.name" class="console-section">
        <h3 class="console-title">{{ consoleData.name }}</h3>
        <div class="games-grid">
          <div v-for="game in consoleData.games" :key="game.name" class="game-card" @click="$emit('open-game', { view: consoleData.view, game: game.name })">
            <img :src="game.media?.box3d || game.img" :alt="game.name" class="game-thumbnail" />
            <div class="game-info">
              <span class="game-title">{{ game.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredConsoles.length === 0" class="no-results">
        <p>No se encontraron juegos que coincidan con "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { gcGames, ps2Games, ps3Games, wiiGames, n64Games, ps1Games } from '../data/gamesData.js';

const emit = defineEmits(['back', 'open-game']);

const searchQuery = ref('');

// Flatten the game arrays since they are nested arrays of shelves
const flattenGames = (shelvesArray) => {
  return shelvesArray.reduce((acc, row) => acc.concat(row), []);
};

const consoles = [
  { name: 'Nintendo 64', view: 'n64', games: flattenGames(n64Games) },
  { name: 'Nintendo GameCube', view: 'gc', games: flattenGames(gcGames) },
  { name: 'Nintendo Wii', view: 'wii', games: flattenGames(wiiGames) },
  { name: 'PlayStation 1', view: 'ps1', games: flattenGames(ps1Games) },
  { name: 'PlayStation 2', view: 'ps2', games: flattenGames(ps2Games) },
  { name: 'PlayStation 3', view: 'ps3', games: flattenGames(ps3Games) },
];

const filteredConsoles = computed(() => {
  if (!searchQuery.value) return consoles;
  const lowerQuery = searchQuery.value.toLowerCase();
  
  return consoles.map(c => {
    return {
      ...c,
      games: c.games.filter(g => g.name.toLowerCase().includes(lowerQuery))
    };
  }).filter(c => c.games.length > 0);
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
  justify-content: space-between;
  align-items: center;
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
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s, transform 0.2s;
}

.back-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #212c42;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 10px 20px;
  margin-bottom: 30px;
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.5);
  border-color: #fbbf24;
}

.game-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 15px;
  background-color: rgba(0,0,0,0.2);
  box-sizing: border-box;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
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
</style>
