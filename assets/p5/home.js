/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · desde 2003 living standard  │
   ╰────────────────────────────────────────────────────╯ */

   let pal = {};

   const minDiameter = 10;
   const maxDiameter = 100;

      // Definir variable global para el máximo de enlaces por nodo
   const MAX_LINKS = 5;
   
   let postsData = [];
   let filteredPosts = [];
   let categoryFilter = {};
   let cnv;
   
   const Engine = Matter.Engine,
       World = Matter.World,
       Bodies = Matter.Bodies,
       Constraint = Matter.Constraint;
   
   let engine;
   let world;
   let boundaries = [];
   let tooltips = {};
   
   const hoverThreshold = 1000; // Time in ms to activate (for color change/click)
   const fadeDuration = 500; // Duration of hover fade-in effect (adjust as needed)
   let links = [];
   
   function preload() {
       loadJSON(
           "/feed.json",
           (data) => {
               postsData = data;
               // Ensure 'categorias' is always an array
               postsData.forEach(post => {
                   if (!Array.isArray(post.categorias)) {
                       post.categorias = []; // Default to empty array if missing or not an array
                   }
                   // Ensure 'largo' exists and is a number, provide default if not
                    if (typeof post.largo !== 'number' || isNaN(post.largo)) {
                        console.warn(`Post "${post.titulo}" missing or invalid 'largo'. Defaulting to 1000.`);
                        post.largo = 1000;
                    }
               });
               filteredPosts = postsData;
           },
           (err) => {
               console.error("Error cargando feed.json:", err);
           }
       );
   }
   
   function setup() {
       // Inicializar colores ahora que p5.js está listo
       pal = {
           activeColor: color(166, 10, 10),
           codeColor: color(150, 177, 150),
           codeOutline: color(90, 106, 90),
           escuelaColor: color(94, 137, 179, 180),
           ideaColor: color(255, 126, 0, 200),
           imageColor: color(120, 120, 120, 200), // Image color defined but not used in drawing logic yet
           noteColor: color(255, 244, 152, 200),
           hoverColor: color(0), // Negro para hover
       };
   
       // Chequeo defensivo si `postsData` no se cargó o está vacío
       if (!Array.isArray(postsData) || postsData.length === 0) {
           console.warn("postsData no está listo o está vacío. Esperando...");
           // Podríamos intentar recargar o simplemente mostrar un mensaje
           createCanvas(windowWidth, 200); // Crear un canvas pequeño para mensaje
           background(200);
           fill(0);
           textAlign(CENTER, CENTER);
           text("Cargando datos o datos no disponibles...", width/2, height/2);
           noLoop(); // Detener draw()
           return;
       }
   
       // --- Proceder con setup normal si hay datos ---
       let w = document.getElementById("p5").offsetWidth;
       let windowHeightPercentage = window.innerHeight * 0.75;
       windowHeightPercentage = constrain(windowHeightPercentage, w*1.2, window.innerHeight);
       let canvasHeight = Math.max(w, windowHeightPercentage); // Usar el mayor entre ancho y 75% alto ventana
       cnv = createCanvas(w, canvasHeight);
       cnv.elt.addEventListener('wheel', function(e) {
        // No se llama a e.preventDefault(), lo que permite la acción predeterminada del navegador
      }, { passive: true });
       cnv.parent("p5");
       cnv.elt.style.touchAction = "auto"; // Allow default touch actions like scrolling/zooming on canvas element
       textFont("Barlow");
   
       engine = Engine.create();
       world = engine.world;
       engine.world.gravity.y = 0; // No gravity
   
       // Setup mouse interaction with Matter.js
       let canvasmouse = Matter.Mouse.create(cnv.elt);
       canvasmouse.pixelRatio = pixelDensity(); // Important for high-density displays
       let mConstraint = Matter.MouseConstraint.create(engine, {
           mouse: canvasmouse,
           constraint: {
               stiffness: 0.2, // Adjust how stiff the mouse constraint is
               render: {
                   visible: false // Don't draw the mouse constraint visualization
               }
           }
       });
       World.add(world, mConstraint);
   
       // Populate categoryFilter based on loaded data
       postsData.forEach((post) => {
           (post.categorias || []).forEach((cat) => {
               if (cat && typeof cat === 'string') { // Ensure category is a non-empty string
                    categoryFilter[cat.trim()] = true; // Trim whitespace
               }
           });
       });
       createCategoryCheckboxes(); // Create checkboxes based on found categories
   
       // Calculate min/max length for mapping radius (filter out non-numbers first)
       let largos = postsData.map((p) => p.largo).filter(l => typeof l === 'number' && !isNaN(l));
       let minLen = largos.length > 0 ? Math.min(...largos) : 1000; // Default min if no valid lengths
       let maxLen = largos.length > 0 ? Math.max(...largos) : 1000; // Default max if no valid lengths
       if (minLen === maxLen) maxLen += 1; // Avoid division by zero if all posts have same length
   
       // Create static boundaries for the world
       let t = 50; // Thickness of boundaries
       boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true })); // Bottom
       boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true }));    // Top
       boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true }));  // Left
       boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true })); // Right
       World.add(world, boundaries);
   
       // Create Matter.js bodies for each post
       postsData.forEach((post, index) => {
           // Initial position in a circle
           let angle = map(index, 0, postsData.length, 0, TWO_PI);
           let radiusFromCenter = Math.min(width, height) * 0.3; // Adjust starting radius
           let x = width / 2 + cos(angle) * radiusFromCenter;
           let y = height / 2 + sin(angle) * radiusFromCenter;
   
           // Determine radius based on category or length
           let isCode = post.categorias.includes("code");
           post.radius = isCode
               ? 7 // Fixed small radius for 'code' category
               : map(
                   post.largo, // Use validated largo
                   minLen,
                   maxLen,
                   minDiameter / 2,
                   maxDiameter / 2
                 );
           // Ensure radius is within bounds
           post.radius = constrain(post.radius, minDiameter / 2, maxDiameter / 2);
   
           // Create the Matter body
           post.body = Bodies.circle(x, y, post.radius, {
               restitution: 0.8, // Bounciness
               friction: 0.01,    // Low friction
               frictionAir: 0.02, // Some air drag
               density: 0.01     // Affects mass
           });
   
           // Initialize interaction properties
           post.hoverStart = null;
           post.activated = false;
           post.touchStartX = undefined;
           post.touchStartY = undefined;
   
           World.add(world, post.body); // Add body to the Matter world
           // Give bodies a small initial random velocity
           Matter.Body.setVelocity(post.body, { x: random(-1, 1), y: random(-1, 1) });
   
           // --- Create and STYLE HTML tooltips ---
           tooltips[post.body.id] = createDiv(post.titulo.toUpperCase());
           tooltips[post.body.id].parent("p5"); // Attach to the p5 container div
           tooltips[post.body.id].style("position", "absolute");
           tooltips[post.body.id].style("display", "none"); // Hidden initially
           tooltips[post.body.id].style("pointer-events", "none"); // Prevent interference with mouse/touch
           tooltips[post.body.id].style("z-index", "10"); // Ensure it's above canvas elements
   
           // Required design styles:
           tooltips[post.body.id].style("background-color", "rgba(255, 255, 255, 0.85)"); // White, slightly more opaque
           tooltips[post.body.id].style("color", "#333"); // Darker gray text for better contrast
           tooltips[post.body.id].style("font-family", "'Barlow', sans-serif"); // Barlow font
           tooltips[post.body.id].style("font-size", "11px"); // Slightly smaller font size
           tooltips[post.body.id].style("text-align", "center"); // Centered text
           tooltips[post.body.id].style("text-transform", "uppercase"); // Uppercase text
           tooltips[post.body.id].style("padding", "4px 8px"); // Padding
           tooltips[post.body.id].style("border-radius", "3px"); // Slightly smaller radius
           tooltips[post.body.id].style("white-space", "nowrap"); // Prevent text wrapping
           tooltips[post.body.id].style("box-shadow", "0 1px 3px rgba(0,0,0,0.1)"); // Subtle shadow
   
           // CSS Transform for positioning (centering above the anchor point)
           tooltips[post.body.id].style("transform", "translateX(-50%) translateY(-100%)");
           // --- End tooltip creation ---
       });
   
       filteredPosts = postsData; // Initialize filtered list
       initializeNodes();
       createLinks(); // Create springs between related posts
   }
   
   // =========================================================================
   // Draw Function (MODIFIED for tooltip visibility and position)
   // =========================================================================
   function draw() {
       clear(); // Use clear() instead of background() for transparency if needed over HTML
       Engine.update(engine);
       let now = millis();
   
       // Determine pointer position (mouse or touch)
       let pointerX = touches.length > 0 ? touches[0].x : mouseX;
       let pointerY = touches.length > 0 ? touches[0].y : mouseY;
   
       // Update filteredPosts based on checkbox states
       filteredPosts = postsData.filter((p) =>
           p.body && p.categorias.some((cat) => categoryFilter[cat]) // Check body exists
       );
   
       // --- Draw Links (behind circles) ---
       blendMode(HARD_LIGHT)
       stroke(0, 204, 255, 28); // Semi-transparent black links
       strokeWeight(20);
       links.forEach((link) => {
           // Check if both bodies of the link exist and are in the filtered list
           const bodyA = link.bodyA;
           const bodyB = link.bodyB;
           const bodyAVisible = filteredPosts.some((p) => p.body.id === bodyA.id);
           const bodyBVisible = filteredPosts.some((p) => p.body.id === bodyB.id);
           if (bodyAVisible && bodyBVisible) {
               line(bodyA.position.x, bodyA.position.y, bodyB.position.x, bodyB.position.y);
           }
       });
       blendMode(BLEND)
       // --- Draw Circles and Handle Tooltips ---
       filteredPosts.forEach((post) => {
           if (!post.body) return; // Skip if body doesn't exist for some reason
   
           let pos = post.body.position;
           let angle = post.body.angle; // Get body angle for potential rotation later
           let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < post.radius;
           const tooltip = tooltips[post.body.id];
           let showTooltipThisFrame = false; // Flag to control tooltip visibility
   
           // --- State Logic and Tooltip Handling ---
           if (isHovering) {
               // --- Tooltip Visibility on Hover ---
               if (tooltip) {
                   tooltip.style("display", "block"); // Show immediately on hover
                   // Position closer: change -8 to -2 (or adjust as needed)
                   tooltip.position(pos.x, pos.y - (post.radius * .3)); // ADJUSTED POSITION
                   showTooltipThisFrame = true; // Mark to keep visible
               }
   
               // --- Activation Logic (for circle color change and click after delay) ---
               if (!post.activated) {
                   if (!post.hoverStart) {
                       post.hoverStart = now; // Start timer for activation state change
                   } else if (now - post.hoverStart >= hoverThreshold) {
                       post.activated = true; // Change state for color/click
                   }
               }
           } else {
               // Not hovering
               if (post.activated || post.hoverStart) {
                    // Deactivate if was active or in hover-start
                    post.hoverStart = null;
                    post.activated = false;
                    // Tooltip hiding handled by the flag below
               }
           }
   
           // --- Circle Drawing Logic ---
           push(); // Isolate transformations and styles
           translate(pos.x, pos.y); // Move origin to body position
           // rotate(angle); // Optional: rotate ellipse with body angle
   
           if (post.activated) {
               // Active state (red) - color changes after threshold
               fill(pal.activeColor);
               noStroke();
           } else if (post.hoverStart) { // Show fade effect as soon as hover starts
               // Hover fade-in state (before activation threshold)
               let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1);
               let baseColor;
               if (post.categorias.includes("code")) { baseColor = pal.codeColor; }
               else if (post.categorias.includes("escuela")) { baseColor = pal.escuelaColor; }
               else if (post.categorias.includes("ideas")) { baseColor = pal.ideaColor; }
               else { baseColor = pal.noteColor; }
               let hoverFill = lerpColor(baseColor, pal.hoverColor, pct);
               fill(hoverFill);
   
               if (post.categorias.includes("code")) {
                   stroke(pal.codeOutline);
                   strokeWeight(1.5);
               } else {
                   noStroke();
               }
           } else {
               // Normal state (color by category)
               if (post.categorias.includes("code")) {
                   fill(pal.codeColor);
                   stroke(pal.codeOutline);
                   strokeWeight(1.5);
               } else if (post.categorias.includes("escuela")) {
                   fill(pal.escuelaColor);
                   noStroke();
               } else if (post.categorias.includes("ideas")) {
                   fill(pal.ideaColor);
                   noStroke();
               } else { // Default to noteColor if no other specific category matches
                   fill(pal.noteColor);
                   noStroke();
               }
           }
   
           // Draw the ellipse at the translated origin (0,0)
           ellipse(0, 0, post.radius * 2);
   
           pop(); // Restore previous drawing state
   
           // --- Final Tooltip Visibility Control ---
           if (tooltip) { // Check again if tooltip exists
                if (!showTooltipThisFrame) { // Hide if not hovering
                    tooltip.style("display", "none");
                }
           }
       });
   }
   
   
