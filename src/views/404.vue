<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <div class="text-9xl">🤖</div>
      </div>
      
      <h1 class="text-6xl md:text-8xl font-bold text-gray-900 mb-6">
        404
      </h1>
      
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
        Page Not Found
      </h2>
      
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Oops! The page you're looking for seems to have wandered off into the digital void.
      </p>
      
      <div class="space-x-4">
        <router-link 
          to="/" 
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go Home
        </router-link>
        
        <router-link 
          to="/projects" 
          class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          View Projects
        </router-link>
      </div>
      
      <div class="mt-12">
        <p class="text-sm text-gray-500">
          Error 404 - The requested resource could not be found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// This component doesn't need any reactive data
</script>
