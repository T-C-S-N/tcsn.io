<template>
  <!-- Background StarField -->
  <StarField />

  <section class="fixed inset-0 pointer-events-none">
    <div class="relative w-full h-full">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50">
        You dont control anything... or do you ?
      </div>
    </div>
  </section>

  <section
    class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div
          :class="`h-1/2 text-md font-mono text-white border border-primary/20 ${
            screenFull1 ? 'w-screen h-screen' : 'w-screen h-screen'
          }`"
        >
          <StarFieldFilter1 :stars="allStars" class="w-full h-full" />

          <!-- full screen button -->
          <a
            class="absolute top-4 right-4 text-primary/50 p-2 rounded-md border border-primary/20 cursor-pointer hover:bg-background/50 transition-all"
            @click="screenFull1 = !screenFull1"
          >
            <fa :icon="['fas', screenFull1 ? 'expand' : 'compress']" class="bg-primary" />
          </a>
        </div>
      </div>
    </div>
  </section>

  <section
    class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="relative w-full lg:w-1/2 text-md font-mono text-white">
          <StarFieldFilter1 :stars="starFieldStore.clusterStars" />
        </div>
      </div>
    </div>
  </section>

  <section
    class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono text-white">
          <StarFieldFilter1 :stars="starFieldStore.stormStars" />
        </div>
      </div>
    </div>
  </section>

  <section
    class="clip-container flex justify-center lg:items-center w-full min-h-screen text-primary p-4 pt-10 lg:pt-4"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono">
          <ChatBot class="max-h-[calc(100vh-250px)]" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'

const starFieldStore = useStarFieldStore()
const { stars, flyingStars, clusterStars, stormStars } = toRefs(starFieldStore)

// Create a computed array for the combined stars with fallback to empty arrays
const allStars = computed(() => [
  ...(flyingStars.value || []),
  ...(clusterStars.value || []),
  ...(stormStars.value || [])
  //...(stars.value || [])
])

const screenFull1 = ref(false)
</script>
