<template>
  <header
    class="fixed left-0 flex justify-between items-center gap-4 w-screen h-[75px] px-4 py-2 z-[100] transition-none"
    :style="{
      top: `${headerTopPosition}px`
    }"
  >
    <!-- Logo -->
    <div
      :class="`flex items-center logo top-0 left-0 h-[75%] z-[100] cursor-pointer transition-all z-100 px-6 ${
        $route.name === 'stars' ? 'opacity-30 hover:opacity-100' : ''
      } `"
      @click="toggleStarsView"
    >
      <!--<Logo :status="logoStatus" class="h-full" />-->

      <img :src="logoImg" alt="" class="h-full ml-2" />
    </div>

    <!-- Socials -->
    <div
      class="hidden lg:grid grid-cols-5 justify-center items-center gap-2 text-gray-900 h-full px-4 rounded-md"
    >
      <a
        v-for="(social, index) in socials"
        :key="index"
        :href="social.url"
        target="_blank"
        class="flex flex-row justify-center items-center gap-2 transition px-2 py-2 border-b border-transparent hover:border-gray-900"
      >
        <fa :icon="social.icon" />
        <div class="hidden sm:block">{{ social.name?.toUpperCase() }}</div>
      </a>
    </div>

    <!--<div class="px-4 py-1 z-[100] w-[calc(100vw/12)]">
      <LanguageSwitcher />
    </div>-->

    <!-- Mobile burger menu button -->
    <div
      v-if="$route.name !== 'stars'"
      class="lg:hidden flex items-center border border-transparent hover:border-primary/10 rounded-md px-2 py-1 backdrop-blur-[2px] transition-all z-[100]"
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
    class="fixed inset-0 bg-opacity-95 backdrop-blur-[5px] z-[100] lg:hidden w-full bg-gradient-to-bl from-transparent via-background/5 to-primary/5"
    @click="closeMobileMenu"
  >
    <div class="flex flex-col items-start justify-start h-full gap-8 text-primary p-4">
      <!--<div class="px-2 py-2 border-b border-primary/10 w-full h-20 flex items-center">
        <LanguageSwitcher />
      </div>-->

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
        {{ $t(item.i18n) }}
      </div>
    </div>
  </div>

  <SEO :title="props.title" :description="`TCSN ${props.title}`" site-title="TCSN" />
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SEO from './SEO.vue'
import logoImg from '@/assets/img/2025_tcsn_logo-sm.png'

const props = defineProps({
  title: {
    type: String,
    default: 'TCSN'
  }
})

const router = useRouter()
const logoStatus = ref(0)
const isMobileMenuOpen = ref(false)
const scrollY = ref(0)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

const socials = ref([
  {
    name: 'LinkedIn',
    url: 'https://mlnk.is/ZwRlTk',
    icon: ['fab', 'linkedin']
  },
  {
    name: 'GitHub',
    url: 'https://mlnk.is/mOQUmq',
    icon: ['fab', 'github']
  },
  {
    name: 'CodePen',
    url: 'https://mlnk.is/ZUtEWK',
    icon: ['fab', 'codepen']
  },
  {
    name: 'Behance',
    url: 'https://mlnk.is/iojJfi',
    icon: ['fab', 'behance']
  },
  //{
  //  name: 'Kaggle',
  //  url: 'https://mlnk.is/UVyD0t',
  //  icon: ['fab', 'kaggle']
  //}
])

const navigationItems = [
  //{ i18n: 'navigation.home', name: 'Home', path: '/', icon: ['fas', 'home'] },
  {
    i18n: 'navigation.about',
    name: 'About',
    path: '/about',
    icon: ['fas', 'info-circle']
  },
  //{
  //  i18n: 'navigation.projects',
  //  name: 'Projects',
  //  path: '/projects',
  //  icon: ['fas', 'project-diagram']
  //},
  {
    i18n: 'navigation.contact',
    name: 'Contact',
    path: '/contact',
    icon: ['fas', 'envelope']
  }
]

const headerTopPosition = computed(() => {
  return Math.max(0, Math.min(windowHeight.value - 75, windowHeight.value - 75 - (scrollY.value)))
})

const updateLogoStatus = (routeName) => {
  switch (routeName) {
    case 'home':
      logoStatus.value = 1
      break
    case 'about':
      logoStatus.value = 3
      break
    case 'projects':
      logoStatus.value = 7
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
    //router.push({ name: 'stars' })
  }
}

const handleScroll = () => {
  scrollY.value = window.scrollY
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  // Set initial logo status based on current route
  updateLogoStatus(router.currentRoute.value.name)
  
  // Initialize window height
  windowHeight.value = window.innerHeight
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // Remove scroll listener
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => router.currentRoute.value.name,
  (routeName) => {
    updateLogoStatus(routeName)
  }
)
</script>
