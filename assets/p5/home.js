/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · desde 2003 living standard  │
   ╰────────────────────────────────────────────────────╯ */

   let pal = {};

   const minDiameter = 10;
   const maxDiameter = 100;

   const MAX_LINKS = 2;

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

   const hoverThreshold = 1000;
   const fadeDuration = 500;
   let links = [];

   // ***** NUEVO: Variable global para la rigidez *****
   let currentStiffness = 0.00001; // Valor inicial por defecto

   // ... (resto de variables globales) ...

   function preload() {
       // ... (sin cambios en preload) ...
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
       // Inicializar colores
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

       // Chequeo defensivo
       if (!Array.isArray(postsData) || postsData.length === 0) {
           console.warn("postsData no está listo o está vacío.");
           createCanvas(windowWidth, 200);
           background(200); fill(0); textAlign(CENTER, CENTER);
           text("Cargando datos...", width/2, height/2);
           noLoop(); return;
       }

       // Setup Canvas
       let w = document.getElementById("p5").offsetWidth;
       let windowHeightPercentage = window.innerHeight * 0.75;
       windowHeightPercentage = constrain(windowHeightPercentage, w*1.2, window.innerHeight);
       let canvasHeight = Math.max(w, windowHeightPercentage);
       cnv = createCanvas(w, canvasHeight);
       cnv.elt.addEventListener('wheel', function(e) {}, { passive: true });
       cnv.parent("p5");
       cnv.elt.style.touchAction = "auto";
       textFont("Barlow");

       // Setup Matter.js Engine y Mouse
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

       // Populate categoryFilter y crear checkboxes
       postsData.forEach((post) => {
           (post.categorias || []).forEach((cat) => {
               if (cat && typeof cat === 'string') { categoryFilter[cat.trim()] = true; }
           });
       });
       createCategoryCheckboxes();

       // Calcular min/max largo
       let largos = postsData.map((p) => p.largo).filter(l => typeof l === 'number' && !isNaN(l));
       let minLen = largos.length > 0 ? Math.min(...largos) : 1000;
       let maxLen = largos.length > 0 ? Math.max(...largos) : 1000;
       if (minLen === maxLen) maxLen += 1;

       updateBoundaries(); // Crear boundaries iniciales

       // Crear cuerpos Matter.js para posts (con posición aleatoria inicial)
       postsData.forEach((post, index) => {
            // Calcular radio
           let isCode = post.categorias.includes("code");
           post.radius = isCode ? 7 : map(post.largo, minLen, maxLen, minDiameter / 2, maxDiameter / 2);
           post.radius = constrain(post.radius, minDiameter / 2, maxDiameter / 2);

           // ***** AJUSTE: Posición inicial Aleatoria *****
           let margin = post.radius + 10;
           margin = Math.min(margin, width / 2 - 1, height / 2 - 1);
           if (margin < post.radius) margin = post.radius;
           let x = random(margin, width - margin);
           let y = random(margin, height - margin);
           // ***** FIN AJUSTE *****

           post.body = Bodies.circle(x, y, post.radius, {
               restitution: 0.8, friction: 0.01, frictionAir: 0.02, density: 0.01
           });

           post.hoverStart = null; post.activated = false;
           post.touchStartX = undefined; post.touchStartY = undefined;

           World.add(world, post.body);
           Matter.Body.setVelocity(post.body, { x: random(-1, 1), y: random(-1, 1) });

           // Crear tooltips HTML
           tooltips[post.body.id] = createDiv(post.titulo.toUpperCase());
           tooltips[post.body.id].parent("p5");
           // ... (estilos del tooltip sin cambios) ...
           tooltips[post.body.id].style("position", "absolute");
           tooltips[post.body.id].style("display", "none");
           tooltips[post.body.id].style("pointer-events", "none");
           tooltips[post.body.id].style("z-index", "10");
           tooltips[post.body.id].style("background-color", "rgba(255, 255, 255, 0.85)");
           tooltips[post.body.id].style("color", "#333");
           tooltips[post.body.id].style("font-family", "'Barlow', sans-serif");
           tooltips[post.body.id].style("font-size", "11px");
           tooltips[post.body.id].style("text-align", "center");
           tooltips[post.body.id].style("text-transform", "uppercase");
           tooltips[post.body.id].style("padding", "4px 8px");
           tooltips[post.body.id].style("border-radius", "3px");
           tooltips[post.body.id].style("white-space", "nowrap");
           tooltips[post.body.id].style("box-shadow", "0 1px 3px rgba(0,0,0,0.1)");
           tooltips[post.body.id].style("transform", "translateX(-50%) translateY(-100%)");
       });

       filteredPosts = postsData;
       initializeNodes();
       createLinks(); // Crear links iniciales (usará currentStiffness)

       // ***** NUEVO: Configuración del Slider de Rigidez *****
       const stiffnessSlider = select('#stiffnessSlider');
       const stiffnessValueSpan = select('#stiffnessValue');

       if (stiffnessSlider && stiffnessValueSpan) {
           // Sincronizar slider/span con el valor inicial de JS
           stiffnessSlider.value(currentStiffness);
            // Formatear valor para mostrar (notación exponencial es útil aquí)
           stiffnessValueSpan.html(currentStiffness.toExponential(2));

           // Listener para el evento 'input' (se dispara continuamente al mover)
           stiffnessSlider.input(() => {
               // 1. Actualizar la variable global
               currentStiffness = parseFloat(stiffnessSlider.value());

               // 2. Actualizar el texto del span
               stiffnessValueSpan.html(currentStiffness.toExponential(2));

               // 3. Actualizar la rigidez de TODOS los links existentes
               links.forEach(link => {
                   if (link) { // Chequeo básico por si acaso
                       link.stiffness = currentStiffness;
                   }
               });
               // console.log("Stiffness updated to:", currentStiffness); // Para depurar
           });
       } else {
           console.error("Error: No se encontró el slider #stiffnessSlider o el span #stiffnessValue en el HTML.");
       }
       // ***** FIN NUEVO *****

   }

   // ... (draw, funciones de interacción, createCategoryCheckboxes sin cambios)...
   function draw() {
       background(255, 10); // Use clear() instead of background() for transparency if needed over HTML
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
       blendMode(MULTIPLY)
       // ***** AJUSTE: Usar un alfa más bajo para que sea más sutil al aumentar rigidez *****
       stroke(0, 204, 255, 15); // Semi-transparent black links (alfa reducido)
       strokeWeight(20);
       links.forEach((link) => {
           // Check if both bodies of the link exist and are in the filtered list
           const bodyA = link.bodyA;
           const bodyB = link.bodyB;
           // Comprobar si los cuerpos existen y son visibles
           if (!bodyA || !bodyB) return; // Saltar si falta algún cuerpo
           const bodyAVisible = filteredPosts.some((p) => p.body && p.body.id === bodyA.id);
           const bodyBVisible = filteredPosts.some((p) => p.body && p.body.id === bodyB.id);

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

   function touchMoved(e) {
    if (!filteredPosts || !postsData) return;

    let isOverNode = false;

    if (touches.length > 0) {
      let pointerX = touches[0].x;
      let pointerY = touches[0].y;

      postsData.forEach((post) => {
        if (!post.body) return;

        if (dist(pointerX, pointerY, post.body.position.x, post.body.position.y) < post.radius) {
          isOverNode = true;

          // Si se movió mucho, cancela hover
          if (
            post.touchStartX !== undefined &&
            post.touchStartY !== undefined &&
            dist(pointerX, pointerY, post.touchStartX, post.touchStartY) > 10
          ) {
            post.hoverStart = null;
            post.activated = false;
          }
        }
      });
    }

    // ✅ Solo bloquea scroll si estás interactuando con un nodo
    return isOverNode ? false : true;
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

   function createCategoryCheckboxes() {
    // Remover contenedor existente si existe
    let containerId = "categorias";
    let existingContainer = select('#' + containerId);
    if (existingContainer) {
      existingContainer.remove();
    }

    // Crear contenedor para los checkboxes
    let container = createDiv().id(containerId).parent("p5");
     // ***** NUEVO: Añadir estilo al contenedor de categorías *****
    container.style('display', 'flex');
    container.style('flex-wrap', 'wrap');
    container.style('justify-content', 'center'); // Centrar los checkboxes
    container.style('gap', '10px'); // Espacio entre checkboxes
    container.style('padding', '10px 0'); // Padding vertical

    // Obtener y ordenar alfabéticamente las categorías
    let sortedCategories = Object.keys(categoryFilter).sort();

    sortedCategories.forEach((cat) => {
      // Crear contenedor para cada checkbox con su etiqueta
      let checkboxContainer = createDiv().parent(container);
        // ***** NUEVO: Estilo para cada item (label + checkbox) *****
       checkboxContainer.style('display', 'inline-block'); // O simplemente quitar el div extra si no es necesario

      // Crear elemento label que envolverá el checkbox y el texto
      let label = createElement('label');
      label.parent(checkboxContainer);
        // ***** NUEVO: Estilo para el label *****
       label.style('font-size', '12px');
       label.style('cursor', 'pointer');
       label.style('user-select', 'none'); // Evitar selección de texto al hacer clic rápido
       label.style('display', 'flex'); // Alinea checkbox y texto
       label.style('align-items', 'center'); // Centra verticalmente


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


   function windowResized() {
       // ... (cálculo de w y canvasHeight sin cambios) ...
        let w = document.getElementById("p5").offsetWidth;
       // Ensure height is reasonable, e.g., not smaller than a certain minimum
       let minHeight = 400;
       let windowHeightPercentage = window.innerHeight * 0.75;
       // Let canvas height be related to width but not excessively tall or short
       let canvasHeight = constrain(w * 0.7, minHeight, window.innerHeight * 0.8); // Example: 70% of width, constrained


       resizeCanvas(w, canvasHeight);
       updateBoundaries(); // Actualizar boundaries

       // --- Recrear links (IMPORTANTE: usan el currentStiffness actualizado) ---
       links.forEach(link => World.remove(world, link));
       createLinks(); // Usa el valor actual de currentStiffness

        // Reposicionar cuerpos opcionalmente (sin cambios)
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

   function updateBoundaries(){
        // ***** AJUSTE: Crear boundaries si no existen O si existen (para resize) *****
        if (boundaries && boundaries.length > 0) { // Solo remover si existen
             World.remove(world, boundaries);
        }
       boundaries = []; // Clear array siempre
       let t = 50000; // Grosor GRANDE
       boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width, t, { isStatic: true, label: 'boundary-bottom' }));
       boundaries.push(Bodies.rectangle(width / 2, -t / 2, width, t, { isStatic: true, label: 'boundary-top' }));
       boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height, { isStatic: true, label: 'boundary-left' }));
       boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height, { isStatic: true, label: 'boundary-right' }));
       World.add(world, boundaries); // Add new/updated boundaries
   }

   // Clase Node (sin cambios)
   class Node {
       constructor(post) { this.post = post; this.links = []; }
       hasLinkTo(otherNode) { return this.links.includes(otherNode); }
       addLink(otherNode) {
           if (this.links.length < MAX_LINKS && !this.hasLinkTo(otherNode)) {
               this.links.push(otherNode);
           }
       }
   }

   // Función initializeNodes (sin cambios)
   function initializeNodes() {
       postsData.forEach(post => { post.node = new Node(post); });
   }


   // Función createLinks (MODIFICADA para usar currentStiffness)
   function createLinks() {
       const linkLength = 10;
       // ***** ELIMINADO: const stiffnessValue = 0.00001; *****
       const dampingValue = 0.005;

       // Limpiar links existentes del mundo y array (sin cambios)
       links.forEach(link => { if(link) World.remove(world, link); });
       links = [];

       // Reiniciar links en nodos (sin cambios)
       postsData.forEach(post => { if (post.node) post.node.links = []; });

       // Crear nuevos links
       postsData.forEach(postA => {
           if (!postA.body || !postA.node) return; // Chequeo extra

           let candidates = postsData.filter(postB => {
               if (postA === postB || !postB.body || !postB.node) return false;
               let shareTag = postA.categorias.some(cat => postB.categorias.includes(cat));
               let candidateHasLinkToA = postB.node.hasLinkTo(postA.node);
               return shareTag && !candidateHasLinkToA;
           });

           candidates.sort((a, b) => a.node.links.length - b.node.links.length);

           while (postA.node.links.length < MAX_LINKS && candidates.length > 0) {
               let candidate = candidates.shift();
               if (candidate.node.links.length < MAX_LINKS) {
                   postA.node.addLink(candidate.node);
                   candidate.node.addLink(postA.node);

                   let spring = Constraint.create({
                       bodyA: postA.body,
                       bodyB: candidate.body,
                       length: linkLength,
                       // ***** MODIFICADO: Usar variable global *****
                       stiffness: currentStiffness,
                       damping: dampingValue,
                       render: { visible: false }
                   });
                   links.push(spring);
                   World.add(world, spring);
               }
           }
       });
   }