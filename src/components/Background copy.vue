<template>
  <div
    class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    :style="{
      '--earth-rotation-duration': `${TIMING.EARTH_ROTATION_DURATION}s`,
      '--sky-rotation-origin-x': `${SKY_ROTATION.ORIGIN_X}%`,
      '--sky-rotation-origin-y': `${SKY_ROTATION.ORIGIN_Y}%`,
      '--sky-container-size': `${SKY_ROTATION.CONTAINER_SIZE}%`
    }"
  >
    <!-- Canvas for all stars -->
    <canvas
      ref="starsCanvas"
      class="stars-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

class Star {
  constructor(data) {
    // 2D plane coordinates (percentage)
    this.x = data?.x ?? 0
    this.y = data?.y ?? 0
    
    // Star properties
    this.size = data?.size ?? 1
    this.color = data?.color ?? '#FFB679'
    this.direction = data?.direction
    this.type = data?.type ?? 'static' // 'static', 'lonely', 'cluster', 'storm'
    this.isVisible = data?.isVisible ?? true
    
    // 3D velocity for Doppler effect and movement
    this.velocity3D = data?.velocity3D ?? { x: 0, y: 0, z: 0 }
    
    // Additional properties for animation
    this.startTime = data?.startTime ?? performance.now()
    this.animationDuration = data?.animationDuration ?? 3
    this.baseOpacity = data?.baseOpacity ?? 1
    this.twinkleDelay = data?.twinkleDelay ?? 0
    this.metadata = data?.metadata ?? {}
    
    // For moving stars
    this.startX = data?.startX
    this.startY = data?.startY
    this.endX = data?.endX
    this.endY = data?.endY
  }
}

// Sky Rotation Configuration (fixed constants)
const SKY_ROTATION = {
  ORIGIN_X: 50, // percentage - horizontal position of rotation center (screen center)
  ORIGIN_Y: 15, // percentage - vertical position of rotation center (screen center)
  CONTAINER_SIZE: 1000 // percentage - size of rotating container to ensure full coverage
}

// STAR CONFIGURATION CONSTANTS
// =============================

// Static Stars Configuration
const STATIC_STARS = {
  COUNT: 800, // Reduced for better performance with motion trails
  SIZE_MIN: 0.5,
  SIZE_MAX: 2.0,
  TWINKLE_DELAY_MAX: 3
}

// Lonely Flying Stars Configuration
const LONELY_STARS = {
  COUNT: 10,
  SIZE_MIN: 1.5, // Much larger for visibility
  SIZE_MAX: 3.5, // Much larger for visibility
  DURATION_MIN: 2, // MUCH faster - 2-5 seconds to cross screen
  DURATION_MAX: 5, // MUCH faster
  APPEARANCE_INTERVAL_MIN: 100, // More frequent appearances
  APPEARANCE_INTERVAL_MAX: 300, // More frequent appearances
  BURST_CHANCE: 0.3, // Higher chance for burst (more stars)
  BURST_COUNT_MIN: 3,
  BURST_COUNT_MAX: 15,
  BURST_STAGGER_DELAY: 300 // milliseconds between burst stars
}

// Star Clusters Configuration
const CLUSTERS = {
  COUNT: 10,
  STARS_PER_CLUSTER_MIN: 2,
  STARS_PER_CLUSTER_MAX: 7,
  STAR_SIZE_MIN: 1.2, // Larger for better visibility
  STAR_SIZE_MAX: 3.0, // Larger for better visibility
  DURATION_MIN: 3, // MUCH faster movement
  DURATION_MAX: 8, // MUCH faster movement
  APPEARANCE_INTERVAL_MIN: 500, // More frequent clusters
  APPEARANCE_INTERVAL_MAX: 1200, // More frequent clusters
  BURST_CHANCE: 0.2, // 20% chance for cluster burst
  BURST_COUNT_MIN: 2,
  BURST_COUNT_MAX: 4,
  BURST_STAGGER_DELAY: 800, // milliseconds between burst clusters

  // Cluster Formation
  SPREAD_RADIUS: 500, // pixels (total spread = 2 * radius = 1200px)
  BORDER_MARGIN_MIN: -30, // percentage from border edges (extended range)
  BORDER_MARGIN_MAX: 130, // extended to match static star coverage

  // Individual Star Variations within Cluster
  DELAY_VARIATION_MAX: 5, // seconds
  SPEED_VARIATION_MIN: 0.5, // multiplier
  SPEED_VARIATION_MAX: 2,
  TRAJECTORY_OFFSET_MAX: 40, // pixels
  VISIBILITY_BUFFER: 10 // extra seconds before cluster disappears
}

// Star Storms Configuration
const STAR_STORMS = {
  COUNT: 2, // Number of concurrent storm systems (reduced for performance)
  DURATION_MIN: 6, // seconds
  DURATION_MAX: 12, // seconds
  INTENSITY_MIN: 0.8, // multiplier for star density
  INTENSITY_MAX: 1.5, // multiplier for star density (reduced)
  INTERVAL_MIN: 10000, // More frequent storms (10-30 seconds)
  INTERVAL_MAX: 30000, // More frequent storms

  // Storm Star Configuration
  STARS_PER_STORM_BASE: 120, // More stars per storm for better visibility
  STAR_SIZE_MIN: 1.2, // Larger for better visibility
  STAR_SIZE_MAX: 3.0, // Larger for better visibility
  STORM_STAR_DURATION_MIN: 2, // MUCH faster - 2-4 seconds
  STORM_STAR_DURATION_MAX: 4, // MUCH faster
  STORM_STAR_DISTANCE_MIN: 1000, // pixels to travel (increased for more movement)
  STORM_STAR_DISTANCE_MAX: 2500, // pixels to travel (increased for dramatic effect)

  // Visual effects
  FADE_IN_DURATION: 1.5, // seconds (faster fade)
  FADE_OUT_DURATION: 2, // seconds (faster fade)
  BRIGHTNESS_MULTIPLIER: 1.4 // Reduced brightness multiplier
}