//    // =========================================================================
//    // Link Creation Function
//    // =========================================================================
//    function createLinks() {
//        const linkLength = Math.min(width, height) * 0.3; // Dynamic link length based on canvas size
//        const stiffnessValue = 0.001; // Low stiffness for loose connection
//        const dampingValue = 0.05;    // Some damping to reduce oscillations
   
//        links = []; // Clear existing links if re-running
   
//        for (let i = 0; i < postsData.length; i++) {
//            for (let j = i + 1; j < postsData.length; j++) {
//                const post1 = postsData[i];
//                const post2 = postsData[j];
   
//                // Ensure both posts have bodies before creating link
//                if (!post1.body || !post2.body) continue;
   
//                // Create link if they share at least one category
//                if (post1.categorias.some((cat) => post2.categorias.includes(cat))) {
//                    const spring = Constraint.create({
//                        bodyA: post1.body,
//                        bodyB: post2.body,
//                        length: linkLength, // Desired resting length
//                        stiffness: stiffnessValue,
//                        damping: dampingValue, // Add damping
//                        render: { visible: false } // Don't let Matter draw the constraint
//                    });
//                    links.push(spring);
//                    World.add(world, spring);
//                }
//            }
//        }
//    }
   
   // =========================================================================
   // Interaction Functions (Mouse and Touch)
   // =========================================================================
   function mousePressed() {
       if (!filteredPosts || !postsData) return; // Guard clause
   
       // Check if click was on an activated post
       filteredPosts.forEach((post) => {
            if (!post.body) return;
            let pos = post.body.position;
            // Use post.activated flag which is set after hover threshold
           if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
               if (post.url) { // Check if URL exists
                   window.location.href = post.url; // Navigate
               } else {
                   console.log(`Clicked on activated post "${post.titulo}" with no URL.`);
               }
           }
       });
       return false; // Prevent default browser actions
   }
   
   function touchStarted() {
       if (!filteredPosts || !postsData) return;
   
       if (touches.length > 0) {
           let pointerX = touches[0].x;
           let pointerY = touches[0].y;
   
           // Check if touch started on a circle to potentially initiate hover timer
           postsData.forEach((post) => { // Check all posts, not just filtered, for initial touch
               if (!post.body) return;
               let pos = post.body.position;
               if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
                   // Start hover timer immediately on touch down within radius
                   if (!post.hoverStart) {
                       post.hoverStart = millis();
                   }
                   // Store touch start position to detect dragging
                   post.touchStartX = pointerX;
                   post.touchStartY = pointerY;
               }
           });
       }
        // We don't return false here usually, let Matter.js handle touch for dragging
   }
   
   function touchMoved() {
        if (!filteredPosts || !postsData) return;
   
        if (touches.length > 0) {
           let pointerX = touches[0].x;
           let pointerY = touches[0].y;
   
           // Check if touch moved significantly, cancel hover if so
           postsData.forEach((post) => {
                if (!post.body) return;
                // Check if this post had a touch start recorded
                if (post.touchStartX !== undefined && post.touchStartY !== undefined) {
                    // Calculate distance moved from start
                    if (dist(pointerX, pointerY, post.touchStartX, post.touchStartY) > 10) { // Drag threshold
                        // If dragged significantly, cancel hover/activation process
                        post.hoverStart = null;
                        post.activated = false;
                        // Reset touch start points as well? Maybe not, let Matter handle drag.
                        // But definitely stop activation sequence.
                    }
                }
           });
       }
       return false; // Prevent page scrolling while dragging on canvas
   }
   
   
   function touchEnded() {
       if (!filteredPosts || !postsData) return;
   
       // Use last known touch position or mouse position as fallback
       // Getting last position before touches array becomes empty can be tricky,
       // relying on mouseX/Y might be inaccurate on pure touch devices.
       // For simplicity, we might just check activation state.
       // let pointerX = (touches.length > 0) ? touches[0].x : (typeof pwinMouseX !== 'undefined' ? pwinMouseX : mouseX);
       // let pointerY = (touches.length > 0) ? touches[0].y : (typeof pwinMouseY !== 'undefined' ? pwinMouseY : mouseY);
   
   
       // Check if touch ended on an *activated* post (tap)
       filteredPosts.forEach((post) => {
           if (!post.body) return;
           let pos = post.body.position;
   
           // Check if the post was activated *and* it wasn't dragged significantly (touch start coords still defined)
           // We check 'activated' which means the threshold was met before touch end.
           if (
               post.activated &&
               post.touchStartX !== undefined // Ensure it wasn't cancelled by drag
               // We might skip the final dist check here if activation implies it was a tap
               // && dist(pointerX, pointerY, pos.x, pos.y) < post.radius
           ) {
               if (post.url) {
                   window.location.href = post.url; // Navigate on tap
               } else {
                    console.log(`Tapped on activated post "${post.titulo}" with no URL.`);
               }
           }
   
           // Reset interaction state for this post after touch ends
           post.hoverStart = null;
           post.activated = false; // Deactivate on touch end regardless of navigation
           post.touchStartX = undefined;
           post.touchStartY = undefined;
           // Hide tooltip immediately
           if (tooltips[post.body.id]) {
               tooltips[post.body.id].style('display', 'none');
           }
       });
   }
   
   // =========================================================================
   // DOM Element Creation
   // =========================================================================

   function createCategoryCheckboxes() {
    // Remover contenedor existente si existe
    let containerId = "categorias";
    let existingContainer = select('#' + containerId);
    if (existingContainer) {
      existingContainer.remove();
    }
    
    // Crear contenedor para los checkboxes
    let container = createDiv().id(containerId).parent("p5");
    
    // Obtener y ordenar alfabéticamente las categorías
    let sortedCategories = Object.keys(categoryFilter).sort();
    
    sortedCategories.forEach((cat) => {
      // Crear contenedor para cada checkbox con su etiqueta
      let checkboxContainer = createDiv().parent(container);
      
      // Crear elemento label que envolverá el checkbox y el texto
      let label = createElement('label');
      label.parent(checkboxContainer);
      
      // Crear el elemento input de tipo checkbox
      let checkbox = createElement('input');
      checkbox.attribute('type', 'checkbox');
      checkbox.attribute('id', 'check-' + cat);
      checkbox.attribute('checked', true);
      
      // Agregar el checkbox al label
      label.child(checkbox);
      
      // Crear un span para el texto y agregarlo al label
      let span = createSpan(' ' + cat);
      span.parent(label);
      
      // Añadir listener para actualizar el estado en categoryFilter
      checkbox.elt.addEventListener('change', function() {
        categoryFilter[cat] = checkbox.elt.checked;
      });
    });
  }
  
   
   // =========================================================================
   // Window Resize Handling
   // =========================================================================
   function windowResized() {
       let w = document.getElementById("p5").offsetWidth;
       // Ensure height is reasonable, e.g., not smaller than a certain minimum
       let minHeight = 400;
       let windowHeightPercentage = window.innerHeight * 0.75;
       // Let canvas height be related to width but not excessively tall or short
       let canvasHeight = constrain(w * 0.7, minHeight, window.innerHeight * 0.8); // Example: 70% of width, constrained
   
       resizeCanvas(w, canvasHeight);
   
       // --- Update boundaries ---
       if (boundaries.length >= 4) {
            World.remove(world, boundaries); // Remove old boundaries
            boundaries = []; // Clear array
            let t = 50; // Thickness
            boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true, label: 'boundary-bottom' }));
            boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true, label: 'boundary-top' }));
            boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true, label: 'boundary-left' }));
            boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true, label: 'boundary-right' }));
            World.add(world, boundaries); // Add new boundaries
       }
   
       // --- Recreate links with potentially new length ---
       // Remove old constraints from the world first
       links.forEach(link => World.remove(world, link));
       createLinks(); // Recalculate links based on new width/height
   
       // Optional: reposition bodies if needed, e.g., push them away from new edges
       postsData.forEach(post => {
           if(post.body){
                // Example: Gently push bodies towards the center if they are outside bounds
               let buffer = 50;
               if (post.body.position.x < buffer) Matter.Body.applyForce(post.body, post.body.position, {x:0.005 * post.body.mass, y:0}); // Scale force by mass
               if (post.body.position.x > width - buffer) Matter.Body.applyForce(post.body, post.body.position, {x:-0.005 * post.body.mass, y:0});
               if (post.body.position.y < buffer) Matter.Body.applyForce(post.body, post.body.position, {y:0.005 * post.body.mass, x:0});
               if (post.body.position.y > height - buffer) Matter.Body.applyForce(post.body, post.body.position, {y:-0.005 * post.body.mass, x:0});
           }
       });
   
   
       console.log(`Resized canvas to: ${w} x ${canvasHeight}`);
   }



