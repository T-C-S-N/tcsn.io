<template>
  <div class="w-full h-screen overflow-hidden fixed top-0 left-0 bg-black">
    <!-- Camera Preview Video (hidden, used for AR tracking) -->
    <video
      ref="videoEl"
      autoplay
      playsinline
      muted
      webkit-playsinline
      class="hidden w-full h-full object-cover"
      crossorigin="anonymous"
    />

    <!-- Canvas for AR rendering -->
    <canvas
      ref="canvasEl"
      class="w-full h-full absolute inset-0"
    />

    <!-- UI Overlay -->
    <div
      v-if="!cameraActive"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          TCSN AR
        </h2>
        <p class="text-gray-300 text-lg mb-8">
          Point your camera at the Hiro marker
        </p>
        <button
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition mb-4"
          @click="startCamera"
        >
          📹 Start Camera
        </button>
      </div>
    </div>

    <!-- Status Indicator -->
    <div
      v-if="cameraActive"
      class="absolute top-4 right-4 z-20 flex items-center gap-2"
    >
      <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      <span class="text-white text-sm font-semibold">CAMERA ACTIVE</span>
    </div>

    <!-- Control Buttons -->
    <div
      v-if="cameraActive"
      class="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-20"
    >
      <button
        class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        @click="stopCamera"
      >
        ⏹️ Stop
      </button>
    </div>

    <!-- Status Text -->
    <div
      v-if="cameraActive"
      class="absolute top-4 left-4 z-20 text-white text-sm font-semibold drop-shadow-lg"
    >
      {{ statusText }}
    </div>

    <!-- AR Status -->
    <div
      v-if="cameraActive"
      class="absolute top-12 left-4 z-20 text-white text-xs drop-shadow-lg"
    >
      <div :class="markerDetected ? 'text-green-400' : 'text-orange-400'">
        {{ markerDetected ? '✅ Marker Detected' : '🔍 Searching for Marker...' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoEl = ref(null)
const canvasEl = ref(null)
const cameraActive = ref(false)
const markerDetected = ref(false)
const statusText = ref('Camera Ready')

let animationId = null

const startCamera = async () => {
  try {
    statusText.value = 'Requesting camera...'
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })

    if (videoEl.value) {
      videoEl.value.srcObject = stream
      
      // Ensure video plays on iOS
      videoEl.value.setAttribute('playsinline', '')
      videoEl.value.setAttribute('webkit-playsinline', '')
      
      // Force play on iOS
      const playPromise = videoEl.value.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video play error:', error)
        })
      }
      
      cameraActive.value = true
      statusText.value = 'Initializing AR...'
      
      // Wait for video to be ready then init AR
      await new Promise(r => setTimeout(r, 500))
      initializeAR()
    }
  } catch (error) {
    console.error('Camera error:', error)
    statusText.value = 'Camera access denied'
  }
}

const initializeAR = async () => {
  try {
    // Load required libraries
    await loadLibraries()
    
    const THREE = window.THREE
    const canvas = canvasEl.value
    const video = videoEl.value
    
    if (!canvas || !video || !THREE) {
      console.error('Missing required elements or THREE.js')
      return
    }

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1) // Opaque black background

    // Create a video texture from the camera feed
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.flipY = true
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    const backgroundGeometry = new THREE.PlaneGeometry(
      window.innerWidth / 100,
      window.innerHeight / 100
    )
    const backgroundMaterial = new THREE.MeshBasicMaterial({ map: videoTexture })
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
    backgroundMesh.position.z = -10
    scene.add(backgroundMesh)

    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    scene.add(light)

    // Create a marker tracking object
    const markerGroup = new THREE.Group()
    scene.add(markerGroup)

    // Add 3D cube to marker
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const material = new THREE.MeshPhongMaterial({ color: 0x00d9ff })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.z = 0
    markerGroup.add(cube)

    // Add glow effect
    const glowGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
    const glowMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aaff,
      emissive: 0x00aaff,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.3
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.z = 0
    markerGroup.add(glow)

    // Initialize marker detection
    const markerDetector = initMarkerDetection(video, markerGroup)

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Ensure video texture updates (critical for iOS)
      if (videoTexture) {
        videoTexture.needsUpdate = true
      }
      
      // Rotate cube
      cube.rotation.x += 0.01
      cube.rotation.y += 0.02
      glow.rotation.y -= 0.015

      // Update marker detection
      markerDetector.update()

      renderer.render(scene, camera)
    }

    animate()
    statusText.value = 'Show Hiro Marker'
  } catch (error) {
    console.error('AR initialization error:', error)
    statusText.value = 'Error initializing AR'
  }
}

