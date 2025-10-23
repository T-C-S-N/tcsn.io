<template>
  <div
    ref="filterContainer"
    class="inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
    style="clip-path: inset(0)"
  >
    <!-- Containers for props.stars -->
    <div
      v-for="(star, index) in props.stars"
      :key="`star-container-${index}-${containerKey}`"
      class="absolute pointer-events-auto"
      :class="getStarAnimationClass(star.type)"
      :style="getStarContainerStyle(star, index)"
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
          class="absolute text-xs text-primary/70 bg-background/10 backdrop-blur-[2px] px-3 py-2 rounded-lg border border-primary/10 whitespace-nowrap flex items-center gap-2 shadow-lg"
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
          <span
            v-if="getStarCoordinatesAndSpeed(star, index)"
            class="font-medium"
          >
            <div class="">{{ getStarName(star, index) }}</div>
            <div class="">x: {{ getStarCoordinatesAndSpeed(star, index).x.toFixed(2) }}</div>
            <div class="">y: {{ getStarCoordinatesAndSpeed(star, index).y.toFixed(2) }}</div>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  stars: {
    type: Array,
    default: () => []
  }
})

// Constants
const CONTAINER_RADIUS = 20

// Responsive setup - use container's own dimensions
const filterContainer = ref(null)
const containerWidth = ref(window.innerWidth)
const containerHeight = ref(window.innerHeight)
const containerKey = ref(0)

// Handle window resize and update container dimensions
const handleResize = () => {
  if (filterContainer.value) {
    containerWidth.value = filterContainer.value.clientWidth
    containerHeight.value = filterContainer.value.clientHeight
  } else {
    containerWidth.value = window.innerWidth
    containerHeight.value = window.innerHeight
  }
  // Force re-render of containers when container size changes
  containerKey.value++
}

// Watch for container dimension changes to update positions
watch([containerWidth, containerHeight], () => {
  containerKey.value++
})

// Get star container position using same calculation as StarField store
const getStarContainerStyle = (star, index) => {
  if (!star || typeof star.getRotatedPosition !== 'function') {
    // Fallback to original positioning if getRotatedPosition is not available
    return {
      left: `${star.x * 100}%`,
      top: `${star.y * 100}%`,
      transform: 'translate(-50%, -50%)',
      animationDelay: `${index * 0.2}s`
    }
  }

  // Use the same positioning calculation as StarField store, but with container dimensions
  const pos = star.getRotatedPosition()
  const x = pos.x * containerWidth.value
  const y = pos.y * containerHeight.value

  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)',
    animationDelay: `${index * 0.2}s`
  }
}

// Helper functions for star display
const getStarName = (star, index) => {
  if (star.name) return star.name
  if (star.label) return star.label
  if (star.metadata?.name) return star.metadata.name
  return `${
    (star.type || 'Static').charAt(0).toUpperCase() + (star.type || 'static').slice(1)
  } Star ${index + 1}`
}

const getStarCoordinatesAndSpeed = (star, index) => {
  if (star) {
    return {
      x: star.x || 0,
      y: star.y || 0,
      velocity3D: star.velocity3D || { x: 0, y: 0, z: 0 },
      class: 'translate(-50%,-50%)',
      animationDelay: `${index * 0.2}s`
    }
  }
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
    case 'static':
      return 'rgba(251, 191, 36, 0.6)' // yellow-400
    case 'lonely':
      return 'rgba(96, 165, 250, 0.6)' // blue-400
    case 'cluster':
      return 'rgba(196, 181, 253, 0.6)' // purple-400
    case 'storm':
      return 'rgba(248, 113, 113, 0.6)' // red-400
    default:
      return 'rgba(255, 182, 121, 0.4)' // primary
  }
}

const getStarAnimationClass = (type) => {
  switch (type) {
    case 'static':
      return 'star-static-float'
    case 'lonely':
      return 'star-lonely-drift'
    case 'cluster':
      return 'star-cluster-orbit'
    case 'storm':
      return 'star-storm-chaos'
    default:
      return 'star-gentle-glow'
  }
}

onMounted(() => {
  // Initial measurement of container
  if (filterContainer.value) {
    containerWidth.value = filterContainer.value.clientWidth
    containerHeight.value = filterContainer.value.clientHeight
  }
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

/* Ensure content stays within borders */
:deep(div[class*="inset"]) {
  overflow: hidden !important;
  clip-path: inset(0) !important;
}
</style>
