function rotate2D(vec, theta, center = {x: 0, y: 0}) {
    // Translate vector to origin based on the center point
    const translatedX = vec.x - center.x;
    const translatedY = vec.y - center.y;
  
    // Apply rotation
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
    const rotatedY = translatedX * sinTheta + translatedY * cosTheta;
  
    // Translate back to original position
    return {
        x: rotatedX + center.x,
        y: rotatedY + center.y
    };
  }

function rotate2DSimple(vec, theta) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    return {
        x: vec.x * cosTheta - vec.y * sinTheta,
        y: vec.x * sinTheta + vec.y * cosTheta
    };
}

const rand = (a=1)=>Math.random()*a;
const edge = (a, b) => a>0&&b>0?vecLength([a,b]):a>b?a:b;

convertToCanvasDim = function (x, y, w, h) {
    x = (x+1) * w/2;
    y = (y+1) * h/2;
    return [x, y];
}

convertToNormalized = function (x, y, w, h) {
    x = 2 * x / w - 1;
    y = 2 * y / h - 1;
    return [x, y];
}

// Old functions for testing
const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]; // *
const vecAbs = (v) => [Math.abs(v[0]), Math.abs(v[1])]; // *
const vecMax = (v, s) => [Math.max(v[0], s), Math.max(v[1], s)]; // *
const vecMin = (v1, v2) => Math.min(v1, v2);
const vecNormalize = (v) => {
      const len = vecLength(v);
      return [v[0] / len, v[1] / len];
};
const vecLength = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
////

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
}

// Generative functions
function sdfShapesCircles(v, shapes) {
  let combinedShapes = Infinity;
  for(let shape of shapes) {
    let shapeVal = sdf_circle(v.copy(), shape.pos, shape.radius);
    combinedShapes = sdf_smoothUnion(combinedShapes, shapeVal, slider.value());
  }
  return combinedShapes;
}

function sdfShapesSquares(v, shapes) {
  let combinedShapes = Infinity;
  for(let shape of shapes) {
    let {x, y} = rotate2D(v.copy(), shape.rotAngle);
    let rotV = new Vec2(x, y);
    let shapeVal = sdf_box(rotV, shape.pos, shape.dim, shape.inflate);
    combinedShapes = sdf_smoothUnion(combinedShapes, shapeVal, slider.value());
  }
  return combinedShapes;
}

function sdfShapesTris(v, shapes) {
  let combinedShapes = Infinity;
  for(let shape of shapes) {
    let {x, y} = rotate2D(v.copy(), shape.rotAngle);
    let rotV = new Vec2(x, y);
    let shapeVal = sdf_EquilateralTriangle(rotV, shape.pos, shape.radius) - shape.cornerRad;
    combinedShapes = sdf_smoothUnion(combinedShapes, shapeVal, slider.value());
  }
  return combinedShapes;
}

function sdfShapesHexes(v, shapes) {
  let combinedShapes = Infinity;
  for(let shape of shapes) {
    let {x, y} = rotate2D(v.copy(), shape.rotAngle);
    let rotV = new Vec2(x, y);
    let shapeVal = sdf_Hexagon(rotV, shape.pos, shape.radius) - shape.cornerRad;
    combinedShapes = sdf_smoothUnion(combinedShapes, shapeVal, slider.value());
  }
  return combinedShapes;
}

function sdfShapes(v, shapes) {
  let combinedShapes = Infinity;
  for(let shape of shapes) {
    let type = shape.type;
    
    let shapeVal;
    if (type == 0) {
      shapeVal = sdf_circle(v.copy(), shape.pos, shape.radius);
    }  else if (type == 1) {
      let {x, y} = rotate2D(v.copy(), shape.rotAngle, {x: shape.pos.x, y: shape.pos.y});
      let rotV = new Vec2(x, y);
      shapeVal = sdf_box(rotV, shape.pos, shape.dim, shape.inflate);
    } else if (type == 2) {
      let {x, y} = rotate2D(v.copy(), shape.rotAngle, {x: shape.pos.x, y: shape.pos.y});
      let rotV = new Vec2(x, y);
      shapeVal = sdf_EquilateralTriangle(rotV, shape.pos, shape.radius) - shape.cornerRad;
    } else if (type == 3) {
      let {x, y} = rotate2D(v.copy(), shape.rotAngle, {x: shape.pos.x, y: shape.pos.y});
      let rotV = new Vec2(x, y);
      shapeVal = sdf_Hexagon(rotV, shape.pos, shape.radius) - shape.cornerRad;
    }
    combinedShapes = sdf_smoothUnion(combinedShapes, shapeVal, slider.value());
  }
  return combinedShapes;
}

