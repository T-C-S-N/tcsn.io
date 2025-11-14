<template>
  <div class="w-full h-screen fixed top-0 left-0 bg-black overflow-hidden">
    <!-- A-Frame AR Scene -->
    <a-scene
      v-if="cameraActive"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false"
      vr-mode-ui="enabled: false"
      class="w-full h-full"
    >
      <!-- Camera -->
      <a-camera position="0 0 0"></a-camera>

      <!-- Hiro Marker -->
      <a-marker preset="hiro">
        <!-- Rotating cube -->
        <a-box
          position="0 0 0"
          rotation="0 45 0"
          scale="0.8 0.8 0.8"
          color="#00d9ff"
          animation="property: rotation; to: 360 45 0; loop: true; dur: 4000"
        ></a-box>
        <!-- Glow effect -->
        <a-box
          position="0 0 0"
          rotation="0 45 0"
          scale="1.1 1.1 1.1"
          color="#00aaff"
          opacity="0.2"
        ></a-box>
      </a-marker>
    </a-scene>

    <!-- Camera Inactive Screen -->
    <div
      v-if="!cameraActive"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          TCSN AR
        </h2>
        <p class="text-gray-400 text-lg mb-8">
          Point your camera at the Hiro marker
        </p>
        <div class="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-500/10 animate-pulse">
          <span class="text-5xl">📱</span>
        </div>
        <button
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mb-4"
          @click="activateCamera"
        >
          📹 Start Camera
        </button>
        <button
          class="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
          @click="goBack"
        >
          ← Back
        </button>
      </div>
    </div>

    <!-- Camera Active Overlay -->
    <div
      v-if="cameraActive"
      class="absolute inset-0 pointer-events-none flex flex-col justify-between p-4"
    >
      <!-- Header -->
      <div class="text-white text-center">
        <h1 class="text-2xl font-bold drop-shadow-lg">TCSN AR</h1>
        <p class="text-xs opacity-75">Point at Hiro marker</p>
      </div>

      <!-- Status indicator (top right) -->
      <div class="absolute top-4 right-4 flex items-center gap-2 z-20">
        <div
          class="w-3 h-3 rounded-full animate-pulse"
          :class="markerDetected ? 'bg-green-500' : 'bg-orange-500'"
        ></div>
        <span class="text-white text-xs font-semibold">
          {{ markerDetected ? 'MARKER FOUND' : 'SEARCHING' }}
        </span>
      </div>

      <!-- Bottom controls -->
      <div class="flex flex-col gap-3">
        <div class="bg-black/70 backdrop-blur-sm text-white text-xs p-3 rounded text-center">
          {{ markerDetected ? '✅ Marker detected - Rotate to explore!' : '🎯 Show the marker' }}
        </div>
        <div class="flex justify-center gap-3 pointer-events-auto">
          <button
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm"
            @click="deactivateCamera"
          >
            ⏹️ Stop
          </button>
          <button
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold text-sm"
            @click="goBack"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cameraActive = ref(false)
const markerDetected = ref(false)

const activateCamera = async () => {
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    // Stop the stream - we just need permission
    stream.getTracks().forEach(track => track.stop())
    
    // Now activate the AR scene
    cameraActive.value = true
    console.log('Camera activated')
  } catch (error) {
    console.error('Camera permission denied:', error)
    alert('Camera permission is required for AR')
  }
}

const deactivateCamera = () => {
  cameraActive.value = false
  markerDetected.value = false
}

const goBack = () => {
  cameraActive.value = false
  router.push({ name: 'home' })
}

// A-Frame event listeners
const setupAREvents = () => {
  const markerEl = document.querySelector('a-marker')
  if (markerEl) {
    markerEl.addEventListener('markerFound', () => {
      console.log('Marker found!')
      markerDetected.value = true
    })
    markerEl.addEventListener('markerLost', () => {
      console.log('Marker lost')
      markerDetected.value = false
    })
  }
}

onMounted(async () => {
  // Load A-Frame if not already loaded
  if (!window.AFRAME) {
    const script = document.createElement('script')
    script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js'
    script.onload = () => {
      console.log('A-Frame loaded')
      // Load AR.js
      const arScript = document.createElement('script')
      arScript.src = 'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/three.js/ar.js'
      arScript.onload = () => {
        console.log('AR.js loaded')
      }
      document.head.appendChild(arScript)
    }
    document.head.appendChild(script)
  } else {
    console.log('A-Frame already loaded')
  }

  // Setup AR event listeners when component updates
  setTimeout(() => {
    setupAREvents()
  }, 1000)
})
</script>

<style scoped>
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

:deep(a-scene) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

:deep(canvas) {
  display: block !important;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
