<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
    <!-- Canvas for background stars -->
    <canvas
      ref="starsCanvas"
      class="stars-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
    
    <!-- Containers for props.stars -->
    <div 
      v-for="(star, index) in props.stars" 
      :key="`star-container-${index}`"
      class="absolute pointer-events-auto"
      :style="{
        left: `${star.x * 100}%`,
        top: `${star.y * 100}%`,
        transform: 'translate(-50%, -50%)'
      }"
    >
      <!-- Star container circle -->
      <div 
        class="relative flex items-center justify-center"
        :style="{
          width: `${CONTAINER_RADIUS * 2}px`,
          height: `${CONTAINER_RADIUS * 2}px`
        }"
      >
        <!-- Circle container -->
        <div 
          class="absolute border-2 border-primary/30 rounded-full bg-primary/5 hover:bg-primary/10 transition-all duration-300"
          :style="{
            width: `${CONTAINER_RADIUS * 2}px`,
            height: `${CONTAINER_RADIUS * 2}px`
          }"
        />
        
        <!-- Line to label -->
        <svg 
          class="absolute pointer-events-none"
          :width="CONTAINER_RADIUS * 4"
          :height="CONTAINER_RADIUS * 4"
          :style="{
            left: `${CONTAINER_RADIUS}px`,
            top: `${CONTAINER_RADIUS}px`
          }"
        >
          <line 
            :x1="0" 
            :y1="0"
            :x2="CONTAINER_RADIUS * 2" 
            :y2="-CONTAINER_RADIUS"
            stroke="rgba(255, 182, 121, 0.4)"
            stroke-width="1"
            stroke-dasharray="2,2"
          />
        </svg>
        
        <!-- Label -->
        <div 
          class="absolute text-xs text-primary/70 bg-background/80 px-2 py-1 rounded border border-primary/20 whitespace-nowrap"
          :style="{
            left: `${CONTAINER_RADIUS * 2 + 5}px`,
            top: `-${CONTAINER_RADIUS + 10}px`
          }"
        >
          {{ star.name || star.label || `Star ${index + 1}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  stars: {
    type: Array,
    default: () => []
  }
})

// Constants
const CONTAINER_RADIUS = 20

// Canvas setup
const starsCanvas = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

// Simple background stars for ambiance
const backgroundStars = ref([])

// Generate simple background stars
const generateBackgroundStars = () => {
  backgroundStars.value = []
  const numStars = 150
  
  for (let i = 0; i < numStars; i++) {
    backgroundStars.value.push({
      x: Math.random() * canvasWidth.value,
      y: Math.random() * canvasHeight.value,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2
    })
  }
}

// Draw background stars
const drawBackgroundStars = () => {
  const canvas = starsCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  backgroundStars.value.forEach(star => {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 182, 121, ${star.opacity})`
    ctx.fill()
  })
}

// Handle window resize
const handleResize = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
  generateBackgroundStars()
  drawBackgroundStars()
}

onMounted(() => {
  generateBackgroundStars()
  drawBackgroundStars()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>