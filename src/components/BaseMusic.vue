<template>
  <div class="music-view">
    <BaseBackground word="MUSIC" />

    <button class="back-btn" @click="$emit('back')">
      <i class="fas fa-arrow-left"></i> Volver a la Tienda
    </button>

    <h1 class="page-title">ZONA DE MÚSICA</h1>

    <div class="music-layout">
      <div class="cube-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <button class="nav-arrow left desktop-only" @click="rotateLeft">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="nav-arrow right desktop-only" @click="rotateRight">
          <i class="fas fa-chevron-right"></i>
        </button>

        <div class="scene">
          <div class="rack-cap top"></div>
          <div class="carousel" :style="{ transform: `rotateY(${currentAngle}deg)` }">
            <div
              class="carousel-face"
              v-for="(face, faceIndex) in faces"
              :key="faceIndex"
              :style="{ transform: `rotateY(${faceIndex * 60}deg) translateZ(155px)` }"
            >
              <div class="cd-rack-column">
                <div
                  class="cd-jewel-case"
                  v-for="(cd, cdIndex) in face"
                  :key="cd.name + cdIndex"
                  @click="selectCd(cd)"
                  :class="{ active: activeCd && activeCd.name === cd.name }"
                >
                  <div class="cd-cover-wrapper">
                    <img :src="cd.coverUrl" :alt="cd.name" loading="lazy" decoding="async" />
                    <div class="jewel-reflection"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rack-pedestal"></div>
          <div class="rack-base"></div>
        </div>
        <div class="mobile-helper-text mobile-only">
          Selecciona un álbum o gira el mueble deslizandolo con tu dedo
        </div>
      </div>

      <div class="player-container" :class="{ 'is-active': activeCd }">
        <div class="info-panel" v-if="activeCd">
          <div class="header-info">
            <button class="close-player-btn mobile-only" @click="activeCd = null">
              <i class="fas fa-times"></i>
            </button>
            <div class="disc-presentation">
              <img
                :src="activeCd.coverUrl"
                :alt="`Portada de ${activeCd.name}`"
                class="active-cover"
                decoding="async"
              />
              <img
                v-if="activeCd.discUrl"
                :src="activeCd.discUrl"
                alt=""
                aria-hidden="true"
                class="active-disc"
                decoding="async"
                :class="{ spinning: playing }"
              />
            </div>
            <div class="text-info">
              <h2>{{ activeCd.realTitle || activeCd.name }}</h2>
              <div class="desc-container">
                <p class="history-text" :class="{ expanded: isDescExpanded }">
                  {{
                    activeCd.description ||
                    'Banda sonora legendaria de este clásico indiscutible. Cada acorde y melodía ha quedado grabada en la mente de generaciones, un disco en formato físico que evoca perfectamente aquellos tiempos dorados de los videojuegos.'
                  }}
                </p>
                <button class="ver-mas-btn mobile-only" @click="isDescExpanded = !isDescExpanded">
                  {{ isDescExpanded ? 'Ver menos' : 'Ver más...' }}
                </button>
              </div>
            </div>
          </div>

          <div class="audio-player retro-player">
            <div class="retro-top-row">
              <div class="retro-screen">
                <div class="retro-time">
                  <div class="current-time">{{ formattedTime }}</div>
                  <div class="total-time">/{{ formattedDuration }}</div>
                </div>
                <div class="retro-screen-divider"></div>
                <div class="retro-title-marquee">
                  <div class="marquee-container" v-if="activeCd.tracks[activeTrack - 1]">
                    <div class="marquee-content" :class="{ paused: !playing }">
                      {{ activeCd.tracks[activeTrack - 1].title }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="retro-big-play" aria-hidden="true" @click="togglePlay">
                <i class="fas" :class="playing ? 'fa-pause' : 'fa-play'"></i>
              </div>
            </div>

            <div class="retro-progress-row">
              <input
                type="range"
                class="retro-seek-slider"
                min="0"
                :max="duration || 0"
                step="0.1"
                :value="currentTime"
                @input="onSeek"
              />
            </div>

            <div class="retro-bottom-row">
              <div class="retro-controls">
                <button class="retro-ctrl-btn" @click="prevTrack">
                  <i class="fas fa-backward-step"></i>
                </button>
                <button class="retro-ctrl-btn" @click="togglePlay">
                  <i class="fas" :class="playing ? 'fa-pause' : 'fa-play'"></i>
                </button>
                <button class="retro-ctrl-btn" @click="stop"><i class="fas fa-stop"></i></button>
                <button class="retro-ctrl-btn" @click="nextTrack">
                  <i class="fas fa-forward-step"></i>
                </button>
              </div>

              <div class="retro-mini-tracklist">
                <ul class="retro-tracklist-ul">
                  <li
                    v-for="(track, index) in activeCd.tracks"
                    :key="index"
                    :class="{ playing: activeTrack === index + 1 }"
                    @click="playTrack(index + 1)"
                  >
                    <span class="retro-track-num">0{{ index + 1 }}</span> {{ track.title }}
                  </li>
                </ul>
              </div>

              <div class="retro-volume-section">
                <div class="retro-volume-container">
                  <div
                    class="retro-volume-knob"
                    :style="{
                      background: `conic-gradient(from 225deg, #38bdf8 0deg, #38bdf8 ${volume * 2.7}deg, rgba(255,255,255,0.1) ${volume * 2.7}deg, rgba(255,255,255,0.1) 270deg, transparent 270deg, transparent 360deg)`,
                    }"
                  >
                    <div
                      class="knob-dial"
                      :style="{ transform: `rotate(${volume * 2.7 - 135}deg)` }"
                    >
                      <div class="knob-indicator"></div>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" v-model="volume" class="knob-range" />
                </div>
                <div class="volume-label">VOLUME</div>
              </div>
            </div>

            <audio
              ref="audioPlayer"
              :src="currentTrackUrl"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              @ended="onTrackEnd"
              @error="onAudioError"
            ></audio>
          </div>
        </div>
        <div class="empty-info" v-else>
          <i class="fas fa-compact-disc rotate-icon"></i>
          <h2>SELECCIONA UN DISCO DEL MUEBLE PARA ESCUCHAR</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import BaseBackground from './BaseBackground.vue';

