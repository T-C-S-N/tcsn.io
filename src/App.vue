<template>
  <div id="app" class="font-sans antialiased">
    <div class="text-primary">
      <FieldMap :items="items" />
    </div>
    <Layout v-if="!isLoading">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </Layout>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFieldStore } from '@/stores/field.js'
import FieldMap from '@/components/field/FieldMap.vue'

const route = useRoute()
const { items } = toRefs(useFieldStore())
const { generateFieldItems, updateFieldItems } = useFieldStore()

// Initialize visitor tracking
//const {
//  //visitorName,
//  //isNewVisitor,
//  //isNewSession,
//  //isLoading
//  //getGreeting
//} = useVisitorTracking()

const isLoading = ref(true)

watch(
  () => route.path,
  () => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

onMounted(() => {
  // the splash screen will be shown while isLoading is true (minimum 2 seconds)
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false
    }, 13)
  }

  generateFieldItems()

  setInterval(() => {
    updateFieldItems()
  }, 100)

  // Regenerate on window resize
  window.addEventListener('resize', () => {
    generateFieldItems()
  })
})
</script>
