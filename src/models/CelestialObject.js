import { EARTH, CONSTELLATIONS } from '@/constants/index.js'

export class CelestialObject {
  constructor (data) {
    // type: 'static', 'lonely', 'cluster', 'storm'
    this.type = data?.type ?? 'static'; // 'static', 'lonely', 'cluster', 'storm'
    this.groupId = data?.groupId ?? null; // For grouping stars in clusters or storms

    // 2D plane coordinates (percentage)
    this.x = data?.x ?? 0;
    this.y = data?.y ?? 0;
    this.z = data?.z ?? 0; // For depth effect and color variation
    this.color = data?.color ?? '#FFFFFF'; // Default color

    // Store original coordinates for static stars to prevent drift
    if (this.type === 'static') {
      this.originalX = this.x;
      this.originalY = this.y;
      this.originalZ = this.z;
    }

    // Star properties
    this.size = data?.size ?? 1;
    this.type = data?.type ?? 'static'; // 'static', 'lonely', 'cluster', 'storm'
    this.isVisible = data?.isVisible ?? true;

    // 3D velocity for Doppler effect and movement
    // 0: negative, 5: static, 10: positive
    this.velocity3D = data?.velocity3D ?? { x: 0, y: 0, z: 0 };

    // Additional properties for animation
    this.startTime = data?.startTime ?? performance.now(); // Track when star was created
    this.animationDuration = data?.animationDuration ?? 3; // seconds for a full animation cycle
    this.baseOpacity = data?.baseOpacity ?? 1; // Base opacity for twinkling
    this.twinkleDelay = data?.twinkleDelay ?? 0; // Delay before twinkle starts
    this.metadata = data?.metadata ?? {};

    // Generate unique celestial code and object type for this star
    // e.g., "CMT-A7FX3Q2N" (Comet with alphanumeric code)
    this.objectType = data?.objectType ?? this.generateObjectType();
    this.celestialCode = data?.celestialCode ?? this.generateCelestialCode();
  }