// Timing Configuration
const TIMING = {
  EARTH_ROTATION_DURATION: 20, // seconds for complete rotation
  SATELLITE_FLASH_INTERVAL: 2000, // milliseconds
  SATELLITE_FLASH_DURATION: 200 // milliseconds
}

const staticStars = ref([])
const starClusters = ref([])
const lonelyStars = ref([])
const starStorms = ref([])
const allStarsOnScreen = ref([]) // Comprehensive array of all stars with coordinates and metadata

// Canvas related
const starsCanvas = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)
let ctx = null
let animationFrameId = null
let glitchInterval = null
let clusterInterval = null
let lonelyStarInterval = null
let stormInterval = null
let starsUpdateInterval = null

// Generate a star storm that fills the entire screen
const generateStarStorm = (id) => {
  const intensity =
    STAR_STORMS.INTENSITY_MIN +
    Math.random() * (STAR_STORMS.INTENSITY_MAX - STAR_STORMS.INTENSITY_MIN)
  const duration =
    STAR_STORMS.DURATION_MIN +
    Math.random() * (STAR_STORMS.DURATION_MAX - STAR_STORMS.DURATION_MIN)

  // Performance optimization: reduce star count on smaller screens or lower-end devices
  const screenSize = Math.min(window.innerWidth, window.innerHeight)
  const performanceMultiplier = screenSize < 768 ? 0.4 : screenSize < 1200 ? 0.6 : 0.85 // More aggressive reduction
  const starCount = Math.floor(
    STAR_STORMS.STARS_PER_STORM_BASE * intensity * performanceMultiplier
  )

  const stars = Array.from({ length: starCount }, (_, i) => {
    const direction = Math.random() * 360
    const distance =
      STAR_STORMS.STORM_STAR_DISTANCE_MIN +
      Math.random() *
        (STAR_STORMS.STORM_STAR_DISTANCE_MAX - STAR_STORMS.STORM_STAR_DISTANCE_MIN)

    return {
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size:
        STAR_STORMS.STAR_SIZE_MIN +
        Math.random() * (STAR_STORMS.STAR_SIZE_MAX - STAR_STORMS.STAR_SIZE_MIN),
      delay: Math.random() * 2, // Reduced stagger delay
      duration:
        STAR_STORMS.STORM_STAR_DURATION_MIN +
        Math.random() *
          (STAR_STORMS.STORM_STAR_DURATION_MAX - STAR_STORMS.STORM_STAR_DURATION_MIN),
      direction,
      distance,
      intensity: 0.7 + Math.random() * 0.6, // Slightly reduced intensity range
      velocity3D: {
        x: Math.sin((direction * Math.PI) / 180) * (distance / 1000), // Normalized velocity
        y: Math.cos((direction * Math.PI) / 180) * (distance / 1000),
        z: (Math.random() - 0.5) * 4 // Storm stars have high Z velocity variation
      }
    }
  })

  return {
    id,
    intensity,
    duration,
    delay: 0,
    stars,
    active: false
  }
}

// Initialize star storms
const initializeStarStorms = () => {
  starStorms.value = Array.from({ length: STAR_STORMS.COUNT }, (_, i) =>
    generateStarStorm(i)
  )
}

// Activate a storm
const activateStorm = (storm) => {
  storm.active = true
  storm.delay = 0

  // Deactivate storm after duration + fade out time
  setTimeout(() => {
    storm.active = false
  }, (storm.duration + STAR_STORMS.FADE_OUT_DURATION) * 1000)
}

