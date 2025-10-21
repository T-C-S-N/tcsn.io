<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useStarFieldStore } from '@/stores/starFieldStore.js'

// Constants
const EARTH = {
  ROTATION_PERIOD: 600, // seconds for a full rotation
  ROTATE_AXIS_X: 4, // Axis tilt for rotation
  ROTATE_AXIS_Y: 5, // Axis tilt for rotation
  ROTATE_CENTER_X: 0.5, // Center of rotation (0-1 range)
  ROTATE_CENTER_Y: 0, // Center of rotation (0-1 range)
  VIEW_MARGIN_X: 1, // Margin for padding around the viewport for star creation
  VIEW_MARGIN_Y: 1, // Margin for padding around the viewport for star creation
  ZOOM: 1.0 // Zoom factor for extended coverage area
}
const STARS = {
  MAX_AMOUNT: Math.max(600, Math.min(100, Math.floor(60 * EARTH.ZOOM))), // Cap at 300 stars max for performance
  MIN_SIZE: 0.5, // Minimum star size
  MAX_SIZE: 1.5 // Maximum star size
}

const FLYING_STARS = {
  MIN_SIZE: 0.5,
  MAX_SIZE: 1,
  MIN_VELOCITY: 0.005, // Reduced for longer duration
  MAX_VELOCITY: 2, // Reduced for longer duration
  Z_VELOCITY: 7,
  SPAWN_CHANCE: 0.005 // Reduced spawn chance for better performance
}

const CLUSTER_STARS = {
  MIN_SIZE: 0.5,
  MAX_SIZE: 1,
  MIN_VELOCITY: 0.005, // Reduced for longer duration
  MAX_VELOCITY: 2, // Reduced for longer duration
  CLUSTER_RADIUS: 0.5, // Radius for cluster stars
  SPAWN_CHANCE: 0.0002, // Reduced spawn chance for better performance
  SPEED_VARIATION: 0.2, // Max speed difference within a cluster
  DIRECTION_VARIATION: 0.1, // Direction variation within cluster
  DELAY_VARIATION: 0.3 // Max delay variation within cluster
}

const STORM_STARS = {
  MIN_SIZE: 0.5,
  MAX_SIZE: 1,
  MIN_VELOCITY: 0.005, // Reduced for longer duration
  MAX_VELOCITY: 2, // Reduced for longer duration
  CLUSTER_RADIUS: 5, // Radius for cluster stars
  SPAWN_CHANCE: 0.0002, // Reduced spawn chance for better performance
  STORM_RADIUS: 0.1 // Radius for storm stars
}

class Star {
  constructor(data) {
    // type: 'static', 'lonely', 'cluster', 'storm'
    this.type = data?.type ?? 'static' // 'static', 'lonely', 'cluster', 'storm'
    this.groupId = data?.groupId ?? null // For grouping stars in clusters or storms

    // 2D plane coordinates (percentage)
    this.x = data?.x ?? 0
    this.y = data?.y ?? 0
    this.z = data?.z ?? 0 // For depth effect and color variation
    this.color = data?.color ?? '#FFFFFF' // Default color

    // Store original coordinates for static stars to prevent drift
    if (this.type === 'static') {
      this.originalX = this.x
      this.originalY = this.y
      this.originalZ = this.z
    }

    // Star properties
    this.size = data?.size ?? 1
    this.type = data?.type ?? 'static' // 'static', 'lonely', 'cluster', 'storm'
    this.isVisible = data?.isVisible ?? true

    // 3D velocity for Doppler effect and movement
    // 0: negative, 5: static, 10: positive
    this.velocity3D = data?.velocity3D ?? { x: 0, y: 0, z: 0 }

    // Additional properties for animation
    this.startTime = data?.startTime ?? performance.now() // Track when star was created
    this.animationDuration = data?.animationDuration ?? 3 // seconds for a full animation cycle
    this.baseOpacity = data?.baseOpacity ?? 1 // Base opacity for twinkling
    this.twinkleDelay = data?.twinkleDelay ?? 0 // Delay before twinkle starts
    this.metadata = data?.metadata ?? {}
  }

  setColorBasedOnDepth() {
    // Normalize z velocity from 0-10 range to -1 to 1 range for Doppler effect
    const normalizedZ = (this.velocity3D.z - 5) / 5 // 0-10 becomes -1 to 1

    // Base star color (warm white)
    let r = 255,
      g = 182,
      b = 121 // #FFB679

    // The more positive the z velocity, the brighter the star, the more its red
    // The more negative the z velocity, the dimmer the star, the more its blue
    if (normalizedZ > 0) {
      // Moving towards observer - red shift and brighter
      const redShift = normalizedZ
      r = Math.min(255, 255) // Keep red high
      g = Math.max(100, 182 - redShift * 82) // Reduce green
      b = Math.max(60, 121 - redShift * 61) // Reduce blue

      // Increase brightness
      const brightnessFactor = 1 + redShift * 0.5 // Up to 1.5x brighter
      r = Math.min(255, r * brightnessFactor)
      g = Math.min(255, g * brightnessFactor)
      b = Math.min(255, b * brightnessFactor)
    } else if (normalizedZ < 0) {
      // Moving away from observer - blue shift and dimmer
      const blueShift = Math.abs(normalizedZ)
      r = Math.max(80, 255 - blueShift * 175) // Reduce red significantly
      g = Math.max(120, 182 - blueShift * 62) // Reduce green
      b = Math.min(255, 121 + blueShift * 134) // Increase blue

      // Decrease brightness
      const brightnessFactor = 1 - blueShift * 0.4 // Down to 0.6x dimmer
      r = Math.max(0, r * brightnessFactor)
      g = Math.max(0, g * brightnessFactor)
      b = Math.max(0, b * brightnessFactor)
    }

    this.color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  }