defineEmits(['back']);

const customTracks = {
  'DK Country': [
    {
      title: '03. The Map Page',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-donkey-kong-original-sound-version/bfwsypbp/03.%20The%20Map%20Page.mp3',
    },
    {
      title: '06. Water Music',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-donkey-kong-original-sound-version/wnyffmrw/06.%20Water%20Music.mp3',
    },
    {
      title: '25. The Pirate Ship',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-donkey-kong-original-sound-version/uenapxsw/25.%20The%20Pirate%20Ship.mp3',
    },
  ],
  'Super Mario Galaxy': [
    {
      title: '11. Battlerock Galaxy',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/super-mario-galaxy-original-sound-track-2008/nujmgvie/11.%20Battlerock%20Galaxy.mp3',
    },
    {
      title: '18. Rosalina In The Observatory 3',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/super-mario-galaxy-original-sound-track-2008/kkwzlfui/18.%20Rosalina%20In%20The%20Observatory%203.mp3',
    },
    {
      title: '25. Super Mario Galaxy',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/super-mario-galaxy-original-sound-track-2008/flngtzsp/25.%20Super%20Mario%20Galaxy.mp3',
    },
  ],
  'Super Mario 64': [
    {
      title: '05. Super Mario 64 Main Theme',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-mario-64-soundtrack/shhnuigj/05.%20Super%20Mario%2064%20Main%20Theme.mp3',
    },
    {
      title: '09. Dire, Dire Docks',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-mario-64-soundtrack/tksjrhmo/09.%20Dire%2C%20Dire%20Docks.mp3',
    },
    {
      title: '32. Ultimate Koopa',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/super-mario-64-soundtrack/xvknlqvg/32.%20Ultimate%20Koopa.mp3',
    },
  ],
  'The Last Of Us': [
    {
      title: '03. The Last of Us',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/the-last-of-us-2013/kqaesdnd/03.%20The%20Last%20of%20Us.mp3',
    },
    {
      title: '20. All Gone [No Escape]',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/the-last-of-us-2013/hnvohssk/20.%20All%20Gone%20%5BNo%20Escape%5D.mp3',
    },
    {
      title: '22. The Path',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/the-last-of-us-2013/rsmkmfrr/22.%20The%20Path.mp3',
    },
  ],
  "Yoshi's Island": [
    {
      title: '07. Flower Garden',
      url: 'https://vgmtreasurechest.com/soundtracks/super-mario-yoshis-island-original-sound-version/bktqvicn/07.%20Flower%20Garden.mp3',
    },
    {
      title: '13. Athletic',
      url: 'https://vgmtreasurechest.com/soundtracks/super-mario-yoshis-island-original-sound-version/strdqtxe/13.%20Athletic.mp3',
    },
    {
      title: '20. Map BGM',
      url: 'https://vgmtreasurechest.com/soundtracks/super-mario-yoshis-island-original-sound-version/vknhxtzq/20.%20Map%20BGM.mp3',
    },
  ],
  'Zelda Ocarina Of time': [
    {
      title: '01. Title Theme',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/the-legend-of-zelda-ocarina-of-time-sound-track-cd-1998/tgyafamg/01.%20Title%20Theme.mp3',
    },
    {
      title: '05. Kokiri Forest',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/the-legend-of-zelda-ocarina-of-time-sound-track-cd-1998/chcoobrf/05.%20Kokiri%20Forest.mp3',
    },
    {
      title: '17. Lost Woods',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/the-legend-of-zelda-ocarina-of-time-sound-track-cd-1998/ioyzdqtx/17.%20Lost%20Woods.mp3',
    },
  ],
  'No More Heroes': [
    {
      title: '01. Beam Katana Chronicles',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/no-more-heroes-original-sound-tracks/dscihmpo/1-01.%20Beam%20Katana%20Chronicles.mp3',
    },
    {
      title: '12. Oxygen Graffiti',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/no-more-heroes-original-sound-tracks/uwwvmxbr/1-12.%20Oxygen%20Graffiti.mp3',
    },
    {
      title: '08. DND (Do Not Destroy)',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/no-more-heroes-original-sound-tracks/icmdhblz/1-08.%20DND%20%28Do%20Not%20Destroy%29.mp3',
    },
  ],
  'Castlevania Symphony of the night': [
    {
      title: '03. Prologue',
      url: 'https://vgmtreasurechest.com/soundtracks/castlevania-symphony-of-the-night/pozhljpu/03.%20Prologue%201.mp3',
    },
    {
      title: "10. Dracula's Castle (Akira Yamaoka)",
      url: 'https://vgmtreasurechest.com/soundtracks/castlevania-symphony-of-the-night/lznsbchg/10.%20Dracula%27s%20Castle%20%28Arranged%20by%20Akira%20Yamaoka%29%201.mp3',
    },
    {
      title: '14. Marble Gallery',
      url: 'https://vgmtreasurechest.com/soundtracks/castlevania-symphony-of-the-night/ewsaxlok/14.%20Marble%20Gallery%201.mp3',
    },
  ],
  'Kingdom Hearts HD1.5': [
    {
      title: '1-16 Traverse Town',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kingdom-hearts-hd-1.5-remix/vpllwcwb/1-16%20Traverse%20Town.mp3',
    },
    {
      title: '2-27 Fragments of Sorrow',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kingdom-hearts-hd-1.5-remix/jdollwcu/2-27%20Fragments%20of%20Sorrow.mp3',
    },
    {
      title: '2-32 Hikari',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kingdom-hearts-hd-1.5-remix/rwjclvyf/2-32%20Hikari.mp3',
    },
  ],
  'Persona 5': [
    {
      title: '1-04. Life Will Change',
      url: 'https://vgmtreasurechest.com/soundtracks/persona-5/oizwnxzf/1-04.%20Life%20Will%20Change.mp3',
    },
    {
      title: '1-17. Last Surprise',
      url: 'https://vgmtreasurechest.com/soundtracks/persona-5/njfybmem/1-17.%20Last%20Surprise.mp3',
    },
    {
      title: '3-31. Hoshi To Bokura To',
      url: 'https://vgmtreasurechest.com/soundtracks/persona-5/ymoiytxf/3-31.%20Hoshi%20To%20Bokura%20To.mp3',
    },
  ],
  'Kirby 64 - The Crystal Shards Original Soundtrack': [
    {
      title: '04. Planet Popstar',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kirby-hoshi-no-64-original-soundtrack/kxfklzns/04.%20Planet%20Popstar.mp3',
    },
    {
      title: '20. Aqua Star',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kirby-hoshi-no-64-original-soundtrack/niaetgbn/20.%20Aqua%20Star.mp3',
    },
    {
      title: '32. 100-Yard Hop',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/kirby-hoshi-no-64-original-soundtrack/beuiirkx/32.%20100-Yard%20Hop.mp3',
    },
  ],
  'Metal Gear Solid': [
    {
      title: '01. Metal Gear Solid Main Theme',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/metal-gear-solid-original-soundtrack/wplmznrs/01.%20Metal%20Gear%20Solid%20Main%20Theme.mp3',
    },
    {
      title: '08. Warhead Storage',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/metal-gear-solid-original-soundtrack/dfszrkbd/08.%20Warhead%20Storage.mp3',
    },
    {
      title: '18. End Title - The Best is Yet to Come',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/metal-gear-solid-original-soundtrack/ruyhqiqh/18.%20End%20Title%20%20-%20%20The%20Best%20is%20Yet%20to%20Come.mp3',
    },
  ],
  "Banjo-Kazooie's Great Adventure Original Soundtrack": [
    {
      title: "04 - Mumbo's Mountain",
      url: 'https://nu.vgmtreasurechest.com/soundtracks/banjo-kazooie-s-great-adventure-original-soundtrack/cauvvpnu/04%20-%20Mumbo%27s%20Mountain.mp3',
    },
    {
      title: "09 - Gobi's Valley",
      url: 'https://nu.vgmtreasurechest.com/soundtracks/banjo-kazooie-s-great-adventure-original-soundtrack/algwnbtn/09%20-%20Gobi%27s%20Valley.mp3',
    },
    {
      title: '12 - Click Clock Wood',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/banjo-kazooie-s-great-adventure-original-soundtrack/mhwodasl/12%20-%20Click%20Clock%20Wood.mp3',
    },
  ],
  'Ridge Racer Type 4': [
    {
      title: '01. URBAN FRAGMENTS',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/r4-ridge-racer-type-4/xpgnwvlt/01.%20URBAN%20FRAGMENTS.mp3',
    },
    {
      title: '06. PEARL BLUE SOUL',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/r4-ridge-racer-type-4/gtcepkgb/06.%20PEARL%20BLUE%20SOUL.mp3',
    },
    {
      title: '07. NAKED GLOW',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/r4-ridge-racer-type-4/nmwxyxtz/07.%20NAKED%20GLOW.mp3',
    },
  ],
  'Shadow Of the Colossus': [
    {
      title: '08. A Path Opened -Battle with the Colossus-',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/wander-and-the-colossus-roar-of-the-earth-shadow-of-the-c/hiuzowrr/08.%20A%20Path%20Opened%20-Battle%20with%20the%20Colossus-.mp3',
    },
    {
      title: '13. Revived Power -Battle with the Colossus-',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/wander-and-the-colossus-roar-of-the-earth-shadow-of-the-c/tfvltnfn/13.%20Revived%20Power%20-Battle%20with%20the%20Colossus-.mp3',
    },
    {
      title: '35. Sun-Blessed Lands',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/wander-and-the-colossus-roar-of-the-earth-shadow-of-the-c/ruzpzcni/35.%20Sun-Blessed%20Lands.mp3',
    },
  ],
  'Silent Hill 2': [
    {
      title: '01. Theme of Laura',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/silent-hill-2-original-soundtrack/rhoxwqnq/01.%20Theme%20of%20Laura.mp3',
    },
    {
      title: '24. True',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/silent-hill-2-original-soundtrack/avzmlsfx/24.%20True.mp3',
    },
    {
      title: '30. Promise',
      url: 'https://nu.vgmtreasurechest.com/soundtracks/silent-hill-2-original-soundtrack/swhwmvqs/30.%20Promise.mp3',
    },
  ],
  'Bully Original Game Soundtrack': [
    {
      title: '01 Bully Main Theme (Running Theme)',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/bully-original-game-soundtrack/zafydwxx/01%20Bully%20Main%20Theme%20%28Running%20Theme%29.mp3',
    },
    {
      title: '09 Vendetta Greasers',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/bully-original-game-soundtrack/vmxdxdzn/09%20Vendetta%20Greasers.mp3',
    },
    {
      title: '32 Defender Of The Castle',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/bully-original-game-soundtrack/gugxuenc/32%20Defender%20Of%20The%20Castle.mp3',
    },
  ],
  'Paper Mario Game Music Soundtrack': [
    {
      title: '1-02. Main Title',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/paper-mario-game-music-soundtrack-cd-2001/zdshecxf/1-02.%20Main%20Title.mp3',
    },
    {
      title: '1-06. Goomba Village Theme',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/paper-mario-game-music-soundtrack-cd-2001/bgfgqjxm/1-06.%20Goomba%20Village%20Theme.mp3',
    },
    {
      title: '1-11. Toad Town Theme',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/paper-mario-game-music-soundtrack-cd-2001/dmzovmvu/1-11.%20Toad%20Town%20Theme.mp3',
    },
  ],
  'Mario Kart Wii': [
    {
      title: '1-20. Coconut Mall',
      url: 'https://vgmtreasurechest.com/soundtracks/mario-kart-wii-platinum-soundtrack/thgjdnej/10.%20Coconut%20Mall.mp3',
    },
    {
      title: '1-36. Maple Treeway',
      url: 'https://vgmtreasurechest.com/soundtracks/mario-kart-wii-platinum-soundtrack/vdhzafya/15.%20Maple%20Treeway.mp3',
    },
    {
      title: '1-54. Rainbow Road',
      url: 'https://vgmtreasurechest.com/soundtracks/mario-kart-wii-platinum-soundtrack/zisorsos/20.%20Rainbow%20Road.mp3',
    },
  ],
  'Diddy Kong Racing': [
    {
      title: '07. Ancient Lake',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/diddy-kong-racing-extended/ouhcptzn/07.%20Ancient%20Lake.mp3',
    },
    {
      title: '14. Everfrost Peak',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/diddy-kong-racing-extended/niacnfph/14.%20Everfrost%20Peak.mp3',
    },
    {
      title: '20. Pirate Lagoon',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/diddy-kong-racing-extended/nvokijwg/20.%20Pirate%20Lagoon.mp3',
    },
  ],
  'Bomberman Hero': [
    {
      title: '01. Foehn',
      url: 'https://vgmtreasurechest.com/soundtracks/bomberman-hero-original-soundtrack/txivfqnt/01.%20foehn.mp3',
    },
    {
      title: '03. Redial',
      url: 'https://vgmtreasurechest.com/soundtracks/bomberman-hero-original-soundtrack/ibkutkto/03.%20redial.mp3',
    },
    {
      title: '04. Monogenic',
      url: 'https://vgmtreasurechest.com/soundtracks/bomberman-hero-original-soundtrack/nwvmaqbj/04.%20monogenic.mp3',
    },
  ],
  'Jet Set Radio': [
    {
      title: '01 - Let Mom Sleep',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/jet-set-radio-original-soundtrack/xcsfankn/01%20-%20Let%20Mom%20Sleep.mp3',
    },
    {
      title: '02 - Humming the Bassline',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/jet-set-radio-original-soundtrack/jjqevsdk/02%20-%20Humming%20the%20Bassline.mp3',
    },
    {
      title: '05 - Sneakman',
      url: 'https://jetta.vgmtreasurechest.com/soundtracks/jet-set-radio-original-soundtrack/vddhcmgt/05%20-%20Sneakman.mp3',
    },
  ],
  'Halo Combat Evolved (Original Soundtrack)': [
    {
      title: '26 Halo',
      url: 'https://vgmtreasurechest.com/soundtracks/halo-original-soundtrack-2002/dmzmkpuf/26%20Halo.mp3',
    },
    {
      title: '03 Brothers in Arms',
      url: 'https://vgmtreasurechest.com/soundtracks/halo-original-soundtrack-2002/zadrwlmf/03%20Brothers%20in%20Arms.mp3',
    },
    {
      title: '10 Under Cover of Night',
      url: 'https://vgmtreasurechest.com/soundtracks/halo-original-soundtrack-2002/zcolppfi/10%20Under%20Cover%20of%20Night.mp3',
    },
  ],
  'God of war III': [
    {
      title: '01. God of War III Overture',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/god-of-war-3/akwehyuc/01.%20God%20of%20War%20III%20Overture.mp3',
    },
    {
      title: '15. Brothers of Blood',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/god-of-war-3/ufqoxugy/15.%20Brothers%20of%20Blood.mp3',
    },
    {
      title: '22. Rage of Sparta',
      url: 'https://lambda.vgmtreasurechest.com/soundtracks/god-of-war-3/mczsotav/22.%20Rage%20of%20Sparta.mp3',
    },
  ],
};

