/** @format */

import React from "react";
import Sketch, { background, stroke, noFill, noStroke, fill, rect, circle, text, textSize } from "react-p5";

let x = 50;
let y = 50;
export default (props) => {
  const canvasSize = 500;
  const margin = [
    [50, 50],
    [50, 50],
  ];
  const maxOs = 5;
  const os = [];
  const osRadius = 15;

  function circlesIntersect(x1, y1, r1, x2, y2, r2) {
    return Math.hypot(x1 - x2, y1 - y2) < r1 + r2;
  }

  function bounce(x1, y1, vx1, vy1, x2, y2, vx2, vy2) {
    // Calculate the distance between the centers of the circles
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the normal vector between the two circles
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate the tangent vector
    const tx = -ny;
    const ty = nx;

    // Project the velocities of the circles onto the normal and tangent vectors
    const dv1n = vx1 * nx + vy1 * ny;
    const dv1t = vx1 * tx + vy1 * ty;
    const dv2n = vx2 * nx + vy2 * ny;
    const dv2t = vx2 * tx + vy2 * ty;

    // Calculate the new normal velocities using the formula for elastic collision
    const v1n = dv2n;
    const v2n = dv1n;

    // The tangential velocities remain unchanged
    const v1t = dv1t;
    const v2t = dv2t;

    // Convert the normal and tangential velocities back into regular x and y velocities
    vx1 = v1n * nx + v1t * tx;
    vy1 = v1n * ny + v1t * ty;
    vx2 = v2n * nx + v2t * tx;
    vy2 = v2n * ny + v2t * ty;

    return [vx1, vy1, vx2, vy2];
  }

  function getUniquePosition() {
    let x = (Math.random() + margin[0][0] + osRadius) * canvasSize - margin[0][1] - osRadius;
    let y = (Math.random() - margin[1][0] + osRadius) * canvasSize - margin[1][1] - osRadius;

    for (let i = 0; i < os.length; i++) {
      if ((x > os[i].x - osRadius && x < os[i].x + osRadius) || (y > os[i].y - osRadius && y < os[i].y + osRadius)) {
        return getUniquePosition();
      }
    }

    return [parseFloat(x.toFixed(1)), parseFloat(y.toFixed(1))];
  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(500, 500).parent(canvasParentRef);
    // createCanvas(canvasSize, canvasSize);

    for (let i = 0; i < maxOs; i++) {
      const p = getUniquePosition();
      os.push({
        x: p[0],
        y: p[1],
        vx: (Math.random() - 2) * 2,
        vy: (Math.random() - 2) * 2,
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      });
    }
  };

  const draw = (p5) => {
    background(250);
    stroke(0);
    noFill();
    rect(margin[0][0], margin[1][0], canvasSize - margin[0][0] - margin[0][1], canvasSize - margin[1][0] - margin[1][1]);

    noStroke();
    //fill(240, 205, 200);
    rect(margin[0][0], 5, canvasSize - margin[0][0] - margin[0][1], 40);
    rect(5, margin[1][0], 40, canvasSize - margin[1][0] - margin[1][1]);

    for (let o of os) {
      if (o.x < margin[0][0] + osRadius / 2 || o.x > canvasSize - margin[0][1] - osRadius / 2) o.vx *= -1;
      if (o.y < margin[1][0] + osRadius / 2 || o.y > canvasSize - margin[1][1] - osRadius / 2) o.vy *= -1;

      let c = false;
      for (let p of os) {
        if (o !== p) {
          c = circlesIntersect(o.x, o.y, osRadius / 2, p.x, p.y, osRadius / 2);

          if (c) {
            const [vx1, vy1, vx2, vy2] = bounce(o.x, o.y, o.vx, o.vy, p.x, p.y, p.vx, p.vy);

            o.vx = vx1;
            o.vy = vy1;
            p.vx = vx2;
            p.vy = vy2;
          }
        }
      }

      o.x -= o.vx;
      o.y -= o.vy;

      const textX = o.x.toFixed(1);
      const textY = o.y.toFixed(1);
      const textS = parseFloat(Math.sqrt(o.vx * o.vx + o.vy * o.vy).toFixed(2));

      noStroke();
      fill(0);
      circle(o.x, o.y, osRadius);
      rect(o.x, 5, 2, textS * 13);
      rect(5, o.y, textS * 13, 2);
      rect(o.x, canvasSize - textS * 13 - 5, 2, textS * 13);
      rect(canvasSize - textS * 13 - 5, o.y, textS * 13, 2);

      fill(0);
      textSize(10);
      text(textS, o.x + 10, o.y - 5, 70, 80);
      text(textX, o.x + 10, o.y + 5, 70, 80);
      text(textY, o.x + 10, o.y + 15, 70, 80);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
