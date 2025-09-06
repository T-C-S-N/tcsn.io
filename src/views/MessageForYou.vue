<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center px-4">
    <div class="text-center text-white">
      <div class="mb-8">
        <div class="text-6xl md:text-9xl font-bold opacity-50">💌</div>
      </div>
      
      <h1 class="text-4xl md:text-6xl font-bold mb-6">
        A Special Message
      </h1>
      
      <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
        Sometimes the most meaningful messages come when you least expect them.
        Thank you for being here.
      </p>
      
      <div class="space-y-4">
        <p class="text-lg opacity-80">
          "Every interaction is an opportunity to create something beautiful."
        </p>
        
        <div class="pt-8">
          <router-link 
            to="/" 
            class="inline-block bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Return Home
          </router-link>
        </div>
      </div>
      
      <div class="mt-16 opacity-60">
        <p class="text-sm">
          - TCSN Team
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// This component doesn't need any reactive data for now
</script>

<style scoped>
/* Add any specific styles for the message page */
</style>