  getTwinkleOpacity() {
    // Calculate current time since star creation
    const now = performance.now()
    const elapsed = (now - this.startTime) / 1000 // Convert to seconds

    // Apply twinkle delay
    if (elapsed < this.twinkleDelay) {
      return this.baseOpacity
    }

    // Create a smooth twinkling effect using sine waves
    const twinkleTime = elapsed - this.twinkleDelay
    const twinklePhase = (twinkleTime * 2 * Math.PI) / this.animationDuration

    // Create multiple sine waves for more complex twinkling
    const primaryTwinkle = Math.sin(twinklePhase) * 0.3
    const secondaryTwinkle = Math.sin(twinklePhase * 1.7 + Math.PI / 3) * 0.2
    const tertiaryTwinkle = Math.sin(twinklePhase * 0.5 + Math.PI / 6) * 0.1

    // Combine waves and ensure opacity stays within reasonable bounds
    const twinkleEffect = primaryTwinkle + secondaryTwinkle + tertiaryTwinkle
    const finalOpacity = this.baseOpacity + twinkleEffect

    // Clamp between 0.1 and 1.0 to keep stars visible
    return Math.max(0.1, Math.min(1.0, finalOpacity))
  }

  checkVisibility() {
    //// For static stars, always check visibility based on their rotated position
    //if (this.type === 'static') {
    //  const rotatedPos = this.getRotatedPosition()
    //  this.isVisible = rotatedPos.x >= -0.1 && rotatedPos.x <= 1.1 && rotatedPos.y >= -0.1 && rotatedPos.y <= 1.1
    //} else {
    //  // For flying stars, check their direct position with small buffer
    //  this.isVisible = this.x >= -0.1 && this.x <= 1.1 && this.y >= -0.1 && this.y <= 1.1
    //}
  }

  update() {
    // For static stars, ensure they stay at their original coordinates
    if (this.type === 'static') {
      // Reset to original coordinates to prevent any drift
      this.x = this.originalX
      this.y = this.originalY
      this.z = this.originalZ
    } else {
      // Check if star should start moving yet (for delayed cluster stars)
      const now = performance.now()
      if (now >= this.startTime) {
        // For flying stars, apply both linear movement AND rotation effect
        // Calculate rotation effect
        const rotationSpeed = (2 * Math.PI) / (EARTH.ROTATION_PERIOD * 1000) // radians per millisecond
        const deltaTime = 16 // Approximate frame time in milliseconds
        
        // Calculate rotation center
        const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1
        const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1
        const centerX = EARTH.ROTATE_CENTER_X + normalizedAxisX
        const centerY = EARTH.ROTATE_CENTER_Y + normalizedAxisY
        
        // Calculate current distance and angle from rotation center
        const deltaX = this.x - centerX
        const deltaY = this.y - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const currentAngle = Math.atan2(deltaY, deltaX)
        
        // Apply rotation (counter-clockwise to simulate Earth's rotation effect on sky)
        const newAngle = currentAngle + rotationSpeed * deltaTime
        const rotatedX = centerX + Math.cos(newAngle) * distance
        const rotatedY = centerY + Math.sin(newAngle) * distance
        
        // Apply linear movement
        const linearX = this.velocity3D.x / 1000
        const linearY = this.velocity3D.y / 1000
        
        // Combine rotation and linear movement
        this.x = rotatedX + linearX
        this.y = rotatedY + linearY
        this.z += this.velocity3D.z / 1000
      }
      // Stars with future start times remain at their initial position

      // No wrap around for flying stars - let them fly off screen and get cleaned up
      // They will be removed by the 500px boundary check in updateFlyingStars()
    }

    // Update visibility for all stars
    this.checkVisibility()
    // Update color based on depth for all stars
    this.setColorBasedOnDepth()
  }

  getRotatedPosition() {
    // Calculate rotation based on Earth's rotation period
    const now = performance.now()
    const rotationProgress = now / 1000 / EARTH.ROTATION_PERIOD // Progress through rotation cycle
    const rotationAngle = rotationProgress * 2 * Math.PI // Convert to radians

    // Define the rotation center (normalize large axis values to stay on screen)
    const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1 // Keep within -0.2 to 0.2 range
    const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1 // Keep within -0.2 to 0.2 range

    const centerX = EARTH.ROTATE_CENTER_X + normalizedAxisX // User-defined center with offset
    const centerY = EARTH.ROTATE_CENTER_Y + normalizedAxisY // User-defined center with offset

    // Calculate distance and angle from the rotation center
    const deltaX = this.x - centerX
    const deltaY = this.y - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const currentAngle = Math.atan2(deltaY, deltaX)

    // Apply rotation around the center
    const newAngle = currentAngle + rotationAngle
    const rotatedX = centerX + Math.cos(newAngle) * distance
    const rotatedY = centerY + Math.sin(newAngle) * distance

    // Keep the z coordinate for depth effects
    return {
      x: rotatedX,
      y: rotatedY,
      z: this.z
    }
  }
}

