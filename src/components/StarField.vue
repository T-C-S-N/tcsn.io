<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
    <!-- Canvas for all stars -->
    <canvas
      ref="starsCanvas"
      class="stars-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'

// Initialize store
const starFieldStore = useStarFieldStore()

// Canvas ref
const starsCanvas = ref(null)

// Canvas setup and event handling
onMounted(() => {
  if (starsCanvas.value) {
    // Set the canvas reference in the store
    starFieldStore.setStarsCanvas(starsCanvas.value)

    // Set canvas dimensions
    starsCanvas.value.width = window.innerWidth
    starsCanvas.value.height = window.innerHeight

    // Clear canvas completely to remove any artifacts from previous renders
    starFieldStore.resetCanvas()

    // Generate stars and start animation loop
    starFieldStore.generateStars(starsCanvas.value)
  }
})

onUnmounted(() => {
  starFieldStore.clearStars()
})
</script>

<style scoped>
/* Canvas for stars */
.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
