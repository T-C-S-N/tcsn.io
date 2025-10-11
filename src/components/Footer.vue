<template>
  <footer 
    :class="[
      'w-full p-4 flex flex-col sm:flex-row justify-between items-center text-sm',
      isDarkMode ? 'bg-neutral-900 text-gray-300' : 'bg-white text-neutral-800'
    ]"
  >
    <div class="flex space-x-4 mb-4 sm:mb-0">
      <a href="https://linkedin.com/in/tocausan" target="_blank" class="hover:text-blue-500 transition">
        LinkedIn
      </a>
      <a href="https://github.com/tocausan" target="_blank" class="hover:text-blue-500 transition">
        GitHub
      </a>
      <a href="https://codepen.io/tocausan" target="_blank" class="hover:text-blue-500 transition">
        CodePen
      </a>
    </div>
    
    <div class="text-center text-xs">
      © {{ currentYear }} TCSN | All rights reserved
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isDarkMode: boolean
}

defineProps<Props>()

const currentYear = computed(() => new Date().getFullYear())
</script>
