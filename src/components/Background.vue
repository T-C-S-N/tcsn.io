<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">  
    <!-- Stars Background -->
    <div class="stars-background">
      <!-- Static twinkling stars -->
      <div 
        v-for="i in 100" 
        :key="`star-${i}`" 
        class="star"
        :style="{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          '--star-size': `${0.5 + Math.random() * 1.5}px`
        }"
      />
      
      <!-- Flying stars -->
      <div 
        v-for="i in 5" 
        :key="`flying-star-${i}`" 
        class="flying-star"
        :style="{ 
          '--start-x': `${Math.random() * 100}%`,
          '--start-y': `${Math.random() * 100}%`,
          '--end-x': `${Math.random() * 100}%`,
          '--end-y': `${Math.random() * 100}%`,
          '--star-size': `${0.5 + Math.random() * 1.5}px`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 12}s`
        }"
      />
    </div>
    
    <!-- Terminal-style grid background (subtle) -->
    <div class="absolute inset-0 opacity-[0.05]">
      <div 
        v-for="i in 20" 
        :key="`h-${i}`" 
        class="absolute w-full h-px bg-primary"
        :style="{ top: `${i * 5}%` }"
      />
      <div 
        v-for="i in 20" 
        :key="`v-${i}`" 
        class="absolute h-full w-px bg-primary"
        :style="{ left: `${i * 5}%` }"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let glitchInterval = null

onMounted(() => {
  // Add occasional satellite communication flashes
  glitchInterval = setInterval(() => {
    const satellites = document.querySelectorAll('.satellite')
    satellites.forEach(sat => {
      sat.style.filter = 'brightness(2) drop-shadow(0 0 10px #FFB679)'
      setTimeout(() => {
        sat.style.filter = 'brightness(1)'
      }, 200)
    })
  }, 8000)
})

onUnmounted(() => {
  if (glitchInterval) {
    clearInterval(glitchInterval)
  }
})
</script>

<style scoped>
/* Stars */
.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.star {
  position: absolute;
  width: var(--star-size);
  height: var(--star-size);
  background: #FFB679;
  border-radius: 50%;
  animation: star-twinkle 3s infinite ease-in-out;
}

.flying-star {
  position: absolute;
  width: var(--star-size);
  height: var(--star-size);
  background: #FFB679;
  border-radius: 50%;
  animation: fly-random 10s linear infinite, star-twinkle 2s infinite ease-in-out;
  box-shadow: 0 0 4px #FFB679;
  left: var(--start-x);
  top: var(--start-y);
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes fly-random {
  0% { 
    left: var(--start-x);
    top: var(--start-y);
    opacity: 0; 
    transform: scale(0.5); 
  }
  10% { 
    opacity: 1; 
    transform: scale(1); 
  }
  90% { 
    opacity: 1; 
    transform: scale(1); 
  }
  100% { 
    left: var(--end-x);
    top: var(--end-y);
    opacity: 0; 
    transform: scale(0.5); 
  }
}
</style>
