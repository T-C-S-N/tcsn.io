<template>
  <div id="app" class="font-sans antialiased bg-background-900">
    <!-- Visitor Welcome Message -->
    <!--<div
      v-if="visitorName && !isLoading"
      class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium shadow-md sticky top-0 z-[1000] animate-slide-down"
    >
      {{ getGreeting() }}
    </div>-->
    
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script setup>
import Layout from '@/components/layout/Layout.vue'
import { useVisitorTracking } from '@/composables/useVisitorTracking.js'

// Initialize visitor tracking
const {
  visitorName,
  isNewVisitor,
  isNewSession,
  isLoading,
  getGreeting
} = useVisitorTracking();
</script>

<style>
/* Custom animation for slide down */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}
</style>
