<template>
  <div class="w-full h-screen overflow-hidden fixed top-0 left-0 bg-black">
    <!-- AR Scene Container -->
    <div 
      v-if="cameraActive"
      ref="containerEl"
      class="w-full h-full absolute inset-0"
    >
      <!-- Canvas for Three.js/AR -->
      <canvas
        ref="canvasEl"
        class="w-full h-full"
      />
    </div>

    <!-- Fallback message when camera is not active -->
    <div
      v-show="!cameraActive"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          TCSN AR Experience
        </h2>
        <p class="text-gray-400 text-lg mb-8">
          Transform your business card into 3D
        </p>
        <div class="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-500/10 animate-pulse">
          <span class="text-5xl">📱</span>
        </div>
        <div class="flex flex-col gap-4 pointer-events-auto">
          <button
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            @click="requestCamera"
          >
            📹 Start Camera
          </button>
          <button
            class="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
            @click="goBack"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>

    <!-- Top-right: Camera Feed Indicator -->
    <div 
      v-if="cameraActive"
      class="absolute top-4 right-4 z-20 flex items-center gap-2"
    >
      <!-- Indicator circle -->
      <div
        class="w-3 h-3 rounded-full animate-pulse"
        :class="markerDetected ? 'bg-green-500' : 'bg-orange-500'"
      />
      <span
        class="text-white text-xs font-semibold"
        :class="markerDetected ? 'text-green-400' : 'text-orange-400'"
      >
        {{ markerDetected ? 'MARKER FOUND' : 'SEARCHING' }}
      </span>
    </div>

    <!-- Top-left: Marker Status Badge -->
    <div 
      v-if="cameraActive && markerDetected"
      class="absolute top-4 left-4 z-20 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg animate-pulse shadow-lg"
    >
      <span class="inline-block mr-2">✅</span>
      <span class="font-semibold">Marker Detected</span>
    </div>

    <!-- UI Overlay -->
    <div
      v-if="cameraActive"
      class="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between p-4 pointer-events-none z-10"
    >
      <!-- Header -->
      <div class="text-white text-center">
        <h1 class="text-2xl font-bold drop-shadow-lg">
          TCSN AR
        </h1>
        <p class="text-xs opacity-75 drop-shadow">
          Point at Hiro marker
        </p>
      </div>

      <!-- Center: Real-time Instructions -->
      <div class="text-center">
        <div class="text-white text-lg font-semibold drop-shadow-lg transition-all duration-300">
          <p
            v-if="!markerDetected"
            class="animate-bounce"
          >
            🎯 Show the marker
          </p>
          <p
            v-else
            class="text-green-400"
          >
            🎉 Rotate to explore!
          </p>
        </div>
      </div>

      <!-- Bottom: Control Panel -->
      <div class="flex flex-col gap-3">
        <!-- Instructions box -->
        <div class="bg-black/70 backdrop-blur-sm text-white text-xs p-3 rounded mx-4 text-center shadow-lg">
          <div
            v-if="!markerDetected"
            class="space-y-1"
          >
            <p class="font-semibold">
              Marker Not Found
            </p>
            <p class="opacity-80">
              Ensure good lighting and steady hand
            </p>
          </div>
          <div
            v-else
            class="space-y-1"
          >
            <p class="font-semibold text-green-400">
              ✓ Marker Detected
            </p>
            <p class="opacity-80">
              Move your phone to see the 3D cube rotate
            </p>
          </div>
          <a
            href="/hiro-marker.html"
            target="_blank"
            class="inline-block mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white no-underline text-xs font-semibold transition pointer-events-auto"
          >
            🖨️ Get Marker
          </a>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-3 pointer-events-auto px-4">
          <button
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition font-semibold text-sm shadow-lg"
            @click="toggleCamera"
          >
            {{ cameraActive ? '⏹️ Stop' : '📹 Start' }}
          </button>
          <button
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition font-semibold text-sm shadow-lg"
            @click="goBack"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>

    <!-- Camera request overlay - HIDDEN by default -->
    <div
      v-if="false && !cameraActive && showInitialized"
      class="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-30 pointer-events-auto"
    >
      <div class="bg-gray-900/95 p-8 rounded-lg text-center max-w-sm mx-4 border border-gray-700 shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-4">
          Camera Permission
        </h2>
        <p class="text-gray-300 mb-6">
          We need camera access to show you the AR experience. Allow camera access when prompted.
        </p>
        <button
          class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition mb-3"
          @click="requestCamera"
        >
          📹 Open Camera
        </button>
        <button
          class="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition"
          @click="goBack"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Debug Info -->
    <div
      v-if="debugMode"
      class="absolute bottom-4 left-4 bg-black/90 text-green-400 text-xs p-3 rounded font-mono max-w-xs z-20 space-y-1"
    >
      <div>Camera: {{ cameraActive ? 'ON' : 'OFF' }}</div>
      <div>Marker: {{ markerDetected ? 'FOUND' : 'LOST' }}</div>
      <div>Status: {{ arStatus }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const arStatus = ref('Loading AR...')
const cameraActive = ref(false)
const markerDetected = ref(false)
const debugMode = ref(false)
const containerEl = ref(null)
const canvasEl = ref(null)

const requestCamera = async () => {
  try {
    arStatus.value = 'Requesting camera...'
    // Request camera permission first
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' },
      audio: false
    })
    // Stop initial stream - AR.js will use its own
    stream.getTracks().forEach(track => track.stop())
    
    // Activate the AR scene
    cameraActive.value = true
    arStatus.value = 'Initializing AR...'
    
    // Wait for DOM to render
    await new Promise(r => setTimeout(r, 100))
    
    // Initialize AR.js with Three.js
    if (canvasEl.value && window.THREEx && window.THREE) {
      initializeARScene()
    } else {
      arStatus.value = 'Libraries not ready'
    }
  } catch (error) {
    console.error('Camera error:', error)
    arStatus.value = 'Camera access denied'
    cameraActive.value = false
  }
}