// Stars array
const stars = ref([])
const flyingStars = ref([])
const clusterStars = ref([])
const stormStars = ref([])

// Initialize store
const starFieldStore = useStarFieldStore()

// Watch for changes in stars and sync with store
watch([stars, flyingStars, clusterStars, stormStars], () => {
  const allStars = [...stars.value, ...flyingStars.value, ...clusterStars.value, ...stormStars.value]
  starFieldStore.updateStars(allStars)
}, { deep: true })

// intervals
const intervals = []
// Canvas related
const starsCanvas = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

// Throttle resize events for better performance
let resizeTimeout = null

// Handle window resize
const handleResize = () => {
  const newWidth = window.innerWidth
  const newHeight = window.innerHeight
  
  canvasWidth.value = newWidth
  canvasHeight.value = newHeight
  
  // Clear existing timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  
  // Throttle the canvas update
  resizeTimeout = setTimeout(() => {
    // Force canvas element to update its dimensions immediately
    if (starsCanvas.value) {
      const canvas = starsCanvas.value
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Clear and redraw immediately after resize
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, newWidth, newHeight)
        displayStars()
      }
    }
  }, 16) // Throttle to ~60fps
}

// Calculate extended view boundaries using margins and rotation
function getExtendedBounds() {
  // Calculate rotation center
  const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1
  const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1
  const centerX = EARTH.ROTATE_CENTER_X + normalizedAxisX
  const centerY = EARTH.ROTATE_CENTER_Y + normalizedAxisY

  // Calculate the maximum distance from center to any screen corner during rotation
  const corners = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 }
  ]

  const maxDistanceFromCenter = Math.max(
    ...corners.map((corner) =>
      Math.sqrt(Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2))
    )
  )

  // Use EARTH.ZOOM for configurable coverage area, with minimum buffer
  const rotationBuffer = Math.max(0.5, maxDistanceFromCenter * EARTH.ZOOM)

  return {
    minX: centerX - rotationBuffer,
    maxX: centerX + rotationBuffer,
    minY: centerY - rotationBuffer,
    maxY: centerY + rotationBuffer,
    centerX: centerX,
    centerY: centerY,
    maxRadius: rotationBuffer
  }
}

// Zone-based star management for even distribution
function getZoneInfo() {
  const bounds = getExtendedBounds()
  // Scale grid size based on ZOOM for better distribution, with minimum grid size
  const baseGridSize = Math.max(3, Math.ceil(Math.sqrt(STARS.MAX_AMOUNT / 4)))
  const gridSize = Math.max(baseGridSize, Math.ceil(baseGridSize * Math.sqrt(EARTH.ZOOM)))
  const totalWidth = bounds.maxX - bounds.minX
  const totalHeight = bounds.maxY - bounds.minY
  const cellWidth = totalWidth / gridSize
  const cellHeight = totalHeight / gridSize

  return {
    gridSize,
    cellWidth,
    cellHeight,
    totalZones: gridSize * gridSize,
    bounds
  }
}

// Count stars per zone to ensure even distribution
function getStarsPerZone() {
  const zoneInfo = getZoneInfo()
  const starsPerZone = new Map()

  stars.value.forEach((star) => {
    if (star.metadata?.starId === 0) return // Skip North Star

    // Calculate which zone this star belongs to
    const relativeX = star.x - zoneInfo.bounds.minX
    const relativeY = star.y - zoneInfo.bounds.minY
    const gridX = Math.floor(relativeX / zoneInfo.cellWidth)
    const gridY = Math.floor(relativeY / zoneInfo.cellHeight)
    const zoneId = `${gridX}-${gridY}`

    starsPerZone.set(zoneId, (starsPerZone.get(zoneId) || 0) + 1)
  })

  return starsPerZone
}

// Generate a star in a specific zone for balanced distribution
function generateStarInZone(gridX, gridY, starId) {
  const zoneInfo = getZoneInfo()

  // Add randomness within the zone
  const randomOffsetX = (Math.random() - 0.5) * zoneInfo.cellWidth * 0.8
  const randomOffsetY = (Math.random() - 0.5) * zoneInfo.cellHeight * 0.8

  const baseCellX =
    zoneInfo.bounds.minX + gridX * zoneInfo.cellWidth + zoneInfo.cellWidth / 2
  const baseCellY =
    zoneInfo.bounds.minY + gridY * zoneInfo.cellHeight + zoneInfo.cellHeight / 2

  const x = baseCellX + randomOffsetX
  const y = baseCellY + randomOffsetY

  const star = new Star({
    type: 'static',
    groupId: null,
    x: x,
    y: y,
    z: (Math.random() - 0.5) * 0.2,
    size: Math.random() * (STARS.MAX_SIZE - STARS.MIN_SIZE) + STARS.MIN_SIZE,
    velocity3D: {
      x: 0,
      y: 0,
      z: Math.random() * 10 // Keep as number, not string
    },
    baseOpacity: 0.6 + Math.random() * 0.4,
    twinkleDelay: Math.random() * 10,
    animationDuration: 2 + Math.random() * 4,
    isVisible: true,
    metadata: { starId: starId, zoneX: gridX, zoneY: gridY }
  })

  star.setColorBasedOnDepth()
  return star
}

