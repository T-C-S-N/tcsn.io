
export default class FieldItem {
  constructor (data) {
    this.x = data?.x ?? 0;
    this.y = data?.y ?? 0;
    this.z = data?.z ?? 0; // For depth effect and color variation
    this.vx = data?.vx ?? 0;
    this.vy = data?.vy ?? 0;
    this.vz = data?.vz ?? 0;
    this.status = data?.status ?? 'created'; // created, outside, entering, inside, exiting, destroyed
    this.maxOutsideDistance = data?.maxOutsideDistance ?? 200;
    this.minVelocity = data?.minVelocity ?? 0.0005;
    this.maxVelocity = data?.maxVelocity ?? 0.002;
    this.radius = data?.radius ?? 8; // collision radius (half of typical 16px diameter)
    this.weight = data?.weight ?? 1; // mass or weight for collision calculations
    this.isGravityAffected = data?.isGravityAffected ?? false;
    this.isCollidable = data?.isCollidable ?? false;
  }

  // generate field item based on the current window size
  static generateRandom (width, height, depth, maxOutsideDistance = 200, minVelocity = 0.0005, maxVelocity = 0.002) {
    // randomly choose which edge to spawn from (left, right, top, bottom, front, back)
    const edge = Math.floor(Math.random() * 6);
    let x, y, z, vx, vy, vz;

    const margin = maxOutsideDistance;
    const speed = minVelocity + Math.random() * (maxVelocity - minVelocity);

    if (edge === 0) {
      // left edge: x must be negative (outside left boundary)
      x = -(margin + Math.random() * 50); // ensure negative
      y = Math.random() * height;
      z = Math.random() * depth;
      vx = speed;
      vy = (Math.random() - 0.5) * speed * 0.3;
      vz = (Math.random() - 0.5) * speed * 0.3;
    } else if (edge === 1) {
      // right edge: x must be > width + margin
      x = width + margin + Math.random() * 50;
      y = Math.random() * height;
      z = Math.random() * depth;
      vx = -speed;
      vy = (Math.random() - 0.5) * speed * 0.3;
      vz = (Math.random() - 0.5) * speed * 0.3;
    } else if (edge === 2) {
      // top edge: y must be negative (outside top boundary)
      x = Math.random() * width;
      y = -(margin + Math.random() * 50); // ensure negative
      z = Math.random() * depth;
      vx = (Math.random() - 0.5) * speed * 0.3;
      vy = speed;
      vz = (Math.random() - 0.5) * speed * 0.3;
    } else if (edge === 3) {
      // bottom edge: y must be > height + margin
      x = Math.random() * width;
      y = height + margin + Math.random() * 50;
      z = Math.random() * depth;
      vx = (Math.random() - 0.5) * speed * 0.3;
      vy = -speed;
      vz = (Math.random() - 0.5) * speed * 0.3;
    } else if (edge === 4) {
      // front edge: z must be negative (outside front boundary)
      x = Math.random() * width;
      y = Math.random() * height;
      z = -(margin + Math.random() * 50); // ensure negative
      vx = (Math.random() - 0.5) * speed * 0.3;
      vy = (Math.random() - 0.5) * speed * 0.3;
      vz = speed;
    } else {
      // back edge: z must be > depth + margin
      x = Math.random() * width;
      y = Math.random() * height;
      z = depth + margin + Math.random() * 50;
      vx = (Math.random() - 0.5) * speed * 0.3;
      vy = (Math.random() - 0.5) * speed * 0.3;
      vz = -speed;
    }

    return new FieldItem({
      x, y, z, vx, vy, vz,
      maxOutsideDistance,
      minVelocity,
      maxVelocity,
      weight: Math.random() * 1.5 + 0.5 // weight between 0.5 and 2.0
    });
  }

  updateStatus (width, height, depth) {
    // define status as follow:
    // created: initial state
    // outside: outside the window
    // entering: entering the window (100px inside the window)
    // inside: inside the window
    // exiting: exiting the window
    // destroyed: destroyed (200px outside the window)
    if (this.x < -this.maxOutsideDistance || this.x > width + this.maxOutsideDistance || this.y < -this.maxOutsideDistance || this.y > height + this.maxOutsideDistance || this.z < -this.maxOutsideDistance || this.z > depth + this.maxOutsideDistance) {
      this.status = 'destroyed';
    } else if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.z < 0 || this.z > depth) {
      this.status = 'outside';
    } else if (this.x < 100 || this.x > width - 100 || this.y < 100 || this.y > height - 100 || this.z < 100 || this.z > depth - 100) {
      this.status = 'entering';
    } else {
      this.status = 'inside';
    }
  }

  updatePosition (width, height, depth) {
    // Apply gravity based on weight if affected by gravity
    if (this.isGravityAffected) {
      const gravity = 0.01;
      this.vz -= this.weight * gravity;

      // Apply terminal velocity - cap downward speed
      const terminalVelocity = 0.5;
      if (this.vz < -terminalVelocity) {
        this.vz = -terminalVelocity;
      }
    }

    // update position based on velocity and window size
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    this.updateStatus(width, height, depth);
  }

  // Check collision with another item
  collidesWith (other) {
    // Calculate distance in 3D space
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Collision occurs if distance is less than sum of radii
    return distance < (this.radius + other.radius);
  }

  // Handle collision with another item - simple separation only
  handleCollision (other) {
    // Only process collision if both items are active and collidable
    if (this.status === 'destroyed' || other.status === 'destroyed') {
      return;
    }

    if (!this.isCollidable || !other.isCollidable) {
      return;
    }

    // Calculate collision normal vector
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dz = other.z - this.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance === 0 || distance > (this.radius + other.radius) * 1.2) return;

    // Normalize the collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    const nz = dz / distance;

    // Separate overlapping objects with gentle push
    const overlap = (this.radius + other.radius) - distance;
    if (overlap > 0) {
      const separation = overlap / 2 + 1; // Small buffer

      this.x -= separation * nx;
      this.y -= separation * ny;
      this.z -= separation * nz;

      other.x += separation * nx;
      other.y += separation * ny;
      other.z += separation * nz;
    }
  }
}