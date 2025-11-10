<script setup lang="ts">
import { watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useGameStore } from '@/stores/gameStore';
import HealthBar from '@/components/HealthBar.vue';
import ActionButton from '@/components/ActionButton.vue';
import GameLog from '@/components/GameLog.vue';
import GameOverModal from '@/components/GameOverModal.vue';

const { isDark, toggle } = useDarkMode()
const store = useGameStore();

// FORCE UPDATE HIGH SCORE BADGE
watch(
  () => store.highScore,
  (newVal) => {
    console.log('High score updated:', newVal)
  }
)
</script>

<template>
  <main :class="isDark ? 'dark' : ''" class="font-display">
    <div class="min-h-screen bg-linear-to-br from-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
        
      <!-- CENTERED CONTAINER -->
      <div class="max-w-sm sm:max-w-md md:max-w-xl xl:max-w-6xl mx-auto">

        <!-- HIGH SCORE BADGE -->
        <div class="text-center mb-4">
          <span class="inline-flex items-center gap-3 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105 cursor-default">
            🏆 Best: {{ store.highScore }} {{ store.highScore === 1 ? 'round' : 'rounds' }}
          </span>
        </div>

        <!-- DARK MODE TOGGLE -->
        <div class="flex justify-end mb-6">
          <button
            @click="toggle"
            class="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            <svg v-if="isDark" class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-2.464-4.95l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM5 11a1 1 0 100-2H4a1 1 0 000 2h1z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>
        </div>

        <!-- GAME TITLE -->
        <h1 class="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Monster Slayer
        </h1>

        <!-- NEW GAME BUTTON -->
        <div class="flex justify-center mt-6 mb-8">
          <button
            @click="store.startGame()"
            class="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Game
          </button>
        </div>

        <!-- HEALTH BARS -->
        <HealthBar label="You" :percentage="store.playerBarStyles.width" color="bg-emerald-500" />
        <HealthBar label="Monster" :percentage="store.monsterBarStyles.width" color="bg-red-600" />

        <!-- ACTION BUTTONS -->
        <div class="flex flex-wrap gap-3 justify-center mt-8">
          <ActionButton label="Attack" @click="store.attackMonster()" />
          <ActionButton
            label="Special Attack"
            :disabled="!store.mayUseSpecialAttack"
            variant="special"
            @click="store.specialAttackMonster(); store.attackPlayer()"
          />
          <ActionButton label="Heal" variant="heal" @click="store.healPlayer()" />
          <ActionButton label="Surrender" variant="surrender" @click="store.surrender()" />
        </div>

        <!-- SPECIAL ATTACK -->
        <p v-if="!store.mayUseSpecialAttack && store.currentRound > 0" class="text-center mt-2 text-sm text-purple-600">
          Special Attack in {{ 3 - (store.currentRound % 3) }} rounds
        </p>

        <!-- GAME LOG -->
        <GameLog :messages="store.logMessages"/>

      </div> <!-- END CENTERED CONTAINER -->

      <!-- GAME OVER MODAL -->
      <GameOverModal />

    </div>  
  </main>
</template>