// Generate a single static star within extended bounds using zone-based distribution
function generateStaticStar(id) {
  let x, y

  // For the North Star (id=0), place it at the rotation center
  if (id === 0) {
    // Calculate center using the same formula as rotation function
    const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1
    const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1
    x = EARTH.ROTATE_CENTER_X + normalizedAxisX
    y = EARTH.ROTATE_CENTER_Y + normalizedAxisY
  } else {
    // Use zone-based distribution for even spread
    const bounds = getExtendedBounds()

    // Create a grid system for even distribution based on ZOOM
    const baseGridSize = Math.max(3, Math.ceil(Math.sqrt(STARS.MAX_AMOUNT / 4)))
    const gridSize = Math.max(
      baseGridSize,
      Math.ceil(baseGridSize * Math.sqrt(EARTH.ZOOM))
    )
    const totalWidth = bounds.maxX - bounds.minX
    const totalHeight = bounds.maxY - bounds.minY
    const cellWidth = totalWidth / gridSize
    const cellHeight = totalHeight / gridSize

    // Determine which zone this star belongs to
    const starIndex = id - 1 // Exclude North Star
    const gridX = starIndex % gridSize
    const gridY = Math.floor(starIndex / gridSize)

    // Add some randomness within the cell to avoid perfect grid appearance
    const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.8 // 80% of cell size for randomness
    const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.8

    // Calculate position within the assigned zone
    const baseCellX = bounds.minX + gridX * cellWidth + cellWidth / 2
    const baseCellY = bounds.minY + gridY * cellHeight + cellHeight / 2

    x = baseCellX + randomOffsetX
    y = baseCellY + randomOffsetY
  }

  const star = new Star({
    type: 'static',
    groupId: null,
    x: x,
    y: y,
    z: (Math.random() - 0.5) * 0.2,
    size:
      id === 0 ? 1.5 : Math.random() * (STARS.MAX_SIZE - STARS.MIN_SIZE) + STARS.MIN_SIZE,
    velocity3D: {
      x: 0,
      y: 0,
      z: Math.random() * 10 // Keep as number, not string
    },
    baseOpacity: id === 0 ? 1.0 : 0.6 + Math.random() * 0.4,
    twinkleDelay: id === 0 ? 0 : Math.random() * 10,
    animationDuration: id === 0 ? 8 : 2 + Math.random() * 4,
    isVisible: true,
    metadata: { starId: id }
  })

  star.setColorBasedOnDepth()
  return star
}

// Count visible stars on screen
function countVisibleStars() {
  const screenBounds = { minX: -0.1, maxX: 1.1, minY: -0.1, maxY: 1.1 }

  return stars.value.filter((star) => {
    const pos = star.getRotatedPosition()
    return (
      pos.x >= screenBounds.minX &&
      pos.x <= screenBounds.maxX &&
      pos.y >= screenBounds.minY &&
      pos.y <= screenBounds.maxY
    )
  }).length
}

// Maintain star count with zone-based even distribution
function maintainStarCount() {
  const visibleCount = countVisibleStars()
  const deficit = STARS.MAX_AMOUNT - visibleCount

  if (deficit > 0) {
    const zoneInfo = getZoneInfo()
    const starsPerZone = getStarsPerZone()
    const targetStarsPerZone = Math.ceil(STARS.MAX_AMOUNT / zoneInfo.totalZones)

    // Find zones that need more stars
    const emptyZones = []
    for (let gridX = 0; gridX < zoneInfo.gridSize; gridX++) {
      for (let gridY = 0; gridY < zoneInfo.gridSize; gridY++) {
        const zoneId = `${gridX}-${gridY}`
        const currentCount = starsPerZone.get(zoneId) || 0

        if (currentCount < targetStarsPerZone) {
          // Add this zone multiple times based on how many stars it needs
          const needed = targetStarsPerZone - currentCount
          for (let i = 0; i < needed && emptyZones.length < deficit; i++) {
            emptyZones.push({ gridX, gridY })
          }
        }
      }
    }

    // Generate stars in zones that need them
    const starsToAdd = Math.min(deficit, emptyZones.length)
    for (let i = 0; i < starsToAdd; i++) {
      const zone = emptyZones[i]
      const newId = stars.value.length
      const newStar = generateStarInZone(zone.gridX, zone.gridY, newId)
      stars.value.push(newStar)
    }

    // If we still have deficit and all zones are filled, add randomly
    const remainingDeficit = deficit - starsToAdd
    if (remainingDeficit > 0) {
      for (let i = 0; i < remainingDeficit; i++) {
        const newId = stars.value.length
        const newStar = generateStaticStar(newId)
        stars.value.push(newStar)
      }
    }
  }

  // Remove stars that are extremely far outside bounds for performance
  const bounds = getExtendedBounds()
  const maxAllowedDistance = bounds.maxRadius * 1.2

  stars.value = stars.value.filter((star) => {
    // Always keep the North Star
    if (star.metadata?.starId === 0) return true

    // Calculate distance from rotation center
    const distanceFromCenter = Math.sqrt(
      Math.pow(star.x - bounds.centerX, 2) + Math.pow(star.y - bounds.centerY, 2)
    )

    return distanceFromCenter <= maxAllowedDistance
  })
}