const discMetadata = {
  "Banjo-Kazooie's Great Adventure Original Soundtrack": {
    realTitle: 'Banjo-Kazooie Original Soundtrack',
    description:
      'La partitura alegre e icónica compuesta por Grant Kirkhope. Sus instrumentos dinámicos y extravagantes capturan perfectamente el espíritu de este legendario juego de plataformas.',
  },
  'Bomberman Hero': {
    realTitle: 'Bomberman Hero Original Soundtrack',
    description:
      'Una banda sonora de drum and bass increíblemente única y pegadiza compuesta por Jun Chikuma. Se aleja del estilo habitual de la serie, ofreciendo ritmos futuristas de alta energía.',
  },
  'Bully Original Game Soundtrack': {
    realTitle: 'Bully Original Game Soundtrack',
    description:
      'Compuesta por Shawn Lee, esta banda sonora llena de ritmo cuenta con una mezcla de funk, rock y elementos orquestales que establecen magistralmente el ambiente para la rebelión adolescente en la Academia Bullworth.',
  },
  'Castlevania Symphony of the night': {
    realTitle: 'Castlevania: Symphony of the Night Original Soundtrack',
    description:
      'Una composición magistral de Michiru Yamane. Esta banda sonora mezcla elementos de música barroca, rock, jazz y clásica, creando una atmósfera gótica y envolvente que define la serie.',
  },
  'DK Country': {
    realTitle: 'Donkey Kong Country Original Soundtrack',
    description:
      'Compuesta por David Wise, Eveline Novakovic y Robin Beanland. Una banda sonora atmosférica y ambiental innovadora que superó los límites auditivos de la SNES.',
  },
  'Diddy Kong Racing': {
    realTitle: 'Diddy Kong Racing Original Soundtrack',
    description:
      'Una banda sonora alegre y animada de David Wise. Aporta una energía aventurera y vibrante a cada pista de carreras, consolidando su lugar como un clásico de N64.',
  },
  'God of war III': {
    realTitle: 'God of War III Original Soundtrack',
    description:
      'Una partitura orquestal épica y majestuosa compuesta por Gerard Marino y otros. Aporta una escala increíble y un peso emocional al clímax furioso y brutal de la venganza divina de Kratos.',
  },
  'Halo Combat Evolved (Original Soundtrack)': {
    realTitle: 'Halo: Combat Evolved Original Soundtrack',
    description:
      "La banda sonora fundamental de Martin O'Donnell y Michael Salvatori. Su uso de cantos gregorianos, cuerdas majestuosas y percusión pesada creó el sonido de toda una generación de ciencia ficción.",
  },
  'Jet Set Radio': {
    realTitle: 'Jet Set Radio Original Soundtrack',
    description:
      'Una mezcla altamente energética, funky y ecléctica compuesta principalmente por Hideki Naganuma. Captura perfectamente la cultura rebelde del graffiti del juego.',
  },
  'Kingdom Hearts HD1.5': {
    realTitle: 'Kingdom Hearts HD 1.5 ReMIX Original Soundtrack',
    description:
      'Las composiciones bellamente remasterizadas de Yoko Shimomura. Combina la magia de Disney con la profundidad emocional de Square Enix, creando un viaje auditivo profundamente nostálgico y conmovedor.',
  },
  'Kirby 64 - The Crystal Shards Original Soundtrack': {
    realTitle: 'Kirby 64: The Crystal Shards Original Soundtrack',
    description:
      'Una partitura maravillosamente ligera y alegre compuesta por Jun Ishikawa e Hirokazu Ando. Sus melodías cargadas de sintetizadores acompañan perfectamente la aventura de Kirby en 3D.',
  },
  'Mario Kart Wii': {
    realTitle: 'Mario Kart Wii Original Soundtrack',
    description:
      'Una colección musical increíblemente enérgica y de ritmo rápido. Sus pegadizos himnos de carrera mantienen la adrenalina alta, haciendo que cada carrera frenética sea inolvidable.',
  },
  'Metal Gear Solid': {
    realTitle: 'Metal Gear Solid Original Game Soundtrack',
    description:
      'Una obra maestra cinematográfica compuesta por el equipo de sonido de KCE Japan. Su mezcla de tensión atmosférica, coros y música electrónica redefinió la narración de historias en los videojuegos.',
  },
  'No More Heroes': {
    realTitle: 'No More Heroes Original Sound Tracks',
    description:
      'Compuesta por Masafumi Takada, esta banda sonora ruidosa, agresiva y con estilo es el telón de fondo perfecto para la acción desenfrenada de Travis Touchdown.',
  },
  'Paper Mario Game Music Soundtrack': {
    realTitle: 'Paper Mario Original Soundtrack',
    description:
      'Una aventura musical encantadora compuesta por Yuka Tsujiyoko y otros. Sus melodías caprichosas dan vida a las versiones de papel del Reino Champiñón.',
  },
  'Persona 5': {
    realTitle: 'Persona 5 Original Soundtrack',
    description:
      'Una banda sonora de acid jazz y funk ultra elegante creada por Shoji Meguro. Sus pistas vocales increíblemente pegadizas y ritmos suaves roban el corazón de cada oyente.',
  },
  'Ridge Racer Type 4': {
    realTitle: 'R4: Ridge Racer Type 4 Direct Audio',
    description:
      'Una mezcla suave y sofisticada de acid jazz, funk y música electrónica de baile. Ofrece una experiencia de conducción urbana nocturna que sigue siendo increíblemente estilizada.',
  },
  'Shadow Of the Colossus': {
    realTitle: 'Shadow of the Colossus: Roar of the Earth',
    description:
      'Compuesta por Kow Otani, esta partitura orquestal profundamente emocional captura la tragedia majestuosa y la escala épica de derrotar a gigantescas bestias míticas.',
  },
  'Silent Hill 2': {
    realTitle: 'Silent Hill 2 Original Soundtracks',
    description:
      'La obra maestra aterradora y profundamente melancólica de Akira Yamaoka. La combinación de ruido industrial, rock alternativo y pistas ambientales inquietantes induce un puro pavor psicológico.',
  },
  'Super Mario 64': {
    realTitle: 'Super Mario 64 Original Soundtrack',
    description:
      "La partitura pionera de Koji Kondo para plataformas 3D. Desde el contagioso 'Bob-omb Battlefield' hasta el relajante 'Dire, Dire Docks', este álbum estableció el estándar de oro.",
  },
  'Super Mario Galaxy': {
    realTitle: 'Super Mario Galaxy Original Soundtrack',
    description:
      'Una innovadora banda sonora totalmente orquestada de Mahito Yokota y Koji Kondo. Sus majestuosos temas cósmicos aportan una inmensa maravilla al viaje interestelar de Mario.',
  },
  'The Last Of Us': {
    realTitle: 'The Last of Us Original Soundtrack',
    description:
      'Una banda sonora acústica minimalista y de una belleza inquietante de Gustavo Santaolalla. Sus melancólicos rasgueos de guitarra reflejan perfectamente el sombrío mundo post-apocalíptico.',
  },
  "Yoshi's Island": {
    realTitle: "Super Mario World 2: Yoshi's Island Original Soundtrack",
    description:
      'Koji Kondo regresa con una banda sonora alegre inspirada en canciones infantiles. Sus encantadoras cualidades similares a una caja de música contrastan con el desafiante juego.',
  },
  'Zelda Ocarina Of time': {
    realTitle: 'The Legend of Zelda: Ocarina of Time Original Soundtrack',
    description:
      'La legendaria partitura de aventuras de fantasía de Koji Kondo. Cada melodía vinculada a la Ocarina se ha vuelto un ícono cultural, definiendo el paisaje sonoro de la fantasía.',
  },
};

