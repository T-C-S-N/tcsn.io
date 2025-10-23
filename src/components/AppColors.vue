<template>
  <div class="flex flex-row">
    <div v-for="color in colors" :key="color.name" class="flex items-center">
      <div :class="`w-[60px] h-[40px] bg-${color.class}`"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const colors = ref([
  { name: 'primary', class: 'primary' },
  { name: 'secondary', class: 'secondary' },
  { name: 'tertiary', class: 'tertiary' },
  { name: 'quaternary', class: 'quaternary' },
  { name: 'accent', class: 'accent' },
  { name: 'background', class: 'background' },
  //{ name: 'text', class: 'text' },
  //{ name: 'success', class: 'success' },
  //{ name: 'error', class: 'error' },
  //{ name: 'warning', class: 'warning' },
  //{ name: 'info', class: 'info' }
])
</script>
