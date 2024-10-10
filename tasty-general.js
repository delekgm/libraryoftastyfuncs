function sampleRandom3D(min, max) {

    const remap = (value, oldMin, oldMax, newMin, newMax) => {
        return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
    }

    const radius = remap(Math.random(), 0, 1, min, max); // distance from origin
    const theta = Math.random() * 2 * Math.PI; // random angle between 0 and 2π
    const phi = Math.random() * Math.PI; // random angle between 0 and π

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [x, y, z];
}

function remap (value, oldMin, oldMax, newMin, newMax) {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

// P5 Only would need to adjust lerpColor and color for other languages
function setColor(currCol) {
    const d = this.pos.dist(this.initPos); // Distance between current position and initial position
    const prevColor = color(currCol); // Previous color colror() is p5
    
    // Map the distance to the range of color indices
    const colorIndex = map(d, 0, 150, 0, colors.length - 1, true);
    const colorId = Math.floor(colorIndex);
    
    // Determine the next color index for interpolation
    const nextColorId = min(colorId + 1, colors.length - 1);
    
    // Calculate interpolation factor 't' for blending
    const t = colorIndex - colorId;
    
    // Interpolate between the two colors
    let c0 = lerpColor(color(colors[colorId]), color(colors[nextColorId]), t);
    
    // Set the new color
    return c0;
  }

// Hex color funcs
const hexToRGB = (hex) => {
    // Remove the leading # if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values and convert to integers
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

const getBrightness = (hex) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate brightness
    return (r + g + b) / 3;
  };