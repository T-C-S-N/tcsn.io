<template>
  <div
    ref="businessCard"
    class="flex justify-center items-center w-full h-full relative"
    style="perspective: 1200px"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="cardContainer"
      class="relative w-[180mm] h-[110mm] flex items-center justify-center shadow-xl cursor-pointer transition-all"
      :style="cardContainerStyle"
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

      <!-- Right face (edge border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-[#EEEFEA] top-1/2 left-1/2 -translate-y-1/2"
        style="
          transform: rotateY(90deg) translateZ(89mm) translateX(0%) translateY(-50%);
          transform-style: preserve-3d;
        "
      />

      <!-- Left face (edge border) -->
      <div
        class="absolute h-[110mm] w-[2mm] bg-[#EEEFEA] top-1/2 left-1/2 -translate-y-1/2"
        style="
          transform: rotateY(-90deg) translateZ(91mm) translateX(0%) translateY(-50%);
          transform-style: preserve-3d;
        "
      />

      <!-- Top face (edge border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-[#EEEFEA] top-1/2 left-1/2 -translate-x-1/2"
        style="
          transform: rotateX(90deg) translateZ(56mm) translateX(-50%) translateY(0%);
          transform-style: preserve-3d;
        "
      />

      <!-- Bottom face (edge border) -->
      <div
        class="absolute w-[180mm] h-[2mm] bg-[#EEEFEA] top-1/2 left-1/2 -translate-x-1/2"
        style="
          transform: rotateX(-90deg) translateZ(54mm) translateX(-50%) translateY(0%);
          transform-style: preserve-3d;
        "
      />
    </div>

    <!-- iOS Gyroscope Permission Button -->
    <button
      v-if="isIOS && !isGyroscopeAvailable && !gyroscopeChecked"
      class="fixed top-4 right-4 px-3 py-2 bg-white/90 text-xs font-semibold rounded-lg shadow-lg hover:bg-white transition-all z-50"
      @click.stop="requestGyroscopePermissionManual"
    >
      📱 Enable Motion
    </button>
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
const isFlipping = ref(false)
const flipAxis = ref('y')
const flipSign = ref(1)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isIOS = ref(false)
const gyroscopeChecked = ref(false)

// Responsive card scale
const cardScale = computed(() => {
  if (windowWidth.value < 640) return 0.5 // mobile - smaller
  if (windowWidth.value < 1024) return 0.75 // tablet
  return 1 // desktop
})

// Card container style with rotation and scale
const cardContainerStyle = computed(() => {
  return {
    ...containerStyle.value,
    transform: `${containerStyle.value.transform} scale(${cardScale.value})`
  }
})

// Update container transform with rotation and flip
const containerStyle = computed(() => {
  const flipAngle = isFlipped.value ? flipSign.value * 180 : 0
  const rotateX = rotation.value.x + (flipAxis.value === 'x' ? flipAngle : 0)
  const rotateY = rotation.value.y + (flipAxis.value === 'y' ? flipAngle : 0)

  return {
    transform: `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `,
    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transitionDuration:
      isHovered.value && !isFlipped.value && !isFlipping.value ? '0s' : '0.8s',
    transformStyle: 'preserve-3d'
  }
})

// Calculate glare effect based on card rotation (not mouse position)
const glareStyle = computed(() => {
  const maxRotation = 65
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
  if (typeof DeviceOrientationEvent === 'undefined') {
    console.warn('❌ DeviceOrientationEvent not available')
    isGyroscopeAvailable.value = false
    return
  }

  try {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log('📱 iOS 13+ detected - Requesting orientation permission...')
      const permission = await DeviceOrientationEvent.requestPermission()
      console.log('✅ Orientation permission response:', permission)
      
      if (permission === 'granted') {
        console.log('✅ Orientation GRANTED - Adding listeners')
        isGyroscopeAvailable.value = true
        startGyroscope()
      } else if (permission === 'denied') {
        console.warn('❌ Orientation permission DENIED by user')
        isGyroscopeAvailable.value = false
      } else {
        console.warn('⚠️ Orientation permission unknown:', permission)
        isGyroscopeAvailable.value = false
      }
    } else {
      console.log('📱 Non-iOS or older iOS detected - Adding orientation listeners directly')
      isGyroscopeAvailable.value = true
      startGyroscope()
    }
  } catch (error) {
    console.error('❌ Orientation permission error:', error)
    isGyroscopeAvailable.value = false
  }
}

// Start listening to gyroscope events
const startGyroscope = () => {
  window.addEventListener('deviceorientation', handleDeviceOrientation)
  console.log('✅ DeviceOrientation listener added')
}

// Manual permission request (called from UI button)
const requestGyroscopePermissionManual = async () => {
  console.log('User clicked Enable Motion button')
  await requestGyroscopePermission()
  gyroscopeChecked.value = true
}

// Handle device orientation
const handleDeviceOrientation = (event) => {
  const alpha = 0.25
  
  let beta = event.beta || 0
  let gamma = event.gamma || 0
  
  beta = Math.max(-90, Math.min(90, beta))
  gamma = Math.max(-45, Math.min(45, gamma))
  
  const isometricAngle = 65

  const newRotationX = (beta / 180) * isometricAngle
  const newRotationY = (gamma / 90) * isometricAngle
  
  rotation.value.x = rotation.value.x * (1 - alpha) + newRotationX * alpha
  rotation.value.y = rotation.value.y * (1 - alpha) + newRotationY * alpha

  isHovered.value = true
  isUsingGyroscope.value = true
  mousePosition.value = { x: 50, y: 50 }
  
  console.debug('Gyroscope data - beta:', beta.toFixed(2), 'gamma:', gamma.toFixed(2))
}

// Handle mouse move
const handleMouseMove = (e) => {
  if (!businessCard.value || !cardContainer.value) return

  isUsingGyroscope.value = false

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

  mousePosition.value.x = (x / outerRect.width) * 100
  mousePosition.value.y = (y / outerRect.height) * 100

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
  if (isFlipping.value) return

  if (!cardContainer.value) {
    isFlipping.value = true
    isFlipped.value = !isFlipped.value
    window.setTimeout(() => (isFlipping.value = false), 1000)
    return
  }

  const rect = cardContainer.value.getBoundingClientRect()

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

  const tilt = 12
  if (minDist === distToLeft) {
    flipAxis.value = 'y'
    flipSign.value = -1
    rotation.value.x = 0
    rotation.value.y = -tilt
  } else if (minDist === distToRight) {
    flipAxis.value = 'y'
    flipSign.value = 1
    rotation.value.x = 0
    rotation.value.y = tilt
  } else if (minDist === distToTop) {
    flipAxis.value = 'x'
    flipSign.value = -1
    rotation.value.x = -tilt
    rotation.value.y = 0
  } else {
    flipAxis.value = 'x'
    flipSign.value = 1
    rotation.value.x = tilt
    rotation.value.y = 0
  }

  isFlipping.value = true
  isFlipped.value = !isFlipped.value

  const onTransitionEnd = (ev) => {
    if (ev && ev.propertyName && !ev.propertyName.includes('transform')) return
    isFlipping.value = false
    if (!isUsingGyroscope.value) {
      rotation.value.x = 0
      rotation.value.y = 0
    }
    cardContainer.value &&
      cardContainer.value.removeEventListener('transitionend', onTransitionEnd)
  }

  cardContainer.value.addEventListener('transitionend', onTransitionEnd)
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

// Handle window resize (defined outside lifecycle for proper cleanup)
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle hooks
onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  isIOS.value = /iphone|ipad|ipod/.test(userAgent)
  
  console.log('📱 Device detected:', isIOS.value ? 'iOS' : 'Non-iOS')
  
  if (!isIOS.value) {
    console.log('Auto-requesting gyroscope for non-iOS device')
    requestGyroscopePermission()
  } else {
    console.log('iOS detected - waiting for user to click Enable Motion button')
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (isGyroscopeAvailable.value) {
    window.removeEventListener('deviceorientation', handleDeviceOrientation)
    console.log('✅ Gyroscope listeners removed')
  }
  window.removeEventListener('resize', handleResize)
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
