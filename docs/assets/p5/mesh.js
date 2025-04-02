// Definición de variables
let w = []; // Array para almacenar los objetos Wanderer
let num = 50; // Número de objetos Wanderer
let l = 150; // Longitud de la arista
let count = 0; // Contador

// Configuración inicial
function setup() {
  let cnv = createCanvas(400, 400); // Crear un lienzo de 400x400 píxeles
  cnv.parent('p5'); // Asignar el lienzo al contenedor con id 'p5'
  let divP5 = document.getElementById('p5');
  divP5.style.mixBlendMode = "multiply";
  for (let i = 0; i < num; i++) {
    w.push(new Wanderer()); // Crear y añadir objetos Wanderer al array
  }
  background(247); // Establecer el color de fondo
}

// Bucle de dibujo
function draw() {
  l = (noise(frameCount / 100) - 0.5) * width; // Calcular la longitud de la arista basada en ruido
  if (mouseIsPressed) {
    let n = new Wanderer();
    n.x = mouseX;
    n.y = mouseY;
    w.push(n);
    w.splice(0, 1); // Eliminar el primer elemento del array para mantener el tamaño
  }

  stroke(0, 50); // Establecer el color y la transparencia del trazo
  for (let i = 0; i < w.length; i++) {
    w[i].wander(); // Llamar al método wander de cada objeto Wanderer
  }

  // Dibujar líneas entre objetos cercanos
  for (let i = 0; i < w.length; i++) {
    for (let j = w.length - 1; j > i; j--) {
      let d = dist(w[i].x, w[i].y, w[j].x, w[j].y);
      if (d < l) {
        line(w[i].x, w[i].y, w[j].x, w[j].y);
      }
    }
  }

  veil(); // Aplicar velo para crear efecto de desvanecimiento
  fill(0); // Establecer el color de relleno
  noStroke(); // Eliminar el trazo

  // Dibujar cada objeto Wanderer
  for (let i = 0; i < w.length; i++) {
    w[i].paint();
  }
}

// Función para crear un efecto de desvanecimiento
function veil() {
  fill(255, 25); // Color blanco con baja opacidad
  noStroke();
  rect(0, 0, width, height); // Dibujar un rectángulo que cubre todo el lienzo
}

// Clase Wanderer
class Wanderer {
  constructor() {
    this.seed = round(random(-9999999, 9999999)); // Semilla para el ruido

    this.a = random(TWO_PI); // Ángulo inicial
    this.speed = random(0.3, 0.5); // Velocidad de movimiento
    this.x = (width / 2) + cos(this.a) * random(100); // Posición inicial en x
    this.y = (height / 2) + sin(this.a) * random(100); // Posición inicial en y
    this.d = random(3); // Diámetro del círculo
  }

  // Método para simular el movimiento errante
  wander() {
    noiseSeed(this.seed);
    this.a += (noise(millis() / 300) - 0.5);
    // Rebote en los bordes
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.a += PI;
    }

    this.x += cos(this.a) * this.speed;
    this.y += sin(this.a) * this.speed;
  }

  // Método para dibujar el objeto
  paint() {
    // Amplificar el ruido con 'l' y usarlo para el color del círculo
    let noiseValue = noise(this.x, this.y, millis() / 1000);
    let colorValue = map(noiseValue, 0, 1, 0, 255);
    fill(colorValue * (l / 50), 100); // Amplificación con l/50
    ellipse(this.x, this.y, this.d, this.d);
  }
}