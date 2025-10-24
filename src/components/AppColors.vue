<template>
  <div class="flex flex-row">
    <div v-for="color in colors" :key="color.name" class="flex items-center">
      <div
        :class="`bg-${color.class}`"
        :style="`width: ${width}px; height: ${height}px;`"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  width: {
    type: Number,
    default: 60
  },
  height: {
    type: Number,
    default: 40
  }
})

const colors = ref([
  { name: 'primary', class: 'primary' },
  { name: 'secondary', class: 'secondary' },
  { name: 'tertiary', class: 'tertiary' },
  { name: 'quaternary', class: 'quaternary' },
  { name: 'accent', class: 'accent' },
  { name: 'background', class: 'background' }
  //{ name: 'text', class: 'text' },
  //{ name: 'success', class: 'success' },
  //{ name: 'error', class: 'error' },
  //{ name: 'warning', class: 'warning' },
  //{ name: 'info', class: 'info' }
])
</script>