// Generate a storm of star clusters
function generateStormStars() {
  const stormId = Date.now() + Math.random() // Unique storm ID
  const numClusters = 2 + Math.floor(Math.random() * 4) // 2-5 clusters per storm

  // Choose random starting edge for the storm center
  const startEdge = Math.floor(Math.random() * 4)
  let stormCenterX, stormCenterY, stormEndX, stormEndY

  // Start position - outside screen boundaries
  switch (startEdge) {
    case 0: // top
      stormCenterX = 0.1 + Math.random() * 0.8 // Keep away from corners
      stormCenterY = -0.2
      break
    case 1: // right
      stormCenterX = 1.2
      stormCenterY = 0.1 + Math.random() * 0.8
      break
    case 2: // bottom
      stormCenterX = 0.1 + Math.random() * 0.8
      stormCenterY = 1.2
      break
    case 3: // left
      stormCenterX = -0.2
      stormCenterY = 0.1 + Math.random() * 0.8
      break
  }

  // End position - opposite side with variation
  switch (startEdge) {
    case 0: // started from top, go to bottom
      stormEndX = stormCenterX + (Math.random() - 0.5) * 0.6
      stormEndY = 1.2
      break
    case 1: // started from right, go to left
      stormEndX = -0.2
      stormEndY = stormCenterY + (Math.random() - 0.5) * 0.6
      break
    case 2: // started from bottom, go to top
      stormEndX = stormCenterX + (Math.random() - 0.5) * 0.6
      stormEndY = -0.2
      break
    case 3: // started from left, go to right
      stormEndX = 1.2
      stormEndY = stormCenterY + (Math.random() - 0.5) * 0.6
      break
  }

  // Calculate base velocity for the storm
  const stormDistance = Math.sqrt(
    (stormEndX - stormCenterX) ** 2 + (stormEndY - stormCenterY) ** 2
  )
  const stormSpeed =
    STORM_STARS.MIN_VELOCITY +
    Math.random() * (STORM_STARS.MAX_VELOCITY - STORM_STARS.MIN_VELOCITY)
  const stormDuration = stormDistance / (stormSpeed / 100)

  const stormBaseVelocityX = (((stormEndX - stormCenterX) / stormDuration) * 1000) / 16
  const stormBaseVelocityY = (((stormEndY - stormCenterY) / stormDuration) * 1000) / 16

  const newStormStars = []

  // Generate multiple clusters within the storm
  for (let clusterIndex = 0; clusterIndex < numClusters; clusterIndex++) {
    // Position each cluster within storm radius
    const clusterAngle = Math.random() * 2 * Math.PI
    const clusterRadius = Math.random() * STORM_STARS.STORM_RADIUS
    const clusterCenterX = stormCenterX + Math.cos(clusterAngle) * clusterRadius
    const clusterCenterY = stormCenterY + Math.sin(clusterAngle) * clusterRadius

    // Each cluster has 3-6 stars
    const clusterSize = 3 + Math.floor(Math.random() * 4)

    // Add cluster-level variation to storm movement
    const clusterSpeedVariation = 1 + (Math.random() - 0.5) * 0.3 // 30% speed variation between clusters
    const clusterDirectionVariation = (Math.random() - 0.5) * (Math.PI / 6) // 30 degree direction variation

    // Apply rotation matrix for cluster direction variation
    const cos = Math.cos(clusterDirectionVariation)
    const sin = Math.sin(clusterDirectionVariation)
    const clusterVelocityX =
      (stormBaseVelocityX * cos - stormBaseVelocityY * sin) * clusterSpeedVariation
    const clusterVelocityY =
      (stormBaseVelocityX * sin + stormBaseVelocityY * cos) * clusterSpeedVariation

    // Generate individual stars in this cluster
    for (let starIndex = 0; starIndex < clusterSize; starIndex++) {
      // Position each star within the cluster
      const starAngle = Math.random() * 2 * Math.PI
      const starRadius = Math.random() * STORM_STARS.CLUSTER_RADIUS
      const starX = clusterCenterX + Math.cos(starAngle) * starRadius
      const starY = clusterCenterY + Math.sin(starAngle) * starRadius

      // Add individual star variation within cluster
      const starSpeedVariation = 1 + (Math.random() - 0.5) * 0.2 // 20% individual speed variation
      const starDirectionVariation = (Math.random() - 0.5) * (Math.PI / 12) // 15 degree individual direction variation

      // Apply individual star variation
      const starCos = Math.cos(starDirectionVariation)
      const starSin = Math.sin(starDirectionVariation)
      const finalVelocityX =
        (clusterVelocityX * starCos - clusterVelocityY * starSin) * starSpeedVariation
      const finalVelocityY =
        (clusterVelocityX * starSin + clusterVelocityY * starCos) * starSpeedVariation

      // Add delay variation for organic appearance
      const delayVariation = Math.random() * 1000 // Up to 1 second delay

      const stormStar = new Star({
        type: 'storm',
        groupId: stormId,
        x: starX,
        y: starY,
        z: Math.random() - 0.5,
        size:
          STORM_STARS.MIN_SIZE +
          Math.random() * (STORM_STARS.MAX_SIZE - STORM_STARS.MIN_SIZE),
        velocity3D: {
          x: finalVelocityX,
          y: finalVelocityY,
          z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 3 // More Z variation for storms
        },
        baseOpacity: 0.6 + Math.random() * 0.4,
        animationDuration: 4 + Math.random() * 6, // Much longer animation duration for storms
        startTime: performance.now() + delayVariation,
        metadata: {
          duration: stormDuration * 1000 * starSpeedVariation,
          stormId: stormId,
          clusterIndex: clusterIndex,
          isStormStar: true,
          delayVariation: delayVariation
        }
      })

      stormStar.setColorBasedOnDepth()
      newStormStars.push(stormStar)
    }
  }

  return newStormStars
}

