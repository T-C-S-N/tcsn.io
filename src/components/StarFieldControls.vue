<template>
  <div class="starfield-controls p-4 bg-black/20 backdrop-blur-sm rounded-lg text-white">
    <h3 class="text-lg font-bold mb-4">
      StarField Controls
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Star Count Display -->
      <div class="stat-item">
        <label class="block text-sm font-medium mb-1">Total Stars:</label>
        <div class="text-xl font-mono">
          {{ starCount }}
        </div>
      </div>
      
      <!-- Status -->
      <div class="stat-item">
        <label class="block text-sm font-medium mb-1">Status:</label>
        <div class="text-sm">
          <span
            v-if="isReady"
            class="text-green-400"
          >✓ Ready</span>
          <span
            v-else
            class="text-yellow-400"
          >⏳ Initializing...</span>
        </div>
      </div>
      
      <!-- Speed Control -->
      <div class="control-item">
        <label class="block text-sm font-medium mb-1">Animation Speed:</label>
        <input
          v-model="speedValue"
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          class="w-full"
          @input="updateSpeed(speedValue)"
        >
        <div class="text-xs text-gray-300">
          {{ speedValue }}x
        </div>
      </div>
      
      <!-- Density Control -->
      <div class="control-item">
        <label class="block text-sm font-medium mb-1">Star Density:</label>
        <input
          v-model="densityValue"
          type="range"
          min="50"
          max="200"
          step="10"
          class="w-full"
          @input="updateDensity(densityValue)"
        >
        <div class="text-xs text-gray-300">
          {{ densityValue }} stars
        </div>
      </div>
      
      <!-- Color Preset -->
      <div class="control-item">
        <label class="block text-sm font-medium mb-1">Color Theme:</label>
        <select
          v-model="selectedColorTheme"
          class="w-full bg-black/50 border border-gray-600 rounded px-2 py-1"
          @change="updateColorTheme"
        >
          <option value="default">
            Default White
          </option>
          <option value="warm">
            Warm Colors
          </option>
          <option value="cool">
            Cool Colors
          </option>
          <option value="rainbow">
            Rainbow
          </option>
        </select>
      </div>
      
      <!-- Actions -->
      <div class="control-item">
        <label class="block text-sm font-medium mb-1">Actions:</label>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            @click="reset"
          >
            Reset
          </button>
          <button
            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            @click="randomizeSettings"
          >
            Randomize
          </button>
        </div>
      </div>
    </div>
    
    <!-- Current Settings Display -->
    <div class="mt-4 p-2 bg-black/30 rounded">
      <h4 class="text-sm font-medium mb-2">
        Current Settings:
      </h4>
      <pre class="text-xs text-gray-300 overflow-x-auto">{{ JSON.stringify(animationSettings, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStarField } from '@/composables/useStarField.js'

// Use the StarField composable
const {
  starCount,
  isReady,
  animationSettings,
  updateSpeed,
  updateDensity,
  updateColors,
  updateAllSettings,
  reset
} = useStarField()

// Local reactive values for controls
const speedValue = ref(animationSettings.value.speed)
const densityValue = ref(animationSettings.value.density)
const selectedColorTheme = ref('default')

// Color themes
const colorThemes = {
  default: ['#ffffff', '#f0f0f0', '#e0e0e0'],
  warm: ['#ffddaa', '#ffcc88', '#ffbb66'],
  cool: ['#aaddff', '#88ccff', '#66bbff'],
  rainbow: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
}

// Methods
const updateColorTheme = () => {
  const colors = colorThemes[selectedColorTheme.value]
  updateColors(colors)
}

const randomizeSettings = () => {
  const randomSpeed = Math.random() * 2.5 + 0.5 // 0.5 - 3.0
  const randomDensity = Math.floor(Math.random() * 150) + 50 // 50 - 200
  const themes = Object.keys(colorThemes)
  const randomTheme = themes[Math.floor(Math.random() * themes.length)]
  
  speedValue.value = randomSpeed
  densityValue.value = randomDensity
  selectedColorTheme.value = randomTheme
  
  updateAllSettings({
    speed: randomSpeed,
    density: randomDensity,
    colors: colorThemes[randomTheme]
  })
}
</script>

<style scoped>
.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

input[type="range"] {
  accent-color: rgb(59 130 246);
}

input[type="range"]::-webkit-slider-track {
  background-color: rgb(75 85 99);
  border-radius: 0.25rem;
}

input[type="range"]::-webkit-slider-thumb {
  background-color: rgb(59 130 246);
  border-radius: 50%;
}
</style>
