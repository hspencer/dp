let postsData = [];
let filteredPosts = [];
let categoryFilter = {};
let cnv;

// Matter.js aliases
const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;

let engine;
let world;
let boundaries = [];

const hoverThreshold = 1000; // ms para activar un post
const fadeDuration = 1500;   // ms para animación de hover

function preload() {
  // Cargar JSON de posts
  loadJSON('/feed.json', (data) => {
    postsData = data;
  }, (err) => {
    console.error("Error cargando feed.json:", err);
  });
}

function setup() {
  // Verificar que los datos son válidos
  if (!Array.isArray(postsData)) {
    console.error("postsData no es un array");
    noLoop();
    return;
  }

  // Crear canvas cuadrado del ancho del contenedor #p5
  let w = document.getElementById('p5').offsetWidth;
  cnv = createCanvas(w, w);
  cnv.parent('p5');
  cnv.elt.style.touchAction = "auto";
  textFont('Barlow');

  // Inicializar motor físico sin gravedad vertical
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;

  // Habilitar interacción con mouse
  let canvasmouse = Matter.Mouse.create(cnv.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let mConstraint = Matter.MouseConstraint.create(engine, { mouse: canvasmouse });
  World.add(world, mConstraint);

  // Recopilar todas las categorías y activar checkboxes
  postsData.forEach(post => {
    (post.categorias || []).forEach(cat => {
      categoryFilter[cat] = true;
    });
  });
  createCategoryCheckboxes();

  // Calcular mínimos y máximos para escalar tamaños
  let largos = postsData.map(p => p.largo || 1000);
  let minLen = Math.min(...largos);
  let maxLen = Math.max(...largos);

  // Crear límites estáticos del canvas (paredes)
  let t = 50;
  boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true }));
  boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true }));
  World.add(world, boundaries);

  // Crear cuerpos para cada post
  postsData.forEach((post, index) => {
    let angle = map(index, 0, postsData.length, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;

    // Radio fijo si es "code", si no se escala según largo
    let isCode = post.categorias.includes('code');
    post.radius = isCode ? 5 : map(post.largo || 1000, minLen, maxLen, 15, 30);

    // Crear cuerpo físico circular
    post.body = Bodies.circle(x, y, post.radius, {
      restitution: 0.9,
      friction: 0,
      frictionAir: 0.05
    });

    // Inicializar estado de interacción
    post.hoverStart = null;
    post.activated = false;
    post.touchStartX = undefined;
    post.touchStartY = undefined;

    // Añadir cuerpo al mundo físico
    World.add(world, post.body);

    // Velocidad inicial aleatoria
    Matter.Body.setVelocity(post.body, { x: random(-3, 3), y: random(-3, 3) });
  });

  filteredPosts = postsData; // Al inicio, mostrar todos
}

function draw() {
  clear();
  Engine.update(engine);
  let now = millis();

  // Usar posición táctil o del mouse
  let pointerX = touches.length > 0 ? touches[0].x : mouseX;
  let pointerY = touches.length > 0 ? touches[0].y : mouseY;

  // Aplicar filtro de categorías
  filteredPosts = postsData.filter(p => p.categorias.some(cat => categoryFilter[cat]));

  filteredPosts.forEach(post => {
    let pos = post.body.position;
    let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < post.radius;

    // Control de hover/activación
    if (isHovering && !post.activated) {
      if (!post.hoverStart) post.hoverStart = now;
      if (now - post.hoverStart >= hoverThreshold) post.activated = true;
    } else if (!isHovering) {
      post.hoverStart = null;
      post.activated = false;
    }

    // Estilo visual según categoría
    let baseColor = color(200); // gris por defecto
    if (post.categorias.includes('code')) {
      baseColor = color(255, 255, 255, 127); // rojo 50%
    } else if (post.categorias.includes('escuela')) {
      baseColor = color(43, 128, 48, 190); // verde limón 50%
    } else if (post.categorias.includes('ideas')) {
      baseColor = color(100, 200, 255, 255); // celeste 50%
    }

    // Relleno y trazo según estado
    if (post.activated) {
      fill(204, 0, 0); // rojo completo
      noStroke();
    } else if (post.hoverStart) {
      let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1);
      let g = lerp(200, 0, pct);
      fill(g);
      noStroke();
    } else {
      fill(baseColor);
      if (post.categorias.includes('code')) {
        stroke(204, 0, 0);
        strokeWeight(1.5);
      } else {
        noStroke();
      }
    }

    // Dibujo del círculo (diámetro = radio × 2)
    ellipse(pos.x, pos.y, post.radius * 2);
  });

  // Mostrar títulos al acercar
  filteredPosts.forEach(post => {
    let pos = post.body.position;
    if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(post.titulo.toUpperCase(), pos.x, pos.y - post.radius - 5);
    }
  });
}

// Redirección por click
function mousePressed() {
  filteredPosts.forEach(post => {
    let pos = post.body.position;
    if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      window.location.href = post.url;
    }
  });
}

// Soporte para interacción táctil
function touchStarted() {
  if (touches.length > 0) {
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    filteredPosts.forEach(post => {
      let pos = post.body.position;
      if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
        if (!post.hoverStart) post.hoverStart = millis();
        post.touchStartX = pointerX;
        post.touchStartY = pointerY;
      }
    });
  }
}

// Cancelar si hay movimiento táctil
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

// Activar al soltar el toque
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

// Crear checkboxes por categoría
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
