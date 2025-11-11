<template>
  <div
    ref="cardContainer"
    class="w-full h-full flex items-center justify-center select-none"
    style="perspective: 1200px;"
  >
    <!-- Card wrapper (hit area - stays static) -->
    <div
      ref="cardWrapper"
      class="relative"
      style="width: 180mm; height: 110mm;"
      :style="cardWrapperStyle"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @click="toggleFlip"
    >
      <!-- Rotated inner container -->
      <div
        class="absolute inset-0 w-full h-full"
        :style="cardRotationStyle"
      >
        <!-- Card Front -->
        <div
          class="absolute inset-0 w-full h-full"
          :style="cardFaceStyle('front')"
        >
          <img
            :src="cardFront"
            alt="Business Card Front"
            class="w-full h-full object-cover"
          >

          <!-- Glare effect -->
          <div
            class="absolute inset-0 opacity-0 transition-opacity duration-300"
            :style="glareStyle"
          />
        </div>

        <!-- Card Back -->
        <div
          class="absolute inset-0 w-full h-full"
          :style="cardFaceStyle('back')"
        >
          <img
            :src="cardBack"
            alt="Business Card Back"
            class="w-full h-full object-cover"
          >

          <!-- Glare effect on back -->
          <div
            class="absolute inset-0 opacity-0 transition-opacity duration-300"
            :style="glareStyle"
          />
        </div>
      </div>
    </div>

    <!-- Flip indicator -->
    <div class="absolute bottom-4 left-4 text-primary/50 text-xs pointer-events-none">
      {{ isFlipped ? 'Back' : 'Front' }} - Click to flip
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import cardFront from '@/assets/img/2025_tcsn_business_card_front.webp'
import cardBack from '@/assets/img/2025_tcsn_business_card_back.webp'

const cardContainer = ref(null)
const cardWrapper = ref(null)
const rotation = ref({ x: 0, y: 0 })
const mousePosition = ref({ x: 0, y: 0 })
const isHovered = ref(false)
const isFlipped = ref(false)

// Calculate card wrapper style (static - no rotation)
const cardWrapperStyle = computed(() => {
  const scale = isHovered.value ? 1.05 : 1
  
  return {
    transform: `scale(${scale})`,
    transition: isHovered.value && !isFlipped.value ? 'none' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transformStyle: 'preserve-3d',
  }
})

// Calculate rotation style for inner container (isometric)
const cardRotationStyle = computed(() => {
  return {
    transform: `
      rotateX(${rotation.value.x}deg)
      rotateY(${rotation.value.y}deg)
    `,
    transition: isHovered.value && !isFlipped.value ? 'none' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transformStyle: 'preserve-3d'
  }
})

// Calculate individual card face styles
const cardFaceStyle = (side) => {
  const isFront = side === 'front'
  const flipRotation = isFlipped.value ? 180 : 0
  
  return {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: isFront ? `rotateY(${flipRotation}deg)` : `rotateY(${flipRotation + 180}deg)`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}

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

// Handle mouse enter
const handleMouseEnter = () => {
  isHovered.value = true
}

// Handle mouse move
const handleMouseMove = (e) => {
  if (!cardWrapper.value) return

  isHovered.value = true
  const rect = cardWrapper.value.getBoundingClientRect()

  // Calculate mouse position relative to card
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // Only process if cursor is inside the card bounds
  if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
    handleMouseLeave()
    return
  }

  // Calculate center point
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Calculate normalized position (-1 to 1)
  const normalizedX = (x - centerX) / centerX
  const normalizedY = (y - centerY) / centerY

  // For true isometric perspective (35.264 degrees)
  const isometricAngle = 35.264
  const rotationX = normalizedY * -isometricAngle
  const rotationY = normalizedX * isometricAngle

  // Update rotation
  rotation.value.x = rotationX
  rotation.value.y = rotationY

  // Update glare position (as percentage)
  mousePosition.value.x = (x / rect.width) * 100
  mousePosition.value.y = (y / rect.height) * 100
}

// Handle mouse leave
const handleMouseLeave = () => {
  isHovered.value = false
  rotation.value = { x: 0, y: 0 }
  mousePosition.value = { x: 50, y: 50 }
}

// Toggle flip
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
.perspective {
  perspective: 1200px;
}
</style>