// Update the comprehensive stars array with all current stars and their data
const updateAllStarsArray = () => {
  const allStars = []
  const currentTime = performance.now()

  // Add static stars (now Star instances on 2D plane)
  staticStars.value.forEach((star) => {
    if (star.isVisible) {
      allStars.push(star)
    }
  })

  // Add visible lonely stars
  lonelyStars.value
    .filter((star) => star.visible)
    .forEach((star) => {
      allStars.push({
        id: `lonely-${star.id}`,
        type: 'lonely',
        startX: star.startX,
        startY: star.startY,
        endX: star.endX,
        endY: star.endY,
        size: star.size,
        baseOpacity: 1,
        startTime: currentTime - star.delay * 1000,
        animationDuration: star.duration,
        isVisible: true,
        inViewport: true,
        metadata: {
          trajectory: {
            startX: star.startX,
            startY: star.startY,
            endX: star.endX,
            endY: star.endY
          },
          color: '#FFB679',
          hasGlow: true,
          velocity3D: star.velocity3D
        }
      })
    })

  // Add visible cluster stars
  starClusters.value
    .filter((cluster) => cluster.visible)
    .forEach((cluster) => {
      cluster.stars.forEach((star) => {
        allStars.push({
          id: `cluster-${cluster.id}-${star.id}`,
          type: 'cluster',
          clusterStartX: cluster.startX,
          clusterStartY: cluster.startY,
          clusterEndX: cluster.endX,
          clusterEndY: cluster.endY,
          offsetX: star.offsetX,
          offsetY: star.offsetY,
          size: star.size,
          baseOpacity: 1,
          startTime: currentTime - cluster.delay * 1000 - star.delay * 1000,
          animationDuration: cluster.duration,
          speedVariation: star.speedVariation,
          trajectoryOffsetX: star.trajectoryOffsetX,
          trajectoryOffsetY: star.trajectoryOffsetY,
          driftAngle: star.driftAngle,
          isVisible: true,
          inViewport: true,
          lastLoggedProgress: -1, // Track logging progress
          metadata: {
            clusterId: cluster.id,
            color: '#FFB679',
            hasGlow: true,
            velocity3D: star.velocity3D
          }
        })
      })
    })

  // Add active storm stars
  starStorms.value
    .filter((storm) => storm.active)
    .forEach((storm) => {
      storm.stars.forEach((star) => {
        allStars.push({
          id: `storm-${storm.id}-${star.id}`,
          type: 'storm',
          startX: star.left,
          startY: star.top,
          direction: star.direction,
          distance: star.distance,
          size: star.size,
          baseOpacity: star.intensity,
          startTime: currentTime - storm.delay * 1000 - star.delay * 1000,
          animationDuration: star.duration,
          isVisible: true,
          lastLoggedProgress: -1, // Track logging progress
          inViewport: true,
          metadata: {
            stormId: storm.id,
            stormIntensity: storm.intensity,
            intensity: star.intensity,
            color: '#FFB679',
            hasGlow: true,
            brightness: 1.4 * star.intensity,
            velocity3D: star.velocity3D
          }
        })
      })
    })

  // Update the reactive array
  allStarsOnScreen.value = allStars

  // Also expose to window for external access
  if (typeof window !== 'undefined') {
    window.tcsn_stars = {
      total: allStars.length,
      totalGenerated:
        staticStars.value.length +
        lonelyStars.value.filter((s) => s.visible).length +
        starClusters.value.reduce((acc, c) => acc + (c.visible ? c.stars.length : 0), 0) +
        starStorms.value.reduce((acc, s) => acc + (s.active ? s.stars.length : 0), 0),
      rendered: allStars.length,
      renderingMethod: 'canvas',
      byType: {
        static: allStars.filter((s) => s.type === 'static').length,
        lonely: allStars.filter((s) => s.type === 'lonely').length,
        cluster: allStars.filter((s) => s.type === 'cluster').length,
        storm: allStars.filter((s) => s.type === 'storm').length
      },
      stars: allStars,
      canvas: {
        width: canvasWidth.value,
        height: canvasHeight.value,
        context: ctx
      },
      // Helper functions
      getStarsByType: (type) => allStars.filter((s) => s.type === type),
      getStarsInRegion: (x1, y1, x2, y2) =>
        allStars.filter((s) => s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2),
      getStarById: (id) => allStars.find((s) => s.id === id),
      // Real-time stats
      stats: {
        totalStars: allStars.length,
        visibleStars: allStars.filter((s) => s.isVisible).length,
        renderedStars: allStars.length,
        animatingStars: allStars.filter((s) => s.type !== 'static').length,
        lastUpdate: new Date().toISOString()
      }
    }
  }
}

// Trigger random storm
const triggerStormAppearance = () => {
  const availableStorms = starStorms.value.filter((storm) => !storm.active)

  if (availableStorms.length > 0) {
    const randomStorm =
      availableStorms[Math.floor(Math.random() * availableStorms.length)]

    // Generate new storm data
    const newStorm = generateStarStorm(randomStorm.id)
    Object.assign(randomStorm, newStorm)

    activateStorm(randomStorm)
  }
}

// Canvas drawing functions
const initCanvas = () => {
  if (!starsCanvas.value) return

  ctx = starsCanvas.value.getContext('2d')
  ctx.imageSmoothingEnabled = false // Better performance for simple shapes

  // Handle high DPI displays
  const dpr = window.devicePixelRatio || 1
  
  // Use viewport dimensions to ensure full screen coverage
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  canvasWidth.value = viewportWidth
  canvasHeight.value = viewportHeight

  // Set canvas internal resolution (for high DPI)
  starsCanvas.value.width = viewportWidth * dpr
  starsCanvas.value.height = viewportHeight * dpr

  // Scale context for high DPI
  ctx.scale(dpr, dpr)
  
  // Set canvas CSS size to full viewport
  starsCanvas.value.style.width = viewportWidth + 'px'
  starsCanvas.value.style.height = viewportHeight + 'px'
}

