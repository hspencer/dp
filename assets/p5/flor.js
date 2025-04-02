let model;
let current;
let c = [
  "#D63F09", "#FFA94D", "#FAE203", "#8FCB35", "#00828E", "#00426E", "#A64DFF", "#EB12EB",
  "#AE1D04", "#FF8408", "#DECC02", "#7EB331", "#0F8CA5", "#135589", "#8A27EC", "#CA0DCA",
  "#870101", "#C46200", "#B8AE01", "#6C9A2E", "#2096C0", "#2D6EAD", "#6C00D7", "#A809A8",
  "#690808", "#984805", "#929100", "#59802A", "#31A1DA", "#4688D1", "#4C0098", "#860486"
];
let file;
let MAX = 120; // radio máximo del pétalo
let offset = 5;
let currentCol;

function setup() {
  let cnv = createCanvas(350, 350);
  cnv.parent('p5');
  smooth();
  noStroke();
  model = new CitiPulse(width / 2, height / 2);
  populateCitiPulse(model);
  current = new Petal();
  file = year() + month() + day() + hour() + minute() + ".mov";
  currentCol = color(255);
}

function draw() {
  clear();
  noFill();
  stroke("#E3E3E3");
  strokeWeight(1);
  ellipse(width / 2, height / 2, MAX * 2 + offset * 2, MAX * 2 + offset * 2);
  model.draw();
}

function keyPressed() {
  if (key == 'v') {
    for (let i = 0; i < model.petal.length; i++) {
      console.log("petal[" + i + "].value = " + model.petal[i].value);
    }
    console.log("---------------------------------------------");
  }
  if (key == ' ') {
    populateCitiPulse(model);
  }
  if (key == 'x') {
    noLoop();
  }
  if (key == 's') {
    saveFrame("img/citipulse-#####.png");
  }
}

function mouseMoved() {
  currentCol = get(mouseX, mouseY);
}

function mousePressed() {
  console.log(current.name + ", cuyo valor es " + current.value);
}

class CitiPulse {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.petal = [];
  }

  draw() {
    for (let i = 0; i < this.petal.length; i++) {
      push();
      translate(this.x, this.y);
      rotate(this.petal[i].alfa * i);
      this.petal[i].be();
      pop();
    }
  }
}

function populateCitiPulse(mod) {
  let num = round(random(3, 10)); // número de pétalos o términos de primer nivel
  let alfa = TWO_PI / num;
  let beta = (alfa + PI) / 2;
  let radio = (MAX * sin(alfa / 2)) / (1 + sin(alfa / 2));
  let ac = MAX - radio;
  console.log(" num = " + num);
  console.log(" alfa = " + alfa + "\t (" + degrees(alfa) + " grados)");
  console.log(" beta = " + beta);
  console.log("radio = " + radio);
  let result = radio + ac;
  console.log(" AC = " + ac + "\t radio + AC = " + result);
  console.log("---------------------------------------------");
  mod.petal = new Array(num);
  for (let i = 0; i < mod.petal.length; i++) {
    mod.petal[i] = new Petal();
    mod.petal[i].alfa = alfa;
    mod.petal[i].beta = beta;
    mod.petal[i].r = radio;
    mod.petal[i].ac = ac;
    mod.petal[i].x = mod.x;
    mod.petal[i].y = mod.y;
    // lo único de cada pétalo
    mod.petal[i].value = random(0.2, 1);
    mod.petal[i].name = "Elemento " + i;
    mod.petal[i].c = c[i];
  }
}

class Petal {
  constructor(x, y, value, col, name) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.name = name;
    this.c = col;
    this.seed = round(random(99999));
    this.alfa = 0;
    this.beta = 0;
    this.r = 0;
    this.ac = 0;
    this.co = color(0);
  }

  be() {
    noiseSeed(this.seed);
    this.value = noise(this.seed + millis() / 6000);
    if (this.over(currentCol)) {
      this.co = color(red(this.c) - 25, green(this.c) - 25, blue(this.c) - 25);
      this.draw(0, 0, this.r + offset, this.co);
    }
    this.draw(offset, 0, this.r, this.c);
  }

  over(col) {
    return red(this.c) === red(col) && green(this.c) === green(col) && blue(this.c) === blue(col);
  }

  draw(ox, oy, radio, col) {
    fill(col);
    noStroke();
    push();
    translate(ox, oy);
    beginShape();
    vertex(0, 0);
    for (let t = -this.beta; t <= this.beta; t += 0.1) {
      let xpos = this.value * cos(t) * radio;
      let ypos = this.value * sin(t) * radio;
      vertex(this.ac * this.value + abs(this.r - radio) + xpos, ypos);
    }
    endShape(CLOSE);
    pop();
  }
}