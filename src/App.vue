<template>
  <!--<ConnectionBackground />-->
  <StarField />

  <!--<Splash v-if="isLoading" />-->

  <div
    id="app"
    class="font-sans antialiased"
  >
    <!-- Visitor Welcome Message -->
    <!--<div
      v-if="visitorName && !isLoading"
      class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium shadow-md sticky top-0 z-[1000] animate-slide-down"
    >
      {{ getGreeting() }}
    </div>-->

    <Layout v-if="!isLoading">
      <router-view v-slot="{ Component, route }">
        <!--<transition
          name="fade"
          mode="out-in"
        >-->
        <component
          :is="Component"
          :key="route.path"
        />
        <!--</transition>-->
      </router-view>
    </Layout>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, watch, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'

//import { useVisitorTracking } from '@/composables/useVisitorTracking.js'
import ConnectionBackground from '@/components/ConnectionBackground.vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'
//import { useStarFieldStore } from '@/stores/starFieldStore.js'

const route = useRoute()
//const starFieldStore = useStarFieldStore()
const {generateStars} =useStarFieldStore()
const {stars} =toRefs(useStarFieldStore())


// Initialize visitor tracking
//const {
//  //visitorName,
//  //isNewVisitor,
//  //isNewSession,
//  //isLoading
//  //getGreeting
//} = useVisitorTracking()

const isLoading = ref(true)

watch(() => route.path, () => {
// Scroll to top when route changes
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  // the splash screen will be shown while isLoading is true (minimum 2 seconds)
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false
    }, 13)
  }

  //generateStars()
})
</script>
