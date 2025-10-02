<template>
  <div class="app-layout">
    <SEO
      :title="props.title"
      :description="`TCSN ${props.title}`"
      site-title="TCSN"
    />
    <Header />
    <main class="main-content">
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

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  width: 100%;
  margin-top: 70px; /* Header height on mobile */
  min-height: calc(100vh - 70px);
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .main-content {
    margin-top: 80px; /* Header height on desktop */
    min-height: calc(100vh - 80px);
  }
}
</style>