import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStarFieldStore = defineStore('starField', () => {
  // State
  const starFieldRef = ref(null)
  const stars = ref([])
  const isInitialized = ref(false)
  
  // Animation settings
  const animationSettings = ref({
    speed: 1,
    density: 100,
    colors: ['#ffffff', '#f0f0f0', '#e0e0e0'],
    size: { min: 1, max: 3 }
  })

  // Actions
  function setStarFieldRef(ref) {
    starFieldRef.value = ref
    if (ref && ref.stars) {
      stars.value = ref.stars
      isInitialized.value = true
    }
  }

  function updateStars(newStars) {
    stars.value = newStars
  }

  function updateAnimationSettings(settings) {
    animationSettings.value = { ...animationSettings.value, ...settings }
    
    // If StarField is initialized, apply the new settings
    if (starFieldRef.value && starFieldRef.value.updateSettings) {
      starFieldRef.value.updateSettings(animationSettings.value)
    }
  }

  function getStarCount() {
    return stars.value.length
  }

  function resetStarField() {
    if (starFieldRef.value && starFieldRef.value.reset) {
      starFieldRef.value.reset()
    }
  }

  // Getters
  const isStarFieldReady = () => isInitialized.value && starFieldRef.value

  return {
    // State
    starFieldRef,
    stars,
    isInitialized,
    animationSettings,
    
    // Actions
    setStarFieldRef,
    updateStars,
    updateAnimationSettings,
    getStarCount,
    resetStarField,
    
    // Getters
    isStarFieldReady
  }
})
