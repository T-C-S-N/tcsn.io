<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-4">
          Chat with AI
        </h1>
        <p class="text-lg text-primary/70 max-w-2xl mx-auto">
          Get instant answers about Tomas's background, experience, skills, and projects. 
          Ask anything you'd like to know!
        </p>
      </div>

      <!-- Service Status -->
      <div 
        v-if="!isAvailable" 
        class="max-w-2xl mx-auto mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-center"
      >
        <div class="flex items-center justify-center gap-2">
          <font-awesome-icon icon="exclamation-triangle" />
          <span>AI service is currently unavailable. Please try again later.</span>
        </div>
      </div>

      <!-- AI Chat Component -->
      <AIChat />

      <!-- Additional Info -->
      <div class="max-w-2xl mx-auto mt-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
        <h3 class="text-lg font-semibold text-primary mb-3">
          About this AI Assistant
        </h3>
        <div class="text-sm text-primary/70 space-y-2">
          <p>
            This AI assistant has been trained with comprehensive information about Tomas's 
            professional background, technical skills, project experience, and career journey.
          </p>
          <p>
            Feel free to ask specific questions about his expertise in web development, 
            design systems, startup experience, or any particular technologies you're curious about.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Vue.js & React
            </span>
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Node.js & Python
            </span>
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              UI/UX Design
            </span>
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Startup Experience
            </span>
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              AI Integration
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AIChat from '@/components/AIChat.vue'
import { useAIStore } from '@/stores/aiStore.js'

const aiStore = useAIStore()

const isAvailable = computed(() => aiStore.isAvailable)

onMounted(async () => {
  await aiStore.initialize()
})

// Set page title
document.title = 'AI Chat - tcsn.io'
</script>

<style scoped>
/* Custom scrollbar for the entire page */
:deep(.chat-history) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 182, 121, 0.3) transparent;
}
</style>
