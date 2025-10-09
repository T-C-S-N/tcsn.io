<template>
  <div 
    :class="[
      'flex flex-col min-h-screen',
      isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'
    ]"
  >
    <Header :isDarkMode="isDarkMode" />
    <main class="flex-1 w-screen h-screen relative z-10">
      <slot />
    </main>
    <Footer :isDarkMode="isDarkMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'

const isDarkMode = ref(false)

onMounted(() => {
  // Initialize dark mode preference
  isDarkMode.value = localStorage.getItem('darkMode') === 'true'
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

// Expose methods for child components
defineExpose({
  toggleDarkMode,
  isDarkMode
})
</script>
