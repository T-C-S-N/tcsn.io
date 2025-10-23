<template>
  <div
    ref="filterContainer"
    class="inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
    style="clip-path: inset(0)"
  >
    <!-- Containers for props.stars -->
    <!-- Only render stars that are sufficiently inside (200px margin) or exiting -->
    <div
      v-for="(star, index) in visibleStars.filter((s) => shouldRenderStar(s))"
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
        <!-- Circle container - animated draw effect -->
        <svg
          class="absolute pointer-events-none"
          :width="CONTAINER_RADIUS * 2"
          :height="CONTAINER_RADIUS * 2"
          :style="{
            transform: 'translate(-50%, -50%)',
            left: `${CONTAINER_RADIUS}px`,
            top: `${CONTAINER_RADIUS}px`
          }"
          :class="getCircleAnimationClass(star)"
        >
          <circle
            :cx="CONTAINER_RADIUS"
            :cy="CONTAINER_RADIUS"
            :r="CONTAINER_RADIUS - 2"
            :stroke="getCircleColor(star.type)"
            stroke-width="2"
            fill="none"
            class="circle-draw"
            :class="getCircleStrokeClass(star)"
          />
        </svg>

        <!-- Background circle (visual support) -->
        <div
          class="absolute rounded-full cursor-pointer"
          :class="getContainerClasses(star.type)"
          :style="{
            width: `${CONTAINER_RADIUS * 2}px`,
            height: `${CONTAINER_RADIUS * 2}px`,
            opacity: 0.3
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
            :class="getLineAnimationClass(star)"
          />
        </svg>

        <!-- Label with animated text appearance -->
        <div
          class="absolute text-xs text-primary/70 bg-background/10 backdrop-blur-[2px] px-3 py-2 rounded-lg border border-primary/10 whitespace-nowrap flex items-center gap-2 shadow-lg"
          :style="{
            left: `${CONTAINER_RADIUS * 2 + 8}px`,
            top: `-${CONTAINER_RADIUS + 12}px`
          }"
          :class="getLabelAnimationClass(star)"
        >
          <!-- Star type badge -->
          <!--<span
            class="text-xs px-2 py-1 rounded-full border flex-shrink-0"
            :class="getTypeBadgeClasses(star.type)"
          >
            {{ (star.type || 'static').toUpperCase() }}
          </span>-->

          <!-- Star name/label with character animation -->
          <span
            v-if="getStarCoordinatesAndSpeed(star, index)"
            class="font-medium text-content pt-8"
            :class="getTextAnimationClass(star, index)"
          >
            <div class="line-content">{{ getStarName(star, index) }}</div>
            <div class="line-content">x: {{ getStarCoordinatesAndSpeed(star, index).x.toFixed(2) }}</div>
            <div class="line-content">y: {{ getStarCoordinatesAndSpeed(star, index).y.toFixed(2) }}</div>
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
const containerKey = ref(0)
const visibleStarsSet = ref(new Set()) // Track which stars are currently visible in filter
const starEntranceMap = ref(new Map()) // Track which stars are newly entering (for animation)

// Handle window resize and update container dimensions
const handleResize = () => {
  // Container dimensions are now calculated on-demand in getStarContainerStyle
  // No need to store them in refs - just trigger a minimal re-render
  containerKey.value++
}

// Get container dimensions and position relative to viewport
const getContainerInfo = () => {
  if (filterContainer.value) {
    const rect = filterContainer.value.getBoundingClientRect()
    return {
      width: filterContainer.value.clientWidth,
      height: filterContainer.value.clientHeight,
      // Position relative to viewport
      viewportX: rect.left,
      viewportY: rect.top,
      // Position in normalized coordinates (0-1 of full screen)
      normalizedX: rect.left / window.innerWidth,
      normalizedY: rect.top / window.innerHeight,
      normalizedWidth: rect.width / window.innerWidth,
      normalizedHeight: rect.height / window.innerHeight
    }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    viewportX: 0,
    viewportY: 0,
    normalizedX: 0,
    normalizedY: 0,
    normalizedWidth: 1,
    normalizedHeight: 1
  }
}

