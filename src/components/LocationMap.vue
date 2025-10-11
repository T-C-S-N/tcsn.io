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
    // Use globally loaded Leaflet
    const L = window.L
    
    // Create map instance
    map = L.map(mapContainer.value, {
      center: [props.latitude, props.longitude],
      zoom: props.zoom,
      zoomControl: false, // Disable zoom controls
      scrollWheelZoom: false, // Disable scroll zoom
      doubleClickZoom: false, // Disable double-click zoom
      boxZoom: false, // Disable box zoom
      keyboard: false, // Disable keyboard navigation
      dragging: false, // Disable dragging
      attributionControl: false // Disable attribution
    })

    // Add monochrome tile layer for better color control
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: ''
    }).addTo(map)

    // Add marker
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    L.marker([props.latitude, props.longitude], {
      icon: customIcon
    }).addTo(map)

  } catch (error) {
    console.error('Failed to load map:', error)
  }
}

// Update map when coordinates change
watch([() => props.latitude, () => props.longitude], () => {
  if (map) {
    map.setView([props.latitude, props.longitude], props.zoom)
  }
})

onMounted(() => {
  // Load Leaflet CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)
  
  // Load Leaflet JS
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
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

/* Custom marker styles */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 20px;
  height: 20px;
  background: #ffb679;
  border: 2px solid #ffffff;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.marker-pin::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* Hide any remaining Leaflet controls */
:deep(.leaflet-control-container) {
  display: none !important;
}

:deep(.leaflet-bottom) {
  display: none !important;
}

:deep(.leaflet-top) {
  display: none !important;
}

/* Custom map styling */
:deep(.leaflet-container) {
  background: rgba(255, 182, 121, 0.05);
  font-family: inherit;
}

/* Apply #ffb679 color scheme to map tiles */
:deep(.leaflet-tile) {   
  opacity: 0.8;
}

/* Create color overlay for streets and details */
:deep(.leaflet-map-pane)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    #ffb679 0%,
    #ffb679 70%,
    #ffb679 100%
  );
  pointer-events: none;
  z-index: 400;
}

/* Style for streets and building details */
:deep(.leaflet-tile-pane) {
  position: relative;
}

:deep(.leaflet-tile-pane)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*background: #ffb679;*/
  mix-blend-mode: soft-light;
  opacity: 0.3;
  pointer-events: none;
}
</style>