// Update storm stars
function updateStormStars() {
  const now = performance.now()

  // Remove expired storm stars and those outside bounds
  stormStars.value = stormStars.value.filter((star) => {
    const elapsed = now - star.startTime
    const timeExpired = elapsed >= star.metadata.duration

    // Check if star is 500px outside window borders
    const canvas = starsCanvas.value
    if (canvas) {
      const x = star.x * canvas.width
      const y = star.y * canvas.height
      const outsideBounds =
        x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500

      // Remove if time expired OR outside bounds
      if (timeExpired || outsideBounds) {
        return false
      }
    }

    return !timeExpired
  })

  // Spawn new storm stars based on spawn chance
  if (Math.random() < STORM_STARS.SPAWN_CHANCE) {
    const newStormStars = generateStormStars()
    stormStars.value.push(...newStormStars)
  }

  // Update positions
  stormStars.value.forEach((star) => {
    star.update()
  })
}

// Generate a flying star from a random edge
function generateFlyingStar() {
  // Choose random edge (0=top, 1=right, 2=bottom, 3=left)
  const startEdge = Math.floor(Math.random() * 4)
  const endEdge = Math.floor(Math.random() * 4)

  let startX, startY, endX, endY

  // Start position - outside screen boundaries
  switch (startEdge) {
    case 0: // top
      startX = Math.random()
      startY = -0.1
      break
    case 1: // right
      startX = 1.1
      startY = Math.random()
      break
    case 2: // bottom
      startX = Math.random()
      startY = 1.1
      break
    case 3: // left
      startX = -0.1
      startY = Math.random()
      break
  }

  // End position - opposite side or random side
  switch (endEdge) {
    case 0: // top
      endX = Math.random()
      endY = -0.1
      break
    case 1: // right
      endX = 1.1
      endY = Math.random()
      break
    case 2: // bottom
      endX = Math.random()
      endY = 1.1
      break
    case 3: // left
      endX = -0.1
      endY = Math.random()
      break
  }

  // Calculate velocity based on distance and desired speed
  const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
  const speed =
    FLYING_STARS.MIN_VELOCITY +
    Math.random() * (FLYING_STARS.MAX_VELOCITY - FLYING_STARS.MIN_VELOCITY)
  const duration = distance / (speed / 100) // Scale duration

  const flyingStar = new Star({
    type: 'lonely',
    x: startX,
    y: startY,
    z: Math.random() - 0.5,
    size:
      FLYING_STARS.MIN_SIZE +
      Math.random() * (FLYING_STARS.MAX_SIZE - FLYING_STARS.MIN_SIZE),
    velocity3D: {
      x: (((endX - startX) / duration) * 1000) / 16,
      y: (((endY - startY) / duration) * 1000) / 16,
      z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 2
    },
    baseOpacity: 0.8 + Math.random() * 0.2,
    animationDuration: 3 + Math.random() * 4, // Longer animation duration for longer-lasting effect
    startTime: performance.now(),
    metadata: {
      duration: duration * 1000,
      endX: endX,
      endY: endY,
      isFlyingStar: true
    }
  })

  flyingStar.setColorBasedOnDepth()
  return flyingStar
}

