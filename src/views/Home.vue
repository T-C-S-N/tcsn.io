<template>
  <div class="min-h-screen w-full overflow-hidden bg-background">
    <div class="text-green-400 text-shadow-green font-mono p-4">
      tcsn.io
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'

const visitorStore = useVisitorStore()

onMounted(() => {
  visitorStore.initializeVisitor()
  visitorStore.addInteraction('page_loaded', { page: 'home' })
})

onUnmounted(() => {
  visitorStore.endSession()
})
</script>
