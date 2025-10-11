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
import { ref, onMounted, onUnmounted } from 'vue'

class Star {
  constructor(data) {
    // 2D plane coordinates (percentage)
    this.x = data?.x ?? 0
    this.y = data?.y ?? 0
    
    // Star properties
    this.size = data?.size ?? 1
    this.color = data?.color ?? '#FFB679'
    this.direction = data?.direction
    this.type = data?.type ?? 'static' // 'static', 'lonely', 'cluster', 'storm'
    this.isVisible = data?.isVisible ?? true
    
    // 3D velocity for Doppler effect and movement
    this.velocity3D = data?.velocity3D ?? { x: 0, y: 0, z: 0 }
    
    // Additional properties for animation
    this.startTime = data?.startTime ?? performance.now()
    this.animationDuration = data?.animationDuration ?? 3
    this.baseOpacity = data?.baseOpacity ?? 1
    this.twinkleDelay = data?.twinkleDelay ?? 0
    this.metadata = data?.metadata ?? {}
    
    // For moving stars
    this.startX = data?.startX
    this.startY = data?.startY
    this.endX = data?.endX
    this.endY = data?.endY
  }
}

// Stars array
const stars = ref([])

// Canvas related
const starsCanvas = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

onMounted(() => {
  // Initialize canvas dimensions
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
})

onUnmounted(() => {
  // Cleanup if needed
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
