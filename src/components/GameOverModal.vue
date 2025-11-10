<template>
  <Transition name="modal">
    <div
      v-if="store.hasWinner"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 scale-100"
      >
        <!-- VICTORY / DEFEAT / DRAW -->
        <h2
          class="text-5xl font-bold mb-4"
          :class="{
            'text-green-600 dark:text-green-400': store.winner === 'player',
            'text-red-600 dark:text-red-400': store.winner === 'monster',
            'text-yellow-600 dark:text-yellow-400': store.winner === 'draw'
          }"
        >
          {{ store.winner === 'player' ? 'Victory!' : store.winner === 'draw' ? 'Draw!' : 'Defeat!' }}
        </h2>

        <!-- ROUNDS -->
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Rounds: <span class="font-bold">{{ store.currentRound }}</span>
        </p>

        <!-- NEW RECORD -->
        <p
          v-if="store.isNewRecord"
          class="text-2xl font-bold text-yellow-500 dark:text-yellow-400 animate-bounce mb-3"
        >
          NEW RECORD!
        </p>

        <!-- HIGH SCORE -->
        <p v-if="store.highScore" class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Best: {{ store.highScore }} {{ store.highScore === 1 ? 'round' : 'rounds' }}
        </p>

        <!-- NEW GAME BUTTON -->
        <button
          @click="store.startGame()"
          class="relative group w-full px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg transition transform hover:scale-105"
        >
          New Game
          <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Reset and start fresh
          </span>
        </button>
      </div>
    </div>
  </Transition>  
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
const store = useGameStore();
</script>