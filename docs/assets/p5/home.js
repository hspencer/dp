let postsData = posts;
let cnv;
const baseurl = "";

const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

let engine;
let world;
let boundaries = [];

const nodeRadius = 20;
const hoverThreshold = 1000;
const fadeDuration = 1500;

function stopTouchScrolling(canvas){
  // Prevenir el scroll cuando se toca el canvas
  document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
          e.preventDefault();
      }
  }, { passive: false });
  document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
          e.preventDefault();
      }
  }, { passive: false });
  document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
          e.preventDefault();
      }
  }, { passive: false });
}

function setup() {
  let h = document.getElementById('last-posts').offsetHeight - 100;
  cnv = createCanvas(document.getElementById('p5').offsetWidth, h);
  cnv.parent('p5');
  stopTouchScrolling(document.getElementById('p5'));
  textFont('Barlow');

  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;

  let canvasmouse = Matter.Mouse.create(cnv.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let mConstraint = Matter.MouseConstraint.create(engine, { mouse: canvasmouse });
  World.add(world, mConstraint);

  let lengths = postsData.map(post => post.length || 1000);
  let minLen = Math.min(...lengths);
  let maxLen = Math.max(...lengths);

  let thickness = 50;
  boundaries.push(Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }));
  boundaries.push(Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }));
  World.add(world, boundaries);

  postsData.forEach((post, index) => {
    let angle = map(index, 0, postsData.length, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;
    post.radius = map(post.length || 1000, minLen, maxLen, 15, 30);
    post.body = Bodies.circle(x, y, post.radius, {
      restitution: 0.9,
      friction: 0,
      frictionAir: 0.05
    });
    post.hoverStart = null;
    post.activated = false;
    World.add(world, post.body);
    Matter.Body.setVelocity(post.body, { x: random(-3, 3), y: random(-3, 3) });
  });
}

function draw() {
  clear();
  Engine.update(engine);
  let now = millis();

  postsData.forEach(post => {
    let pos = post.body.position;
    let hovering = dist(mouseX, mouseY, pos.x, pos.y) < post.radius;

    if (hovering && !post.activated) {
      if (!post.hoverStart) post.hoverStart = now;
      let elapsed = now - post.hoverStart;
      if (elapsed >= hoverThreshold) post.activated = true;
    } else if (!hovering) {
      post.hoverStart = null;
      post.activated = false;
    }

    let c;
    if (post.activated) {
      c = color('#C00');
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

  postsData.forEach(post => {
    let pos = post.body.position;
    if (dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(post.title.toUpperCase(), pos.x, pos.y - post.radius - 5);
    }
  });
}

function mousePressed() {
  postsData.forEach(post => {
    let pos = post.body.position;
    if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
      window.location.href = baseurl + post.url;
    }
  });
}