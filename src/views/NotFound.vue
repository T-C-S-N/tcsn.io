<template>
  <div class="not-found">
    <div class="container mx-auto px-4 py-8 text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <router-link 
        to="/" 
        class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 component
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}
</style>
