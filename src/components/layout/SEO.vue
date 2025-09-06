<template>
  <!-- SEO meta tags are handled in index.html for now -->
  <div></div>
</template>

<script setup>
// For now, we'll handle SEO through the main index.html
// In a production app, you'd want to use a proper head management library

const props = defineProps({
  title: {
    type: String,
    default: 'TCSN'
  },
  description: {
    type: String,
    default: 'Creative technology studio crafting digital experiences that inspire and engage.'
  },
  siteTitle: {
    type: String,
    default: 'TCSN'
  }
})
</script>
