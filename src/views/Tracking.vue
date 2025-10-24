<template>  
  <section class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20">
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono text-white">
          

        </div>
      </div>
    </div>
  </section>


  <section class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20">
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono text-white">
          <!--<StarFieldFilter1 :stars="starFieldStore.clusterStars" />-->
        </div>
      </div>
    </div>
  </section>


  <section class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20">
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono text-white">
          <!--<StarFieldFilter1 :stars="starFieldStore.stormStars" />-->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, toRefs,onMounted } from 'vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'
import { useVisitorStore } from '@/stores/visitorStore.js'


const starFieldStore = useStarFieldStore()
const { stars, flyingStars, clusterStars, stormStars } = toRefs(starFieldStore)

// Create a computed array for the combined stars with fallback to empty arrays
const allStars = computed(() => [
  ...(flyingStars.value || []),
  ...(clusterStars.value || []),
  ...(stormStars.value || []),
  //...(stars.value || [])
])
</script>