  generateCelestialCode () {
    // Generate a random alphanumeric code of specified length
    const charset = CONSTELLATIONS.CHARSET;
    let code = '';
    for (let i = 0; i < CONSTELLATIONS.CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  }

  generateObjectType () {
    // Select a random celestial object type (comet, asteroid, meteor, etc.)
    const objectTypes = CONSTELLATIONS.OBJECT_TYPES;
    const randomIndex = Math.floor(Math.random() * objectTypes.length);
    return objectTypes[randomIndex];
  }

  getCelestialIdentifier () {
    // Return formatted identifier: "TYPE-CODE" (e.g., "CMT-A7FX3Q2N")
    return `${this.objectType}-${this.celestialCode}`;
  }

  setColorBasedOnDepth () {
    // Normalize z velocity from 0-10 range to -1 to 1 range for Doppler effect
    const normalizedZ = (this.velocity3D.z - 5) / 5; // 0-10 becomes -1 to 1

    // Base star color (warm white)
    let r = 255,
      g = 182,
      b = 121; // #FFB679

    // The more positive the z velocity, the brighter the star, the more its red
    // The more negative the z velocity, the dimmer the star, the more its blue
    if (normalizedZ > 0) {
      // Moving towards observer - red shift and brighter
      const redShift = normalizedZ;
      r = Math.min(255, 255); // Keep red high
      g = Math.max(100, 182 - redShift * 82); // Reduce green
      b = Math.max(60, 121 - redShift * 61); // Reduce blue

      // Increase brightness
      const brightnessFactor = 1 + redShift * 0.5; // Up to 1.5x brighter
      r = Math.min(255, r * brightnessFactor);
      g = Math.min(255, g * brightnessFactor);
      b = Math.min(255, b * brightnessFactor);
    } else if (normalizedZ < 0) {
      // Moving away from observer - blue shift and dimmer
      const blueShift = Math.abs(normalizedZ);
      r = Math.max(80, 255 - blueShift * 175); // Reduce red significantly
      g = Math.max(120, 182 - blueShift * 62); // Reduce green
      b = Math.min(255, 121 + blueShift * 134); // Increase blue

      // Decrease brightness
      const brightnessFactor = 1 - blueShift * 0.4; // Down to 0.6x dimmer
      r = Math.max(0, r * brightnessFactor);
      g = Math.max(0, g * brightnessFactor);
      b = Math.max(0, b * brightnessFactor);
    }

    this.color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }

  getTwinkleOpacity () {
    // Calculate current time since star creation
    const now = performance.now();
    const elapsed = (now - this.startTime) / 1000; // Convert to seconds

    // Apply twinkle delay
    if (elapsed < this.twinkleDelay) {
      return this.baseOpacity;
    }

    // Create a smooth twinkling effect using sine waves
    const twinkleTime = elapsed - this.twinkleDelay;
    const twinklePhase = (twinkleTime * 2 * Math.PI) / this.animationDuration;

    // Create multiple sine waves for more complex twinkling
    const primaryTwinkle = Math.sin(twinklePhase) * 0.3;
    const secondaryTwinkle = Math.sin(twinklePhase * 1.7 + Math.PI / 3) * 0.2;
    const tertiaryTwinkle = Math.sin(twinklePhase * 0.5 + Math.PI / 6) * 0.1;

    // Combine waves and ensure opacity stays within reasonable bounds
    const twinkleEffect = primaryTwinkle + secondaryTwinkle + tertiaryTwinkle;
    const finalOpacity = this.baseOpacity + twinkleEffect;

    // Clamp between 0.1 and 1.0 to keep stars visible
    return Math.max(0.1, Math.min(1.0, finalOpacity));
  }

  checkVisibility () {
    //// For static stars, always check visibility based on their rotated position
    //if (this.type === 'static') {
    //  const rotatedPos = this.getRotatedPosition()
    //  this.isVisible = rotatedPos.x >= -0.1 && rotatedPos.x <= 1.1 && rotatedPos.y >= -0.1 && rotatedPos.y <= 1.1
    //} else {
    //  // For flying stars, check their direct position with small buffer
    //  this.isVisible = this.x >= -0.1 && this.x <= 1.1 && this.y >= -0.1 && this.y <= 1.1
    //}
  }

  update () {
    // For static stars, they maintain their original coordinates but rotation 
    // is applied during rendering via getRotatedPosition()
    if (this.type === 'static') {
      // Keep original coordinates - rotation is handled in getRotatedPosition()
      // No need to reset as static stars don't move on their own
      this.x = this.originalX;
      this.y = this.originalY;
      this.z = this.originalZ;
    } else {
      // Check if star should start moving yet (for delayed cluster stars)
      const now = performance.now();
      if (now >= this.startTime) {
        // For flying/cluster/storm stars: apply ONLY linear movement to base coordinates
        // Earth rotation is applied in getRotatedPosition() just like static stars
        // This separates concerns: stored coords = base position, rotation = viewport effect
        
        // Apply linear movement
        const linearX = this.velocity3D.x / 1000;
        const linearY = this.velocity3D.y / 1000;

        // Update base coordinates with only linear movement
        this.x += linearX;
        this.y += linearY;
        this.z += this.velocity3D.z / 1000;
      }
      // Stars with future start times remain at their initial position

      // No wrap around for flying stars - let them fly off screen and get cleaned up
      // They will be removed by the 500px boundary check in updateFlyingStars()
    }

    // Update visibility for all stars
    this.checkVisibility();
    // Update color based on depth for all stars
    this.setColorBasedOnDepth();
  }

  getRotatedPosition () {
    // Calculate rotation based on Earth's rotation period
    const now = performance.now();
    const rotationProgress = now / 1000 / EARTH.ROTATION_PERIOD; // Progress through rotation cycle
    const rotationAngle = rotationProgress * 2 * Math.PI; // Convert to radians

    // Define the rotation center (normalize large axis values to stay on screen)
    const normalizedAxisX = (EARTH.ROTATE_AXIS_X % 2) * 0.1; // Keep within -0.2 to 0.2 range
    const normalizedAxisY = (EARTH.ROTATE_AXIS_Y % 2) * 0.1; // Keep within -0.2 to 0.2 range

    const centerX = EARTH.ROTATE_CENTER_X + normalizedAxisX; // User-defined center with offset
    const centerY = EARTH.ROTATE_CENTER_Y + normalizedAxisY; // User-defined center with offset

    // Calculate distance and angle from the rotation center
    const deltaX = this.x - centerX;
    const deltaY = this.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const currentAngle = Math.atan2(deltaY, deltaX);

    // Apply rotation around the center
    const newAngle = currentAngle + rotationAngle;
    const rotatedX = centerX + Math.cos(newAngle) * distance;
    const rotatedY = centerY + Math.sin(newAngle) * distance;

    // Keep the z coordinate for depth effects
    return {
      x: rotatedX,
      y: rotatedY,
      z: this.z
    };
  }
}
