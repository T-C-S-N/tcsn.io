<template>
  <div class="visitor-info text-xs text-green-600 absolute top-2 right-2">
    <div>{{ visitorStore.displayName }}</div>
    <div>{{ visitorStore.sessionTimeFormatted }}</div>
  </div>
</template>

<script setup>
import { useVisitorStore } from '@/stores/visitorStore.js'

const visitorStore = useVisitorStore()
</script>

<style scoped>
.visitor-info {
  font-family: 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  text-shadow: 0 0 5px #00ff00;
}
</style>
