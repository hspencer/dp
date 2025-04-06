let w = [];
let num = 15;
let l = 80; // edge length
let pg;
let noiseColor;

function setup() {
  let p5Div = document.getElementById('p5');
  let cnv = createCanvas(p5Div.offsetWidth, p5Div.offsetWidth);
  cnv.parent('p5');
  for (let i = 0; i < num; i++) {
    w.push(new Wanderer());
  }
  pg = createGraphics(width, height);
  noiseColor = new NoiseColor();
}

function draw() {
  l = (noise(frameCount / 100) - 0.5) * width;

  if (mouseIsPressed) {
    let n = new Wanderer();
    n.x = mouseX;
    n.y = mouseY;
    w.push(n);
    w.splice(0, 1);
  }

  noiseColor.update(); // Update the noise color values

  for (let i = 0; i < w.length; i++) {
    w[i].wander();
  }

  for (let i = 0; i < w.length; i++) {
    for (let j = w.length - 1; j > i; j--) {
      let d = dist(w[i].x, w[i].y, w[j].x, w[j].y);
      if (d < l) {
        let lineColor = noiseColor.getColor(i, j); // Get color based on indices
        stroke(lineColor);
        blendMode(MULTIPLY);
        line(w[i].x, w[i].y, w[j].x, w[j].y);
        blendMode(BLEND);
      }
    }
  }
  veil();

  for (let i = 0; i < w.length; i++) {
    let wandererColor = noiseColor.getWandererColor(i);
    w[i].paint(wandererColor);
  }
}

function veil() {
  pg.image(get(), 0, 0, width, height);
  pg.tint(255, 0.00001);
  image(pg, 0, 0);
}

class Wanderer {
  constructor() {
    this.seed = round(random(-9999999, 9999999));
    this.a = random(TWO_PI);
    this.speed = random(0.3, 0.5);
    this.x = (width / 2) + cos(this.a) * random(100);
    this.y = (height / 2) + sin(this.a) * random(100);
    this.d = random(3);
  }

  wander() {
    noiseSeed(this.seed);
    this.a += (noise(millis() / 300) - 0.5);
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.a += PI;
    }
    this.x += cos(this.a) * this.speed;
    this.y += sin(this.a) * this.speed;
  }

  paint(color) {
    blendMode(DIFFERENCE);
    fill(color);  // Use the provided color
    ellipse(this.x, this.y, this.d, this.d);
    blendMode(BLEND);
  }
}

class NoiseColor {
  constructor() {
    this.zoom = random(0.001, 0.005); // Adjust zoom for smoother changes
    this.speed = random(0.005, 0.01); // Adjust speed for smoother changes
    this.offset = random(1000); // Add an offset to vary initial values
  }

  update() {
    this.r = map(noise(this.offset + frameCount * this.speed), 0, 1, 0, 255);
    this.g = map(noise(this.offset + frameCount * this.speed + 1000), 0, 1, 0, 255); // Different offset for g
    this.b = map(noise(this.offset + frameCount * this.speed + 2000), 0, 1, 0, 255); // Different offset for b
  }

  getColor(i, j) {
      // Vary color slightly based on indices for more variation
      let r = this.r + map(i, 0, w.length, -20, 20);
      let g = this.g + map(j, 0, w.length, -20, 20);
      let b = this.b + map(i + j, 0, w.length * 2, -20, 20)
      return color(r, g, b, 1);
  }

  getWandererColor(i) {
    let r = this.g; // Use g for r
    let g = this.b; // Use b for g
    let b = this.r; // Use r for b
    return color(r, g, b, 10);
  }
}