// Generate a cluster of stars moving together
function generateClusterStars() {
  const clusterId = Date.now() + Math.random() // Unique cluster ID
  const clusterSize = 3 + Math.floor(Math.random() * 5) // 3-7 stars per cluster

  // Choose random starting edge for the cluster center
  const startEdge = Math.floor(Math.random() * 4)
  let centerX, centerY, endX, endY

  // Start position - outside screen boundaries
  switch (startEdge) {
    case 0: // top
      centerX = 0.2 + Math.random() * 0.6 // Keep away from corners
      centerY = -0.15
      break
    case 1: // right
      centerX = 1.15
      centerY = 0.2 + Math.random() * 0.6
      break
    case 2: // bottom
      centerX = 0.2 + Math.random() * 0.6
      centerY = 1.15
      break
    case 3: // left
      centerX = -0.15
      centerY = 0.2 + Math.random() * 0.6
      break
  }

  // End position - opposite side with some variation
  switch (startEdge) {
    case 0: // started from top, go to bottom
      endX = centerX + (Math.random() - 0.5) * 0.4
      endY = 1.15
      break
    case 1: // started from right, go to left
      endX = -0.15
      endY = centerY + (Math.random() - 0.5) * 0.4
      break
    case 2: // started from bottom, go to top
      endX = centerX + (Math.random() - 0.5) * 0.4
      endY = -0.15
      break
    case 3: // started from left, go to right
      endX = 1.15
      endY = centerY + (Math.random() - 0.5) * 0.4
      break
  }

  // Calculate base velocity for the cluster
  const distance = Math.sqrt((endX - centerX) ** 2 + (endY - centerY) ** 2)
  const baseSpeed =
    CLUSTER_STARS.MIN_VELOCITY +
    Math.random() * (CLUSTER_STARS.MAX_VELOCITY - CLUSTER_STARS.MIN_VELOCITY)
  const baseDuration = distance / (baseSpeed / 100)

  const baseVelocityX = (((endX - centerX) / baseDuration) * 1000) / 16
  const baseVelocityY = (((endY - centerY) / baseDuration) * 1000) / 16

  // Generate individual stars in the cluster
  const newClusterStars = []
  for (let i = 0; i < clusterSize; i++) {
    // Position each star within cluster radius
    const angle = Math.random() * 2 * Math.PI
    const radius = Math.random() * CLUSTER_STARS.CLUSTER_RADIUS
    const starX = centerX + Math.cos(angle) * radius
    const starY = centerY + Math.sin(angle) * radius

    // Add speed and direction variation within the cluster
    const speedVariation = 1 + (Math.random() - 0.5) * CLUSTER_STARS.SPEED_VARIATION
    const directionVariation = (Math.random() - 0.5) * CLUSTER_STARS.DIRECTION_VARIATION

    // Apply rotation matrix for direction variation
    const cos = Math.cos(directionVariation)
    const sin = Math.sin(directionVariation)
    const velocityX = (baseVelocityX * cos - baseVelocityY * sin) * speedVariation
    const velocityY = (baseVelocityX * sin + baseVelocityY * cos) * speedVariation

    // Add delay variation for staggered start times within cluster
    const delayVariation = Math.random() * CLUSTER_STARS.DELAY_VARIATION * 1000 // Convert to milliseconds

    const clusterStar = new Star({
      type: 'cluster',
      groupId: clusterId,
      x: starX,
      y: starY,
      z: Math.random() - 0.5,
      size:
        CLUSTER_STARS.MIN_SIZE +
        Math.random() * (CLUSTER_STARS.MAX_SIZE - CLUSTER_STARS.MIN_SIZE),
      velocity3D: {
        x: velocityX,
        y: velocityY,
        z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 2
      },
      baseOpacity: 0.7 + Math.random() * 0.3,
      animationDuration: 3 + Math.random() * 4, // Longer animation duration for longer-lasting effect
      startTime: performance.now() + delayVariation, // Add staggered start time
      metadata: {
        duration: baseDuration * 1000 * speedVariation,
        clusterId: clusterId,
        isClusterStar: true,
        delayVariation: delayVariation
      }
    })

    clusterStar.setColorBasedOnDepth()
    newClusterStars.push(clusterStar)
  }

  return newClusterStars
}

// Update flying stars
function updateFlyingStars() {
  const now = performance.now()

  // Remove expired flying stars and those outside bounds
  flyingStars.value = flyingStars.value.filter((star) => {
    const elapsed = now - star.startTime
    const timeExpired = elapsed >= star.metadata.duration

    // Check if star is 500px outside window borders
    const canvas = starsCanvas.value
    if (canvas) {
      const x = star.x * canvas.width
      const y = star.y * canvas.height
      const outsideBounds =
        x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500

      // Remove if time expired OR outside bounds
      if (timeExpired || outsideBounds) {
        return false
      }
    }

    return !timeExpired
  })

  // Spawn new flying stars based on spawn chance
  if (Math.random() < FLYING_STARS.SPAWN_CHANCE) {
    const newFlyingStar = generateFlyingStar()
    flyingStars.value.push(newFlyingStar)
  }

  // Update positions
  flyingStars.value.forEach((star) => {
    star.update()
  })
}

// Update cluster stars
function updateClusterStars() {
  const now = performance.now()

  // Remove expired cluster stars and those outside bounds
  clusterStars.value = clusterStars.value.filter((star) => {
    const elapsed = now - star.startTime
    const timeExpired = elapsed >= star.metadata.duration

    // Check if star is 500px outside window borders
    const canvas = starsCanvas.value
    if (canvas) {
      const x = star.x * canvas.width
      const y = star.y * canvas.height
      const outsideBounds =
        x < -500 || x > canvas.width + 500 || y < -500 || y > canvas.height + 500

      // Remove if time expired OR outside bounds
      if (timeExpired || outsideBounds) {
        return false
      }
    }

    return !timeExpired
  })

  // Spawn new cluster stars based on spawn chance
  if (Math.random() < CLUSTER_STARS.SPAWN_CHANCE) {
    const newClusterStars = generateClusterStars()
    clusterStars.value.push(...newClusterStars)
  }

  // Update positions
  clusterStars.value.forEach((star) => {
    star.update()
  })
}

