<template>
  <div
    class="min-h-screen w-full overflow-hidden bg-background flex items-start lg:items-center justify-center"
  >
    <div class="font-mono text-green-400 p-8 w-full lg:w-1/2">
      <!-- Terminal-style Menu -->
      <div class="terminal-menu flex flex-col justify-start gap-2">
        <div
          class="flex items-center gap-1 hover:gap-2 transition-all cursor-pointer w-full"
        >
          <div class="text-green-500 mr-2">></div>
          <a
            @click="$router.push('/contact')"
            class="cursor-pointer hover:text-green-300 transition-colors"
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
        <div class="text-green-500"></div>
        <div class="cursor-blink">_</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'

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
* {
  text-shadow: 0 0px 5px #00ff00;
  filter: blur(0.2px);
  animation: glow-pulse 3s infinite alternate, text-glow 2s infinite alternate;
}

.cursor-blink {
  font-weight: bold;
  animation: blink 1s step-start infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 5px #00ff00;
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 1px #00ff00;
  }
}

@keyframes text-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00;
    filter: blur(0.2px);
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00;
    filter: blur(0.3px);
  }
}

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

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
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
