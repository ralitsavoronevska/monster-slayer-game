<template>
  <div class="mb-6">
    <div class="flex justify-between text-sm mb-1 font-medium">
      <span class="text-xl font-bold text-gray-800 dark:text-gray-100 ">
        {{ label }}
      </span>
      <span class="text-xl font-bold text-gray-800 dark:text-gray-100">
        {{ percentage }}
      </span>
    </div>
    <div class="mt-2 rounded-full h-10 overflow-hidden dark:bg-gray-700 bg-white">
      <div
        class="h-full transition-all duration-300"
        :class="color"
        :style="{ width: percentage }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  percentage: string
  color: string
}>()
</script>