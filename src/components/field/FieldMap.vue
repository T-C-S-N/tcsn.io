<template>
  <div class="w-screen h-screen fixed top-0 left-0 pointer-events-none overflow-hidden z-0">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="text-primary absolute bg-primary rounded-full transition-all w-4 h-4"
      :style="getItemStyle(item)"
    >

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

// Store window dimensions as reactive state
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const coordinatesToPixels = (x, y, z, width, height, depth) => {
  // Simple perspective scaling based on depth
  const scale = 300 / (depth + 300)
  return { x, y, scale }
}

// Compute style for each item to trigger reactivity
const getItemStyle = (item) => {
  const coords = coordinatesToPixels(
    item.x,
    item.y,
    item.z,
    windowWidth.value,
    windowHeight.value,
    600
  )
  
  // Debug: log items that are inside the window (between 0 and window dimensions)
  if (item.x >= 0 && item.x <= windowWidth.value && item.y >= 0 && item.y <= windowHeight.value) {
    console.warn(`Item inside window: x=${item.x}, y=${item.y}, status=${item.status}`)
  }
  
  return {
    left: coords.x + 'px',
    top: coords.y + 'px',
    transform: `scale(${coords.scale})`
  }
}
</script>
