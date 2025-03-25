let postsData = posts;
let cnv;
// Alias de Matter.js para mayor claridad
const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

let engine;
let world;
let boundaries = [];

// Radio de cada nodo (post)
const nodeRadius = 20;

function setup() {
  // Se crea el lienzo y se asigna como hijo del elemento con id 'p5'
  cnv = createCanvas(document.getElementById('p5').offsetWidth, 600);
  cnv.parent('p5');
  textFont('Barlow');

  // Inicialización del motor de Matter.js y el mundo físico
  engine = Engine.create();
  world = engine.world;
  // Establecer gravedad cero para simular repulsión sin atracción vertical
  engine.world.gravity.y = 0;

  // Habilitar drag-and-drop de los nodos
  let canvasmouse = Matter.Mouse.create(cnv.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let mConstraint = Matter.MouseConstraint.create(engine, { mouse: canvasmouse });
  World.add(world, mConstraint);

  // Calcular el largo de cada post y definir el radio proporcional
  let lengths = postsData.map(post => post.length || 1000); // Usar 1000 como valor por defecto si no existe la propiedad
  let minLen = Math.min(...lengths);
  let maxLen = Math.max(...lengths);

  // Creación de límites estáticos para evitar que los nodos salgan del lienzo
  let thickness = 50; // Grosor de los límites
  // Límite inferior
  boundaries.push(Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }));
  // Límite superior
  boundaries.push(Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }));
  // Límite izquierdo
  boundaries.push(Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }));
  // Límite derecho
  boundaries.push(Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }));
  // Añadir límites al mundo físico
  World.add(world, boundaries);

  // Para cada post, se crea un cuerpo circular en Matter.js
  postsData.forEach((post, index) => {
    // Distribución de nodos en forma circular
    let angle = map(index, 0, postsData.length, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;
    // Definir el radio proporcional al largo del post (entre 15 y 30)
    post.radius = map(post.length || 1000, minLen, maxLen, 15, 30);
    // Crear cuerpo circular con propiedades físicas usando el radio calculado
    let body = Bodies.circle(x, y, post.radius, { 
      restitution: 0.9, // Efecto de rebote
      friction: 0,
      frictionAir: 0.05
    });
    // Asignar el cuerpo creado al objeto post
    post.body = body;
    // Añadir el cuerpo al mundo físico
    World.add(world, body);
    Matter.Body.setVelocity(body, { x: random(-3, 3), y: random(-3, 3) });
  });
}

function draw() {
  clear(); // Fondo blanco

  // Actualizar el motor de física de Matter.js
  Engine.update(engine);

  // Dibujar cada nodo (primero los círculos)
  postsData.forEach(post => {
    let pos = post.body.position;
    // Determinar si el cursor está sobre el nodo
    let hovered = dist(mouseX, mouseY, pos.x, pos.y) < post.radius;
    // Cambiar el color del nodo en rollover
    fill(hovered ? 120 : 200);
    noStroke();
    ellipse(pos.x, pos.y, post.radius * 2, post.radius * 2);
  });

  // Dibujar los textos de rollover para que aparezcan encima de los nodos
  postsData.forEach(post => {
    let pos = post.body.position;
    if (dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(post.title.toUpperCase(), pos.x, pos.y - post.radius - 5);
    }
  });
}

function doubleClicked() {
  // Comprobar si se ha hecho doble clic en algún nodo
  postsData.forEach(post => {
    let pos = post.body.position;
    if (dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      // Redirigir a la URL del post correspondiente
      window.location.href = post.url;
    }
  });
}