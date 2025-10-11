<template>
  <header 
    :class="[
      'w-full h-16 px-4 flex items-center justify-between fixed top-0 left-0 z-30',
      isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'
    ]"
  >
    <div class="flex items-center">
      <router-link to="/" class="text-xl font-bold">
        TCSN
      </router-link>
    </div>
    
    <nav class="hidden md:flex space-x-6">
      <router-link to="/" class="hover:text-blue-500 transition">Home</router-link>
      <router-link to="/projects" class="hover:text-blue-500 transition">Projects</router-link>
      <router-link to="/contact" class="hover:text-blue-500 transition">Contact</router-link>
    </nav>
    
    <div class="md:hidden">
      <button @click="toggleMobileMenu" class="p-2">
        ☰
      </button>
    </div>
  </header>
  
  <!-- Mobile menu -->
  <div 
    v-if="showMobileMenu"
    :class="[
      'fixed top-16 left-0 w-full z-20 md:hidden',
      isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'
    ]"
  >
    <nav class="flex flex-col p-4 space-y-4">
      <router-link to="/" @click="closeMobileMenu" class="hover:text-blue-500 transition">Home</router-link>
      <router-link to="/projects" @click="closeMobileMenu" class="hover:text-blue-500 transition">Projects</router-link>
      <router-link to="/contact" @click="closeMobileMenu" class="hover:text-blue-500 transition">Contact</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isDarkMode: boolean
}

defineProps<Props>()

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>
