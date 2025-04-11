/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · desde 2003 living standard  │
   ╰────────────────────────────────────────────────────╯ */

   let pal = {};

   const minDiameter = 10;
   const maxDiameter = 100;
   const MAX_LINKS = 3;
   const hoverThreshold = 1000;
   const fadeDuration = 500;
   
   let postsData = [];
   let activeElements = [];
   let inactiveElements = [];
   let categoryFilter = {};
   let cnv;
   let engine, world;
   let boundaries = [];
   let tooltips = {};
   let links = [];


   // links
   const currentStiffness = 0.00001;
   const linkLength = 50;
   const dampingValue = 0.01;


   const Engine = Matter.Engine,
         World = Matter.World,
         Bodies = Matter.Bodies,
         Constraint = Matter.Constraint;
   
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
   }
   
   function setup() {
     pal = {
       activeColor: color(166, 10, 10),
       codeColor: color(150, 177, 150),
       codeOutline: color(90, 106, 90),
       escuelaColor: color(94, 137, 179, 180),
       ideaColor: color(255, 126, 0, 200),
       imageColor: color(120, 120, 120, 200),
       noteColor: color(255, 244, 152, 200),
       hoverColor: color(0),
     };
   
     if (!Array.isArray(postsData) || postsData.length === 0) {
       createCanvas(windowWidth, 200);
       fill(0);
       textAlign(CENTER, CENTER);
       text("Cargando datos...", width / 2, height / 2);
       noLoop();
       return;
     }
   
     let w = document.getElementById("p5").offsetWidth;
     let minHeight = 400;
     let canvasHeight = constrain(w, minHeight, window.innerHeight * 0.8);
     cnv = createCanvas(w, canvasHeight);
     cnv.elt.addEventListener('wheel', function(e) {}, { passive: true });
     cnv.parent("p5");
     cnv.elt.style.touchAction = "auto";
     textFont("Barlow");
   
     engine = Engine.create();
     world = engine.world;
     engine.world.gravity.y = 0;
   
     let canvasmouse = Matter.Mouse.create(cnv.elt);
     canvasmouse.pixelRatio = pixelDensity();
     let mConstraint = Matter.MouseConstraint.create(engine, {
       mouse: canvasmouse,
       constraint: { stiffness: 0.2, render: { visible: false } }
     });
     World.add(world, mConstraint);
   
     postsData.forEach(post => {
       post.categorias.forEach(cat => {
         if (cat && typeof cat === 'string') categoryFilter[cat.trim()] = true;
       });
     });
     createCategoryCheckboxes();
   
     let largos = postsData.map(p => p.largo).filter(l => typeof l === 'number' && !isNaN(l));
     let minLen = largos.length > 0 ? Math.min(...largos) : 1000;
     let maxLen = largos.length > 0 ? Math.max(...largos) : 1000;
     if (minLen === maxLen) maxLen += 1;
   
     updateBoundaries();
   
     postsData.forEach((post, index) => {
       let isCode = post.categorias.includes("code");
       let radius = isCode ? 7 : map(post.largo, minLen, maxLen, minDiameter / 2, maxDiameter / 2);
       radius = constrain(radius, minDiameter / 2, maxDiameter / 2);
   
       let margin = radius + 10;
       margin = Math.min(margin, width / 2 - 1, height / 2 - 1);
       if (margin < radius) margin = radius;
       let x = random(margin, width - margin);
       let y = random(margin, height - margin);
   
       let body = Bodies.circle(x, y, radius, {
         restitution: 0.8, friction: 0.01, frictionAir: 0.02, density: 0.01
       });
   
       let tooltip = createDiv(post.titulo);
       tooltip.parent("p5");
       tooltip.addClass("tooltip");
       tooltip.hide();
   
       let element = {
         post,
         body,
         tooltip,
         node: new Node(post),
         links: [],
         radius,
         hoverStart: null,
         activated: false,
         touchStartX: undefined,
         touchStartY: undefined
       };
   
       if (post.categorias.some(cat => categoryFilter[cat])) {
         activeElements.push(element);
         World.add(world, body);
       } else {
         inactiveElements.push(element);
       }
     });
   
     createLinks();
     Engine.run(engine);
   }
   
   function createLinks() {
     links.forEach(link => World.remove(world, link));
     links = [];
   
     activeElements.forEach(e => e.node.links = []);
   
     activeElements.forEach(elemA => {
       let nodeA = elemA.node;
       let bodyA = elemA.body;
       let candidates = activeElements.filter(elemB => {
         if (elemA === elemB) return false;
         let nodeB = elemB.node;
         let shareTag = elemA.post.categorias.some(cat => elemB.post.categorias.includes(cat));
         let notLinked = !nodeB.hasLinkTo(nodeA);
         return shareTag && notLinked;
       });
   
       candidates.sort((a, b) => a.node.links.length - b.node.links.length);
   
       while (nodeA.links.length < MAX_LINKS && candidates.length > 0) {
         let elemB = candidates.shift();
         let nodeB = elemB.node;
         if (nodeB.links.length < MAX_LINKS) {
           nodeA.addLink(nodeB);
           nodeB.addLink(nodeA);
           let spring = Constraint.create({
             bodyA: bodyA,
             bodyB: elemB.body,
             length: linkLength,
             stiffness: currentStiffness,
             damping: dampingValue,
             render: { visible: false }
           });
           elemA.links.push(spring);
           elemB.links.push(spring);
           links.push(spring);
           World.add(world, spring);
         }
       }
     });
   }
   
   function draw() {
    background(255, 152, 142, 26);
    Engine.update(engine);
    let now = millis();
  
    let pointerX = touches.length > 0 ? touches[0].x : mouseX;
    let pointerY = touches.length > 0 ? touches[0].y : mouseY;
  
    // draw links
    blendMode(SOFT_LIGHT);
    links.forEach(link => {
      if (!link.bodyA || !link.bodyB) return;
      let aActive = activeElements.some(e => e.body.id === link.bodyA.id);
      let bActive = activeElements.some(e => e.body.id === link.bodyB.id);
      if (aActive && bActive) {
        
        let dim = constrain(link.bodyA.mass + link.bodyB.mass, 0, 25);
        stroke(0, 204, 255, 30 - dim);
        strokeWeight(link.bodyA.mass + link.bodyB.mass);
        line(link.bodyA.position.x, link.bodyA.position.y, link.bodyB.position.x, link.bodyB.position.y);
       
      }
    });
    blendMode(BLEND);

    
    // draw tooltips
    activeElements.forEach(element => {
      let { body, radius, post, tooltip } = element;
      let pos = body.position;
      let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < radius;
      let showTooltip = false;
  
      if (isHovering) {
        tooltip.style("display", "block");
        tooltip.position(pos.x, pos.y - (radius * 0.3));
        showTooltip = true;
        if (!element.activated) {
          if (!element.hoverStart) element.hoverStart = now;
          else if (now - element.hoverStart >= hoverThreshold) element.activated = true;
        }
      } else {
        if (element.activated || element.hoverStart) {
          element.hoverStart = null;
          element.activated = false;
        }
      }
  
      push();
      translate(pos.x, pos.y);
  
      if (element.activated) {
        fill(pal.activeColor);
        noStroke();
      } else if (element.hoverStart) {
        let pct = constrain((now - element.hoverStart) / fadeDuration, 0, 1);
        let baseColor = post.categorias.includes("code") ? pal.codeColor :
                        post.categorias.includes("escuela") ? pal.escuelaColor :
                        post.categorias.includes("ideas") ? pal.ideaColor :
                        pal.noteColor;
        let hoverFill = lerpColor(baseColor, pal.hoverColor, pct);
        fill(hoverFill);
        if (post.categorias.includes("code")) {
          stroke(pal.codeOutline);
          strokeWeight(1.5);
        } else {
          noStroke();
        }
      } else {
        if (post.categorias.includes("code")) {
          fill(pal.codeColor);
          stroke(pal.codeOutline);
        } else if (post.categorias.includes("escuela")) {
          fill(pal.escuelaColor);
          stroke(lerpColor(pal.escuelaColor, '#000', 0.3));
        } else if (post.categorias.includes("ideas")) {
          fill(pal.ideaColor);
          stroke(lerpColor(pal.ideaColor, '#000', 0.3));
        } else {
          fill(pal.noteColor);
          stroke(lerpColor(pal.noteColor, '#000', 0.3));
        }
        strokeWeight(1.5);
      }
  
      ellipse(0, 0, radius * 2);
      pop();
  
      if (!showTooltip) tooltip.style("display", "none");
    });
  }
  
  function mousePressed() {
    activeElements.forEach(element => {
      let pos = element.body.position;
      if (element.activated && dist(mouseX, mouseY, pos.x, pos.y) < element.radius) {
        if (element.post.url) window.location.href = element.post.url;
      }
    });
    return false;
  }
  
  function touchStarted() {
    if (touches.length > 0) {
      let pointerX = touches[0].x;
      let pointerY = touches[0].y;
      activeElements.forEach(element => {
        let pos = element.body.position;
        if (dist(pointerX, pointerY, pos.x, pos.y) < element.radius) {
          if (!element.hoverStart) element.hoverStart = millis();
          element.touchStartX = pointerX;
          element.touchStartY = pointerY;
        }
      });
    }
  }
  
  function touchMoved() {
    if (touches.length === 0) return true;
    let pointerX = touches[0].x;
    let pointerY = touches[0].y;
    let isOverNode = false;
    activeElements.forEach(element => {
      let pos = element.body.position;
      if (dist(pointerX, pointerY, pos.x, pos.y) < element.radius) {
        isOverNode = true;
        if (element.touchStartX !== undefined &&
            element.touchStartY !== undefined &&
            dist(pointerX, pointerY, element.touchStartX, element.touchStartY) > 10) {
          element.hoverStart = null;
          element.activated = false;
        }
      }
    });
    return isOverNode ? false : true;
  }
  
  function touchEnded() {
    activeElements.forEach(element => {
      let pos = element.body.position;
      if (element.activated && element.touchStartX !== undefined) {
        if (element.post.url) window.location.href = element.post.url;
      }
      element.hoverStart = null;
      element.activated = false;
      element.touchStartX = undefined;
      element.touchStartY = undefined;
      if (element.tooltip) element.tooltip.style('display', 'none');
    });
  }

  function windowResized() {
    let w = document.getElementById("p5").offsetWidth;
    let minHeight = 400;
    let canvasHeight = constrain(w, minHeight, window.innerHeight * 0.8);
  
    resizeCanvas(w, canvasHeight);
    updateBoundaries();
  
    activeElements.forEach(element => {
      let buffer = 50;
      let pos = element.body.position;
      if (pos.x < buffer) Matter.Body.applyForce(element.body, pos, { x: 0.005 * element.body.mass, y: 0 });
      if (pos.x > width - buffer) Matter.Body.applyForce(element.body, pos, { x: -0.005 * element.body.mass, y: 0 });
      if (pos.y < buffer) Matter.Body.applyForce(element.body, pos, { y: 0.005 * element.body.mass, x: 0 });
      if (pos.y > height - buffer) Matter.Body.applyForce(element.body, pos, { y: -0.005 * element.body.mass, x: 0 });
    });
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

  function updateActiveElements() {
    let allElements = [...activeElements, ...inactiveElements];
  
    allElements.forEach(e => {
      e.links.forEach(link => World.remove(world, link));
      World.remove(world, e.body);
      e.links = [];
    });
  
    activeElements = [];
    inactiveElements = [];
    links = [];
  
    allElements.forEach(e => {
      let isActive = e.post.categorias.some(cat => categoryFilter[cat]);
      if (isActive) {
        activeElements.push(e);
        World.add(world, e.body);
      } else {
        inactiveElements.push(e);
      }
    });
  
    createLinks();
  }
  
  function createCategoryCheckboxes() {
    let containerId = "categorias";
    let existing = select('#' + containerId);
    if (existing) existing.remove();
    let container = createDiv().id(containerId).parent("p5");
    let sorted = Object.keys(categoryFilter).sort();
    sorted.forEach(cat => {
      let div = createDiv().parent(container).style('display', 'inline-block');
      let label = createElement('label').parent(div);
      let checkbox = createElement('input');
      checkbox.attribute('type', 'checkbox');
      checkbox.attribute('id', 'check-' + cat);
      checkbox.attribute('checked', true);
      label.child(checkbox);
      let span = createSpan(' ' + cat).parent(label);
      checkbox.elt.addEventListener('change', () => {
        categoryFilter[cat] = checkbox.elt.checked;
        updateActiveElements();
      });
    });
  }
  
  class Node {
    constructor(post) {
      this.post = post;
      this.links = [];
    }
  
    hasLinkTo(otherNode) {
      return this.links.includes(otherNode);
    }
  
    addLink(otherNode) {
      if (this.links.length < MAX_LINKS && !this.hasLinkTo(otherNode)) {
        this.links.push(otherNode);
      }
    }
  }