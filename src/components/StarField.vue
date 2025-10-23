<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
    <!-- Canvas for rendering all stars -->
    <canvas
      ref="starsCanvas"
      class="stars-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'

// Get the store
const starFieldStore = useStarFieldStore()

// Canvas reference and dimensions
const starsCanvas = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

// Computed properties to access store data
const stars = computed(() => starFieldStore.stars)
const flyingStars = computed(() => starFieldStore.flyingStars)
const clusterStars = computed(() => starFieldStore.clusterStars)
const stormStars = computed(() => starFieldStore.stormStars)

// Throttle resize events
let resizeTimeout = null

// Handle window resize
const handleResize = () => {
  const newWidth = window.innerWidth
  const newHeight = window.innerHeight

  canvasWidth.value = newWidth
  canvasHeight.value = newHeight

  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  resizeTimeout = setTimeout(() => {
    if (starsCanvas.value) {
      const canvas = starsCanvas.value
      canvas.width = newWidth
      canvas.height = newHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, newWidth, newHeight)
        displayStars()
      }
    }
  }, 16)
}

// Display/render stars on canvas
function displayStars() {
  const canvas = starsCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Helper function to draw a star
  const drawStar = (star) => {
    // Get position (rotated for all stars)
    const pos = star.getRotatedPosition()

    // Calculate pixel positions
    const x = pos.x * canvas.width
    const y = pos.y * canvas.height

    // Skip stars outside visible area with margin
    const margin =
      star.type === 'lonely' || star.type === 'cluster' || star.type === 'storm'
        ? 500
        : 100
    if (
      x < -margin ||
      x > canvas.width + margin ||
      y < -margin ||
      y > canvas.height + margin
    )
      return

    const size = star.size
    const color = star.color
    const twinkleOpacity = star.getTwinkleOpacity()

    // Edge fading for smooth appearance
    const fadeMargin = 100
    let edgeFade = 1.0
    if (x < fadeMargin) edgeFade *= Math.max(0, x / fadeMargin)
    else if (x > canvas.width - fadeMargin)
      edgeFade *= Math.max(0, (canvas.width - x) / fadeMargin)
    if (y < fadeMargin) edgeFade *= Math.max(0, y / fadeMargin)
    else if (y > canvas.height - fadeMargin)
      edgeFade *= Math.max(0, (canvas.height - y) / fadeMargin)

    const finalOpacity = twinkleOpacity * edgeFade

    // Skip fully transparent stars
    if (finalOpacity <= 0.05) return

    ctx.globalAlpha = finalOpacity

    // Draw glow for moving stars (flying, cluster, and storm stars)
    if (star.type === 'lonely' || star.type === 'cluster' || star.type === 'storm') {
      const glowSize =
        size * (star.type === 'storm' ? 4 : star.type === 'cluster' ? 2.5 : 3)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
      gradient.addColorStop(0, color)
      gradient.addColorStop(
        0.5,
        color.replace('rgb', 'rgba').replace(')', ', 0.3)')
      )
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, glowSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw main star
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1.0
  }

  // Draw all star types
  stars.value.forEach(drawStar)
  flyingStars.value.forEach(drawStar)
  clusterStars.value.forEach(drawStar)
  stormStars.value.forEach(drawStar)
}

// Update loop
function startUpdateLoop() {
  const update = () => {
    // Update all stars in store
    stars.value.forEach((star) => {
      star.update()
    })

    flyingStars.value.forEach((star) => {
      star.update()
    })

    clusterStars.value.forEach((star) => {
      star.update()
    })

    stormStars.value.forEach((star) => {
      star.update()
    })

    // Remove expired flying stars
    const now = performance.now()
    const canvas = starsCanvas.value
    if (canvas) {
      // Filter flying stars
      starFieldStore.updateFlyingStars(
        flyingStars.value.filter((star) => {
          const elapsed = now - star.startTime
          const timeExpired = elapsed >= star.metadata.duration
          const x = star.x * canvas.width
          const y = star.y * canvas.height
          const outsideBounds =
            x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500
          return !timeExpired && !outsideBounds
        })
      )

      // Filter cluster stars
      starFieldStore.updateClusterStars(
        clusterStars.value.filter((star) => {
          const elapsed = now - star.startTime
          const timeExpired = elapsed >= star.metadata.duration
          const x = star.x * canvas.width
          const y = star.y * canvas.height
          const outsideBounds =
            x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500
          return !timeExpired && !outsideBounds
        })
      )

      // Filter storm stars
      starFieldStore.updateStormStars(
        stormStars.value.filter((star) => {
          const elapsed = now - star.startTime
          const timeExpired = elapsed >= star.metadata.duration
          const x = star.x * canvas.width
          const y = star.y * canvas.height
          const outsideBounds =
            x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500
          return !timeExpired && !outsideBounds
        })
      )
    }

    // Spawn new stars based on chances
    if (Math.random() < 0.0005) {
      starFieldStore.addFlyingStar()
    }
    if (Math.random() < 0.00002) {
      starFieldStore.addClusterStars()
    }
    if (Math.random() < 0.00002) {
      starFieldStore.addStormStars()
    }

    // Display stars
    displayStars()

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}

// Initialize on mount
onMounted(() => {
  // Initialize canvas dimensions
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight

  // Initialize star field in store
  starFieldStore.initializeStarField()

  // Register component with store
  starFieldStore.setStarFieldRef({
    reset: () => {
      starFieldStore.resetStarField()
    }
  })

  // Initial display
  displayStars()

  // Add window resize listener
  window.addEventListener('resize', handleResize)

  // Start update loop
  startUpdateLoop()
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})

// Expose methods for external control
defineExpose({
  reset: () => {
    starFieldStore.resetStarField()
  },
  getAllStars: () => {
    return [
      ...stars.value,
      ...flyingStars.value,
      ...clusterStars.value,
      ...stormStars.value
    ]
  }
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
