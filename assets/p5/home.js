/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · desde 2003 living standard  │
   ╰────────────────────────────────────────────────────╯ */

   let pal = {}; // 🧠 será inicializado dentro de setup()

   const minDiameter = 30;
   const maxDiameter = 60;
   
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
     // 👇 Se carga con callback; no se necesita async/await
     loadJSON('/feed.json', (data) => {
       postsData = data;
       filteredPosts = postsData; // inicialización básica
     }, (err) => {
       console.error("Error cargando feed.json:", err);
     });
   }
   
   function setup() {
     // 💡 Inicializar colores ahora que p5.js está listo
     pal = {
       rojo: color(146, 42, 33),
       rojo50: color(204, 0, 0, 127),
       verdeEscuela50: color(0, 130, 0, 127),
       celesteIdea50: color(0, 186, 255, 180),
       azulImagen50: color(17, 53, 157, 200),
       grisNota50: color(212, 218, 185, 127),
     };
   
     // ⛔️ Chequeo defensivo si `postsData` no se cargó
     if (!Array.isArray(postsData) || postsData.length === 0) {
       console.warn("postsData no está listo o está vacío");
       noLoop();
       return;
     }
   
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
   
     postsData.forEach(post => {
       (post.categorias || []).forEach(cat => {
         categoryFilter[cat] = true;
       });
     });
     createCategoryCheckboxes();
   
     let largos = postsData.map(p => p.largo || 1000);
     let minLen = Math.min(...largos);
     let maxLen = Math.max(...largos);
   
     let t = 50;
     boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true }));
     boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true }));
     boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true }));
     boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true }));
     World.add(world, boundaries);
   
     postsData.forEach((post, index) => {
       let angle = map(index, 0, postsData.length, 0, TWO_PI);
       let x = width / 2 + cos(angle) * 200;
       let y = height / 2 + sin(angle) * 200;
   
       let isCode = post.categorias.includes('code');
       post.radius = isCode
         ? 20
         : map(post.largo || 1000, minLen, maxLen, minDiameter / 2, maxDiameter / 2);
   
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
   
     filteredPosts = postsData;
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
   
       if (post.activated) {
         fill(pal.rojo);
         noStroke();
       } else if (post.hoverStart) {
         let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1);
         let g = lerp(200, 0, pct);
         fill(g);
         noStroke();
       } else {
         if (post.categorias.includes('code')) {
           fill(pal.rojo50);
           stroke(pal.rojo);
           strokeWeight(1.5);
         } else if (post.categorias.includes('escuela')) {
           fill(pal.verdeEscuela50);
           noStroke();
         } else if (post.categorias.includes('ideas')) {
           fill(pal.celesteIdea50);
           noStroke();
         } else {
           fill(pal.grisNota50);
           noStroke();
         }
       }
   
       ellipse(pos.x, pos.y, post.radius * 2);
     });
   
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
     if (!filteredPosts) return;
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
           if (!post.hoverStart) post.hoverStart = millis();
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
   