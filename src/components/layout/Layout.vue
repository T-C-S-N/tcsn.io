<template>
  <div>
    <SEO
      :title="props.title"
      :description="`TCSN ${props.title}`"
      site-title="TCSN"
    />
    <Header />
    <main class="w-full min-h-screen bg-gray-100 shadow-md z-10">
      <slot />
    </main>
    <Footer />
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