// Check if a star (in full-screen 0-1 coords) is within the filter bounds
// const isStarInFilter = (star) => {
//   if (!star) return false
//   const containerInfo = getContainerInfo()
//   
//   // Star is in full-screen coordinates (0-1)
//   // Check if it's within the filter's normalized bounds
//   return (
//     star.x >= containerInfo.normalizedX &&
//     star.x <= containerInfo.normalizedX + containerInfo.normalizedWidth &&
//     star.y >= containerInfo.normalizedY &&
//     star.y <= containerInfo.normalizedY + containerInfo.normalizedHeight
//   )
// }

// Convert full-screen coordinates to filter-local coordinates
const getFilterLocalCoordinates = (star) => {
  if (!star) return { x: 0, y: 0 }
  
  const containerInfo = getContainerInfo()
  
  // Normalize star position relative to filter container
  // (star.x, star.y) are in full-screen 0-1 space
  // Convert to filter-local 0-1 space
  const localX = (star.x - containerInfo.normalizedX) / containerInfo.normalizedWidth
  const localY = (star.y - containerInfo.normalizedY) / containerInfo.normalizedHeight
  
  return { x: localX, y: localY }
}

// Get visible stars (filter out those outside the viewport)
const getVisibleStars = () => {
  if (!Array.isArray(props.stars)) return props.stars
  
  const containerInfo = getContainerInfo()
  const margin = 100 / window.innerWidth // Margin in normalized coordinates
  
  return props.stars.filter((star) => {
    if (!star) return false
    
    // Get rotated position for visibility check (apply Earth rotation)
    let pos = { x: star.x || 0, y: star.y || 0 }
    if (typeof star.getRotatedPosition === 'function') {
      pos = star.getRotatedPosition()
    }
    
    // Check if star is within filter bounds (with margin for smooth entry)
    // Use rotated position to ensure margin check is accurate
    const isVisible = (
      pos.x >= containerInfo.normalizedX - margin &&
      pos.x <= containerInfo.normalizedX + containerInfo.normalizedWidth + margin &&
      pos.y >= containerInfo.normalizedY - margin &&
      pos.y <= containerInfo.normalizedY + containerInfo.normalizedHeight + margin
    )
    
    // Track stars that just entered the filter for entrance animation
    const starKey = `${star.x}-${star.y}-${star.type}`
    if (isVisible && !visibleStarsSet.value.has(starKey)) {
      visibleStarsSet.value.add(starKey)
      // Mark this star as newly entered for animation
      starEntranceMap.value.set(starKey, Date.now())
    }
    if (!isVisible) {
      visibleStarsSet.value.delete(starKey)
      starEntranceMap.value.delete(starKey)
    }
    
    return isVisible
  })
}

// Computed visible stars
const visibleStars = ref([])

