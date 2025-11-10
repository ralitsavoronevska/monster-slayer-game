<template>
  <div class="@container bg-white dark:bg-gray-700 rounded-lg p-4 mt-6 max-h-64 overflow-y-auto">
    <h2 class="text-lg font-bold text-center mb-3 text-gray-700 dark:text-gray-300">
      Battle Log
    </h2>
    <div v-if="messages.length === 0" class="text-center text-gray-500 text-sm">
      No actions yet...
    </div>
    <div v-else>
      <p
        v-for="msg in messages"
        :key="msg.id"
        class="text-sm py-1 @md:text-center animate-fade-in"
        :class="{
          'text-green-600 dark:text-green-400': msg.actionBy === 'player',
          'text-red-600 dark:text-red-400': msg.actionBy === 'monster',
          'font-bold': msg.actionType === 'special-attack',
          'italic': msg.actionType === 'heal'
        }"
      >
        {{ msg.message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogMessage } from '@/stores/gameStore';

defineProps<{
  messages: LogMessage[]
}>()
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>