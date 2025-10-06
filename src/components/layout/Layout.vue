<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden">
    <SEO
      :title="props.title"
      :description="`TCSN ${props.title}`"
      site-title="TCSN"
    />
    <!--<Header />-->
    <main class="flex-1 w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)]">
      <slot />
    </main>
    <!--<Footer />-->
  </div>
</template>

<script setup>
import SEO from './SEO.vue'
import Header from './header/Header.vue'
import Footer from './Footer.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'TCSN'
  }
})
</script>