// Datos de posts
let postsData = posts;
let cnv;

// Importación de módulos de Matter.js
const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

let engine;
let world;
let boundaries = [];

// Constantes para el temporizador (en milisegundos)
const hoverThreshold = 1000; // Tiempo necesario para activar el post
const fadeDuration = 1500;   // Duración de la transición de color

function setup() {
  // Definir dimensiones del canvas según los elementos del DOM
  let w = document.getElementById('p5').offsetWidth;
  cnv = createCanvas(w, w*0.75);
  cnv.parent('p5');

  // Permitir las acciones táctiles por defecto (como el desplazamiento)
  cnv.elt.style.touchAction = "auto";

  textFont('Barlow');

  // Crear motor y mundo de Matter.js sin gravedad vertical
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;

  // Configurar el MouseConstraint para la interacción con el ratón
  let canvasmouse = Matter.Mouse.create(cnv.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let mConstraint = Matter.MouseConstraint.create(engine, { mouse: canvasmouse });
  World.add(world, mConstraint);

  // Calcular escalado del radio de cada post en función de su longitud
  let lengths = postsData.map(post => post.length || 1000);
  let minLen = Math.min(...lengths);
  let maxLen = Math.max(...lengths);

  // Crear límites estáticos alrededor del canvas
  let thickness = 50;
  boundaries.push(Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }));  // Límite inferior
  boundaries.push(Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }));         // Límite superior
  boundaries.push(Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }));        // Límite izquierdo
  boundaries.push(Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true })); // Límite derecho
  World.add(world, boundaries);

  // Crear cuerpos circulares para cada post
  postsData.forEach((post, index) => {
    let angle = map(index, 0, postsData.length, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;
    
    // Escalar el radio según la longitud del post
    post.radius = map(post.length || 1000, minLen, maxLen, 15, 30);
    
    // Crear cuerpo circular con propiedades físicas
    post.body = Bodies.circle(x, y, post.radius, {
      restitution: 0.9,
      friction: 0,
      frictionAir: 0.05
    });
    
    // Inicializar variables para control del temporizador (hover/touch)
    post.hoverStart = null;
    post.activated = false;
    post.touchStartX = undefined;
    post.touchStartY = undefined;
    World.add(world, post.body);
    
    // Asignar velocidad inicial aleatoria
    Matter.Body.setVelocity(post.body, { x: random(-3, 3), y: random(-3, 3) });
  });
}

function draw() {
  clear();
  Engine.update(engine);
  let now = millis();

  // Determinar la posición del puntero: se prioriza el toque (touch) si existe
  let pointerX, pointerY;
  if (touches.length > 0) {
    pointerX = touches[0].x;
    pointerY = touches[0].y;
  } else {
    pointerX = mouseX;
    pointerY = mouseY;
  }

  // Actualizar cada post según la proximidad del puntero
  postsData.forEach(post => {
    let pos = post.body.position;
    let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < post.radius;

    if (isHovering && !post.activated) {
      // Iniciar el temporizador al situarse el puntero sobre el post
      if (!post.hoverStart) {
        post.hoverStart = now;
      }
      // Activar el post si el puntero se mantiene durante el tiempo requerido
      let elapsed = now - post.hoverStart;
      if (elapsed >= hoverThreshold) {
        post.activated = true;
      }
    } else if (!isHovering) {
      // Reiniciar el temporizador y la activación al abandonar el área del post
      post.hoverStart = null;
      post.activated = false;
    }

    // Determinar el color en función del estado del post
    let c;
    if (post.activated) {
      c = color('#C00'); // Post activado se muestra en rojo
    } else if (post.hoverStart) {
      let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1);
      let grey = lerp(200, 0, pct);
      c = color(grey);
    } else {
      c = color(200);
    }

    fill(c);
    noStroke();
    ellipse(pos.x, pos.y, post.radius * 2);
  });

  // Mostrar el título del post cuando el puntero se sitúa sobre él
  postsData.forEach(post => {
    let pos = post.body.position;
    if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(post.title.toUpperCase(), pos.x, pos.y - post.radius - 5);
    }
  });
}

// Evento de ratón: si el post está activado, redirigir a su URL
function mousePressed() {
  postsData.forEach(post => {
    let pos = post.body.position;
    if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      window.location.href = post.url;
    }
  });
}

// Evento táctil: iniciar el temporizador y registrar la posición inicial del toque
function touchStarted() {
  if (touches.length > 0) {
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    postsData.forEach(post => {
      let pos = post.body.position;
      if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
        if (!post.hoverStart) {
          post.hoverStart = millis();
        }
        // Registrar la posición inicial del toque para evaluar el movimiento
        post.touchStartX = pointerX;
        post.touchStartY = pointerY;
      }
    });
  }
}

// Evento táctil de movimiento: cancelar el temporizador si se detecta movimiento excesivo
function touchMoved() {
  if (touches.length > 0) {
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    postsData.forEach(post => {
      if (post.touchStartX !== undefined && post.touchStartY !== undefined) {
        // Cancelar si el movimiento supera los 10 píxeles
        if (dist(pointerX, pointerY, post.touchStartX, post.touchStartY) > 10) {
          post.hoverStart = null;
          post.touchStartX = undefined;
          post.touchStartY = undefined;
          post.activated = false;
        }
      }
    });
  }
}

// Evento táctil finalizado: si el post está activado, redirigir a su URL y restablecer variables
function touchEnded() {
  let pointerX = (touches.length > 0) ? touches[0].x : mouseX;
  let pointerY = (touches.length > 0) ? touches[0].y : mouseY;
  postsData.forEach(post => {
    if (post.activated && dist(pointerX, pointerY, post.body.position.x, post.body.position.y) < post.radius) {
      window.location.href = post.url;
    }
    // Reiniciar variables de estado táctil y del temporizador
    post.hoverStart = null;
    post.touchStartX = undefined;
    post.touchStartY = undefined;
    post.activated = false;
  });
}