const manualDiscsData = [
  {
    folder: "Banjo-Kazooie's Great Adventure Original Soundtrack",
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408970/00_Front_lnjlkv.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408950/Disco1_sh6p3f.png',
  },
  {
    folder: 'Bomberman Hero',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408965/00_Booklet_Front_ctfnxy.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408951/Disco1_u8nris.png',
  },
  {
    folder: 'Bully Original Game Soundtrack',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408952/Cover_ybbimi.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408955/Disco1_mggtc4.png',
  },
  {
    folder: 'Castlevania Symphony of the night',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408958/cover_mgaykt.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408953/Disco1_vciqkq.png',
  },
  {
    folder: 'Diddy Kong Racing',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408968/00_Front_nlxt6j.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408956/Disco1_dk9lkc.png',
  },
  {
    folder: 'DK Country',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409037/00_Front_y4e38r.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408957/Disco1_a80gxn.png',
  },
  {
    folder: 'God of war III',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408967/00_Front_1_nil4xy.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408964/Disco1_qajvkn.png',
  },
  {
    folder: 'Halo Combat Evolved (Original Soundtrack)',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408961/00_Front_1_sugj1d.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408963/Disco1_zysibv.png',
  },
  {
    folder: 'Jet Set Radio',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409033/00_Booklet_Front_ze48ou.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408959/Disco1_pz2xcx.png',
  },
  {
    folder: 'Kingdom Hearts HD1.5',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408971/00_Front_pg1twf.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408971/Disco1_d6quv5.png',
  },
  {
    folder: 'Kirby 64 - The Crystal Shards Original Soundtrack',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408974/00_Front_dup5cy.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408973/Disco1_pewj4m.png',
  },
  {
    folder: 'Mario Kart Wii',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408976/Front_rsxqtd.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408974/Disco1_jykmfl.png',
  },
  {
    folder: 'Metal Gear Solid',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408976/00_Booklet_Front_jsrpd5.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408977/Disco1_em95ct.png',
  },
  {
    folder: 'No More Heroes',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409034/00_Booklet_Front_b16lmh.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408978/Disco1_lvhhao.png',
  },
  {
    folder: 'Paper Mario Game Music Soundtrack',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408980/00_Front_uyyosc.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408980/Disco1_mvj4ot.png',
  },
  {
    folder: 'Persona 5',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408982/Cover_mjpmcb.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408982/Disco1_vkqwjw.png',
  },
  {
    folder: 'Ridge Racer Type 4',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408985/00_Front_qprd9e.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408985/Disco1_v6hxkz.png',
  },
  {
    folder: 'Shadow Of the Colossus',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408988/Front_yt5dcv.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408986/Disco1_reudma.png',
  },
  {
    folder: 'Silent Hill 2',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408989/Front_husili.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408988/Disco1_q0frgj.png',
  },
  {
    folder: 'Super Mario 64',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408991/Front_xt93lg.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408990/Disco1_wvrrji.png',
  },
  {
    folder: 'Super Mario Galaxy',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408994/00_Front_k17vk8.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408993/Disco1_tbfgqx.png',
  },
  {
    folder: 'The Last Of Us',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408994/00_Front_sr9mgi.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408995/Disco1_bjerrl.png',
  },
  {
    folder: "Yoshi's Island",
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408998/01_Front_l4p5f2.jpg',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408997/Disco1_uqpn5k.png',
  },
  {
    folder: 'Zelda Ocarina Of time',
    cover:
      'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786409034/00_Front_1_s5cqgf.png',
    disc: 'https://res.cloudinary.com/dabfglubl/image/upload/f_auto,q_auto/v1786408998/Disco1_ffuci3.png',
  },
];

