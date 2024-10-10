function getFieldVector(position, cellSize) {
    let col = Math.floor(position.x / cellSize);
    let row = Math.floor(position.y / cellSize);
    if (col >= 0 && col < field.length && row >= 0 && row < field[0].length) {
      return field[col][row].copy();
    }
    return null;
}

function rk4Integrate(position, direction) {
    let h = stepSize * direction;
    
    let k1 = getFieldVector(position).mult(h);
    let k2 = getFieldVector(p5.Vector.add(position, k1.copy().mult(0.5))).mult(h);
    let k3 = getFieldVector(p5.Vector.add(position, k2.copy().mult(0.5))).mult(h);
    let k4 = getFieldVector(p5.Vector.add(position, k3)).mult(h);
    
    let delta = p5.Vector.add(k1, p5.Vector.add(k4, p5.Vector.add(k2, k3).mult(2))).mult(1 / 6);
    
    position.add(delta);  // Update position by the weighted sum of the slopes
  
    return position;
}

function eulerIntegrate(position, stepSize) {
    // Compute the derivative (vector) at the current position
    let derivative = getFieldVector(position);
    
    // Scale the derivative by the step size
    let delta = derivative.mult(stepSize);
    
    // Update position by adding the delta
    position.add(delta);
  
    return position;
  }