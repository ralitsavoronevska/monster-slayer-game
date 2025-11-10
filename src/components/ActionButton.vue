<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    class="px-6 py-2 font-bold text-white rounded transition
           disabled:opacity-50 disabled:cursor-not-allowed
           focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[colors[variant || 'normal'], disabled && 'bg-opacity-75']"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  disabled?: boolean;
  variant?: 'normal' | 'special' | 'heal' | 'surrender';
}>();
defineEmits<{ (e: 'click'): void }>();

const colors = {
  normal: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  special: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
  heal: 'dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 bg-green-800 hover:bg-green-900 focus:ring-green-700',
  surrender: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
};
</script>