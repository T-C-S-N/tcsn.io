# StarField Store Documentation

## Overview

The StarField store allows you to manage and interact with the StarField component from anywhere in your Vue application. It provides centralized state management for stars, animation settings, and control methods.

## Architecture

### Components
- **StarFieldStore** (`/src/stores/starFieldStore.js`) - Pinia store managing StarField state
- **useStarField** (`/src/composables/useStarField.js`) - Composable for easy StarField interaction
- **StarField.vue** (`/src/components/StarField.vue`) - Main StarField component (updated to work with store)
- **StarFieldControls.vue** (`/src/components/StarFieldControls.vue`) - Example control panel

### Key Features
- ✅ Global access to StarField state
- ✅ Real-time star count tracking
- ✅ Dynamic animation settings
- ✅ Centralized control methods
- ✅ Store persistence across route changes

## Usage Examples

### Basic Usage - Get Star Count

```vue
<template>
  <div>
    <p>Total Stars: {{ starCount }}</p>
    <p>Status: {{ isReady ? 'Ready' : 'Loading...' }}</p>
  </div>
</template>

<script setup>
import { useStarField } from '@/composables/useStarField.js'

const { starCount, isReady } = useStarField()
</script>
```

### Advanced Usage - Control StarField

```vue
<template>
  <div>
    <button @click="makeItFaster">Speed Up!</button>
    <button @click="addMoreStars">More Stars!</button>
    <button @click="changeColors">Rainbow Mode!</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useStarField } from '@/composables/useStarField.js'

const { updateSpeed, updateDensity, updateColors, reset } = useStarField()

const makeItFaster = () => {
  updateSpeed(2.0) // 2x speed
}

const addMoreStars = () => {
  updateDensity(200) // 200 stars
}

const changeColors = () => {
  updateColors(['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'])
}
</script>
```

### Using Direct Store Access

```vue
<script setup>
import { useStarField } from '@/composables/useStarField.js'

const { store } = useStarField()

// Direct access to store methods
const handleComplexUpdate = () => {
  store.updateAnimationSettings({
    speed: 1.5,
    density: 150,
    colors: ['#ffffff', '#f0f0f0'],
    size: { min: 0.5, max: 2.0 }
  })
}
</script>
```

## Store API Reference

### State
- `starFieldRef` - Reference to the StarField component
- `stars` - Array of all stars
- `isInitialized` - Whether StarField is ready
- `animationSettings` - Current animation configuration

### Actions
- `setStarFieldRef(ref)` - Set the StarField component reference
- `updateStars(newStars)` - Update the stars array
- `updateAnimationSettings(settings)` - Update animation settings
- `getStarCount()` - Get total number of stars
- `resetStarField()` - Reset the StarField
- `isStarFieldReady()` - Check if StarField is ready

## Composable API Reference

### Reactive Properties
- `starCount` - Total number of stars (computed)
- `isReady` - Whether StarField is ready (computed)
- `stars` - All stars array (computed)
- `animationSettings` - Current settings (computed)

### Control Methods
- `updateSpeed(speed)` - Change animation speed
- `updateDensity(density)` - Change star density
- `updateColors(colors)` - Change star colors
- `updateSize(size)` - Change star size range
- `updateAllSettings(settings)` - Update multiple settings
- `reset()` - Reset StarField

### Utility Methods
- `getStarAt(index)` - Get star by index
- `findStarsByColor(color)` - Find stars by color

## Integration Guide

### 1. App.vue Setup (Already Done)
```vue
<script setup>
import { useStarFieldStore } from '@/stores/starFieldStore.js'

const starFieldStore = useStarFieldStore()
const starField = useTemplateRef('starField')

// Watch for StarField component to be ready
watch(starField, (newVal) => {
  if (newVal) {
    starFieldStore.setStarFieldRef(newVal)
  }
}, { immediate: true })
</script>
```

### 2. Using in Any Component
```vue
<script setup>
import { useStarField } from '@/composables/useStarField.js'

// Get whatever you need
const { starCount, updateSpeed, reset } = useStarField()
</script>
```

## Example Use Cases

### 1. Navigation Bar with Star Count
Show current star count in navigation

### 2. Settings Panel
Control StarField from a settings page

### 3. Interactive Elements
Change StarField based on user interactions

### 4. Route-Based Changes
Different StarField settings for different pages

### 5. Performance Monitoring
Track StarField performance metrics

## Performance Notes

- The store uses reactive refs, so watch for unnecessary reactivity
- Star updates are throttled to avoid performance issues
- Use `isReady` to ensure StarField is initialized before operations
- Store persists across route changes automatically

## Troubleshooting

### StarField not responding to changes
- Check if `isReady` is true
- Ensure StarField component is mounted
- Verify store is properly initialized

### Performance issues
- Reduce star density
- Lower animation speed
- Check for memory leaks in watchers

### Store not updating
- Ensure you're using the composable correctly
- Check Vue DevTools for store state
- Verify StarField component integration
