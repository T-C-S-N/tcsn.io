<template>
  <div class="flex items-center justify-center px-4 text-primary font-mono min-h-screen ">
    <div class="text-center"> 
      <h1 class="text-4xl md:text-6xl mb-6">
        404
      </h1>
      
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">
        Page Not Found
      </h2>
      
      <p class="text-lg text-left mb-8 max-w-md mx-auto">
        Oops! The page you're looking for seems to have wandered off into the digital void.
      </p>
      
      <div class="space-x-4">
        <router-link 
          to="/" 
          class="inline-block bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go Home
        </router-link>
      </div>
      
      <div class="mt-12">
        <p class="text-sm">
          Error 404 - The requested resource could not be found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// This component doesn't need any reactive data
</script>
