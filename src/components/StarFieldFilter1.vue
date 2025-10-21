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
      :class="getStarAnimationClass(star.type)"
      :style="{
        left: `${star.x * 100}%`,
        top: `${star.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${index * 0.2}s`
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
        <!-- Circle container with dynamic styling -->
        <div 
          class="absolute rounded-full transition-all duration-300 cursor-pointer"
          :class="getContainerClasses(star.type)"
          :style="{
            width: `${CONTAINER_RADIUS * 2}px`,
            height: `${CONTAINER_RADIUS * 2}px`
          }"
        />
        
        <!-- Enhanced line to label -->
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
            :stroke="getLineColor(star.type)"
            stroke-width="2"
            stroke-dasharray="3,3"
            class="animate-pulse"
          />
        </svg>
        
        <!-- Label with star styling -->
        <div 
          class="absolute text-xs text-primary/70 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/30 whitespace-nowrap flex items-center gap-2 shadow-lg"
          :style="{
            left: `${CONTAINER_RADIUS * 2 + 8}px`,
            top: `-${CONTAINER_RADIUS + 12}px`
          }"
        >
          <!-- Star icon based on type -->
          <span 
            class="text-lg transition-all duration-200"
            :class="{
              'text-yellow-400 animate-pulse': star.type === 'static',
              'text-blue-400 animate-bounce': star.type === 'lonely',
              'text-purple-400 animate-spin': star.type === 'cluster',
              'text-red-400 animate-ping': star.type === 'storm',
              'text-white': !star.type
            }"
          >
            <!--{{ getStarIcon(star.type) }}-->
          </span>
          <!-- Star name/label -->
          <span class="font-medium">
            {{ getStarName(star, index) }}
          </span>
          <!-- Star type badge -->
          <span 
            class="text-xs px-2 py-1 rounded-full border"
            :class="getTypeBadgeClasses(star.type)"
          >
            {{ (star.type || 'static').toUpperCase() }}
          </span>
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

// Handle window resize
const handleResize = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

// Helper functions for star display
const getStarIcon = (type) => {
  switch (type) {
    case 'static': return '⭐'
    case 'lonely': return '💫'
    case 'cluster': return '✨'
    case 'storm': return '⚡'
    default: return '⭐'
  }
}

const getStarName = (star, index) => {
  if (star.name) return star.name
  if (star.label) return star.label
  if (star.metadata?.name) return star.metadata.name
  return `${(star.type || 'Static').charAt(0).toUpperCase() + (star.type || 'static').slice(1)} Star ${index + 1}`
}

const getTypeBadgeClasses = (type) => {
  switch (type) {
    case 'static':
      return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
    case 'lonely':
      return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
    case 'cluster':
      return 'bg-purple-400/20 text-purple-400 border-purple-400/30'
    case 'storm':
      return 'bg-red-400/20 text-red-400 border-red-400/30'
    default:
      return 'bg-white/20 text-white border-white/30'
  }
}

const getContainerClasses = (type) => {
  const baseClasses = 'border-2 hover:scale-110'
  switch (type) {
    case 'static':
      return `${baseClasses} border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/20`
    case 'lonely':
      return `${baseClasses} border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20`
    case 'cluster':
      return `${baseClasses} border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20`
    case 'storm':
      return `${baseClasses} border-red-400/50 bg-red-400/10 hover:bg-red-400/20`
    default:
      return `${baseClasses} border-primary/30 bg-primary/5 hover:bg-primary/10`
  }
}

const getLineColor = (type) => {
  switch (type) {
    case 'static': return 'rgba(251, 191, 36, 0.6)' // yellow-400
    case 'lonely': return 'rgba(96, 165, 250, 0.6)' // blue-400
    case 'cluster': return 'rgba(196, 181, 253, 0.6)' // purple-400
    case 'storm': return 'rgba(248, 113, 113, 0.6)' // red-400
    default: return 'rgba(255, 182, 121, 0.4)' // primary
  }
}

const getStarAnimationClass = (type) => {
  switch (type) {
    case 'static': return 'star-static-float'
    case 'lonely': return 'star-lonely-drift'
    case 'cluster': return 'star-cluster-orbit'
    case 'storm': return 'star-storm-chaos'
    default: return 'star-gentle-glow'
  }
}

onMounted(() => {
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