<template>
  <header 
    :class="[
      'header-nav',
      { 'header-scrolled': isScrolled }
    ]"
  >
    <nav class="nav-container">
      <div class="nav-content">
        <!-- Logo -->
        <div class="logo-section">
          <router-link
            to="/"
            class="logo-link"
            @click="closeMobileMenu"
          >
            <span class="logo-text">TCSN</span>
            <span class="logo-dot">.</span>
            <span class="logo-extension">IO</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': isActiveRoute(item.path) }"
          >
            <font-awesome-icon 
              :icon="item.icon" 
              class="nav-icon"
            />
            <span>{{ item.name }}</span>
          </router-link>
          
          <!-- Theme Toggle -->
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <font-awesome-icon 
              :icon="isDarkMode ? ['fas', 'sun'] : ['fas', 'moon']"
            />
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="mobile-menu-btn">
          <button
            class="menu-toggle"
            @click="toggleMobileMenu"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <font-awesome-icon 
              :icon="['fas', isMobileMenuOpen ? 'times' : 'bars']"
              class="menu-icon"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Overlay -->
      <transition name="mobile-menu">
        <div
          v-show="isMobileMenuOpen"
          class="mobile-nav-overlay"
          @click="closeMobileMenu"
        >
          <div 
            class="mobile-nav"
            @click.stop
          >
            <div class="mobile-nav-content">
              <router-link
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': isActiveRoute(item.path) }"
                @click="closeMobileMenu"
              >
                <font-awesome-icon 
                  :icon="item.icon" 
                  class="mobile-nav-icon"
                />
                <span class="mobile-nav-text">{{ item.name }}</span>
                <font-awesome-icon 
                  v-if="isActiveRoute(item.path)"
                  :icon="['fas', 'check']"
                  class="mobile-nav-check"
                />
              </router-link>
              
              <!-- Theme Toggle Mobile -->
              <div class="mobile-theme-toggle">
                <button
                  class="mobile-theme-btn"
                  @click="toggleTheme"
                >
                  <font-awesome-icon 
                    :icon="['fas', isDarkMode ? 'sun' : 'moon']"
                    class="mobile-theme-icon"
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
/* Header */
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
  transition: all 0.3s ease;
}

.header-scrolled {
  background: rgba(17, 24, 39, 0.85);
  border-bottom: 1px solid rgba(107, 114, 128, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* Logo */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 900;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo-text {
  background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.logo-dot {
  color: #6b7280;
  margin: 0 2px;
  animation: pulse 2s ease-in-out infinite;
}

.logo-extension {
  color: #9ca3af;
  font-size: 1.25rem;
  font-weight: 600;
}

.logo-link:hover .logo-text {
  filter: brightness(1.2);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  background: rgba(55, 65, 81, 0.3);
  border: 1px solid rgba(75, 85, 99, 0.2);
}

.nav-link:hover {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.4);
  border-color: rgba(107, 114, 128, 0.4);
  backdrop-filter: blur(8px);
}

.nav-link-active {
  color: #e5e7eb;
  background: rgba(75, 85, 99, 0.5);
  border-color: rgba(107, 114, 128, 0.5);
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #9ca3af, transparent);
}

.nav-icon {
  font-size: 1rem;
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #d1d5db;
  background: rgba(55, 65, 81, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  margin-left: 0.5rem;
}

.theme-toggle:hover {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.5);
  border-color: rgba(107, 114, 128, 0.5);
  transform: rotate(15deg);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: flex;
  align-items: center;
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #d1d5db;
  background: rgba(55, 65, 81, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.menu-toggle:hover {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.5);
  border-color: rgba(107, 114, 128, 0.5);
}

.menu-icon {
  font-size: 1.25rem;
}

/* Mobile Navigation Overlay */
.mobile-nav-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.mobile-nav {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: rgba(31, 41, 55, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-left: 1px solid rgba(75, 85, 99, 0.3);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

.mobile-nav-content {
  padding: 2rem 1.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background: rgba(55, 65, 81, 0.3);
  border: 1px solid rgba(75, 85, 99, 0.2);
}

.mobile-nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #9ca3af, #6b7280);
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link-active {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.5);
  border-color: rgba(107, 114, 128, 0.4);
  backdrop-filter: blur(8px);
}

.mobile-nav-link-active::before {
  transform: translateX(0);
}

.mobile-nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.mobile-nav-text {
  flex: 1;
}

.mobile-nav-check {
  color: #9ca3af;
  font-size: 1rem;
}

/* Mobile Theme Toggle */
.mobile-theme-toggle {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.mobile-theme-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  color: #d1d5db;
  background: rgba(55, 65, 81, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.mobile-theme-btn:hover {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.6);
  border-color: rgba(107, 114, 128, 0.5);
}

.mobile-theme-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

/* Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active .mobile-nav,
.mobile-menu-leave-active .mobile-nav {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-nav,
.mobile-menu-leave-to .mobile-nav {
  transform: translateX(100%);
}

/* Desktop - Medium screens and up */
@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
  
  .mobile-menu-btn {
    display: none;
  }
  
  .nav-content {
    height: 80px;
  }
  
  .logo-link {
    font-size: 2rem;
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .nav-container {
    padding: 0 2rem;
  }
  
  .desktop-nav {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

/* Extra small screens */
@media (max-width: 375px) {
  .logo-link {
    font-size: 1.5rem;
  }
  
  .mobile-nav {
    max-width: 100%;
  }
}
</style>
