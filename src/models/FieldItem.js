
export default class FieldItem {
  constructor (data) {
    this.x = data?.x ?? 0;
    this.y = data?.y ?? 0;
    this.z = data?.z ?? 0; // For depth effect and color variation
    this.vx = data?.vx ?? 0;
    this.vy = data?.vy ?? 0;
    this.vz = data?.vz ?? 0;
    this.status = data?.status ?? 'created'; // created, outside, entering, inside, exiting, destroyed
  }

  // generate field item based on the current window size
  static generateRandom (width, height, depth) {
    // randomly choose which edge to spawn from (left, right, top, bottom, front, back)
    const edge = Math.floor(Math.random() * 6);
    let x, y, z, vx, vy, vz;

    const margin = 200; // spawn 200px outside the window
    const speed = 3; // inward velocity

    if (edge === 0) {
      // left edge: x must be negative (outside left boundary)
      x = -(margin + Math.random() * 50); // ensure negative
      y = Math.random() * height;
      z = Math.random() * depth;
      vx = speed;
      vy = (Math.random() - 0.5) * speed;
      vz = (Math.random() - 0.5) * speed;
    } else if (edge === 1) {
      // right edge: x must be > width + margin
      x = width + margin + Math.random() * 50;
      y = Math.random() * height;
      z = Math.random() * depth;
      vx = -speed;
      vy = (Math.random() - 0.5) * speed;
      vz = (Math.random() - 0.5) * speed;
    } else if (edge === 2) {
      // top edge: y must be negative (outside top boundary)
      x = Math.random() * width;
      y = -(margin + Math.random() * 50); // ensure negative
      z = Math.random() * depth;
      vx = (Math.random() - 0.5) * speed;
      vy = speed;
      vz = (Math.random() - 0.5) * speed;
    } else if (edge === 3) {
      // bottom edge: y must be > height + margin
      x = Math.random() * width;
      y = height + margin + Math.random() * 50;
      z = Math.random() * depth;
      vx = (Math.random() - 0.5) * speed;
      vy = -speed;
      vz = (Math.random() - 0.5) * speed;
    } else if (edge === 4) {
      // front edge: z must be negative (outside front boundary)
      x = Math.random() * width;
      y = Math.random() * height;
      z = -(margin + Math.random() * 50); // ensure negative
      vx = (Math.random() - 0.5) * speed;
      vy = (Math.random() - 0.5) * speed;
      vz = speed;
    } else {
      // back edge: z must be > depth + margin
      x = Math.random() * width;
      y = Math.random() * height;
      z = depth + margin + Math.random() * 50;
      vx = (Math.random() - 0.5) * speed;
      vy = (Math.random() - 0.5) * speed;
      vz = -speed;
    }

    return new FieldItem({ x, y, z, vx, vy, vz });
  }

  updatePosition (width, height, depth) {
    // update position based on velocity and window size

    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // define status as follow:
    // created: initial state
    // outside: outside the window
    // entering: entering the window (100px inside the window)
    // inside: inside the window
    // exiting: exiting the window
    // destroyed: destroyed (200px outside the window)
    if (this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200 || this.z < -200 || this.z > depth + 200) {
      this.status = 'destroyed';
    } else if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.z < 0 || this.z > depth) {
      this.status = 'outside';
    } else if (this.x < 100 || this.x > width - 100 || this.y < 100 || this.y > height - 100 || this.z < 100 || this.z > depth - 100) {
      this.status = 'entering';
    } else {
      this.status = 'inside';
    }

    // kill it if destroyed
    if (this.status === 'destroyed') {
      // respawn on a random edge, 200px outside the window
      const edge = Math.floor(Math.random() * 6);
      const margin = 200;
      const speed = 3;

      if (edge === 0) {
        // left edge
        this.x = -margin;
        this.y = Math.random() * height;
        this.z = Math.random() * depth;
        this.vx = speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = (Math.random() - 0.5) * speed;
      } else if (edge === 1) {
        // right edge
        this.x = width + margin;
        this.y = Math.random() * height;
        this.z = Math.random() * depth;
        this.vx = -speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = (Math.random() - 0.5) * speed;
      } else if (edge === 2) {
        // top edge
        this.x = Math.random() * width;
        this.y = -margin;
        this.z = Math.random() * depth;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = speed;
        this.vz = (Math.random() - 0.5) * speed;
      } else if (edge === 3) {
        // bottom edge
        this.x = Math.random() * width;
        this.y = height + margin;
        this.z = Math.random() * depth;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = -speed;
        this.vz = (Math.random() - 0.5) * speed;
      } else if (edge === 4) {
        // front edge
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = -margin;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = speed;
      } else {
        // back edge
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = depth + margin;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = -speed;
      }

      this.status = 'created';
    }
  }
}