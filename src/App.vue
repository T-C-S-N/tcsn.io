<template>
  <div id="app">
    <!-- Visitor Welcome Message -->
    <div v-if="visitorName && !isLoading" class="visitor-welcome">
      {{ getGreeting() }}
    </div>
    
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.visitor-welcome {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: slideDown 0.5s ease-out;
}

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
</style>