const extractedCdsMap = {};
manualDiscsData.forEach((item) => {
  const folderName = item.folder;

  if (!extractedCdsMap[folderName]) {
    extractedCdsMap[folderName] = {
      name: folderName,
      realTitle: discMetadata[folderName]?.realTitle || folderName,
      description: discMetadata[folderName]?.description,
      tracks: customTracks[folderName] || [
        { title: `${folderName} Theme 1`, url: '' },
        { title: `${folderName} Theme 2`, url: '' },
        { title: `${folderName} Theme 3`, url: '' },
      ],
    };
  }

  extractedCdsMap[folderName].discUrl = item.disc;
  extractedCdsMap[folderName].coverUrl = item.cover;
});

const extractedCds = Object.values(extractedCdsMap);

// Duplicate CDs to fill the hexagon carousel (24 discs = 6 sides x 4 discs)
const filledCds = [...extractedCds];
let idx = 0;
while (filledCds.length < 24) {
  if (extractedCds.length > 0) {
    filledCds.push({ ...extractedCds[idx], duplicateId: Math.random() });
    idx = (idx + 1) % extractedCds.length;
  } else {
    break;
  }
}

// Generate the 6 faces of the hexagon
const faces = ref([]);
for (let i = 0; i < 6; i++) {
  faces.value.push(filledCds.slice(i * 4, i * 4 + 4));
}

