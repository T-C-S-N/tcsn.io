<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all"
    :class="{ 'shadow-lg': isScrolled }"
  >
    <nav class="max-w-7xl mx-auto px-4 lg:px-8">
      <div class="flex justify-between items-center h-14 lg:h-16">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center text-2xl lg:text-3xl text-text font-medium no-underline transition-all duration-300 backdrop-blur-md shadow-lg rounded-full px-4 py-2 hover:opacity-80 z-10"
          @click="closeMobileMenu"
        >
          TCSN
        </router-link>

        <!-- Desktop Navigation - Show on large screens -->
        <div class="hidden lg:flex items-center gap-1 xl:gap-3">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-4 xl:px-6 py-2.5 text-gray-300 no-underline font-medium text-sm xl:text-base rounded-lg transition-all duration-200 border border-transparent hover:border-gray-600"
            :class="isActiveRoute(item.path) 
              ? 'text-white bg-gray-700 border-gray-600 shadow-md' 
              : 'hover:text-white hover:bg-gray-800/50'"
          >
            <font-awesome-icon
              :icon="item.icon"
              class="text-sm xl:text-base"
            />
            <span>{{ item.name }}</span>
          </router-link>
          
          <!-- Theme Toggle -->
          <button
            class="flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 ml-2 text-gray-300 border border-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:text-white hover:bg-gray-700 hover:border-gray-500 hover:rotate-12"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            @click="toggleTheme"
          >
            <font-awesome-icon
              :icon="isDarkMode ? ['fas', 'sun'] : ['fas', 'moon']"
              class="text-sm xl:text-base"
            />
          </button>
        </div>

        <!-- Tablet Navigation - Show on medium screens -->
        <div class="hidden md:flex lg:hidden items-center gap-1">
          <router-link
            v-for="item in navigationItems.slice(0, 3)"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-1.5 px-3 py-2 text-gray-300 no-underline font-medium text-sm rounded-md transition-all duration-200"
            :class="isActiveRoute(item.path) 
              ? 'text-white bg-gray-700' 
              : 'hover:text-white hover:bg-gray-800/50'"
          >
            <font-awesome-icon
              :icon="item.icon"
              class="text-sm"
            />
            <span class="hidden md:inline">{{ item.name }}</span>
          </router-link>
          
          <!-- More Menu for tablet -->
          <button
            class="flex items-center justify-center w-9 h-9 text-gray-300 border border-gray-600 rounded-md cursor-pointer transition-all duration-200 hover:text-white hover:bg-gray-700"
            @click="toggleMobileMenu"
          >
            <font-awesome-icon
              :icon="['fas', 'ellipsis-h']"
              class="text-sm"
            />
          </button>
        </div>

        <!-- Mobile menu button - Show only on small screens -->
        <button
          class="flex md:hidden items-center justify-center w-10 h-10 text-gray-300 border border-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:text-white hover:bg-gray-800 hover:border-gray-500"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMobileMenu"
        >
          <font-awesome-icon 
            :icon="['fas', isMobileMenuOpen ? 'times' : 'bars']"
            class="text-lg"
          />
        </button>
      </div>

      <!-- Mobile Navigation Overlay -->
      <transition name="mobile-menu">
        <div
          v-show="isMobileMenuOpen"
          class="fixed top-14 left-0 right-0 bottom-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
          @click="closeMobileMenu"
        >
          <div 
            class="absolute top-0 right-0 w-full max-w-sm h-full bg-gray-800 bg-opacity-95 backdrop-blur-xl border-l border-gray-700 shadow-2xl overflow-y-auto"
            @click.stop
          >
            <div class="p-8 space-y-2">
              <router-link
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-4 px-5 py-4 text-gray-300 no-underline font-medium text-lg rounded-md mb-2 transition-all duration-200 relative overflow-hidden border border-gray-700"
                :class="isActiveRoute(item.path) 
                  ? 'text-gray-100 bg-gray-700 border-gray-600' 
                  : 'hover:text-gray-100 hover:bg-gray-700 hover:border-gray-600'"
                @click="closeMobileMenu"
              >
                <div 
                  v-if="isActiveRoute(item.path)"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-600"
                />
                <font-awesome-icon
                  :icon="item.icon"
                  class="text-xl w-6 text-center"
                />
                <span class="flex-1">{{ item.name }}</span>
                <font-awesome-icon 
                  v-if="isActiveRoute(item.path)"
                  :icon="['fas', 'check']"
                  class="text-gray-400"
                />
              </router-link>
              
              <!-- Theme Toggle Mobile -->
              <div class="mt-8 pt-8 border-t border-gray-700">
                <button
                  class="flex items-center gap-4 w-full px-5 py-4 text-gray-300 border border-gray-700 rounded-md text-lg font-medium cursor-pointer transition-all duration-200 hover:text-gray-100 hover:bg-gray-700 hover:border-gray-600"
                  @click="toggleTheme"
                >
                  <font-awesome-icon 
                    :icon="['fas', isDarkMode ? 'sun' : 'moon']"
                    class="text-xl w-6 text-center"
                  />
                  <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isDarkMode = ref(false)

const navigationItems = [
  { name: 'Home', path: '/', icon: ['fas', 'home'] },
  { name: 'Projects', path: '/projects', icon: ['fas', 'folder-open'] },
  { name: 'Memos', path: '/memos', icon: ['fas', 'sticky-note'] },
  { name: 'Contact', path: '/contact', icon: ['fas', 'envelope'] },
]

const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Initialize theme
  const savedTheme = localStorage.getItem('darkMode')
  isDarkMode.value = savedTheme === 'true'
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active > div,
.mobile-menu-leave-active > div {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from > div,
.mobile-menu-leave-to > div {
  transform: translateX(100%);
}
</style>
