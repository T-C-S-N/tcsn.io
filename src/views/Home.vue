<template>
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

  <section class="w-full h-screen clip-container flex flex-col justify-start items-start">
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="w-full lg:w-1/2 text-md font-mono text-white">
          <StarFieldFilter1 :stars="starFieldStore.stars" />
          SCROLL TO REVEAL ME
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { watch } from 'vue'
import ChatBot from '@/components/ChatBot.vue'
import StarFieldFilter1 from '@/components/StarFieldFilter1.vue'
import {useStarFieldStore} from '@/stores/starFieldStore.js'

const starFieldStore = useStarFieldStore()

watch(
  () => starFieldStore.stars,
  (newStars) => {
    console.log( newStars)
  },
  { deep: true }
)
</script>

<style scoped>
/* CSS clip: rect() reveal effect - based on JSFiddle technique */
.clip-container {
  position: relative;
  /* Create stacking context */
  z-index: 1;
}

.clip-wrapper {
  /* Must be absolute positioned for clip: rect() to work */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Clip to the section boundaries using rect(top, right, bottom, left) */
  clip: rect(0px, auto, auto, 0px);
  overflow: hidden;
}

.fixed-content {
  /* Fixed positioning for the reveal effect */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
 
  
  /* Better browser compatibility fixes */
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;
  
  /* Ensure proper rendering on mobile/older browsers */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  transform: translateZ(0);
}

/* Alternative approach for better mobile support */
@supports not (clip: rect(0, 0, 0, 0)) {
  .clip-wrapper {
    /* Fallback to overflow clipping for browsers without clip support */
    clip: unset;
    overflow: hidden;
  }
}

/* First section should not have overflow hidden to not interfere */
section:first-child {
  overflow: visible;
}
</style>