// Clase Node que almacena la referencia al post y sus enlaces
class Node {
  constructor(post) {
    this.post = post; // Referencia al post asociado
    this.links = [];  // Array para almacenar los enlaces
  }
  // Verifica si existe un enlace hacia otro nodo
  hasLinkTo(otherNode) {
    return this.links.includes(otherNode);
  }
  // Agrega un enlace si no se supera el máximo y no existe ya
  addLink(otherNode) {
    if (this.links.length < MAX_LINKS && !this.hasLinkTo(otherNode)) {
      this.links.push(otherNode);
    }
  }
}

// Función para inicializar los nodos en cada post
function initializeNodes() {
  postsData.forEach(post => {
    post.node = new Node(post); // Asignar un nodo a cada post
  });
}

// Función modificada para crear enlaces utilizando los nodos
function createLinks() {
  const linkLength = 10; // Math.min(width, height) * 0.3; // Longitud dinámica del enlace
  const stiffnessValue = 0.00001; // Rigidez para el constraint
  const dampingValue = 0.005;    // Amortiguamiento para el constraint
  
  // Eliminar enlaces existentes del mundo y reiniciar el array
  links.forEach(link => World.remove(world, link));
  links = [];
  
  // Reiniciar los enlaces en cada nodo
  postsData.forEach(post => {
    if (post.node) post.node.links = [];
  });
  
  // Iterar sobre cada post para asignar enlaces
  postsData.forEach(postA => {
    // Seleccionar candidatos: posts que comparten al menos un tag y que no tienen enlace hacia postA
    let candidates = postsData.filter(postB => {
      if (postA === postB) return false; // Excluir el mismo post
      let shareTag = postA.categorias.some(cat => postB.categorias.includes(cat));
      // Verificar que el candidato no tenga enlace hacia postA
      let candidateHasLinkToA = postB.node && postB.node.hasLinkTo(postA.node);
      return shareTag && !candidateHasLinkToA;
    });
    
    // Ordenar candidatos de menor a mayor cantidad de enlaces
    candidates.sort((a, b) => a.node.links.length - b.node.links.length);
    
    // Agregar enlaces hasta alcanzar el máximo permitido para postA
    while (postA.node.links.length < MAX_LINKS && candidates.length > 0) {
      let candidate = candidates.shift(); // Seleccionar el candidato con menos enlaces
      if (candidate.node.links.length < MAX_LINKS) { // Verificar que el candidato no exceda el máximo
        // Agregar enlace bidireccional
        postA.node.addLink(candidate.node);
        candidate.node.addLink(postA.node);
        
        // Crear constraint de Matter.js para representar el enlace
        let spring = Constraint.create({
          bodyA: postA.body,
          bodyB: candidate.body,
          length: linkLength,
          stiffness: stiffnessValue,
          damping: dampingValue,
          render: { visible: false } // El enlace no se dibuja
        });
        links.push(spring);
        World.add(world, spring);
      }
    }
  });
}
