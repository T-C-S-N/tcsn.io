<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden z-100">
    <header class="flex justify-center items-center w-screen">
      <!-- Logo -->
      <div
        class="logo fixed top-0 left-0 w-[150px] px-5 py-2 z-[100] cursor-pointer hover:opacity-90 transition-all"
        @click="$router.push({ name: 'home' })"
      >
        <img src="/tcsn/2021-logo-black.svg" alt="TCSN Logo" class="w-full" />
      </div>
    </header>

    <SEO :title="props.title" :description="`TCSN ${props.title}`" site-title="TCSN" />
    <!--<Header />-->
    <main class="flex-1 w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)]">
      <slot />
    </main>
    <!--<Footer />-->

    <footer class="w-full h-16 px-4 flex items-center justify-between fixed bottom-0 left-0 z-30">
      <FooterNavigation />
    </footer>
  </div>
</template>

<script setup>
import SEO from './SEO.vue'
import Header from './header/Header.vue'
import Footer from './Footer.vue'
import FooterNavigation from './FooterNavigation.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'TCSN'
  }
})
</script>

<style lang="scss" scoped>
.logo {
  text-shadow: 0 0px 5px #00ff00;
}

.logo img {
  animation: rotateY 10s infinite linear;
  backface-visibility: hidden;
  animation: svg-glow-pulse 3s infinite alternate;
}

@keyframes svg-glow-pulse {
  0%,
  100% {
    filter: drop-shadow(0 0 1px #00ff00) drop-shadow(0 0 1px #00ff00);
  }
  50% {
    filter: drop-shadow(0 0 1px #00ff00) drop-shadow(0 0 1px #00ff00)
      drop-shadow(0 0 2px #00ff00);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 5px #00ff00;
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 1px #00ff00;
  }
}

@keyframes text-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00;
    filter: blur(0.2px);
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00;
    filter: blur(0.3px);
  }
}

// rotate Y animation for logo - stays still for 10s, rotates for 2s
@keyframes rotateY {
  0%,
  50% {
    transform: rotateY(0deg);
  }
  60% {
    transform: rotateY(90deg);
  }
  70%,
  100% {
    transform: rotateY(0deg);
  }
}
</style>
