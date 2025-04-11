/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · zopaipa definitiva          │
   ╰────────────────────────────────────────────────────╯ */

   let pal = {};
   const minDiameter = 10;
   const maxDiameter = 100;
   const MAX_LINKS = 3;
   const hoverThreshold = 1000;
   const fadeDuration = 500;
   
   let activeElements = [];
   let inactiveElements = [];
   let categoryFilter = {};
   let cnv, engine, world;
   let boundaries = [];
   let tooltips = {};
   let links = [];
   let imgFallbacks = [];
   let loadedCount = 0;
   let totalToLoad = 0;
   
   const Engine = Matter.Engine,
         World = Matter.World,
         Bodies = Matter.Bodies,
         Constraint = Matter.Constraint;
   
   let pinturaFilenames = [
     "01.png", "02.jpg", "03.jpg", "04.jpg", "05.png",
     "06.png", "07.png", "08.png", "09.png", "10.jpg",
     "12.jpg", "11.jpg", "13.jpg", "14.jpg", "15.jpg",
     "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg"
   ];
   
   let pinturaImages = [];
   let imagenesCargadas = 0;
   let postsData = [];
   
   function preload() {
     loadJSON("/feed.json",
       (data) => {
         postsData = data;
         postsData.forEach(post => {
           if (!Array.isArray(post.categorias)) post.categorias = [];
           if (typeof post.largo !== 'number' || isNaN(post.largo)) post.largo = 1000;
         });
       },
       (err) => console.error("Error cargando feed.json:", err)
     );
   
     pinturaFilenames.forEach((name) => {
       let path = `/assets/pintura/${name}`;
       loadImage(
         path,
         (loaded) => {
           pinturaImages.push(loaded);
           imagenesCargadas++;
           let loadingEl = select("#p5_loading");
           if (loadingEl) loadingEl.html(`${imagenesCargadas}/${pinturaFilenames.length}`);
         },
         (err) => console.warn("No se pudo cargar:", path)
       );
     });
   }
   
   function setup() {
     pal = {
       activeColor: color(166, 10, 10),
       hoverColor: color(255, 126, 0),
       fadeColor: color(80, 0, 0),
       defaultColor: color(230),
     };
   
     let p5Div = select("#p5");
     if (!p5Div) return;
     let w = p5Div.width;
     let h = constrain(w, 400, windowHeight * 0.8);
   
     cnv = createCanvas(w, h);
     cnv.parent("p5");
     textFont("Barlow");
   
     engine = Engine.create();
     world = engine.world;
     world.gravity.y = 0;
   
     let canvasmouse = Matter.Mouse.create(cnv.elt);
     canvasmouse.pixelRatio = pixelDensity();
     let mConstraint = Matter.MouseConstraint.create(engine, {
       mouse: canvasmouse,
       constraint: { stiffness: 0.2, render: { visible: false } }
     });
     World.add(world, mConstraint);
   
     createCategoryCheckboxes();
     updateBoundaries();
   
     let largos = postsData.map(p => p.largo);
     let minLen = Math.min(...largos);
     let maxLen = Math.max(...largos);
   
     postsData.forEach(post => {
       let r = map(post.largo, minLen, maxLen, minDiameter / 2, maxDiameter / 2);
       r = constrain(r, minDiameter / 2, maxDiameter / 2);
   
       let x = random(r, width - r);
       let y = random(r, height - r);
       let body = Bodies.circle(x, y, r, {
         restitution: 0.8, friction: 0.01, frictionAir: 0.02, density: 0.01
       });
   
       let tooltip = createDiv(post.titulo);
       tooltip.parent("p5");
       tooltip.addClass("tooltip");
       tooltip.hide();
   
       let useLocal = post.imagen && post.imagen.startsWith("/");
       let img = useLocal ? loadImage(post.imagen) : random(pinturaImages);
   
       post._img = img;
   
       let e = {
         post,
         body,
         tooltip,
         radius: r,
         hoverStart: null,
         activated: false
       };
   
       activeElements.push(e);
       World.add(world, body);
     });
   
     createLinks();
     Matter.Runner.run(engine);
   }
   
   function draw() {
     clear();
     Engine.update(engine);
     let now = millis();
   
     stroke(0, 204, 255, 60);
     strokeWeight(1);
     links.forEach(link => {
       if (link.bodyA && link.bodyB) {
         line(link.bodyA.position.x, link.bodyA.position.y, link.bodyB.position.x, link.bodyB.position.y);
       }
     });
   
     activeElements.forEach(e => {
       let { body, radius, post, tooltip } = e;
       let pos = body.position;
       let over = dist(mouseX, mouseY, pos.x, pos.y) < radius;
   
       if (over) {
         tooltip.style("display", "block");
         tooltip.position(pos.x, pos.y - radius * 0.3);
         if (!e.activated && e.hoverStart && now - e.hoverStart >= hoverThreshold) e.activated = true;
         if (!e.hoverStart) e.hoverStart = now;
       } else {
         e.hoverStart = null;
         e.activated = false;
         tooltip.hide();
       }
   
       push();
       translate(pos.x, pos.y);
       imageMode(CENTER);
       if (over) {
         noFill();
         stroke(pal.hoverColor);
         strokeWeight(2);
         circle(0, 0, radius * 2);
       }
       let zoom = e.activated ? 1.2 : 1.0;
       if (post._img) image(post._img, 0, 0, radius * 2 * zoom, radius * 2 * zoom);
       pop();
     });
   }
   
   function createLinks() {
     links = [];
     activeElements.forEach((a, i) => {
       for (let j = i + 1; j < activeElements.length; j++) {
         let b = activeElements[j];
         if (a !== b && links.length < MAX_LINKS * activeElements.length) {
           links.push(Constraint.create({
             bodyA: a.body,
             bodyB: b.body,
             length: 60,
             stiffness: 0.0001,
             damping: 0.01
           }));
         }
       }
     });
     links.forEach(l => World.add(world, l));
   }
   
   function mousePressed() {
     activeElements.forEach(e => {
       let pos = e.body.position;
       if (e.activated && dist(mouseX, mouseY, pos.x, pos.y) < e.radius) {
         if (e.post.url) window.location.href = e.post.url;
       }
     });
     return false;
   }
   
   function touchStarted() {
     if (touches.length > 0) {
       let pointerX = touches[0].x;
       let pointerY = touches[0].y;
       activeElements.forEach(e => {
         let pos = e.body.position;
         if (dist(pointerX, pointerY, pos.x, pos.y) < e.radius) {
           if (!e.hoverStart) e.hoverStart = millis();
         }
       });
     }
   }
   
   function touchEnded() {
     activeElements.forEach(e => {
       let pos = e.body.position;
       if (e.activated && e.post.url) window.location.href = e.post.url;
       e.hoverStart = null;
       e.activated = false;
       e.tooltip.hide();
     });
   }
   
   function windowResized() {
     let w = document.getElementById("p5").offsetWidth;
     let h = constrain(w, 400, windowHeight * 0.8);
     resizeCanvas(w, h);
     updateBoundaries();
   }
   
   function updateBoundaries() {
     if (boundaries.length > 0) World.remove(world, boundaries);
     boundaries = [];
     let t = 50000;
     boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true }));
     boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true }));
     boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true }));
     boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true }));
     World.add(world, boundaries);
   }
   
   function createCategoryCheckboxes() {
     let containerId = "categorias";
     let existing = select('#' + containerId);
     if (existing) existing.remove();
     let container = createDiv().id(containerId).parent("p5");
     let allCats = new Set();
     postsData.forEach(p => p.categorias.forEach(c => allCats.add(c)));
     let sorted = [...allCats].sort();
     sorted.forEach(cat => {
       let div = createDiv().parent(container).style('display', 'inline-block');
       let label = createElement('label').parent(div);
       let checkbox = createElement('input');
       checkbox.attribute('type', 'checkbox');
       checkbox.attribute('id', 'check-' + cat);
       checkbox.attribute('checked', true);
       label.child(checkbox);
       let span = createSpan(' ' + cat).parent(label);
       categoryFilter[cat] = true;
       checkbox.elt.addEventListener('change', () => {
         categoryFilter[cat] = checkbox.elt.checked;
         updateActiveElements();
       });
     });
   }
   
   function updateActiveElements() {
    const newlyActive = [];
    const newlyInactive = [];
    const allElements = [...activeElements, ...inactiveElements];
  
    allElements.forEach(e => {
      e.links?.forEach(link => World.remove(world, link));
      World.remove(world, e.body);
      e.links = [];
      if (e.tooltip) e.tooltip.hide();
    });
  
    allElements.forEach(e => {
      const isActive = e.post.categorias.some(cat => categoryFilter[cat]);
      if (isActive) {
        newlyActive.push(e);
        World.add(world, e.body);
      } else {
        newlyInactive.push(e);
      }
    });
  
    activeElements = newlyActive;
    inactiveElements = newlyInactive;
    createLinks();
  }
  