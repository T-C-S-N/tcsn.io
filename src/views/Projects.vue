<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Our Projects
        </h1>
        <p class="text-xl text-gray-600">
          Discover our latest work and creative solutions
        </p>
      </div>

      <!-- Project List -->
      <ProjectList />
    </div>
  </div>
</template>

<script setup>
import ProjectList from '@/components/project/ProjectList.vue'
</script>
