<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden z-100">
    <header
      class="fixed top-0 left-0 flex justify-between items-center w-screen h-[75px] px-4 py-2 z-[50]"
    >
      <!-- Logo -->
      <div
        :class="`logo top-0 left-0 h-full z-[100] cursor-pointer transition-all backdrop-blur-[2px] hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-md ${
          $route.name === 'stars' ? 'opacity-30 hover:opacity-100' : ''
        }`"
        @click="toggleStarsView"
      >
        <Logo :status="logoStatus" class="h-full" />
      </div>

      <!-- Desktop navigation -->
      <div
        v-if="$route.name !== 'stars'"
        class="hidden md:flex flex-row justify-baseline items-center gap-1 text-primary h-full px-4 backdrop-blur-[2px] rounded-md"
      >
        <div
          v-for="(item, i) in navigationItems"
          :key="i"
          class="flex items-center px-2 py-1 transition-all cursor-pointer hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-md"
          :class="
            $route.name === item.name.toLowerCase()
              ? 'text-sm font-bold'
              : 'text-sm hover:text-primary'
          "
          @click="$router.push({ name: item.name.toLowerCase() })"
        >
          {{ item.name }}
        </div>
      </div>

      <!-- Mobile burger menu button -->
      <div
        v-if="$router.currentRoute.name !== 'stars'"
        class="md:hidden flex items-center z-[200] border border-transparent hover:border-primary/10 rounded-md px-2 py-1 backdrop-blur-[2px] transition-all"
      >
        <a
          class="flex flex-col justify-center items-center w-8 h-8 space-y-1 cursor-pointer transition-all outline-none"
          :class="isMobileMenuOpen ? 'text-primary-400' : 'text-primary'"
          @click="toggleMobileMenu"
        >
          <span
            class="block w-6 h-0.5 bg-primary transition-all duration-300"
            :class="isMobileMenuOpen ? 'translate-y-2' : ''"
          />
          <span
            class="block w-6 h-0.5 bg-primary transition-all duration-300"
            :class="isMobileMenuOpen ? 'opacity-0' : ''"
          />
          <span
            class="block w-6 h-0.5 bg-primary transition-all duration-300"
            :class="isMobileMenuOpen ? '-translate-y-2' : ''"
          />
        </a>
      </div>
    </header>

    <!-- Mobile navigation overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-opacity-95 backdrop-blur-md z-[100] md:hidden w-full"
      @click="closeMobileMenu"
    >
      <div class="flex flex-col items-start justify-start h-full gap-4 text-primary p-4">
        <div
          v-for="(item, i) in navigationItems"
          :key="i"
          class="text-lg font-mono cursor-pointer transition-all"
          :class="
            $route.name === item.name.toLowerCase()
              ? 'text-xl font-bold translate-x-2 hover:translate-x-3'
              : 'text-sm hover:text-primary-400 hover:translate-x-1'
          "
          @click="navigateTo(item.name.toLowerCase())"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <SEO :title="props.title" :description="`TCSN ${props.title}`" site-title="TCSN" />
    <!--<Header />-->
    <main class="flex-1 w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)]">
      <slot />
    </main>
    <!--<Footer />-->
    <FooterNavigation />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SEO from './SEO.vue'
import FooterNavigation from './FooterNavigation.vue'
import Logo from '@/components/Logo.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'TCSN'
  }
})

const router = useRouter()
const logoStatus = ref(0)
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Home', path: '/', icon: ['fas', 'home'] },
  { name: 'About', path: '/about', icon: ['fas', 'info-circle'] },
  { name: 'Contact', path: '/contact', icon: ['fas', 'envelope'] }
]

const updateLogoStatus = (routeName) => {
  switch (routeName) {
    case 'home':
      logoStatus.value = 1
      break
    case 'about':
      logoStatus.value = 3
      break
    case 'contact':
      logoStatus.value = 5
      break
    default:
      logoStatus.value = 0
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const navigateTo = (routeName) => {
  closeMobileMenu()
  router.push({ name: routeName })
}

const toggleStarsView = () => {
  const currentRoute = router.currentRoute.value.name
  if (currentRoute !== 'home') {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'stars' })
  }
}

onMounted(() => {
  // Set initial logo status based on current route
  updateLogoStatus(router.currentRoute.value.name)
})

watch(
  () => router.currentRoute.value.name,
  (routeName) => {
    updateLogoStatus(routeName)
  }
)
</script>