const calculateCurrentPosition = (star, currentTime) => {
  if (star.type === 'static') {
    return { x: star.x, y: star.y }
  }

  const elapsed = (currentTime - star.startTime) / 1000 // Convert to seconds
  const progress = elapsed / star.animationDuration

  // Mark star as invisible if animation is complete
  if (progress >= 1 && star.type !== 'static') {
    star.isVisible = false
  }

  if (star.type === 'lonely') {
    const x = star.startX + (star.endX - star.startX) * progress
    const y = star.startY + (star.endY - star.startY) * progress
    
    return { x, y }
  }

  if (star.type === 'cluster') {
    const baseX = star.clusterStartX + (star.clusterEndX - star.clusterStartX) * progress
    const baseY = star.clusterStartY + (star.clusterEndY - star.clusterStartY) * progress

    // Add individual star offset and drift
    const driftProgress = (elapsed * star.speedVariation) % 1
    const driftX =
      Math.sin(driftProgress * Math.PI * 2 + (star.driftAngle * Math.PI) / 180) *
      star.trajectoryOffsetX
    const driftY =
      Math.cos(driftProgress * Math.PI * 2 + (star.driftAngle * Math.PI) / 180) *
      star.trajectoryOffsetY

    const finalX = baseX +
        (star.offsetX / canvasWidth.value) * 100 +
        (driftX / canvasWidth.value) * 100
    const finalY = baseY +
        (star.offsetY / canvasHeight.value) * 100 +
        (driftY / canvasHeight.value) * 100

    return { x: finalX, y: finalY }
  }

  if (star.type === 'storm') {
    const distance = star.distance * progress
    const x =
      star.startX +
      Math.sin((star.direction * Math.PI) / 180) * (distance / canvasWidth.value) * 100
    const y =
      star.startY +
      Math.cos((star.direction * Math.PI) / 180) * (distance / canvasHeight.value) * 100
      
    return { x, y }
  }

  return { x: star.x, y: star.y }
}

const calculateOpacity = (star, currentTime) => {
  const elapsed = (currentTime - star.startTime) / 1000

  if (star.type === 'static') {
    // Twinkling effect
    const twinklePhase = (elapsed + star.twinkleDelay) % 3
    return 0.3 + 0.7 * (Math.sin((twinklePhase * Math.PI * 2) / 3) * 0.5 + 0.5)
  }

  const progress = elapsed / star.animationDuration
  const baseBrightness = 1.2 // Flying stars are 20% brighter

  if (progress < 0.05) {
    // Fade in
    return (progress / 0.05) * star.baseOpacity * baseBrightness
  } else if (progress > 0.95) {
    // Fade out
    return ((1 - progress) / 0.05) * star.baseOpacity * baseBrightness
  }

  return star.baseOpacity * baseBrightness
}