const currentAngle = ref(0);
const activeCd = ref(null);
const playing = ref(false);
const activeTrack = ref(1);
const volume = ref(50);
const isDescExpanded = ref(false);

const audioPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
  const m = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const currentTrackUrl = computed(() => {
  if (!activeCd.value || !activeCd.value.tracks[activeTrack.value - 1]) return '';
  return activeCd.value.tracks[activeTrack.value - 1].url;
});

const formattedTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const rotateLeft = () => {
  currentAngle.value += 60;
};

const rotateRight = () => {
  currentAngle.value -= 60;
};

const touchStartX = ref(0);
const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};
const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX.value - 50) {
    rotateRight();
  } else if (touchEndX > touchStartX.value + 50) {
    rotateLeft();
  }
};

const onTimeUpdate = () => {
  if (audioPlayer.value) currentTime.value = audioPlayer.value.currentTime;
};

const onSeek = (e) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = parseFloat(e.target.value);
    currentTime.value = parseFloat(e.target.value);
  }
};

const onLoadedMetadata = () => {
  if (audioPlayer.value) duration.value = audioPlayer.value.duration;
};

const onTrackEnd = () => {
  if (activeCd.value && activeTrack.value < activeCd.value.tracks.length) {
    playTrack(activeTrack.value + 1);
  } else {
    playing.value = false;
  }
};

const selectCd = (cd) => {
  activeCd.value = cd;
  isDescExpanded.value = false;
  stop();
};

const playTrack = (trackNum) => {
  activeTrack.value = trackNum;
  playing.value = true;
};

const togglePlay = () => {
  if (!playing.value) {
    if (activeCd.value && activeCd.value.tracks[activeTrack.value - 1].url === '') {
      playing.value = true;
      return;
    }
  }
  playing.value = !playing.value;
};

const stop = () => {
  playing.value = false;
  activeTrack.value = 1;
  currentTime.value = 0;
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
  }
};

const onAudioError = (e) => {
  console.error('Audio Load Error:', e);
  // Only notify on real playback attempt, not fast manual switching
  if (playing.value && currentTrackUrl.value) {
    // Could emit an event or use a global toast here
    // For now log for debug and stop playback
    playing.value = false;
  }
};

