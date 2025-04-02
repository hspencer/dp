let postsData = [];
let filteredPosts = [];
let categoryFilter = {};
let cnv;

const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;

let engine;
let world;
let boundaries = [];

const hoverThreshold = 1000;
const fadeDuration = 1500;

function preload() {
  loadJSON('/feed.json', (data) => {
    console.log("Datos cargados:", data);
    postsData = data;
  }, (err) => {
    console.error("Error al cargar JSON:", err);
  });
}

function setup() {
  let w = document.getElementById('p5').offsetWidth;
  cnv = createCanvas(w, w);
  cnv.parent('p5');
  cnv.elt.style.touchAction = "auto";

  textFont('Barlow');

  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;

  let canvasmouse = Matter.Mouse.create(cnv.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let mConstraint = Matter.MouseConstraint.create(engine, { mouse: canvasmouse });
  World.add(world, mConstraint);

  // Inicializar filtro de categorías
  postsData.forEach(post => {
    (post.categorias || []).forEach(cat => {
      categoryFilter[cat] = true;
    });
  });

  createCategoryCheckboxes();

  let lengths = postsData.map(p => p.contenido.length);
  let minLen = Math.min(...lengths);
  let maxLen = Math.max(...lengths);

  // Crear límites del canvas
  let thickness = 50;
  boundaries.push(Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }));
  boundaries.push(Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }));
  World.add(world, boundaries);

  // Agregar cuerpos al mundo
  postsData.forEach((post, index) => {
    let angle = map(index, 0, postsData.length, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;

    // radio fijo si es "code", sino mapeado por longitud
    let isCode = post.categorias.includes('code');
    post.radius = isCode ? 10 : map(post.contenido.length, minLen, maxLen, 15, 30);

    post.body = Bodies.circle(x, y, post.radius, {
      restitution: 0.9,
      friction: 0,
      frictionAir: 0.05
    });

    post.hoverStart = null;
    post.activated = false;
    post.touchStartX = undefined;
    post.touchStartY = undefined;
    World.add(world, post.body);

    Matter.Body.setVelocity(post.body, { x: random(-3, 3), y: random(-3, 3) });
  });

  filteredPosts = postsData; // al principio todos visibles
}

function draw() {
  clear();
  Engine.update(engine);
  let now = millis();

  let pointerX = touches.length > 0 ? touches[0].x : mouseX;
  let pointerY = touches.length > 0 ? touches[0].y : mouseY;

  filteredPosts = postsData.filter(p => p.categorias.some(cat => categoryFilter[cat]));

  filteredPosts.forEach(post => {
    let pos = post.body.position;
    let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < post.radius;

    if (isHovering && !post.activated) {
      if (!post.hoverStart) post.hoverStart = now;
      if (now - post.hoverStart >= hoverThreshold) post.activated = true;
    } else if (!isHovering) {
      post.hoverStart = null;
      post.activated = false;
    }

    // Determinar color según categoría
    let baseColor = color(200);
    if (post.categorias.includes('code')) {
      baseColor = color(140, 35, 0, 127); // rojo 50%
    } else if (post.categorias.includes('escuela')) {
      baseColor = color(41, 128, 48, 77) ; // verde limón 50%
    } else if (post.categorias.includes('ideas')) {
      baseColor = color(100, 200, 255, 127); // celeste 50%
    }

    // Estilo según estado
    if (post.activated) {
      fill(204, 0, 0); // rojo
      noStroke();
    } else if (post.hoverStart) {
      let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1);
      let g = lerp(200, 0, pct);
      fill(g);
      noStroke();
    } else {
      fill(baseColor);
      strokeWeight(1.5);
      if (post.categorias.includes('code')) {
        stroke(204, 0, 0); // contorno rojo
      } else {
        noStroke();
      }
    }

    ellipse(pos.x, pos.y, post.radius * 2);
  });

  // Mostrar título
  filteredPosts.forEach(post => {
    let pos = post.body.position;
    if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(post.titulo.toUpperCase(), pos.x, pos.y - post.radius - 5);
    }
  });
}

function mousePressed() {
  filteredPosts.forEach(post => {
    let pos = post.body.position;
    if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      window.location.href = post.url;
    }
  });
}

function touchStarted() {
  if (touches.length > 0) {
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    filteredPosts.forEach(post => {
      let pos = post.body.position;
      if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
        if (!post.hoverStart) {
          post.hoverStart = millis();
        }
        post.touchStartX = pointerX;
        post.touchStartY = pointerY;
      }
    });
  }
}

function touchMoved() {
  if (touches.length > 0) {
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    filteredPosts.forEach(post => {
      if (post.touchStartX !== undefined && post.touchStartY !== undefined) {
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

function touchEnded() {
  let pointerX = (touches.length > 0) ? touches[0].x : mouseX;
  let pointerY = (touches.length > 0) ? touches[0].y : mouseY;
  filteredPosts.forEach(post => {
    if (post.activated && dist(pointerX, pointerY, post.body.position.x, post.body.position.y) < post.radius) {
      window.location.href = post.url;
    }
    post.hoverStart = null;
    post.touchStartX = undefined;
    post.touchStartY = undefined;
    post.activated = false;
  });
}

function createCategoryCheckboxes() {
  let container = createDiv().id('categorias').parent('p5');
  Object.keys(categoryFilter).forEach(cat => {
    let label = createCheckbox(cat, true);
    label.changed(() => {
      categoryFilter[cat] = label.checked();
    });
    label.parent(container);
  });
}
