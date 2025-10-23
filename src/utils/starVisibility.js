/**
 * Utility functions for star visibility and filtering
 * Allows different renderers (canvas, filters, etc.) to determine visibility
 * based on their own size and margin requirements
 */

/**
 * Check if a star should be visible in a given container
 * @param {Object} star - Star object with x, y coordinates (normalized 0-1)
 * @param {Object} container - Container dimensions { width, height }
 * @param {number} margin - Margin in pixels for off-screen rendering (default: 100)
 * @returns {boolean} - Whether the star should be rendered
 */
export function isStarVisible(star, container, margin = 100) {
  if (!star) return false

  const x = star.x * container.width
  const y = star.y * container.height

  return (
    x >= -margin &&
    x <= container.width + margin &&
    y >= -margin &&
    y <= container.height + margin
  )
}

/**
 * Filter stars by visibility
 * @param {Array} stars - Array of star objects
 * @param {Object} container - Container dimensions { width, height }
 * @param {number} margin - Margin in pixels (default: 100)
 * @returns {Array} - Filtered array of visible stars
 */
export function filterVisibleStars(stars, container, margin = 100) {
  if (!Array.isArray(stars)) return []
  return stars.filter((star) => isStarVisible(star, container, margin))
}

/**
 * Get star pixel position from normalized coordinates
 * @param {Object} star - Star object with normalized x, y (0-1)
 * @param {Object} container - Container dimensions { width, height }
 * @returns {Object} - Pixel position { x, y }
 */
export function getStarPixelPosition(star, container) {
  if (!star || !container) return { x: 0, y: 0 }

  return {
    x: star.x * container.width,
    y: star.y * container.height
  }
}

/**
 * Get all visible stars from multiple collections
 * @param {Object} starCollections - Object with star arrays { stars, flyingStars, clusterStars, stormStars }
 * @param {Object} container - Container dimensions
 * @param {number} margin - Margin in pixels
 * @returns {Array} - All visible stars combined
 */
export function getAllVisibleStars(starCollections, container, margin = 100) {
  const visible = []

  if (starCollections.stars) {
    visible.push(...filterVisibleStars(starCollections.stars, container, margin))
  }
  if (starCollections.flyingStars) {
    visible.push(...filterVisibleStars(starCollections.flyingStars, container, margin))
  }
  if (starCollections.clusterStars) {
    visible.push(...filterVisibleStars(starCollections.clusterStars, container, margin))
  }
  if (starCollections.stormStars) {
    visible.push(...filterVisibleStars(starCollections.stormStars, container, margin))
  }

  return visible
}