watch([currentTrackUrl, playing], async ([newUrl, newPlaying], [oldUrl, oldPlaying]) => {
  if (!audioPlayer.value) return;

  // URL changed (track or CD changed)
  if (newUrl !== oldUrl) {
    currentTime.value = 0;
    duration.value = 0;

    // Force load of new resource
    audioPlayer.value.load();

    // Wait for next tick to ensure DOM processed src before playing
    if (newPlaying) {
      await nextTick();
      audioPlayer.value.play().catch(() => {
        playing.value = false;
      });
    }
  }
  // Playback state changed manually
  else if (newPlaying !== oldPlaying) {
    if (newPlaying) {
      audioPlayer.value.play().catch(() => {
        playing.value = false;
      });
    } else {
      audioPlayer.value.pause();
    }
  }
});

watch(volume, (newVal) => {
  if (audioPlayer.value) audioPlayer.value.volume = newVal / 100;
});

const prevTrack = () => {
  if (activeTrack.value > 1) {
    playTrack(activeTrack.value - 1);
  }
};

const nextTrack = () => {
  if (activeCd.value && activeTrack.value < activeCd.value.tracks.length) {
    playTrack(activeTrack.value + 1);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
.music-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #0d1526;
  color: #f8fafc;
  overflow: hidden;
  position: relative;
}

.page-title {
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 25px;
  text-align: center;
  letter-spacing: 1px;
  position: relative;
  z-index: 10;
}

.back-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: #1e293b;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #3b82f6;
  transform: translateX(-5px);
}

.music-layout {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.cube-container {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid #334155;
  color: #cbd5e1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 50;
  transition: all 0.2s;
}

.nav-arrow:hover {
  background: #fbbf24;
  color: #000;
  border-color: #fbbf24;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

.nav-arrow.left {
  left: 10px;
}
.nav-arrow.right {
  right: 10px;
}

.scene {
  width: 154px; /* Ancho estimado caja CD + márgenes */
  height: 580px;
  position: relative;
  transform-style: preserve-3d;
  margin-top: -10px;
  transform: scale(1.15);
}

.carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1); /* Spring effect on rotation */
}

.carousel-face {
  position: absolute;
  width: 154px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #1e293b, #334155, #1e293b);
  border-left: 2px solid #0f172a;
  border-right: 2px solid #475569;
  transform-style: preserve-3d; /* CRITICAL: allows CD hover effect to elevate */
}

.rack-pedestal {
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%) rotateX(80deg);
  width: 140px;
  height: 140px;
  background: #1e293b;
  border-radius: 50%;
  box-shadow: 0 50px 30px rgba(0, 0, 0, 0.8);
}
.rack-base {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%) rotateX(80deg);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #334155, #0f172a);
  border-radius: 50%;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.9),
    inset 0 2px 5px rgba(255, 255, 255, 0.1);
  border: 4px solid #1e293b;
}

.rack-cap.top {
  position: absolute;
  top: -15px;
  left: -2px;
  width: 158px;
  height: 20px;
  background: #1e293b;
  border-top: 1px solid #475569;
  z-index: 10;
}

.cd-rack-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0;
  transform: translateZ(5px); /* Detach discs from rack spine to prevent clipping */
}

.cd-jewel-case {
  width: 142px;
  height: 125px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-left: 14px solid #111; /* Simulates black plastic hinge of classic CDs */
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.cd-jewel-case:hover {
  transform: translateZ(20px) scale(1.05);
  box-shadow: -10px 10px 20px rgba(0, 0, 0, 0.7);
  z-index: 20;
}

.cd-jewel-case.active {
  border-color: #3b82f6;
  box-shadow:
    0 0 20px rgba(59, 130, 246, 0.8),
    -10px 10px 20px rgba(0, 0, 0, 0.7);
  transform: translateZ(25px) scale(1.1);
}

.cd-cover-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cd-cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.jewel-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 100%
  );
  pointer-events: none;
  border-right: 2px solid rgba(255, 255, 255, 0.5);
}

.player-container {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1));
  border-left: 2px solid rgba(255, 255, 255, 0.05);
}

.empty-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
  height: 100%;
}

.rotate-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: spin 8s linear infinite;
  opacity: 0.5;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.header-info {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  background: rgba(30, 41, 59, 0.6);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: fadeUp 0.4s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.disc-presentation {
  display: flex;
  position: relative;
  width: 320px;
  height: 220px;
  flex-shrink: 0;
}

.active-cover {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);
  border: 1px solid #475569;
  position: relative;
  z-index: 2;
}

.active-disc {
  width: 210px;
  height: 210px;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  transition: left 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.active-disc.spinning {
  left: 105px;
  animation: spinDisc 3s linear infinite;
}

@keyframes spinDisc {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-info h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  color: #fbbf24;
  margin: 0 0 15px 0;
  letter-spacing: 1px;
}

.history-text {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
  font-size: 1.05rem;
}

.retro-player {
  background: #232c3f; /* Darker blue-grey matching screenshot */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  box-sizing: border-box;
}

.retro-top-row {
  display: flex;
  gap: 15px;
  height: 80px;
}

.retro-screen {
  flex: 1;
  min-width: 0;
  background: #060e19;
  border-radius: 6px;
  border: 1px solid #141f2e;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-family: 'Share Tech Mono', monospace;
  color: #38bdf8;
  letter-spacing: 2px;
}

.retro-time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.8rem;
  line-height: 1;
  text-shadow: 0 0 5px rgba(56, 189, 248, 0.4);
  width: 100px;
}

.retro-time .total-time {
  margin-top: 5px;
}

.retro-screen-divider {
  width: 2px;
  background: rgba(56, 189, 248, 0.2);
  height: 80%;
  margin: 0 20px;
}

.retro-title-marquee {
  flex: 1;
  overflow: hidden;
  min-width: 0;
  font-size: 1.2rem;
  text-shadow: 0 0 5px rgba(56, 189, 248, 0.4);
  display: flex;
  align-items: center;
}

.marquee-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 10s linear infinite;
}

.marquee-content.paused {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.retro-big-play {
  width: 100px;
  background: #02060d;
  border-radius: 6px;
  border: 1px solid #141f2e;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #38bdf8;
  font-size: 2.2rem;
  transition: all 0.1s;
}

.retro-big-play:hover {
  background: #0a111a;
  color: #7dd3fc;
}

.retro-big-play:active {
  background: #000;
}

.retro-progress-row {
  display: flex;
  align-items: center;
}

.retro-seek-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #0f1624;
  border-radius: 4px;
  outline: none;
  border: 1px solid #000;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

.retro-seek-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #38bdf8;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  border: 2px solid #232c3f;
}