// Get star container position using normalized coordinates from store
// Converts full-screen coordinates to filter-local pixel positions
const getStarContainerStyle = (star, index) => {
  if (!star) {
    return {
      left: '0',
      top: '0',
      transform: 'translate(-50%, -50%)',
      animationDelay: `${index * 0.2}s`
    }
  }

  // Get normalized position (0-1 in full-screen space)
  let pos = { x: star.x || 0, y: star.y || 0 }
  
  if (typeof star.getRotatedPosition === 'function') {
    pos = star.getRotatedPosition()
  }
  
  // CRITICAL: Clamp coordinates to 0-1 range
  // Static stars may have extended bounds (< 0 or > 1)
  const clampedX = Math.max(0, Math.min(1, pos.x))
  const clampedY = Math.max(0, Math.min(1, pos.y))
  const clampedPos = { x: clampedX, y: clampedY }
  
  // Convert full-screen coordinates to filter-local coordinates
  const localCoords = getFilterLocalCoordinates(clampedPos)
  
  // Get filter container dimensions
  const containerInfo = getContainerInfo()
  
  // Convert filter-local normalized coords (0-1) to pixel positions
  const x = localCoords.x * containerInfo.width
  const y = localCoords.y * containerInfo.height

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
    // Clamp displayed coordinates to 0-1 range
    const clampedX = Math.max(0, Math.min(1, star.x || 0))
    const clampedY = Math.max(0, Math.min(1, star.y || 0))
    return {
      x: clampedX,
      y: clampedY,
      velocity3D: star.velocity3D || { x: 0, y: 0, z: 0 },
      class: 'translate(-50%,-50%)',
      animationDelay: `${index * 0.2}s`
    }
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

const getCircleColor = (type) => {
  switch (type) {
    case 'static':
      return 'rgb(251, 191, 36)' // yellow-400
    case 'lonely':
      return 'rgb(96, 165, 250)' // blue-400
    case 'cluster':
      return 'rgb(196, 181, 253)' // purple-400
    case 'storm':
      return 'rgb(248, 113, 113)' // red-400
    default:
      return 'rgb(255, 182, 121)' // primary
  }
}

// Check if a star is sufficiently inside the filter (200px margin from edges)
const isStarSufficientlyInside = (star) => {
  if (!star) return false
  
  const containerInfo = getContainerInfo()
  
  // Get rotated position (apply Earth rotation before checking margin)
  let pos = { x: star.x || 0, y: star.y || 0 }
  if (typeof star.getRotatedPosition === 'function') {
    pos = star.getRotatedPosition()
  }
  
  // Convert 200px margin to normalized coordinates
  // Based on window width and height for proper scaling
  const horizontalMargin = 200 / window.innerWidth
  const verticalMargin = 200 / window.innerHeight
  
  // Check if star is at least 200px inside all edges of the filter
  // Entry condition: Star must be 200px past the entry edge (using rotated position)
  const isDeepEnough = (
    pos.x >= containerInfo.normalizedX + horizontalMargin &&
    pos.x <= containerInfo.normalizedX + containerInfo.normalizedWidth - horizontalMargin &&
    pos.y >= containerInfo.normalizedY + verticalMargin &&
    pos.y <= containerInfo.normalizedY + containerInfo.normalizedHeight - verticalMargin
  )
  
  return isDeepEnough
}

// Check if a star should be rendered at all
// Render if: (1) star is sufficiently inside the filter (200px margin), OR (2) star is currently exiting
const shouldRenderStar = (star) => {
  if (!star) return false
  
  const isSufficientlyInside = isStarSufficientlyInside(star)
  const isExiting = isStarExiting(star)
  
  // Only render if sufficiently inside OR if it's exiting (to show exit animation)
  return isSufficientlyInside || isExiting
}

const isStarExiting = (star) => {
  // Check if star is in entrance map (newly appeared or exiting)
  const starKey = `${star.x}-${star.y}-${star.type}`
  
  // Star is exiting if it's no longer in visible set
  return !visibleStarsSet.value.has(starKey) && starEntranceMap.value.has(starKey)
}

// Check if animation should play (star is sufficiently inside for entrance, or exiting)
const shouldPlayAnimation = (star) => {
  const starKey = `${star.x}-${star.y}-${star.type}`
  const entranceTime = starEntranceMap.value.get(starKey)
  
  // Only play animation if star has been tracked
  if (!entranceTime) return false
  
  const isInside = isStarSufficientlyInside(star)
  const isExiting = isStarExiting(star)
  
  // Play entrance animation if star is sufficiently inside
  // Play exit animation if star is exiting (even if not sufficiently inside)
  if (isInside || isExiting) {
    // Schedule cleanup after exit animation (0.8s for circle exit)
    if (isExiting) {
      setTimeout(() => {
        starEntranceMap.value.delete(starKey)
      }, 800)
    }
    return true
  }
  
  return false
}

const getCircleAnimationClass = (star) => {
  // Only animate if star is sufficiently inside the filter (200px margin)
  if (!shouldPlayAnimation(star)) return ''
  
  const isExiting = isStarExiting(star)
  return isExiting ? 'animate-circle-exit' : 'animate-circle-enter'
}

const getCircleStrokeClass = (star) => {
  // Only animate if star is sufficiently inside the filter (200px margin)
  if (!shouldPlayAnimation(star)) return ''
  
  const isExiting = isStarExiting(star)
  return isExiting ? 'stroke-exit' : 'stroke-enter'
}

const getLineAnimationClass = (star) => {
  // Only animate if star is sufficiently inside the filter (200px margin)
  if (!shouldPlayAnimation(star)) return ''
  
  const isExiting = isStarExiting(star)
  return isExiting ? 'animate-line-exit' : 'animate-line-enter'
}

const getLabelAnimationClass = (star) => {
  // Only animate if star is sufficiently inside the filter (200px margin)
  if (!shouldPlayAnimation(star)) return ''
  
  const isExiting = isStarExiting(star)
  return isExiting ? 'animate-label-exit' : 'animate-label-enter'
}

const getTextAnimationClass = (star) => {
  // Only animate if star is sufficiently inside the filter (200px margin)
  if (!shouldPlayAnimation(star)) return ''
  
  const isExiting = isStarExiting(star)
  return isExiting ? 'animate-text-exit' : 'animate-text-enter'
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

// Watch for changes to props.stars or containerKey to update visible stars
watch(
  () => [props.stars, containerKey.value],
  () => {
    visibleStars.value = getVisibleStars()
  },
  { deep: true }
)

onMounted(() => {
  // Initial setup
  visibleStars.value = getVisibleStars()
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

/* ========== CIRCLE ANIMATIONS ========== */

/* 
  Circle with radius 18 (CONTAINER_RADIUS - 2)
  Circumference = 2 * π * 18 ≈ 113.1
  Using 113 as the dash length for complete circle
*/

/* Circle drawing animation - enters from 0 to 100% */
@keyframes circleEnter {
  0% {
    stroke-dasharray: 0, 113;
    stroke-dashoffset: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    stroke-dasharray: 113, 113;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

/* Circle undrawing animation - exits from 100% to 0 */
@keyframes circleExit {
  0% {
    stroke-dasharray: 113, 113;
    stroke-dashoffset: 0;
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    stroke-dasharray: 0, 113;
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

.animate-circle-enter {
  animation: circleEnter 0.8s ease-out forwards;
}

.animate-circle-exit {
  animation: circleExit 0.8s ease-in forwards;
}

.stroke-enter {
  animation: circleEnter 0.8s ease-out forwards;
}

.stroke-exit {
  animation: circleExit 0.8s ease-in forwards;
}

/* ========== LINE ANIMATIONS ========== */

@keyframes lineEnter {
  0% {
    opacity: 0;
    stroke-dasharray: 0, 100;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    stroke-dasharray: 100, 0;
  }
}

@keyframes lineExit {
  0% {
    opacity: 1;
    stroke-dasharray: 100, 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    stroke-dasharray: 0, 100;
  }
}

.animate-line-enter {
  animation: lineEnter 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-line-exit {
  animation: lineExit 0.8s ease-in forwards;
}

/* ========== LABEL ANIMATIONS ========== */

@keyframes labelEnter {
  0% {
    opacity: 0;
    scale: 0.8;
    filter: blur(4px);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    scale: 1;
    filter: blur(0px);
  }
}

@keyframes labelExit {
  0% {
    opacity: 1;
    scale: 1;
    filter: blur(0px);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    scale: 0.8;
    filter: blur(4px);
  }
}

.animate-label-enter {
  animation: labelEnter 0.6s ease-out 0.6s forwards;
  opacity: 0;
}

.animate-label-exit {
  animation: labelExit 0.6s ease-in forwards;
}

/* ========== TEXT CHARACTER ANIMATIONS ========== */

/* Character by character appearance */
@keyframes textEnter {
  0% {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }
  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@keyframes textExit {
  0% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
  100% {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }
}

.line-content {
  display: inline-block;
  width: 100%;
  overflow: hidden;
}

.animate-text-enter .line-content:nth-child(1) {
  animation: textEnter 0.3s ease-out 0.8s forwards;
  opacity: 0;
}

.animate-text-enter .line-content:nth-child(2) {
  animation: textEnter 0.3s ease-out 1.0s forwards;
  opacity: 0;
}

.animate-text-enter .line-content:nth-child(3) {
  animation: textEnter 0.3s ease-out 1.2s forwards;
  opacity: 0;
}

.animate-text-exit .line-content:nth-child(1) {
  animation: textExit 0.3s ease-in 0.0s forwards;
}

.animate-text-exit .line-content:nth-child(2) {
  animation: textExit 0.3s ease-in 0.1s forwards;
}

.animate-text-exit .line-content:nth-child(3) {
  animation: textExit 0.3s ease-in 0.2s forwards;
}

/* ========== CONTENT WRAPPER ========== */

.text-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