function sdf(v){

    let hex = sdf_Hexagon(v, 0.3, 0.3, 0.2);
    let {x, y} = rotate2D(v.copy(), PI/1.5);
    let rotV = new Vec2(x, y);
    let square = sdf_box(rotV, new Vec2(0, 0), [0.5, 0.1], 0);
    return sdf_union(hex, square);
  }
  
// Shapes
function sdf_circle(v, center, radius){
  v.sub(center);
  return v.length() - radius;
}

function sdf_box(v, center, [w, h], inflate){
  let line1 = Math.abs(v.y-center.y) - w; // - coord so negative is on the bottom or right
  let line2 = Math.abs(v.x-center.x) - h;
  return edge(line1, line2) - inflate;
}

function sdf_orientedBox(p, a, b, th) {   
  // Step 1: Calculate the vector and its length
  const ba = new Vec2(b[0] - a[0], b[1] - a[1]);
  const l = ba.length();

  // Step 2: Normalize the vector
  const d = ba.normalize();

  // Step 3: Compute q by translating p and then rotating it
  let q = new Vec2((p.x - (a[0] + b[0]) * 0.5), (p.y - (a[1] + b[1]) * 0.5));
  q.e = [q.x * d.x + q.y * d.y, -q.x * d.y + q.y * d.x];

  // Step 4: Compute the absolute value and adjust by the box dimensions
  q = Vec2.abs(q);
  q.e = q.e.map((v, i) => v - [l, th][i] * 0.5)

  // Step 5: Compute the signed distance
  return Vec2.length( Vec2.max(q, 0.0) ) + Vec2.min(Math.max(q.x, q.y), 0.0);
}

function sdf_EquilateralTriangle(p, center, r) {
  p = [p.x - center.x, p.y - center.y];
  let k = Math.sqrt(3.0);
  p[0] = Math.abs(p[0]) - r;
  p[1] = (p[1] + r / k);
  if(p[0] + k * p[1] > 0.0) p = [(p[0] - k * p[1]) / 2.0, (-k * p[0] - p[1]) / 2.0];
  p[0] -= clamp(p[0], -2.0 * r, 0.0);
  return -vecLength(p) * Math.sign(p[1]);
}

function sdf_Hexagon(p, center, r) {
  p = [p.x - center.x, p.y - center.y];

  const k = [-0.866025404, 0.5, 0.577350269];
  const kXY = [k[0], k[1]];

  p[0] = Math.abs(p[0]);
  p[1] = Math.abs(p[1]);

  let multiplier = 2.0 * Math.min(dot(kXY, p), 0.0);
  kXY[0] *= multiplier;
  kXY[1] *= multiplier;
  p[0] -= kXY[0];
  p[1] -= kXY[1];

  let subV = [clamp(p[0], -k[2] * r, k[2] * r), r];
  p[0] -= subV[0];
  p[1] -= subV[1];

  return vecLength(p) * Math.sign(p[1]);
}


// SDF Utils
function sdf_union(sdf1, sdf2) {
  return Math.min(sdf1, sdf2);
}

function sdf_intersect(sdf1, sdf2) {
  return Math.max(sdf1, sdf2);
}

function sdf_subtract(sdf1, sdf2) {
  return Math.max(sdf1, -sdf2)
}

function sdf_repeat(coord, repeat) {
  coord /= repeat;
  coord -= Math.floor(coord) + 0.5;
  coord *= repeat;
  return coord;
}

function sdf_smoothUnion(sdf1, sdf2, k) {
  let h = Math.max(0, Math.min(1, 0.5 + 0.5 * (sdf2 - sdf1) / k));
  return Math.min(sdf1, sdf2) - h * (1 - h) * k;
}