const initMarkerDetection = (video, markerGroup) => {
  let detectionCounter = 0
  let nonDetectionCounter = 0
  const detectionThreshold = 15 // frames to confirm detection
  const nonDetectionThreshold = 5 // frames to confirm no detection
  
  // Create canvas for marker detection
  const detectionCanvas = document.createElement('canvas')
  detectionCanvas.width = 160
  detectionCanvas.height = 120
  const detectionCtx = detectionCanvas.getContext('2d')

  // Sobel edge detection
  const detectEdges = (imageData) => {
    const data = imageData.data
    const width = detectionCanvas.width
    const height = detectionCanvas.height
    const edges = new Uint8Array(width * height)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // Get grayscale values for Sobel operator
        const getGray = (ox, oy) => {
          const i = ((y + oy) * width + (x + ox)) * 4
          return (data[i] + data[i + 1] + data[i + 2]) / 3
        }
        
        // Sobel operator
        const gx = -getGray(-1, -1) - 2 * getGray(-1, 0) - getGray(-1, 1) +
                    getGray(1, -1) + 2 * getGray(1, 0) + getGray(1, 1)
        const gy = -getGray(-1, -1) - 2 * getGray(0, -1) - getGray(1, -1) +
                    getGray(-1, 1) + 2 * getGray(0, 1) + getGray(1, 1)
        
        const magnitude = Math.sqrt(gx * gx + gy * gy)
        edges[y * width + x] = Math.min(255, magnitude)
      }
    }
    return edges
  }

  return {
    update: () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        detectionCounter = 0
        nonDetectionCounter++
        if (nonDetectionCounter > nonDetectionThreshold) {
          markerDetected.value = false
          markerGroup.visible = false
        }
        return
      }

      try {
        // Draw video frame to detection canvas
        detectionCtx.drawImage(video, 0, 0, detectionCanvas.width, detectionCanvas.height)
        
        // Get image data
        const imageData = detectionCtx.getImageData(0, 0, detectionCanvas.width, detectionCanvas.height)
        const data = imageData.data
        
        // Convert to grayscale
        let darkPixels = 0
        let brightPixels = 0
        for (let i = 0; i < data.length; i += 4) {
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
          if (gray < 100) darkPixels++
          else if (gray > 150) brightPixels++
        }
        
        const totalPixels = detectionCanvas.width * detectionCanvas.height
        const darkRatio = darkPixels / totalPixels
        const brightRatio = brightPixels / totalPixels
        
        // Detect edges for pattern recognition
        const edges = detectEdges(imageData)
        
        // Count edge pixels (corners and patterns)
        let edgePixels = 0
        for (let i = 0; i < edges.length; i++) {
          if (edges[i] > 100) edgePixels++
        }
        const edgeRatio = edgePixels / totalPixels
        
        // Marker characteristics:
        // - High edge count (pattern)
        // - Balanced dark and bright areas
        // - Clear boundaries
        const isMarkerDetected = 
          edgeRatio > 0.08 &&
          darkRatio > 0.15 &&
          brightRatio > 0.15 &&
          darkRatio + brightRatio > 0.4
        
        if (isMarkerDetected) {
          detectionCounter++
          nonDetectionCounter = 0
          
          if (detectionCounter > detectionThreshold) {
            if (!markerDetected.value) {
              console.log('Marker detected! Edge ratio:', edgeRatio.toFixed(3))
            }
            markerDetected.value = true
            markerGroup.visible = true
          }
        } else {
          nonDetectionCounter++
          detectionCounter = 0
          
          if (nonDetectionCounter > nonDetectionThreshold) {
            if (markerDetected.value) {
              console.log('Marker lost')
            }
            markerDetected.value = false
            markerGroup.visible = false
          }
        }
      } catch (error) {
        console.warn('Marker detection error:', error)
        markerDetected.value = false
        markerGroup.visible = false
      }
    }
  }
}

const loadLibraries = async () => {
  // Load Three.js if not already loaded
  if (!window.THREE) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

const stopCamera = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (videoEl.value && videoEl.value.srcObject) {
    const tracks = videoEl.value.srcObject.getTracks()
    tracks.forEach(track => track.stop())
    videoEl.value.srcObject = null
  }

  cameraActive.value = false
  markerDetected.value = false
  statusText.value = 'Camera Stopped'
}

onMounted(async () => {
  await loadLibraries()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
video {
  background: #000;
}
</style>