const initializeARScene = () => {
  try {
    const canvas = canvasEl.value
    const container = containerEl.value
    
    if (!canvas || !container) return
    
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const THREEx = window.THREEx
    
    // Initialize AR source
    const arSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
    })
    
    arSource.init(onARSourceReady.bind(null, arSource))
  } catch (error) {
    console.error('AR Scene Error:', error)
    arStatus.value = 'Error initializing AR'
  }
}

const onARSourceReady = (arSource) => {
  try {
    const THREE = window.THREE
    const THREEx = window.THREEx
    
    arSource.onResize()
    arSource.domElement.style.display = 'none'
    
    // Initialize AR context
    const arContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/data/camera_para.dat',
      detectionMode: 'color',
      canvasWidth: arSource.parameters.width,
      canvasHeight: arSource.parameters.height,
      maxDetectionRate: 60,
    })
    
    const camera = new THREE.Camera()
    
    arContext.init(() => {
      camera.projectionMatrix.copy(arContext.getProjectionMatrix())
    })
    
    // Set up Three.js scene
    const canvas = canvasEl.value
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setClearColor(new THREE.Color('lightgrey'), 0.15)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = false
    
    const scene = new THREE.Scene()
    scene.add(camera)
    
    // Create marker controls
    const markerControls = new THREEx.ArMarkerControls(arContext, camera, {
      type: 'pattern',
      patternUrl: 'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/data/hiro.patt',
    })
    
    const markerGroup = new THREE.Group()
    scene.add(markerGroup)
    markerControls.addEventListener('markerFound', () => {
      markerDetected.value = true
      arStatus.value = 'Marker detected!'
    })
    markerControls.addEventListener('markerLost', () => {
      markerDetected.value = false
      arStatus.value = 'Looking for marker...'
    })
    
    // Add 3D cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({ color: '#00d9ff' })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.z = 0
    markerGroup.add(cube)
    
    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    scene.add(light)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      arContext.update(arSource.domElement)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    
    animate()
    arStatus.value = 'AR Ready'
  } catch (error) {
    console.error('AR Source Ready Error:', error)
    arStatus.value = 'Error with AR source'
  }
}

const toggleCamera = () => {
  if (cameraActive.value) {
    // Stop camera by hiding the scene
    cameraActive.value = false
    markerDetected.value = false
    arStatus.value = 'Camera stopped'
  } else {
    requestCamera()
  }
}

const goBack = () => {
  // Stop camera by hiding the scene
  cameraActive.value = false
  router.push({ name: 'home' })
}

onMounted(async () => {
  try {
    debugMode.value = false
    arStatus.value = 'Loading AR libraries...'
    
    // Load Three.js first (required by AR.js)
    if (!window.THREE) {
      await new Promise((resolve) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        s.async = true
        s.onload = resolve
        document.head.appendChild(s)
      })
    }
    
    // Load AR.js
    if (!window.THREEx) {
      await new Promise((resolve) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@master/three.js/ar.js'
        s.async = true
        s.onload = resolve
        document.head.appendChild(s)
      })
    }
    
    await new Promise(r => setTimeout(r, 800))
    arStatus.value = 'Ready - Start Camera'
  } catch (error) {
    console.error('Error loading AR:', error)
    arStatus.value = 'Error loading AR'
  }
})
</script>

<style scoped>
:deep(a-scene) {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

:deep(canvas) {
  width: 100% !important;
  height: 100% !important;
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
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
