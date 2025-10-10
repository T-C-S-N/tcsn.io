<template>
<!--<Background/>-->
  <div
    class="min-h-screen w-full overflow-hidden bg-background flex items-start lg:items-center justify-center pt-20 lg:pt-0"
  >
    <div class="text-glow font-mono p-8 w-full lg:w-1/2">
      <!-- Terminal-style Menu -->
      <div class="terminal-menu flex flex-col justify-start gap-2">
        <div
          class="flex items-center gap-1 hover:gap-2 transition-all cursor-pointer w-full"
        >
          <div class=" mr-2">></div>
          <a
            @click="$router.push({ name: 'contact' })"
            class="cursor-pointer transition-colors"
          >
            contact
          </a>
        </div>
        <!--<div class="flex items-center">
          <span class="text-green-500 mr-2">></span>
          <a @click="$router.push('/projects')" class="cursor-pointer hover:text-green-300 transition-colors">
            projects
          </a>
        </div>-->

        <!--<div class="flex items-center gap-1 hover:gap-2 transition-all cursor-pointer w-full">
          <div class="text-green-500 mr-2">></div>
          <a @click="$router.push('/auth')" class="cursor-pointer hover:text-green-300 transition-colors">
            admin
          </a>
        </div>-->
      </div>

      <!-- Blinking Cursor -->
      <div class="mt-4 flex items-center">
        <div class="text-blink">_</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'
import Background from '@/components/Background.vue'

const visitorStore = useVisitorStore()

onMounted(() => {
  visitorStore.initializeVisitor()
  visitorStore.addInteraction('page_loaded', { page: 'home' })
})

onUnmounted(() => {
  visitorStore.endSession()
})
</script>

<style scoped>
@keyframes logo-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
    filter: brightness(1);
  }
  50% {
    text-shadow: 0 0 8px #00ff00, 0 0 5px #00ff00, 0 0 20px #00ff00;
    filter: brightness(1.15);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .ascii-art {
    font-size: 0.6rem;
    line-height: 1;
  }
}
</style>
