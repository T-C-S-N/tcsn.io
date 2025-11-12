<template>
  <div
    ref="businessCard"
    class="flex justify-center items-center w-full h-full cursor-pointer"
    style="perspective: 1200px"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardContainer"
      class="relative w-[180mm] h-[110mm] flex items-center justify-center shadow-xl"
      :style="containerStyle"
      @click="handleCardClick"
    >
      <!-- Front face (card front image) -->
      <div
        class="absolute w-[180mm] h-[110mm] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style="transform: translateZ(3px) translateX(-50%) translateY(-50%); transform-style: preserve-3d"
      >
        <img
          :src="cardFront"
          alt=""
          loading="lazy"
          class="w-full h-full object-cover"
        >
        <!-- Glare effect -->
        <div
          class="absolute inset-0 opacity-0 transition-opacity duration-300"
          :style="glareStyle"
        />
      </div>

      <!-- Back face (card back image) -->
      <div
        class="absolute w-[180mm] h-[110mm] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style="transform: rotateY(180deg) translateZ(3px) translateX(50%) translateY(-50%); transform-style: preserve-3d"
      >
        <img
          :src="cardBack"
          alt=""
          loading="lazy"
          class="w-full h-full object-cover"
        >
        <!-- Glare effect on back -->
        <div
          class="absolute inset-0 opacity-0 transition-opacity duration-300"
          :style="glareStyle"
        />
      </div>

      <!-- Right face (red border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-white top-1/2 left-1/2 -translate-y-1/2"
        style="transform: rotateY(90deg) translateZ(89mm) translateX(0%) translateY(-50%); transform-style: preserve-3d"
      />

      <!-- Left face (red border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-white top-1/2 left-1/2 -translate-y-1/2"
        style="transform: rotateY(-90deg) translateZ(91mm) translateX(0%) translateY(-50%); transform-style: preserve-3d"
      />

      <!-- Top face (red border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-white top-1/2 left-1/2 -translate-x-1/2"
        style="transform: rotateX(90deg) translateZ(56mm) translateX(-50%) translateY(0%); transform-style: preserve-3d"
      />

      <!-- Bottom face (red border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-white top-1/2 left-1/2 -translate-x-1/2"
        style="transform: rotateX(-90deg) translateZ(54mm) translateX(-50%) translateY(0%); transform-style: preserve-3d"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import cardFront from '@/assets/img/2025_tcsn_business_card_front.webp'
import cardBack from '@/assets/img/2025_tcsn_business_card_back.webp'

const businessCard = ref(null)
const cardContainer = ref(null)
const rotation = ref({ x: 0, y: 0 })
const mousePosition = ref({ x: 0, y: 0 })
const isHovered = ref(false)
const isFlipped = ref(false)
const isUsingGyroscope = ref(false)
const isGyroscopeAvailable = ref(false)

// Update container transform with rotation and flip
const containerStyle = computed(() => {
  const flipRotation = isFlipped.value ? 180 : 0
  
  return {
    transform: `
      rotateX(${rotation.value.x}deg)
      rotateY(${rotation.value.y + flipRotation}deg)
    `,
    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transitionDuration: (isHovered.value && !isFlipped.value) ? '0s' : '0.8s',
    transformStyle: 'preserve-3d'
  }
})

// Calculate glare effect based on mouse position
const glareStyle = computed(() => {
  const x = mousePosition.value.x
  const y = mousePosition.value.y

  return {
    background: `radial-gradient(
      circle at ${x}% ${y}%,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0) 90%
    )`,
    opacity: isHovered.value ? 0.3 : 0,
    transition: isHovered.value ? 'none' : 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
})

// Request gyroscope permission
const requestGyroscopePermission = async () => {
  if (!window.DeviceOrientationEvent) {
    isGyroscopeAvailable.value = false
    return
  }

  try {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const permission = await DeviceOrientationEvent.requestPermission()
      if (permission === 'granted') {
        isGyroscopeAvailable.value = true
        window.addEventListener('deviceorientation', handleDeviceOrientation)
      }
    } else {
      isGyroscopeAvailable.value = true
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }
  } catch (error) {
    console.error('Gyroscope permission denied:', error)
    isGyroscopeAvailable.value = false
  }
}

// Handle device orientation
const handleDeviceOrientation = (event) => {
  const beta = event.beta || 0
  const gamma = event.gamma || 0
  const isometricAngle = 35.264
  
  const rotationX = (beta / 180) * isometricAngle
  const rotationY = (gamma / 90) * isometricAngle
  
  rotation.value.x = rotationX
  rotation.value.y = rotationY
  
  isHovered.value = true
  isUsingGyroscope.value = true
  
  mousePosition.value = { x: 50, y: 50 }
}

// Handle mouse move
const handleMouseMove = (e) => {
  if (!businessCard.value || !cardContainer.value) return
  
  isUsingGyroscope.value = false

  // Get position relative to outer container (businessCard)
  const outerRect = businessCard.value.getBoundingClientRect()
  const x = e.clientX - outerRect.left
  const y = e.clientY - outerRect.top

  const centerX = outerRect.width / 2
  const centerY = outerRect.height / 2

  const normalizedX = (x - centerX) / centerX
  const normalizedY = (y - centerY) / centerY

  const isometricAngle = 35.264
  const rotationX = normalizedY * -isometricAngle
  const rotationY = normalizedX * isometricAngle

  rotation.value.x = rotationX
  rotation.value.y = rotationY

  // Capture mouse position as percentage of outer container
  mousePosition.value.x = (x / outerRect.width) * 100
  mousePosition.value.y = (y / outerRect.height) * 100
  
  // Set hover state based on proximity to card
  const cardRect = cardContainer.value.getBoundingClientRect()
  const cardX = e.clientX - cardRect.left
  const cardY = e.clientY - cardRect.top
  
  const padding = 50
  isHovered.value =
    cardX >= -padding &&
    cardX <= cardRect.width + padding &&
    cardY >= -padding &&
    cardY <= cardRect.height + padding
}

// Handle mouse leave
const handleMouseLeave = () => {
  rotation.value = { x: 0, y: 0 }
  mousePosition.value = { x: 50, y: 50 }
  isHovered.value = false
}

// Toggle flip
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Handle card click - flip towards nearest side
const handleCardClick = (e) => {
  if (!cardContainer.value) return

  const rect = cardContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const distToLeft = x
  const distToRight = rect.width - x
  const distToTop = y
  const distToBottom = rect.height - y

  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom)

  // Determine flip axis and direction based on nearest side
  if (minDist === distToLeft) {
    // Flip from left side - rotate on Y axis
    rotation.value.y = isFlipped.value ? 1 : -5
  } else if (minDist === distToRight) {
    // Flip from right side - rotate on Y axis
    rotation.value.y = isFlipped.value ? 1 : 5
  } else if (minDist === distToTop) {
    // Flip from top side - rotate on X axis
    rotation.value.x = isFlipped.value ? 1 : -5
  } else {
    // Flip from bottom side - rotate on X axis
    rotation.value.x = isFlipped.value ? 1 : 5
  }

  // Toggle flip state
  isFlipped.value = !isFlipped.value
}

// Lifecycle hooks
onMounted(() => {
  requestGyroscopePermission()
})

onUnmounted(() => {
  if (isGyroscopeAvailable.value) {
    window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }
})

// Expose component data for parent components
defineExpose({
  mousePosition,
  rotation,
  isHovered,
  isFlipped,
  isUsingGyroscope
})
</script>

<style scoped>
.perspective {
  perspective: 1200px;
}
</style>