.retro-bottom-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  min-height: 80px;
}

.retro-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.retro-ctrl-btn {
  background: linear-gradient(145deg, #37465e, #1d2532);
  border: 1px solid #0f1624;
  color: #cbd5e1;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow:
    1px 2px 5px rgba(0, 0, 0, 0.5),
    inset 1px 1px 1px rgba(255, 255, 255, 0.1);
  transition: all 0.1s;
}

.retro-ctrl-btn:active {
  background: #1d2532;
  box-shadow: inset 1px 2px 5px rgba(0, 0, 0, 0.6);
  color: #38bdf8;
}

.retro-mini-tracklist {
  flex: 1;
  background: #1e283b;
  border-radius: 6px;
  border: 1px solid #0f1624;
  overflow: hidden;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
  height: 100%;
}

.retro-tracklist-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
}

.retro-tracklist-ul::-webkit-scrollbar {
  width: 6px;
}
.retro-tracklist-ul::-webkit-scrollbar-thumb {
  background: #38bdf8;
  border-radius: 3px;
}
.retro-tracklist-ul::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.retro-tracklist-ul li {
  padding: 5px 10px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  border-bottom: 1px solid #141f2e;
}

.retro-tracklist-ul li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.retro-tracklist-ul li.playing {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
}

.retro-track-num {
  font-family: 'Share Tech Mono', monospace;
  color: #64748b;
  margin-right: 10px;
  font-size: 0.9rem;
}
.retro-tracklist-ul li.playing .retro-track-num {
  color: #38bdf8;
}

.retro-volume-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
}

.retro-volume-container {
  position: relative;
  width: 70px;
  height: 70px;
  min-width: 70px;
  min-height: 70px;
  flex: 0 0 70px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-label {
  font-family: 'Share Tech Mono', monospace;
  color: #64748b;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.retro-volume-knob {
  width: 70px;
  height: 70px;
  min-width: 70px;
  min-height: 70px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 4px;
  box-sizing: border-box;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.8);
}

.knob-dial {
  width: 62px;
  height: 62px;
  min-width: 62px;
  min-height: 62px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(145deg, #37465e, #1d2532);
  box-shadow:
    2px 2px 8px rgba(0, 0, 0, 0.5),
    inset 1px 1px 2px rgba(255, 255, 255, 0.2);
  position: relative;
  display: flex;
  justify-content: center;
}

.knob-indicator {
  position: absolute;
  top: 6px;
  width: 4px;
  height: 14px;
  background: #38bdf8;
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(56, 189, 248, 0.5);
}

.knob-range {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}
.playing .track-num {
  color: #38bdf8;
}

.duration {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.8;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .back-btn {
    position: relative;
    top: 0;
    left: 0;
    margin: 15px auto 10px 15px;
    width: max-content;
  }

  .page-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.8rem;
  }

  .mobile-only {
    display: block !important;
  }

  .desktop-only {
    display: none !important;
  }

  .nav-arrow {
    display: none;
  }

  .cube-container {
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 10px;
  }

  .scene {
    transform: scale(0.765);
    margin-top: 0px;
    margin-bottom: 0px;
    order: 2;
  }

  .mobile-helper-text {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    transform: none;
    margin: 0 auto;
    width: 85%;
    max-width: 300px;
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 10px 15px;
    text-align: center;
    color: #cbd5e1;
    font-size: 0.95rem;
    font-weight: 500;
    pointer-events: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    order: 1;
  }

  .player-container {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    height: calc(100% - 70px);
    z-index: 100;
    background: rgba(13, 21, 38, 0.95);
    backdrop-filter: blur(8px);
    padding: 10px 2%;
    box-sizing: border-box;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
  }

  .player-container.is-active {
    display: flex;
  }

  .empty-info {
    display: none !important;
  }

  .info-panel {
    width: 100%;
    height: auto;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    padding-top: 15px;
  }

  .close-player-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #1e293b;
    color: #cbd5e1;
    border: 1px solid #334155;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 110;
    font-size: 0.9rem;
  }

  .header-info {
    position: relative;
    padding: 10px;
    gap: 15px;
    margin-bottom: 15px;
  }

  .disc-presentation {
    width: 100px;
    height: 100px;
  }

  .active-cover {
    width: 100px;
    height: 100px;
  }

  .active-disc {
    display: none;
  }

  .text-info h2 {
    font-size: 1.2rem;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .history-text {
    font-size: 0.85rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 2px;
  }

  .history-text.expanded {
    display: block;
    -webkit-line-clamp: unset;
  }

  .ver-mas-btn {
    background: none;
    border: none;
    color: #38bdf8;
    font-size: 0.85rem;
    padding: 0;
    cursor: pointer;
    text-decoration: underline;
    font-family: 'Roboto', sans-serif;
  }

  .retro-player {
    padding: 12px;
    gap: 12px;
  }

  .retro-top-row {
    height: 60px;
  }

  .retro-screen {
    padding: 5px 10px;
  }

  .retro-time {
    font-size: 1.2rem;
    width: auto;
  }

  .retro-big-play {
    display: none;
  }

  .retro-bottom-row {
    flex-direction: column;
    gap: 15px;
  }

  .retro-controls {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .retro-controls button:nth-child(3) {
    display: flex;
  }

  .retro-volume-section {
    order: 2;
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  .retro-volume-knob {
    display: none;
  }

  .retro-volume-container {
    width: 100%;
    height: auto;
    min-width: 0;
    min-height: 0;
    aspect-ratio: auto;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .knob-range {
    position: relative;
    opacity: 1;
    width: 100%;
    height: 12px;
    background: #0f1624;
    border-radius: 6px;
    border: 1px solid #000;
    -webkit-appearance: none;
  }

  .knob-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #38bdf8;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    border: 2px solid #232c3f;
  }

  .retro-mini-tracklist {
    order: 3;
    width: 100%;
    min-height: auto;
    height: auto;
  }
}
</style>
