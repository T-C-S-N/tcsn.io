import { defineStore } from 'pinia'
import { ref } from 'vue'
import { EARTH, STARS, FLYING_STARS, CLUSTER_STARS, STORM_STARS } from '@/constants/index.js'
import { CelestialObject } from '@/models/CelestialObject.js'

export const useStarFieldStore = defineStore('starField', () => {
  // State
  const starFieldRef = ref(null)
  const stars = ref([])
  const flyingStars = ref([])
  const clusterStars = ref([])
  const stormStars = ref([])
  const isInitialized = ref(false)
  
  // Animation settings
  const animationSettings = ref({
    speed: 1,
    density: 100,
    colors: ['#ffffff', '#f0f0f0', '#e0e0e0'],
    size: { min: 1, max: 3 }
  })

  // ===== Generation Functions =====
  
  function getExtendedBounds() {
    const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1
    const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1
    const centerX = EARTH.ROTATE_CENTER_X + normalizedAxisX
    const centerY = EARTH.ROTATE_CENTER_Y + normalizedAxisY

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

  function generateStaticStar(id) {
    let x, y

    if (id === 0) {
      const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1
      const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1
      x = EARTH.ROTATE_CENTER_X + normalizedAxisX
      y = EARTH.ROTATE_CENTER_Y + normalizedAxisY
    } else {
      const bounds = getExtendedBounds()
      const baseGridSize = Math.max(3, Math.ceil(Math.sqrt(STARS.MAX_AMOUNT / 4)))
      const gridSize = Math.max(baseGridSize, Math.ceil(baseGridSize * Math.sqrt(EARTH.ZOOM)))
      const totalWidth = bounds.maxX - bounds.minX
      const totalHeight = bounds.maxY - bounds.minY
      const cellWidth = totalWidth / gridSize
      const cellHeight = totalHeight / gridSize

      const starIndex = id - 1
      const gridX = starIndex % gridSize
      const gridY = Math.floor(starIndex / gridSize)

      const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.8
      const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.8

      const baseCellX = bounds.minX + gridX * cellWidth + cellWidth / 2
      const baseCellY = bounds.minY + gridY * cellHeight + cellHeight / 2

      x = baseCellX + randomOffsetX
      y = baseCellY + randomOffsetY
    }

    const star = new CelestialObject({
      type: 'static',
      groupId: null,
      x: x,
      y: y,
      z: (Math.random() - 0.5) * 0.2,
      size: id === 0 ? 1.5 : Math.random() * (STARS.MAX_SIZE - STARS.MIN_SIZE) + STARS.MIN_SIZE,
      velocity3D: {
        x: 0,
        y: 0,
        z: Math.random() * 10
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

  function generateFlyingStar() {
    // Use larger buffer to ensure stars start/end completely outside viewport
    const BUFFER = 0.3 // 30% buffer outside viewport
    const startEdge = Math.floor(Math.random() * 4)
    const endEdge = Math.floor(Math.random() * 4)

    let startX, startY, endX, endY

    // Start position - completely outside viewport
    switch (startEdge) {
      case 0: // Top edge
        startX = Math.random() * (1 + 2 * BUFFER) - BUFFER
        startY = -BUFFER - Math.random() * BUFFER
        break
      case 1: // Right edge
        startX = 1 + BUFFER + Math.random() * BUFFER
        startY = Math.random() * (1 + 2 * BUFFER) - BUFFER
        break
      case 2: // Bottom edge
        startX = Math.random() * (1 + 2 * BUFFER) - BUFFER
        startY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 3: // Left edge
        startX = -BUFFER - Math.random() * BUFFER
        startY = Math.random() * (1 + 2 * BUFFER) - BUFFER
        break
    }

    // End position - completely outside viewport (different edge or same edge)
    switch (endEdge) {
      case 0: // Top edge
        endX = Math.random() * (1 + 2 * BUFFER) - BUFFER
        endY = -BUFFER - Math.random() * BUFFER
        break
      case 1: // Right edge
        endX = 1 + BUFFER + Math.random() * BUFFER
        endY = Math.random() * (1 + 2 * BUFFER) - BUFFER
        break
      case 2: // Bottom edge
        endX = Math.random() * (1 + 2 * BUFFER) - BUFFER
        endY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 3: // Left edge
        endX = -BUFFER - Math.random() * BUFFER
        endY = Math.random() * (1 + 2 * BUFFER) - BUFFER
        break
    }

    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
    const speed = FLYING_STARS.MIN_VELOCITY + Math.random() * (FLYING_STARS.MAX_VELOCITY - FLYING_STARS.MIN_VELOCITY)
    const duration = distance / (speed / 100)

    const flyingStar = new CelestialObject({
      type: 'lonely',
      x: startX,
      y: startY,
      z: Math.random() - 0.5,
      size: FLYING_STARS.MIN_SIZE + Math.random() * (FLYING_STARS.MAX_SIZE - FLYING_STARS.MIN_SIZE),
      velocity3D: {
        x: (((endX - startX) / duration) * 1000) / 16,
        y: (((endY - startY) / duration) * 1000) / 16,
        z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 2
      },
      baseOpacity: 0.8 + Math.random() * 0.2,
      animationDuration: 3 + Math.random() * 4,
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

  function generateClusterStars() {
    const BUFFER = 0.3 // 30% buffer outside viewport
    const clusterId = Date.now() + Math.random()
    const clusterSize = 3 + Math.floor(Math.random() * 5)

    const startEdge = Math.floor(Math.random() * 4)
    let centerX, centerY, endX, endY

    // Start position - completely outside viewport
    switch (startEdge) {
      case 0: // Top edge
        centerX = 0.2 + Math.random() * 0.6
        centerY = -BUFFER - Math.random() * BUFFER
        break
      case 1: // Right edge
        centerX = 1 + BUFFER + Math.random() * BUFFER
        centerY = 0.2 + Math.random() * 0.6
        break
      case 2: // Bottom edge
        centerX = 0.2 + Math.random() * 0.6
        centerY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 3: // Left edge
        centerX = -BUFFER - Math.random() * BUFFER
        centerY = 0.2 + Math.random() * 0.6
        break
    }

    // End position - completely outside viewport
    switch (startEdge) {
      case 0: // From top to bottom
        endX = centerX + (Math.random() - 0.5) * 0.4
        endY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 1: // From right to left
        endX = -BUFFER - Math.random() * BUFFER
        endY = centerY + (Math.random() - 0.5) * 0.4
        break
      case 2: // From bottom to top
        endX = centerX + (Math.random() - 0.5) * 0.4
        endY = -BUFFER - Math.random() * BUFFER
        break
      case 3: // From left to right
        endX = 1 + BUFFER + Math.random() * BUFFER
        endY = centerY + (Math.random() - 0.5) * 0.4
        break
    }

    const distance = Math.sqrt((endX - centerX) ** 2 + (endY - centerY) ** 2)
    const baseSpeed = CLUSTER_STARS.MIN_VELOCITY + Math.random() * (CLUSTER_STARS.MAX_VELOCITY - CLUSTER_STARS.MIN_VELOCITY)
    const baseDuration = distance / (baseSpeed / 100)

    const baseVelocityX = (((endX - centerX) / baseDuration) * 1000) / 16
    const baseVelocityY = (((endY - centerY) / baseDuration) * 1000) / 16

    const newClusterStars = []
    for (let i = 0; i < clusterSize; i++) {
      const angle = Math.random() * 2 * Math.PI
      const radius = Math.random() * CLUSTER_STARS.CLUSTER_RADIUS
      const starX = centerX + Math.cos(angle) * radius
      const starY = centerY + Math.sin(angle) * radius

      const speedVariation = 1 + (Math.random() - 0.5) * CLUSTER_STARS.SPEED_VARIATION
      const directionVariation = (Math.random() - 0.5) * CLUSTER_STARS.DIRECTION_VARIATION

      const cos = Math.cos(directionVariation)
      const sin = Math.sin(directionVariation)
      const velocityX = (baseVelocityX * cos - baseVelocityY * sin) * speedVariation
      const velocityY = (baseVelocityX * sin + baseVelocityY * cos) * speedVariation

      const delayVariation = Math.random() * CLUSTER_STARS.DELAY_VARIATION * 1000

      const clusterStar = new CelestialObject({
        type: 'cluster',
        groupId: clusterId,
        x: starX,
        y: starY,
        z: Math.random() - 0.5,
        size: CLUSTER_STARS.MIN_SIZE + Math.random() * (CLUSTER_STARS.MAX_SIZE - CLUSTER_STARS.MIN_SIZE),
        velocity3D: {
          x: velocityX,
          y: velocityY,
          z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 2
        },
        baseOpacity: 0.7 + Math.random() * 0.3,
        animationDuration: 3 + Math.random() * 4,
        startTime: performance.now() + delayVariation,
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

  function generateStormStars() {
    const BUFFER = 0.3 // 30% buffer outside viewport
    const stormId = Date.now() + Math.random()
    const numClusters = 2 + Math.floor(Math.random() * 4)

    const startEdge = Math.floor(Math.random() * 4)
    let stormCenterX, stormCenterY, stormEndX, stormEndY

    // Start position - completely outside viewport
    switch (startEdge) {
      case 0: // Top edge
        stormCenterX = 0.1 + Math.random() * 0.8
        stormCenterY = -BUFFER - Math.random() * BUFFER
        break
      case 1: // Right edge
        stormCenterX = 1 + BUFFER + Math.random() * BUFFER
        stormCenterY = 0.1 + Math.random() * 0.8
        break
      case 2: // Bottom edge
        stormCenterX = 0.1 + Math.random() * 0.8
        stormCenterY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 3: // Left edge
        stormCenterX = -BUFFER - Math.random() * BUFFER
        stormCenterY = 0.1 + Math.random() * 0.8
        break
    }

    // End position - completely outside viewport
    switch (startEdge) {
      case 0: // From top to bottom
        stormEndX = stormCenterX + (Math.random() - 0.5) * 0.6
        stormEndY = 1 + BUFFER + Math.random() * BUFFER
        break
      case 1: // From right to left
        stormEndX = -BUFFER - Math.random() * BUFFER
        stormEndY = stormCenterY + (Math.random() - 0.5) * 0.6
        break
      case 2: // From bottom to top
        stormEndX = stormCenterX + (Math.random() - 0.5) * 0.6
        stormEndY = -BUFFER - Math.random() * BUFFER
        break
      case 3: // From left to right
        stormEndX = 1 + BUFFER + Math.random() * BUFFER
        stormEndY = stormCenterY + (Math.random() - 0.5) * 0.6
        break
    }

    const stormDistance = Math.sqrt((stormEndX - stormCenterX) ** 2 + (stormEndY - stormCenterY) ** 2)
    const stormSpeed = STORM_STARS.MIN_VELOCITY + Math.random() * (STORM_STARS.MAX_VELOCITY - STORM_STARS.MIN_VELOCITY)
    const stormDuration = stormDistance / (stormSpeed / 100)

    const stormBaseVelocityX = (((stormEndX - stormCenterX) / stormDuration) * 1000) / 16
    const stormBaseVelocityY = (((stormEndY - stormCenterY) / stormDuration) * 1000) / 16

    const newStormStars = []

    for (let clusterIndex = 0; clusterIndex < numClusters; clusterIndex++) {
      const clusterAngle = Math.random() * 2 * Math.PI
      const clusterRadius = Math.random() * STORM_STARS.STORM_RADIUS
      const clusterCenterX = stormCenterX + Math.cos(clusterAngle) * clusterRadius
      const clusterCenterY = stormCenterY + Math.sin(clusterAngle) * clusterRadius

      const clusterSize = 3 + Math.floor(Math.random() * 4)
      const clusterSpeedVariation = 1 + (Math.random() - 0.5) * 0.3
      const clusterDirectionVariation = (Math.random() - 0.5) * (Math.PI / 6)

      const cos = Math.cos(clusterDirectionVariation)
      const sin = Math.sin(clusterDirectionVariation)
      const clusterVelocityX = (stormBaseVelocityX * cos - stormBaseVelocityY * sin) * clusterSpeedVariation
      const clusterVelocityY = (stormBaseVelocityX * sin + stormBaseVelocityY * cos) * clusterSpeedVariation

      for (let starIndex = 0; starIndex < clusterSize; starIndex++) {
        const starAngle = Math.random() * 2 * Math.PI
        const starRadius = Math.random() * STORM_STARS.CLUSTER_RADIUS
        const starX = clusterCenterX + Math.cos(starAngle) * starRadius
        const starY = clusterCenterY + Math.sin(starAngle) * starRadius

        const starSpeedVariation = 1 + (Math.random() - 0.5) * 0.2
        const starDirectionVariation = (Math.random() - 0.5) * (Math.PI / 12)

        const starCos = Math.cos(starDirectionVariation)
        const starSin = Math.sin(starDirectionVariation)
        const finalVelocityX = (clusterVelocityX * starCos - clusterVelocityY * starSin) * starSpeedVariation
        const finalVelocityY = (clusterVelocityX * starSin + clusterVelocityY * starCos) * starSpeedVariation

        const delayVariation = Math.random() * 1000

        const stormStar = new CelestialObject({
          type: 'storm',
          groupId: stormId,
          x: starX,
          y: starY,
          z: Math.random() - 0.5,
          size: STORM_STARS.MIN_SIZE + Math.random() * (STORM_STARS.MAX_SIZE - STORM_STARS.MIN_SIZE),
          velocity3D: {
            x: finalVelocityX,
            y: finalVelocityY,
            z: FLYING_STARS.Z_VELOCITY + (Math.random() - 0.5) * 3
          },
          baseOpacity: 0.6 + Math.random() * 0.4,
          animationDuration: 4 + Math.random() * 6,
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

  // ===== Store Actions =====

  function initializeStarField() {
    if (stars.value.length === 0) {
      for (let i = 0; i < STARS.MAX_AMOUNT; i++) {
        stars.value.push(generateStaticStar(i))
      }
    }
  }

  function setStarFieldRef(ref) {
    starFieldRef.value = ref
    isInitialized.value = true
  }

  function updateStars(newStars) {
    stars.value = newStars
  }

  function updateFlyingStars(newFlyingStars) {
    flyingStars.value = newFlyingStars
  }

  function updateClusterStars(newClusterStars) {
    clusterStars.value = newClusterStars
  }

  function updateStormStars(newStormStars) {
    stormStars.value = newStormStars
  }

  function updateAllStars(starArrays) {
    if (starArrays.stars) stars.value = starArrays.stars
    if (starArrays.flyingStars) flyingStars.value = starArrays.flyingStars
    if (starArrays.clusterStars) clusterStars.value = starArrays.clusterStars
    if (starArrays.stormStars) stormStars.value = starArrays.stormStars
  }

  function addFlyingStar() {
    const newFlyingStar = generateFlyingStar()
    flyingStars.value.push(newFlyingStar)
  }

  function addClusterStars() {
    const newClusterStars = generateClusterStars()
    clusterStars.value.push(...newClusterStars)
  }

  function addStormStars() {
    const newStormStars = generateStormStars()
    stormStars.value.push(...newStormStars)
  }

  function updateAnimationSettings(settings) {
    animationSettings.value = { ...animationSettings.value, ...settings }
  }

  function getStarCount() {
    return stars.value.length
  }

  function getFlyingStarCount() {
    return flyingStars.value.length
  }

  function getClusterStarCount() {
    return clusterStars.value.length
  }

  function getStormStarCount() {
    return stormStars.value.length
  }

  function getTotalStarCount() {
    return stars.value.length + flyingStars.value.length + clusterStars.value.length + stormStars.value.length
  }

  function resetStarField() {
    stars.value = []
    flyingStars.value = []
    clusterStars.value = []
    stormStars.value = []
    initializeStarField()
  }

  // Getters
  const isStarFieldReady = () => isInitialized.value

  return {
    // State
    starFieldRef,
    stars,
    flyingStars,
    clusterStars,
    stormStars,
    isInitialized,
    animationSettings,
    
    // Generation functions
    generateStaticStar,
    generateFlyingStar,
    generateClusterStars,
    generateStormStars,
    initializeStarField,
    
    // Store actions
    setStarFieldRef,
    updateStars,
    updateFlyingStars,
    updateClusterStars,
    updateStormStars,
    updateAllStars,
    addFlyingStar,
    addClusterStars,
    addStormStars,
    updateAnimationSettings,
    
    // Getters
    getStarCount,
    getFlyingStarCount,
    getClusterStarCount,
    getStormStarCount,
    getTotalStarCount,
    isStarFieldReady,
    resetStarField
  }
})
