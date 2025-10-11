<template>
  <div class="map-container">
    <div
      ref="mapContainer"
      class="w-full h-64 rounded-lg overflow-hidden border border-primary/20"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  zoom: {
    type: Number,
    default: 12
  }
})

const mapContainer = ref(null)
let map = null

// Initialize map
const initializeMap = async () => {
  if (!mapContainer.value || !props.latitude || !props.longitude) return

  try {
    // Use globally loaded Mapbox GL JS
    const mapboxgl = window.mapboxgl
    
    // Set Mapbox access token from environment
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
    
    // Create map instance
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme
      center: [props.longitude, props.latitude], // Mapbox uses [lng, lat]
      zoom: props.zoom,
      interactive: false, // Disable all interactions
      attributionControl: false // Hide attribution
    })

    // Add custom marker
    const markerElement = document.createElement('div')
    markerElement.className = 'mapbox-marker'
    markerElement.innerHTML = '<div class="marker-pin"></div>'

    new mapboxgl.Marker(markerElement)
      .setLngLat([props.longitude, props.latitude])
      .addTo(map)

  } catch (error) {
    console.error('Failed to load map:', error)
  }
}

// Update map when coordinates change
watch([() => props.latitude, () => props.longitude], () => {
  if (map) {
    map.setCenter([props.longitude, props.latitude])
  }
})

onMounted(() => {
  // Load Mapbox CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css'
  document.head.appendChild(link)
  
  // Load Mapbox JS
  const script = document.createElement('script')
  script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js'
  script.onload = () => {
    initializeMap()
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
}

/* Custom marker styles for Mapbox */
:deep(.mapbox-marker) {
  background: transparent;
  border: none;
  cursor: default;
}

:deep(.marker-pin) {
  width: 20px;
  height: 20px;
  background: transparent;
  border: 2px solid #ffb679;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

:deep(.marker-pin::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #ffb679;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* Mapbox container styling */
:deep(.mapboxgl-canvas-container) {
  cursor: default !important;
}

:deep(.mapboxgl-canvas) {
  outline: none;
}

/* Hide Mapbox controls and attribution */
:deep(.mapboxgl-ctrl-top-left),
:deep(.mapboxgl-ctrl-top-right),
:deep(.mapboxgl-ctrl-bottom-left),
:deep(.mapboxgl-ctrl-bottom-right) {
  display: none !important;
}

/* Custom map container styling */
:deep(.mapboxgl-map) {
  font-family: inherit;
}
</style>
