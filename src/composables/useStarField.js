import { useStarFieldStore } from '@/stores/starFieldStore.js'
import { computed } from 'vue'

/**
 * Composable for interacting with the StarField throughout the app
 * Provides easy access to StarField state and controls
 */
export function useStarField() {
  const store = useStarFieldStore()

  // Reactive getters
  const starCount = computed(() => store.getStarCount())
  const isReady = computed(() => store.isStarFieldReady())
  const stars = computed(() => store.stars)
  const flyingStars = computed(() => store.flyingStars)
  const clusterStars = computed(() => store.clusterStars)
  const stormStars = computed(() => store.stormStars)
  const animationSettings = computed(() => store.animationSettings)
  
  // Get all stars combined
  const allStars = computed(() => [
    ...store.stars,
    ...store.flyingStars,
    ...store.clusterStars,
    ...store.stormStars
  ])

  // Control functions
  const updateSpeed = (speed) => {
    store.updateAnimationSettings({ speed })
  }

  const updateDensity = (density) => {
    store.updateAnimationSettings({ density })
  }

  const updateColors = (colors) => {
    store.updateAnimationSettings({ colors })
  }

  const updateSize = (size) => {
    store.updateAnimationSettings({ size })
  }

  const updateAllSettings = (settings) => {
    store.updateAnimationSettings(settings)
  }

  const reset = () => {
    store.resetStarField()
  }

  // Utility functions
  const getStarAt = (index) => {
    return store.stars[index] || null
  }

  const findStarsByColor = (color) => {
    return store.stars.filter(star => star.color === color)
  }

  return {
    // State
    starCount,
    isReady,
    stars,
    flyingStars,
    clusterStars,
    stormStars,
    allStars,
    animationSettings,
    
    // Controls
    updateSpeed,
    updateDensity,
    updateColors,
    updateSize,
    updateAllSettings,
    reset,
    
    // Utilities
    getStarAt,
    findStarsByColor,
    
    // Direct store access if needed
    store
  }
}