// Display/render stars on canvas
function displayStars() {
  const canvas = starsCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Helper function to draw a star
  const drawStar = (star, useRotation = true) => {
    // Get position (rotated for all stars now - static stars rotate with celestial sphere,
    // flying/cluster/storm stars move relative to rotating Earth reference frame)
    const pos = useRotation
      ? star.getRotatedPosition()
      : { x: star.x, y: star.y, z: star.z }

    // Calculate pixel positions
    const x = pos.x * canvas.width
    const y = pos.y * canvas.height

    // Skip stars outside visible area with margin
    const margin =
      star.type === 'lonely' || star.type === 'cluster' || star.type === 'storm'
        ? 500
        : 100
    if (
      x < -margin ||
      x > canvas.width + margin ||
      y < -margin ||
      y > canvas.height + margin
    )
      return

    const size = star.size
    const color = star.color
    const twinkleOpacity = star.getTwinkleOpacity()

    // Edge fading for smooth appearance
    const fadeMargin = 100
    let edgeFade = 1.0
    if (x < fadeMargin) edgeFade *= Math.max(0, x / fadeMargin)
    else if (x > canvas.width - fadeMargin)
      edgeFade *= Math.max(0, (canvas.width - x) / fadeMargin)
    if (y < fadeMargin) edgeFade *= Math.max(0, y / fadeMargin)
    else if (y > canvas.height - fadeMargin)
      edgeFade *= Math.max(0, (canvas.height - y) / fadeMargin)

    const finalOpacity = twinkleOpacity * edgeFade

    // Skip fully transparent stars
    if (finalOpacity <= 0.05) return

    ctx.globalAlpha = finalOpacity

    // Draw glow for moving stars (flying, cluster, and storm stars)
    if (star.type === 'lonely' || star.type === 'cluster' || star.type === 'storm') {
      const glowSize =
        size * (star.type === 'storm' ? 4 : star.type === 'cluster' ? 2.5 : 3)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.5, color.replace('rgb', 'rgba').replace(')', ', 0.3)'))
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, glowSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw main star
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1.0
  }

  // Draw static stars (with rotation) - these rotate with the celestial sphere
  stars.value.forEach((star) => {
    drawStar(star, true)
  })

  // Draw flying stars (with rotation) - these now move relative to rotating Earth frame
  flyingStars.value.forEach((star) => {
    drawStar(star, true)
  })

  // Draw cluster stars (with rotation) - these now move relative to rotating Earth frame
  clusterStars.value.forEach((star) => {
    drawStar(star, true)
  })

  // Draw storm stars (with rotation) - these now move relative to rotating Earth frame
  stormStars.value.forEach((star) => {
    drawStar(star, true)
  })
}

// Canvas setup and event handling
onMounted(() => {
  // Initialize canvas dimensions
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight

  // Initial star generation
  for (let i = 0; i < STARS.MAX_AMOUNT; i++) {
    stars.value.push(generateStaticStar(i))
  }

  // Initial display
  displayStars()

  // Add window resize listener
  window.addEventListener('resize', handleResize)

  // Main update loop
  const update = () => {
    // Update all stars
    stars.value.forEach((star) => {
      star.update()
    })

    // Update storm stars
    updateStormStars()

    // Update flying stars
    updateFlyingStars()

    // Update cluster stars
    updateClusterStars()

    // Maintain star count
    maintainStarCount()

    // Display stars on canvas
    displayStars()

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
})

onUnmounted(() => {
  // Cleanup intervals and event listeners
  intervals.forEach(clearInterval)
  window.removeEventListener('resize', handleResize)
  
  // Clear resize timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})

defineExpose({
  stars, // Expose stars for debugging if needed
  flyingStars,
  clusterStars,
  stormStars,
  // Methods for store integration
  updateSettings: (settings) => {
    // Update star field settings dynamically
    if (settings.density !== undefined) {
      // You can add logic to adjust star density
      console.log('Updating star density to:', settings.density)
    }
    if (settings.speed !== undefined) {
      // You can add logic to adjust animation speed
      console.log('Updating animation speed to:', settings.speed)
    }
    if (settings.colors !== undefined) {
      // You can add logic to update star colors
      console.log('Updating star colors to:', settings.colors)
    }
  },
  reset: () => {
    // Reset the star field
    stars.value = []
    flyingStars.value = []
    clusterStars.value = []
    stormStars.value = []
    
    // Regenerate static stars
    for (let i = 0; i < STARS.MAX_AMOUNT; i++) {
      stars.value.push(generateStaticStar(i))
    }
    
    // Redisplay stars
    displayStars()
  },
  getAllStars: () => {
    return [...stars.value, ...flyingStars.value, ...clusterStars.value, ...stormStars.value]
  }
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
