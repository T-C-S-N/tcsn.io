<template>
  <header class="bg-white shadow-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="text-2xl font-bold text-gray-900"
          >
            TCSN
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            :class="{ 'text-blue-600': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            class="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            @click="toggleMobileMenu"
          >
            <Menu
              v-if="!isMobileMenuOpen"
              class="h-6 w-6"
            />
            <X
              v-else
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            :class="{ 'text-blue-600': $route.path === item.path }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Memos', path: '/memos' },
  { name: 'Contact', path: '/contact' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
