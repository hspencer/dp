// Array to store wanderer objects
let wanderers = [];
const initialCount = 10;
// Variable to determine maximum distance for connecting lines
let edgeThreshold = 80; 
// Offscreen graphics buffer for trail effect
let offscreenBuffer; 
// Instance to manage colour variations using noise
let noiseColor;

function setup() {
  // Cache the container element once
  const container = document.getElementById('p5');
  // Create canvas with dimensions matching container width
  const cnv = createCanvas(container.offsetWidth, container.offsetWidth);
  cnv.parent('p5');
  // Initialize wanderers
  for (let i = 0; i < initialCount; i++) {
    wanderers.push(new Wanderer());
  }
  // Create offscreen graphics buffer for fading trail
  offscreenBuffer = createGraphics(width, height);
  offscreenBuffer.clear();
  // Instantiate the noise-based colour controller
  noiseColor = new NoiseColor();
}

function draw() {
  // Update maximum connection distance using noise
  edgeThreshold = (noise(frameCount * 0.01) - 0.5) * width;
  
  // On mouse press, add a new wanderer at the mouse location and remove the oldest one
  if (mouseIsPressed) {
    const newWanderer = new Wanderer();
    newWanderer.x = mouseX;
    newWanderer.y = mouseY;
    wanderers.push(newWanderer);
    wanderers.shift();
  }
  
  // Update the colour values based on noise
  noiseColor.update();
  
  // Update positions of all wanderers
  const count = wanderers.length;
  for (let i = 0; i < count; i++) {
    wanderers[i].update();
  }
  
  // Set blending mode for drawing connecting lines
  blendMode(MULTIPLY);
  // Iterate over pairs of wanderers to draw lines if within threshold distance
  for (let i = 0; i < count; i++) {
    // Cache current wanderer's coordinates
    const { x: xi, y: yi } = wanderers[i];
    for (let j = i + 1; j < count; j++) {
      const { x: xj, y: yj } = wanderers[j];
      const d = dist(xi, yi, xj, yj);
      if (d < edgeThreshold) {
        stroke(noiseColor.getLineColor(i, j)); // Apply noise-based colour to the line
        line(xi, yi, xj, yj);
      }
    }
  }
  // Reset blending mode for subsequent drawings
  blendMode(BLEND);
  
  // Update offscreen buffer for persistent trail with low opacity fade
  offscreenBuffer.image(get(), 0, 0, width, height);
  offscreenBuffer.tint(255, 1); // Very low opacity for fading effect
  image(offscreenBuffer, 0, 0);
  
  // Draw each wanderer using its assigned colour
  for (let i = 0; i < count; i++) {
    wanderers[i].display(noiseColor.getWandererColour(i));
  }
}

// Class representing an individual moving point
class Wanderer {
  constructor() {
    // Assign a random phase to use in noise calculation
    this.phase = random(10000);
    // Initialise direction and speed
    this.a = random(TWO_PI);
    this.speed = random(0.3, 0.5);
    // Position calculated relative to the canvas centre
    this.x = width / 2 + cos(this.a) * random(100);
    this.y = height / 2 + sin(this.a) * random(100);
    // Define size of the drawing point
    this.size = random(1, 3);
  }
  
  // Update position based on noise-influenced angular change
  update() {
    // Compute angular variation without resetting global noise state
    this.a += (noise(this.phase + millis() * 0.0033) - 0.5);
    // Invert direction if the object reaches canvas boundaries
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.a += PI;
    }
    // Update position using current angle and speed
    this.x += cos(this.a) * this.speed;
    this.y += sin(this.a) * this.speed;
  }
  
  // Draw the wanderer on the canvas with a given colour
  display(col) {
    blendMode(DIFFERENCE);
    fill(col);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
    blendMode(BLEND);
  }
}

// Class to manage colour values based on noise functions
class NoiseColor {
  constructor() {
    // Parameters to control noise granularity and variation speed
    this.zoom = random(0.001, 0.005);
    this.speed = random(0.005, 0.01);
    this.offset = random(1000);
  }
  
  // Update colour channels based on noise functions
  update() {
    this.r = map(noise(this.offset + frameCount * this.speed), 0, 1, 0, 255);
    this.g = map(noise(this.offset + frameCount * this.speed + 1000), 0, 1, 0, 255);
    this.b = map(noise(this.offset + frameCount * this.speed + 2000), 0, 1, 0, 255);
  }
  
  // Compute the colour for a connecting line based on wanderer indices
  getLineColor(i, j) {
    const r = this.r + map(i, 0, wanderers.length, -20, 20);
    const g = this.g + map(j, 0, wanderers.length, -20, 20);
    const b = this.b + map(i + j, 0, wanderers.length * 2, -20, 20);
    return color(r, g, b, 1);
  }
  
  // Determine the colour for a wanderer based on noise values
  getWandererColour(i) {
    return color(this.g, this.b, this.r, 10);
  }
}