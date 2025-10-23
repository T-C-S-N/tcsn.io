/**
 * EXAMPLE: How to apply star coordinates in a custom renderer
 * This demonstrates the complete workflow
 */

import { computed } from 'vue'

// ===== EXAMPLE 1: Simple DOM Renderer =====
export function renderStarsToDom(stars, container, margin = 100) {
  const width = container.clientWidth
  const height = container.clientHeight

  // Step 1: Filter visible stars
  const visibleStars = stars.filter((star) => {
    if (!star) return false
    const x = star.x * width
    const y = star.y * height
    return (
      x >= -margin &&
      x <= width + margin &&
      y >= -margin &&
      y <= height + margin
    )
  })

  // Step 2: Create/update DOM elements for each visible star
  visibleStars.forEach((star, index) => {
    // Convert normalized coordinates to pixels
    const x = star.x * width
    const y = star.y * height

    // Get or create element
    let element = container.querySelector(`[data-star-id="${star.id || index}"]`)
    if (!element) {
      element = document.createElement('div')
      element.dataset.starId = star.id || index
      element.className = `star-${star.type}`
      container.appendChild(element)
    }

    // Apply position
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    element.style.transform = 'translate(-50%, -50%)'
    element.style.width = `${star.size}px`
    element.style.height = `${star.size}px`

    // Apply appearance
    element.style.backgroundColor = star.color
    element.style.opacity = star.opacity
  })
}

// ===== EXAMPLE 2: Canvas Renderer =====
export function renderStarsToCanvas(ctx, stars, canvas, margin = 100) {
  const width = canvas.width
  const height = canvas.height

  // Step 1: Filter visible stars
  const visibleStars = stars.filter((star) => {
    if (!star) return false
    const x = star.x * width
    const y = star.y * height
    return (
      x >= -margin &&
      x <= width + margin &&
      y >= -margin &&
      y <= height + margin
    )
  })

  // Step 2: Draw each star
  visibleStars.forEach((star) => {
    const x = star.x * width
    const y = star.y * height

    // Draw based on type
    ctx.fillStyle = star.color
    ctx.globalAlpha = star.opacity

    switch (star.type) {
      case 'static':
        // Draw as circle
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
        break

      case 'lonely':
        // Draw as star
        drawStar(ctx, x, y, star.size)
        break

      case 'cluster':
        // Draw as glowing circle
        ctx.beginPath()
        ctx.arc(x, y, star.size * 1.5, 0, Math.PI * 2)
        ctx.fill()
        break

      default:
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
    }
  })

  ctx.globalAlpha = 1
}

// ===== EXAMPLE 3: Vue Component (Reactive) =====
export const useStarRendering = (starsRef, containerRef, margin = 100) => {
  const visibleStars = computed(() => {
    if (!containerRef.value || !Array.isArray(starsRef.value)) {
      return []
    }

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    return starsRef.value.filter((star) => {
      if (!star) return false
      const x = star.x * width
      const y = star.y * height
      return (
        x >= -margin &&
        x <= width + margin &&
        y >= -margin &&
        y <= height + margin
      )
    })
  })

  const getStarPosition = (star) => {
    if (!containerRef.value || !star) {
      return { x: 0, y: 0 }
    }

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    return {
      x: star.x * width,
      y: star.y * height
    }
  }

  const getStarStyle = (star) => {
    const pos = getStarPosition(star)
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      transform: 'translate(-50%, -50%)',
      width: `${star.size}px`,
      height: `${star.size}px`,
      backgroundColor: star.color,
      opacity: star.opacity
    }
  }

  return {
    visibleStars,
    getStarPosition,
    getStarStyle
  }
}

// ===== EXAMPLE 4: With Rotation =====
export function applyRotation(star, rotationAngle, centerX = 0.5, centerY = 0.5) {
  // Translate to center
  const dx = star.x - centerX
  const dy = star.y - centerY

  // Rotate
  const cos = Math.cos(rotationAngle)
  const sin = Math.sin(rotationAngle)

  const newX = cos * dx - sin * dy + centerX
  const newY = sin * dx + cos * dy + centerY

  return {
    ...star,
    x: newX,
    y: newY
  }
}

// ===== EXAMPLE 5: Star Cleanup =====
export function cleanupOffscreenStars(stars, container, removeMargin = 500) {
  if (!container) return stars

  const width = container.clientWidth
  const height = container.clientHeight

  // Keep only stars within remove margin
  return stars.filter((star) => {
    if (!star) return false
    const x = star.x * width
    const y = star.y * height

    return (
      x >= -removeMargin &&
      x <= width + removeMargin &&
      y >= -removeMargin &&
      y <= height + removeMargin
    )
  })
}

// ===== EXAMPLE 6: Update Moving Stars =====
export function updateMovingStars(stars, deltaTime) {
  return stars.map((star) => {
    if (!star.velocity3D) return star

    return {
      ...star,
      x: star.x + (star.velocity3D.x * deltaTime) / 1000,
      y: star.y + (star.velocity3D.y * deltaTime) / 1000,
      z: star.z + (star.velocity3D.z * deltaTime) / 1000
    }
  })
}

// ===== EXAMPLE 7: Helper - Draw Star Shape =====
function drawStar(ctx, cx, cy, size) {
  const spikes = 5
  const outerRadius = size
  const innerRadius = size / 2

  let rot = (Math.PI / 2) * 3
  let step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius)
    rot += step

    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.fill()
}
