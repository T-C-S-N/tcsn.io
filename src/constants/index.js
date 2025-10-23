// Constants
export const EARTH = Object.freeze({
   ROTATION_PERIOD: 300, // seconds for a full rotation (made faster for testing)
   ROTATE_AXIS_X: 5, // Axis tilt for rotation
   ROTATE_AXIS_Y: 0, // Axis tilt for rotation
   ROTATE_CENTER_X: -0.1, // Center of rotation (0-1 range)
   ROTATE_CENTER_Y: 0.5, // Center of rotation (0-1 range) - moved to center
   VIEW_MARGIN_X: 1, // Margin for padding around the viewport for star creation
   VIEW_MARGIN_Y: 1, // Margin for padding around the viewport for star creation
   ZOOM: .1 // Zoom factor for extended coverage area
});

export const STARS = Object.freeze({
   MAX_AMOUNT: Math.max(400, Math.min(100, Math.floor(60 * EARTH.ZOOM))), // Cap at 400 stars max for performance
   MIN_SIZE: 0.5, // Minimum star size
   MAX_SIZE: 1.5 // Maximum star size
});

export const FLYING_STARS = Object.freeze({
   MIN_SIZE: 0.5,
   MAX_SIZE: 1,
   MIN_VELOCITY: 0.005, // Reduced for longer duration
   MAX_VELOCITY: 2, // Reduced for longer duration
   Z_VELOCITY: 7,
   SPAWN_CHANCE: 0.5 // Reduced spawn chance for better performance
});

export const CLUSTER_STARS = Object.freeze({
   MIN_SIZE: 0.5,
   MAX_SIZE: 1,
   MIN_VELOCITY: 0.005, // Reduced for longer duration
   MAX_VELOCITY: 2, // Reduced for longer duration
   CLUSTER_RADIUS: 0.1, // Radius for cluster stars
   SPEED_VARIATION: 0.2, // Max speed difference within a cluster
   DIRECTION_VARIATION: 0.1, // Direction variation within cluster
   DELAY_VARIATION: 0.3, // Max delay variation within cluster
   SPAWN_CHANCE: 0.2, // Reduced spawn chance for better performance
});

export const STORM_STARS = Object.freeze({
   MIN_SIZE: 0.5,
   MAX_SIZE: 1,
   MIN_VELOCITY: 0.005, // Reduced for longer duration
   MAX_VELOCITY: 2, // Reduced for longer duration
   CLUSTER_RADIUS: 0.1, // Radius for cluster stars
   STORM_RADIUS: 0.1, // Radius for storm stars
   SPAWN_CHANCE: 0.2, // Reduced spawn chance for better performance
});

export const CONSTELLATIONS = Object.freeze({
   // Alphanumeric characters for code generation
   CHARSET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
   CODE_LENGTH: 8, // Length of generated codes (e.g., "AB2X5FQ9")
   OBJECT_TYPES: [
      'CMT', // Comet
      'AST', // Asteroid
      'MET', // Meteor
      'MTD', // Meteoroid
      'PLN', // Planetoid
      'FRG', // Fragment
      'DBR', // Debris
      'PRT', // Particle
      'DUS', // Dust
      'GAS', // Gas
      'PLS', // Plasma
      'STL', // Stellar
      'CSM', // Cosmic
      'CEL', // Celestial
      'BOD', // Body
      'RMN'  // Remnant
   ]
});