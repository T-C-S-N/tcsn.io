<template>
  <div
    ref="businessCard"
    class="flex justify-center items-center w-full h-full"
    style="perspective: 1200px"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardContainer"
      class="relative w-[180mm] h-[110mm] flex items-center justify-center shadow-xl cursor-pointer"
      :style="containerStyle"
      @click="handleCardClick"
    >
      <!-- Front face (card front image) -->
      <div
        class="absolute w-[180mm] h-[110mm] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style="
          transform: translateZ(3px) translateX(-50%) translateY(-50%);
          transform-style: preserve-3d;
        "
      >
        <img :src="cardFront" alt="" loading="lazy" class="w-full h-full object-cover" />
        <!-- Glare effect -->
        <div
          class="absolute inset-0 opacity-0 transition-opacity duration-300"
          :style="glareStyle"
        />
      </div>

      <!-- Back face (card back image) -->
      <div
        class="absolute w-[180mm] h-[110mm] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style="
          transform: rotateY(180deg) translateZ(3px) translateX(50%) translateY(-50%);
          transform-style: preserve-3d;
        "
      >
        <img :src="cardBack" alt="" loading="lazy" class="w-full h-full object-cover" />
        <!-- Glare effect on back -->
        <div
          class="absolute inset-0 opacity-0 transition-opacity duration-300"
          :style="glareStyle"
        />
      </div>

      <!-- Right face (red border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-white top-1/2 left-1/2 -translate-y-1/2"
        style="
          transform: rotateY(90deg) translateZ(89mm) translateX(0%) translateY(-50%);
          transform-style: preserve-3d;
        "
      />

      <!-- Left face (red border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-white top-1/2 left-1/2 -translate-y-1/2"
        style="
          transform: rotateY(-90deg) translateZ(91mm) translateX(0%) translateY(-50%);
          transform-style: preserve-3d;
        "
      />

      <!-- Top face (red border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-white top-1/2 left-1/2 -translate-x-1/2"
        style="
          transform: rotateX(90deg) translateZ(56mm) translateX(-50%) translateY(0%);
          transform-style: preserve-3d;
        "
      />

      <!-- Bottom face (red border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-white top-1/2 left-1/2 -translate-x-1/2"
        style="
          transform: rotateX(-90deg) translateZ(54mm) translateX(-50%) translateY(0%);
          transform-style: preserve-3d;
        "
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
// Prevent re-entrant flips and ensure flips always animate
const isFlipping = ref(false)
// New: control flip axis and direction so flips come from clicked side
const flipAxis = ref('y') // 'x' or 'y'
const flipSign = ref(1) // 1 or -1

// Update container transform with rotation and flip
const containerStyle = computed(() => {
  // compute flip angle depending on axis and sign
  const flipAngle = isFlipped.value ? flipSign.value * 180 : 0

  const rotateX = rotation.value.x + (flipAxis.value === 'x' ? flipAngle : 0)
  const rotateY = rotation.value.y + (flipAxis.value === 'y' ? flipAngle : 0)

  return {
    transform: `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `,
    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    // While hovering and not flipping, we want instant response for tilt (no transition).
    // But when a flip is in progress we must allow the 0.8s transition so flips animate.
    transitionDuration:
      isHovered.value && !isFlipped.value && !isFlipping.value ? '0s' : '0.8s',
    transformStyle: 'preserve-3d'
  }
})

// Calculate glare effect based on card rotation (not mouse position)
const glareStyle = computed(() => {
  // Map rotation to glare position
  // rotation.y: -35 to +35 (roughly), map to 0-100%
  // rotation.x: -35 to +35 (roughly), map to 0-100%

  // Normalize rotation values to 0-100% range
  // Assuming max rotation is around ±35 degrees
  const maxRotation = 35
  const x = 50 + (rotation.value.y / maxRotation) * 50
  const y = 50 - (rotation.value.x / maxRotation) * 50

  return {
    background: `radial-gradient(
      circle at ${x}% ${y}%,
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    )`,
    opacity: 0.6,
    transition: 'background 0.2s ease-out'
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

// Handle card click - flip towards nearest side (robust, supports touch and mouse)
const handleCardClick = (e) => {
  // Prevent starting another flip while one is in progress
  if (isFlipping.value) return

  // If card container isn't present, just toggle flip
  if (!cardContainer.value) {
    isFlipping.value = true
    isFlipped.value = !isFlipped.value
    // fallback to clear isFlipping in case transitionend doesn't fire
    window.setTimeout(() => (isFlipping.value = false), 1000)
    return
  }

  const rect = cardContainer.value.getBoundingClientRect()

  // Determine pointer coordinates relative to card
  let x = rect.width / 2
  let y = rect.height / 2

  if (e) {
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else if (typeof e.clientX !== 'undefined') {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
  }

  // If the card is currently flipped, mirror the pointer coordinates so we decide
  // which visible side the user clicked relative to what they see (back face is rotated).
  // When flipped around Y, left/right are visually swapped; when flipped around X, top/bottom are swapped.
  if (isFlipped.value) {
    if (flipAxis.value === 'y') {
      x = rect.width - x
    } else if (flipAxis.value === 'x') {
      y = rect.height - y
    }
  }

  const distToLeft = x
  const distToRight = rect.width - x
  const distToTop = y
  const distToBottom = rect.height - y

  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom)

  // Apply a pronounced tilt based on which side was clicked to give a physical feel
  const tilt = 12
  if (minDist === distToLeft) {
    // left: flip around Y axis towards negative direction
    flipAxis.value = 'y'
    flipSign.value = -1
    rotation.value.x = 0
    rotation.value.y = -tilt
  } else if (minDist === distToRight) {
    // right: flip around Y axis positive
    flipAxis.value = 'y'
    flipSign.value = 1
    rotation.value.x = 0
    rotation.value.y = tilt
  } else if (minDist === distToTop) {
    // top: flip around X axis negative
    flipAxis.value = 'x'
    flipSign.value = -1
    rotation.value.x = -tilt
    rotation.value.y = 0
  } else {
    // bottom: flip around X axis positive
    flipAxis.value = 'x'
    flipSign.value = 1
    rotation.value.x = tilt
    rotation.value.y = 0
  }

  // Start flip and guard re-entrancy
  isFlipping.value = true
  isFlipped.value = !isFlipped.value

  // Use transitionend to clear isFlipping and gently reset tilt after the animation.
  const onTransitionEnd = (ev) => {
    // only react to transform transitions
    if (ev && ev.propertyName && !ev.propertyName.includes('transform')) return
    // cleanup
    isFlipping.value = false
    // Only reset tilt if not using gyroscope
    if (!isUsingGyroscope.value) {
      rotation.value.x = 0
      rotation.value.y = 0
    }
    cardContainer.value &&
      cardContainer.value.removeEventListener('transitionend', onTransitionEnd)
  }

  cardContainer.value.addEventListener('transitionend', onTransitionEnd)
  // fallback in case transitionend doesn't fire
  window.setTimeout(() => {
    if (isFlipping.value) {
      isFlipping.value = false
      if (!isUsingGyroscope.value) {
        rotation.value.x = 0
        rotation.value.y = 0
      }
    }
  }, 1200)
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