const renderFrame = (currentTime) => {
  if (!ctx || !starsCanvas.value) return

  // Clear entire canvas with full transparency
  ctx.clearRect(0, 0, starsCanvas.value.width, starsCanvas.value.height)

  // Calculate simple rotation progress
  const adjustedTime = currentTime - rotationStartTime
  const rotationProgress = (adjustedTime / 1000) / TIMING.EARTH_ROTATION_DURATION
  const rotationAngle = (rotationProgress % 1) * 2 * Math.PI // radians
  
  // Draw all stars with rotation applied only to static stars
  allStarsOnScreen.value.forEach((star) => {
    if (!star.isVisible) return

    const position = calculateCurrentPosition(star, currentTime)
    const opacity = calculateOpacity(star, currentTime)

    if (opacity <= 0) return

    let finalX, finalY

    // Apply rotation only to static stars - flying stars should move in straight lines
    if (star.type === 'static') {
      // Apply rotation around screen center (50%, 50%) for static stars only
      const centerX = SKY_ROTATION.ORIGIN_X  // 50%
      const centerY = SKY_ROTATION.ORIGIN_Y  // 50%
      
      // Translate to origin relative to rotation center
      const translatedX = position.x - centerX
      const translatedY = position.y - centerY
      
      // Apply rotation matrix
      const rotatedX = translatedX * Math.cos(rotationAngle) - translatedY * Math.sin(rotationAngle)
      const rotatedY = translatedX * Math.sin(rotationAngle) + translatedY * Math.cos(rotationAngle)
      
      // Translate back to screen coordinates
      finalX = rotatedX + centerX
      finalY = rotatedY + centerY
    } else {
      // Flying stars (lonely, cluster, storm) maintain their trajectories without rotation
      finalX = position.x
      finalY = position.y
    }
    
    // Only render stars that are reasonably close to visible area for performance
    if (finalX < -50 || finalX > 150 || finalY < -50 || finalY > 150) {
      return // Skip stars far outside visible area
    }
    
    // Convert rotated percentage coordinates to pixels
    const pixelX = (finalX / 100) * canvasWidth.value
    const pixelY = (finalY / 100) * canvasHeight.value

    const glow = star.metadata?.hasGlow || star.type !== 'static'
    const velocity3D = star.velocity3D || star.metadata?.velocity3D || null

    // Calculate Doppler-shifted color if 3D velocity is provided
    const finalColor = velocity3D ? getDopplerColor(velocity3D, opacity) : star.color || '#FFB679'

    // Set opacity
    ctx.globalAlpha = opacity

    // Add motion trail for flying stars to make movement more visible
    // Skip trails on smaller screens or when too many stars are visible for performance
    const shouldDrawTrail = star.type !== 'static' && 
                           opacity > 0.3 && 
                           canvasWidth.value >= 768 && 
                           allStarsOnScreen.value.length < 300
                           
    if (shouldDrawTrail) {
      const position = calculateCurrentPosition(star, currentTime)
      const elapsed = (currentTime - star.startTime) / 1000
      const progress = elapsed / star.animationDuration
      
      // Draw 3 trail points behind the star
      for (let i = 1; i <= 3; i++) {
        const trailProgress = Math.max(0, progress - (i * 0.015)) // Trail behind by 1.5% each
        let trailX, trailY
        
        if (star.type === 'lonely') {
          trailX = star.startX + (star.endX - star.startX) * trailProgress
          trailY = star.startY + (star.endY - star.startY) * trailProgress
        } else if (star.type === 'cluster') {
          const baseX = star.clusterStartX + (star.clusterEndX - star.clusterStartX) * trailProgress
          const baseY = star.clusterStartY + (star.clusterEndY - star.clusterStartY) * trailProgress
          trailX = baseX + (star.offsetX / canvasWidth.value) * 100
          trailY = baseY + (star.offsetY / canvasHeight.value) * 100
        } else if (star.type === 'storm') {
          const distance = star.distance * trailProgress
          trailX = star.startX + Math.sin((star.direction * Math.PI) / 180) * (distance / canvasWidth.value) * 100
          trailY = star.startY + Math.cos((star.direction * Math.PI) / 180) * (distance / canvasHeight.value) * 100
        }
        
        const trailPixelX = (trailX / 100) * canvasWidth.value
        const trailPixelY = (trailY / 100) * canvasHeight.value
        
        ctx.globalAlpha = opacity * 0.15 * (4 - i) / 3 // Fade trail
        ctx.fillStyle = finalColor
        ctx.beginPath()
        ctx.arc(trailPixelX, trailPixelY, star.size * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Reset opacity for main star
      ctx.globalAlpha = opacity
    }

    // Draw glow effect for special stars
    if (glow) {
      const glowSize = star.type === 'static' ? star.size * 3 : star.size * 5 // Larger glow for flying stars
      const gradient = ctx.createRadialGradient(
        pixelX,
        pixelY,
        0,
        pixelX,
        pixelY,
        glowSize
      )

      // Convert rgb to rgba for gradient stops with stronger glow for flying stars
      const glowAlpha = star.type === 'static' ? 0.25 : 0.4
      const glowColor = finalColor.replace('rgb(', 'rgba(').replace(')', ', ' + glowAlpha + ')')

      gradient.addColorStop(0, finalColor)
      gradient.addColorStop(0.5, glowColor)
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(pixelX, pixelY, glowSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw main star
    ctx.fillStyle = finalColor
    ctx.beginPath()
    ctx.arc(pixelX, pixelY, star.size, 0, Math.PI * 2)
    ctx.fill()
  })

  // Continue animation
  animationFrameId = requestAnimationFrame(renderFrame)
}

// Calculate Doppler-shifted color based on 3D velocity
const getDopplerColor = (velocity3D, baseIntensity = 1) => {
  // Z velocity determines Doppler shift (-1 = moving away = red, +1 = moving towards = blue)
  const dopplerShift = velocity3D.z

  // Calculate magnitude of total velocity for brightness variation
  const velocityMagnitude = Math.sqrt(
    velocity3D.x ** 2 + velocity3D.y ** 2 + velocity3D.z ** 2
  )

  // Base star temperature (white point)
  let r = 255,
    g = 182,
    b = 121 // Default warm white (#FFB679)

  if (dopplerShift > 0) {
    // Moving towards observer - blue shift
    const blueShift = Math.min(dopplerShift, 1) // Clamp to prevent oversaturation
    r = Math.max(120, 255 - blueShift * 135) // Reduce red
    g = Math.max(140, 182 - blueShift * 42) // Slightly reduce green
    b = Math.min(255, 121 + blueShift * 134) // Increase blue
  } else if (dopplerShift < 0) {
    // Moving away from observer - red shift
    const redShift = Math.min(Math.abs(dopplerShift), 1) // Clamp to prevent oversaturation
    r = Math.min(255, 255 + redShift * 0) // Keep red high
    g = Math.max(80, 182 - redShift * 102) // Reduce green significantly
    b = Math.max(40, 121 - redShift * 81) // Reduce blue significantly
  }

  // Velocity magnitude affects brightness and color temperature
  const brightnessFactor = 0.8 + velocityMagnitude * 0.4 // 0.8 to 1.2 range
  const intensityFactor = baseIntensity * brightnessFactor

  // Apply intensity
  r = Math.round(Math.min(255, r * intensityFactor))
  g = Math.round(Math.min(255, g * intensityFactor))
  b = Math.round(Math.min(255, b * intensityFactor))

  return `rgb(${r}, ${g}, ${b})`
}

// Handle window resize
const handleResize = () => {
  if (!starsCanvas.value) return

  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
  initCanvas()
}

// Generate static stars with fixed positions
const generateStaticStars = () => {
  const starInstances = []
  
  // Create a large 2D plane centered around the rotation point (50%, 50%)
  // Use 400% coverage to ensure complete coverage during rotation
  const planeSize = 400 // 400% total coverage
  const planeCenterX = SKY_ROTATION.ORIGIN_X // Center around rotation point X
  const planeCenterY = SKY_ROTATION.ORIGIN_Y // Center around rotation point Y
  
  for (let i = 0; i < STATIC_STARS.COUNT; i++) {
    // Distribute stars evenly across the large plane, centered on rotation point
    const x = planeCenterX + (Math.random() - 0.5) * planeSize // -200% to +200% from center
    const y = planeCenterY + (Math.random() - 0.5) * planeSize // -200% to +200% from center
    
    // Generate 3D velocity components for Doppler effect
    const velocityX = (Math.random() - 0.5) * 2 // -1 to 1
    const velocityY = (Math.random() - 0.5) * 2 // -1 to 1
    const velocityZ = (Math.random() - 0.5) * 2 // -1 to 1, towards/away from observer
    
    // Create Star instance
    const star = new Star({
      x: x,
      y: y,
      size: STATIC_STARS.SIZE_MIN + Math.random() * (STATIC_STARS.SIZE_MAX - STATIC_STARS.SIZE_MIN),
      type: 'static',
      twinkleDelay: Math.random() * STATIC_STARS.TWINKLE_DELAY_MAX,
      velocity3D: { x: velocityX, y: velocityY, z: velocityZ },
      metadata: {
        id: i,
        twinkleDelay: Math.random() * STATIC_STARS.TWINKLE_DELAY_MAX,
        color: '#FFB679'
      }
    })
    
    starInstances.push(star)
  }
  
  return starInstances
}

// Generate a lonely flying star starting from border
const generateLonelyStar = (id) => {
  // Choose random border (0=top, 1=right, 2=bottom, 3=left)
  const startBorder = Math.floor(Math.random() * 4)
  const endBorder = Math.floor(Math.random() * 4)

  let startX, startY, endX, endY

  // Use screen boundaries for flying stars (0-100%) since they don't rotate
  const SCREEN_BORDERS = {
    TOP: -10,    // Just outside screen
    RIGHT: 110,  // Just outside screen
    BOTTOM: 110, // Just outside screen
    LEFT: -10    // Just outside screen
  }
  
  const randomScreenPos = () => Math.random() * 100 // 0-100% for screen positions

  // Start position from border - just outside screen
  switch (startBorder) {
    case 0: // top
      startX = randomScreenPos()
      startY = SCREEN_BORDERS.TOP
      break
    case 1: // right
      startX = SCREEN_BORDERS.RIGHT
      startY = randomScreenPos()
      break
    case 2: // bottom
      startX = randomScreenPos()
      startY = SCREEN_BORDERS.BOTTOM
      break
    case 3: // left
      startX = SCREEN_BORDERS.LEFT
      startY = randomScreenPos()
      break
  }

  // End position at opposite border
  switch (endBorder) {
    case 0: // top
      endX = randomScreenPos()
      endY = SCREEN_BORDERS.TOP
      break
    case 1: // right
      endX = SCREEN_BORDERS.RIGHT
      endY = randomScreenPos()
      break
    case 2: // bottom
      endX = randomScreenPos()
      endY = SCREEN_BORDERS.BOTTOM
      break
    case 3: // left
      endX = SCREEN_BORDERS.LEFT
      endY = randomScreenPos()
      break
  }

  const star = {
    id,
    startX,
    startY,
    endX,
    endY,
    size:
      LONELY_STARS.SIZE_MIN +
      Math.random() * (LONELY_STARS.SIZE_MAX - LONELY_STARS.SIZE_MIN),
    delay: 0,
    duration:
      LONELY_STARS.DURATION_MIN +
      Math.random() * (LONELY_STARS.DURATION_MAX - LONELY_STARS.DURATION_MIN),
    visible: false,
    lastLoggedProgress: -1, // Track logging progress
    velocity3D: {
      x: (endX - startX) / 100, // Normalized trajectory as velocity
      y: (endY - startY) / 100,
      z: (Math.random() - 0.5) * 2 // Random Z velocity for Doppler effect
    }
  }
  
  return star
}

// Generate a cluster of stars starting from border
const generateStarCluster = (id) => {
  const numStars =
    CLUSTERS.STARS_PER_CLUSTER_MIN +
    Math.floor(
      Math.random() *
        (CLUSTERS.STARS_PER_CLUSTER_MAX - CLUSTERS.STARS_PER_CLUSTER_MIN + 1)
    )

  // Choose random border for cluster start and end
  const startBorder = Math.floor(Math.random() * 4)
  const endBorder = Math.floor(Math.random() * 4)

  let baseStartX, baseStartY, baseEndX, baseEndY

  // Use screen boundaries for clusters since they don't rotate
  const SCREEN_BORDERS = {
    TOP: -10,    // Just outside screen
    RIGHT: 110,  // Just outside screen
    BOTTOM: 110, // Just outside screen
    LEFT: -10    // Just outside screen
  }
  
  const randomScreenPos = () => Math.random() * 100 // 0-100% for screen positions

  // Start position from border
  switch (startBorder) {
    case 0: // top
      baseStartX = randomScreenPos()
      baseStartY = SCREEN_BORDERS.TOP
      break
    case 1: // right
      baseStartX = SCREEN_BORDERS.RIGHT
      baseStartY = randomScreenPos()
      break
    case 2: // bottom
      baseStartX = randomScreenPos()
      baseStartY = SCREEN_BORDERS.BOTTOM
      break
    case 3: // left
      baseStartX = SCREEN_BORDERS.LEFT
      baseStartY = randomScreenPos()
      break
  }

  // End position at border
  switch (endBorder) {
    case 0: // top
      baseEndX = randomScreenPos()
      baseEndY = SCREEN_BORDERS.TOP
      break
    case 1: // right
      baseEndX = SCREEN_BORDERS.RIGHT
      baseEndY = randomScreenPos()
      break
    case 2: // bottom
      baseEndX = randomScreenPos()
      baseEndY = SCREEN_BORDERS.BOTTOM
      break
    case 3: // left
      baseEndX = SCREEN_BORDERS.LEFT
      baseEndY = randomScreenPos()
      break
  }

  const stars = Array.from({ length: numStars }, (_, i) => ({
    id: i,
    offsetX: (Math.random() - 0.5) * (CLUSTERS.SPREAD_RADIUS * 2),
    offsetY: (Math.random() - 0.5) * (CLUSTERS.SPREAD_RADIUS * 2),
    size:
      CLUSTERS.STAR_SIZE_MIN +
      Math.random() * (CLUSTERS.STAR_SIZE_MAX - CLUSTERS.STAR_SIZE_MIN),
    delay: Math.random() * CLUSTERS.DELAY_VARIATION_MAX,
    speedVariation:
      CLUSTERS.SPEED_VARIATION_MIN +
      Math.random() * (CLUSTERS.SPEED_VARIATION_MAX - CLUSTERS.SPEED_VARIATION_MIN),
    trajectoryOffsetX: (Math.random() - 0.5) * (CLUSTERS.TRAJECTORY_OFFSET_MAX * 2),
    trajectoryOffsetY: (Math.random() - 0.5) * (CLUSTERS.TRAJECTORY_OFFSET_MAX * 2),
    driftAngle: Math.random() * 360,
    velocity3D: {
      x: (baseEndX - baseStartX) / 100, // Cluster trajectory as base velocity
      y: (baseEndY - baseStartY) / 100,
      z: (Math.random() - 0.5) * 3 // Higher Z variation for clusters
    }
  }))

  return {
    id,
    startX: baseStartX,
    startY: baseStartY,
    endX: baseEndX,
    endY: baseEndY,
    delay: 0,
    duration:
      CLUSTERS.DURATION_MIN +
      Math.random() * (CLUSTERS.DURATION_MAX - CLUSTERS.DURATION_MIN),
    stars,
    visible: false
  }
}

// Initialize lonely stars
const initializeLonelyStars = () => {
  lonelyStars.value = Array.from({ length: LONELY_STARS.COUNT }, (_, i) =>
    generateLonelyStar(i)
  )
}

// Initialize star clusters
const initializeStarClusters = () => {
  starClusters.value = Array.from({ length: CLUSTERS.COUNT }, (_, i) =>
    generateStarCluster(i)
  )
}

// Show a lonely star with animation
const showLonelyStar = (star) => {
  star.visible = true
  star.delay = 0

  // Hide star after animation completes
  setTimeout(() => {
    star.visible = false
  }, (star.duration + 2) * 1000)
}

// Show a cluster with animation
const showCluster = (cluster) => {
  cluster.visible = true
  cluster.delay = 0

  // Calculate extra time based on cluster spread
  const clusterSpread = CLUSTERS.SPREAD_RADIUS * 2 // Total spread diameter
  const extraTimeForSpread = (clusterSpread / 1200) * cluster.duration * 0.5 // 50% extra time
  const totalDuration = cluster.duration + extraTimeForSpread + CLUSTERS.VISIBILITY_BUFFER

  // Hide cluster after all stars have had time to pass screen borders
  setTimeout(() => {
    cluster.visible = false
  }, totalDuration * 1000)
}

// Trigger random lonely star appearances
const triggerLonelyStarAppearance = () => {
  const availableStars = lonelyStars.value.filter((star) => !star.visible)

  if (availableStars.length > 0) {
    const randomStar = availableStars[Math.floor(Math.random() * availableStars.length)]

    // Generate new trajectory for the star
    const newStar = generateLonelyStar(randomStar.id)
    Object.assign(randomStar, newStar)

    showLonelyStar(randomStar)
  }
}

// Trigger random cluster appearances
const triggerClusterAppearance = () => {
  const availableClusters = starClusters.value.filter((cluster) => !cluster.visible)

  if (availableClusters.length > 0) {
    const randomCluster =
      availableClusters[Math.floor(Math.random() * availableClusters.length)]

    // Generate new trajectory for the cluster
    const newCluster = generateStarCluster(randomCluster.id)
    Object.assign(randomCluster, newCluster)

    showCluster(randomCluster)
  }
}

// Trigger multiple clusters for spectacular display
const triggerClusterBurst = () => {
  const availableClusters = starClusters.value.filter((cluster) => !cluster.visible)
  const burstCount = Math.min(
    CLUSTERS.BURST_COUNT_MIN +
      Math.floor(
        Math.random() * (CLUSTERS.BURST_COUNT_MAX - CLUSTERS.BURST_COUNT_MIN + 1)
      ),
    availableClusters.length
  )

  for (let i = 0; i < burstCount; i++) {
    if (availableClusters[i]) {
      const cluster = availableClusters[i]
      const newCluster = generateStarCluster(cluster.id)
      Object.assign(cluster, newCluster)

      // Stagger cluster appearances for dramatic effect
      setTimeout(() => {
        showCluster(cluster)
      }, i * CLUSTERS.BURST_STAGGER_DELAY)
    }
  }
}

// Trigger burst of multiple lonely stars
const triggerStarBurst = () => {
  const availableStars = lonelyStars.value.filter((star) => !star.visible)
  const burstCount = Math.min(
    LONELY_STARS.BURST_COUNT_MIN +
      Math.floor(
        Math.random() * (LONELY_STARS.BURST_COUNT_MAX - LONELY_STARS.BURST_COUNT_MIN + 1)
      ),
    availableStars.length
  )

  for (let i = 0; i < burstCount; i++) {
    if (availableStars[i]) {
      const star = availableStars[i]
      const newStar = generateLonelyStar(star.id)
      Object.assign(star, newStar)

      // Stagger the star appearances slightly
      setTimeout(() => {
        showLonelyStar(star)
      }, i * LONELY_STARS.BURST_STAGGER_DELAY)
    }
  }
}

// Rotation timing
let rotationStartTime = performance.now()

onMounted(() => {
  // Initialize canvas
  initCanvas()

  // Add resize listener
  window.addEventListener('resize', handleResize)

  // Initialize static stars with fixed positions
  staticStars.value = generateStaticStars()

  // Initialize both lonely stars and star clusters
  initializeLonelyStars()
  initializeStarClusters()
  initializeStarStorms()

  // Trigger lonely star appearances with random intervals
  const scheduleLonelyStar = () => {
    const delay =
      LONELY_STARS.APPEARANCE_INTERVAL_MIN +
      Math.random() *
        (LONELY_STARS.APPEARANCE_INTERVAL_MAX - LONELY_STARS.APPEARANCE_INTERVAL_MIN)
    lonelyStarInterval = setTimeout(() => {
      // 70% chance for single star, 30% chance for burst
      if (Math.random() < 1 - LONELY_STARS.BURST_CHANCE) {
        triggerLonelyStarAppearance()
      } else {
        triggerStarBurst()
      }
      scheduleLonelyStar() // Schedule next appearance
    }, delay)
  }
  scheduleLonelyStar()

  // Trigger cluster appearances with random intervals
  const scheduleCluster = () => {
    const delay =
      CLUSTERS.APPEARANCE_INTERVAL_MIN +
      Math.random() *
        (CLUSTERS.APPEARANCE_INTERVAL_MAX - CLUSTERS.APPEARANCE_INTERVAL_MIN)
    clusterInterval = setTimeout(() => {
      // 80% chance for single cluster, 20% chance for cluster burst
      if (Math.random() < 1 - CLUSTERS.BURST_CHANCE) {
        triggerClusterAppearance()
      } else {
        triggerClusterBurst()
      }
      scheduleCluster() // Schedule next appearance
    }, delay)
  }
  scheduleCluster()

  // Trigger storm appearances with random intervals
  const scheduleStorm = () => {
    const delay =
      STAR_STORMS.INTERVAL_MIN +
      Math.random() * (STAR_STORMS.INTERVAL_MAX - STAR_STORMS.INTERVAL_MIN)
    stormInterval = setTimeout(() => {
      triggerStormAppearance()
      scheduleStorm() // Schedule next storm
    }, delay)
  }
  scheduleStorm()

  // Update the comprehensive stars array every 200ms for real-time tracking (less frequent = better performance)
  starsUpdateInterval = setInterval(() => {
    updateAllStarsArray()
  }, 200)

  // Initial update and start animation loop
  updateAllStarsArray()
  animationFrameId = requestAnimationFrame(renderFrame)

  // Add occasional satellite communication flashes
  glitchInterval = setInterval(() => {
    const satellites = document.querySelectorAll('.satellite')
    satellites.forEach((sat) => {
      sat.style.filter = 'brightness(2) drop-shadow(0 0 10px #FFB679)'
      setTimeout(() => {
        sat.style.filter = 'brightness(1)'
      }, TIMING.SATELLITE_FLASH_DURATION)
    })
  }, TIMING.SATELLITE_FLASH_INTERVAL)
})

onUnmounted(() => {
  // Cancel animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // Remove resize listener
  window.removeEventListener('resize', handleResize)

  // Clear intervals and timeouts
  if (glitchInterval) {
    clearInterval(glitchInterval)
  }
  if (clusterInterval) {
    clearTimeout(clusterInterval)
  }
  if (lonelyStarInterval) {
    clearTimeout(lonelyStarInterval)
  }
  if (stormInterval) {
    clearTimeout(stormInterval)
  }
  if (starsUpdateInterval) {
    clearInterval(starsUpdateInterval)
  }

  // Clean up window exposure
  if (typeof window !== 'undefined') {
    delete window.tcsn_stars
  }
})

// Expose the stars array and utility functions to parent components
defineExpose({
  allStarsOnScreen,
  getStarsByType: (type) => allStarsOnScreen.value.filter((s) => s.type === type),
  getStarsInRegion: (x1, y1, x2, y2) =>
    allStarsOnScreen.value.filter(
      (s) => s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2
    ),
  getStarById: (id) => allStarsOnScreen.value.find((s) => s.id === id),
  getStarsCount: () => ({
    total: allStarsOnScreen.value.length,
    static: allStarsOnScreen.value.filter((s) => s.type === 'static').length,
    lonely: allStarsOnScreen.value.filter((s) => s.type === 'lonely').length,
    cluster: allStarsOnScreen.value.filter((s) => s.type === 'cluster').length,
    storm: allStarsOnScreen.value.filter((s) => s.type === 'storm').length
  }),
  updateStarsArray: updateAllStarsArray
})
</script>

<style scoped>
/* Canvas for stars */
.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>