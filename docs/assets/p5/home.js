/* ╭────────────────────────────────────────────────────╮
   │  {dp} · doble página · desde 2003 living standard  │
   ╰────────────────────────────────────────────────────╯ */

// =========================================================================
// Global Variables & Constants
// =========================================================================
let pal = {}; // Object to hold color definitions

const minDiameter = 10;    // Minimum circle diameter
const maxDiameter = 100;   // Maximum circle diameter
const MAX_LINKS = 2;       // Maximum links per node

let postsData = [];        // Array to hold post data from JSON
let filteredPosts = [];    // Array of posts currently visible based on filters
let categoryFilter = {};   // Object to track active category filters
let cnv;                   // p5.js canvas object

// Matter.js Modules
const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Constraint = Matter.Constraint;

let engine;                // Matter.js physics engine
let world;                 // Matter.js physics world
let boundaries = [];       // Array to hold boundary bodies
let tooltips = {};         // Object to hold p5.dom tooltip elements, keyed by body id

// Interaction & Animation Variables
const hoverThreshold = 1000; // Time in ms to activate node on hover/touch
const fadeDuration = 500;    // Duration of hover fade-in effect
let links = [];            // Array to hold Matter.js constraints (springs)

// Stiffness Control Variable (for dynamic slider)
let currentStiffness = 0.00001; // Default stiffness, controlled by slider

// =========================================================================
// Preload Function - Load external data
// =========================================================================
function preload() {
    loadJSON(
        "/feed.json", // Path to your JSON data feed
        (data) => {
            postsData = data;
            // Data validation and preparation
            postsData.forEach(post => {
                // Ensure 'categorias' is always an array
                if (!Array.isArray(post.categorias)) {
                    post.categorias = []; // Default to empty array if missing or not an array
                }
                // Ensure 'largo' exists and is a number, provide default if not
                 if (typeof post.largo !== 'number' || isNaN(post.largo)) {
                     console.warn(`Post "${post.titulo}" missing or invalid 'largo'. Defaulting to 1000.`);
                     post.largo = 1000; // Default length value
                 }
            });
            filteredPosts = postsData; // Initialize filtered list with all posts
        },
        (err) => {
            console.error("Error loading feed.json:", err);
            // Handle error, maybe display a message on canvas later in setup
            postsData = []; // Ensure postsData is an empty array on error
        }
    );
}

// =========================================================================
// Setup Function - Initialize canvas, physics, elements, etc.
// =========================================================================
function setup() {
    // Initialize p5.js colors
    pal = {
        activeColor: color(166, 10, 10),
        codeColor: color(150, 177, 150),
        codeOutline: color(90, 106, 90),
        escuelaColor: color(74, 169, 229, 80),
        ideaColor: color(255, 126, 0, 200),
        imageColor: color(120, 120, 120, 200), // Defined but not used in draw yet
        noteColor: color(255, 244, 152, 200),
        hoverColor: color(0), // Black for hover state
    };

    // Defensive check if postsData failed to load or is empty
    if (!Array.isArray(postsData) || postsData.length === 0) {
        console.warn("postsData is not ready or is empty. Displaying message.");
        let w = windowWidth; // Use window width for placeholder
        try { // Attempt to get p5 container width if it exists
             w = document.getElementById("p5").offsetWidth || windowWidth;
        } catch(e) { /* ignore error if #p5 doesn't exist yet */ }
        createCanvas(w, 200); // Create a small canvas for the message
        background(230);
        fill(50);
        textAlign(CENTER, CENTER);
        textFont("Barlow", 16); // Assuming Barlow might be available
        text("Error loading post data or no data available.", width / 2, height / 2);
        noLoop(); // Stop draw() loop
        return; // Exit setup early
    }

    // --- Proceed with normal setup if data is available ---

    // Calculate Canvas Size
    let w = document.getElementById("p5").offsetWidth;
    let windowHeightPercentage = window.innerHeight * 0.75;
    // Constrain height based on width and window height
    let canvasHeight = constrain(w * 0.7, 400, window.innerHeight * 0.8); // Example constraints
    cnv = createCanvas(w, canvasHeight);
    // Allow default scroll behavior on canvas wheel events
    cnv.elt.addEventListener('wheel', function(e) {}, { passive: true });
    cnv.parent("p5"); // Attach canvas to the div with id="p5"
    cnv.elt.style.touchAction = "auto"; // Allow default touch actions (scroll/zoom)
    textFont("Barlow"); // Set default font

    // Initialize Matter.js Engine
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0; // No vertical gravity

    // Setup Mouse Interaction with Matter.js
    let canvasmouse = Matter.Mouse.create(cnv.elt);
    canvasmouse.pixelRatio = pixelDensity(); // Important for high-density displays
    let mConstraint = Matter.MouseConstraint.create(engine, {
        mouse: canvasmouse,
        constraint: {
            stiffness: 0.2, // How stiff the mouse drag is
            render: {
                visible: false // Don't draw the constraint visualization
            }
        }
    });
    World.add(world, mConstraint); // Add mouse constraint to the world

    // Populate categoryFilter based on loaded data
    postsData.forEach((post) => {
        (post.categorias || []).forEach((cat) => {
            if (cat && typeof cat === 'string') { // Ensure category is a non-empty string
                 categoryFilter[cat.trim()] = true; // Initialize all categories as active
            }
        });
    });
    

    // Calculate min/max post length ('largo') for mapping radius
    let largos = postsData.map((p) => p.largo).filter(l => typeof l === 'number' && !isNaN(l));
    let minLen = largos.length > 0 ? Math.min(...largos) : 1000;
    let maxLen = largos.length > 0 ? Math.max(...largos) : 1000;
    if (minLen === maxLen) maxLen += 1; // Avoid division by zero if all posts have same length

    // Create initial static boundaries for the physics world
    updateBoundaries();

    // Create Matter.js bodies for each post
    postsData.forEach((post, index) => {
        // Determine radius based on category ('code' is fixed size) or length
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
        // Ensure radius is within defined min/max bounds
        post.radius = constrain(post.radius, minDiameter / 2, maxDiameter / 2);

        // Calculate initial random position inside canvas boundaries
        let margin = post.radius + 10; // Margin based on radius plus some padding
        margin = Math.min(margin, width / 2 - 1, height / 2 - 1); // Ensure margin fits canvas
        if (margin < post.radius) margin = post.radius; // Margin must be at least the radius
        let x = random(margin, width - margin);
        let y = random(margin, height - margin);

        // Create the Matter.js circular body
        post.body = Bodies.circle(x, y, post.radius, {
            restitution: 0.8, // Bounciness
            friction: 0.01,   // Low surface friction
            frictionAir: 0.02,// Some air drag
            density: 0.01    // Affects mass relative to size
        });

        // Initialize interaction properties for hover/touch states
        post.hoverStart = null;
        post.activated = false;
        post.touchStartX = undefined;
        post.touchStartY = undefined;

        World.add(world, post.body); // Add the body to the Matter world

        // Give bodies a small initial random velocity to spread them out
        Matter.Body.setVelocity(post.body, { x: random(-1, 1), y: random(-1, 1) });

        // --- Create and Style HTML tooltips dynamically using p5.dom ---
        tooltips[post.body.id] = createDiv(post.titulo.toUpperCase());
        tooltips[post.body.id].parent("p5"); // Attach tooltip to the main p5 container
        tooltips[post.body.id].style("position", "absolute");
        tooltips[post.body.id].style("display", "none"); // Hidden initially
        tooltips[post.body.id].style("pointer-events", "none"); // Prevent tooltip from blocking mouse/touch
        tooltips[post.body.id].style("z-index", "10"); // Ensure tooltip is above canvas
        // Visual Styles for Tooltip
        tooltips[post.body.id].style("background-color", "rgba(255, 255, 255, 0.85)");
        tooltips[post.body.id].style("color", "#333");
        tooltips[post.body.id].style("font-family", "'Barlow', sans-serif");
        tooltips[post.body.id].style("font-size", "11px");
        tooltips[post.body.id].style("text-align", "center");
        tooltips[post.body.id].style("text-transform", "uppercase");
        tooltips[post.body.id].style("padding", "4px 8px");
        tooltips[post.body.id].style("border-radius", "3px");
        tooltips[post.body.id].style("white-space", "nowrap"); // Prevent text wrapping
        tooltips[post.body.id].style("box-shadow", "0 1px 3px rgba(0,0,0,0.1)");
        // CSS Transform for positioning (centered horizontally, above the node)
        tooltips[post.body.id].style("transform", "translateX(-50%) translateY(-100%)");
        // --- End tooltip creation ---
    });

    // --- Dynamic Creation of Stiffness Slider Control using p5.dom ---

    // 1. Create a container Div to group the slider controls
    let stiffnessControlContainer = createDiv();
    stiffnessControlContainer.id('stiffness-controls'); // Assign an ID for CSS targeting
    stiffnessControlContainer.parent('p5'); // Attach container to the main p5 div
    // Basic inline styles for layout (can be overridden with CSS)
    // stiffnessControlContainer.style('padding', '10px');
    // stiffnessControlContainer.style('display', 'flex');
    // stiffnessControlContainer.style('align-items', 'center');
    // stiffnessControlContainer.style('gap', '8px');

    // 2. Create the text label for the slider
    let stiffnessLabel = createSpan('Rigidez: ');
    stiffnessLabel.parent(stiffnessControlContainer); // Add label to the container
    // stiffnessLabel.style('font-family', '"Barlow", sans-serif');
    // stiffnessLabel.style('font-size', '12px');

    // 3. Create the slider element
    let stiffnessSlider = createSlider(
        0.0000001,           // Min stiffness value
        0.001,              // Max stiffness value
        currentStiffness,   // Initial value from global variable
        0.0000001            // Step increment
    );
    stiffnessSlider.parent(stiffnessControlContainer); // Add slider to the container
    stiffnessSlider.style('width', '150px'); // Set a visual width for the slider

    // 4. Create a Span to display the current stiffness value
    let stiffnessValueDisplay = createSpan(currentStiffness.toExponential(2)); // Show initial value
    stiffnessValueDisplay.parent(stiffnessControlContainer); // Add display to the container
    // stiffnessValueDisplay.style('font-family', '"Barlow", sans-serif');
    // stiffnessValueDisplay.style('font-size', '12px');
    // stiffnessValueDisplay.style('min-width', '50px'); // Ensure space for the text

    // 5. Add the input event listener to the slider
    stiffnessSlider.input(() => {
        // Update the global stiffness variable
        currentStiffness = stiffnessSlider.value(); // Get current value from p5 slider

        // Update the text display
        stiffnessValueDisplay.html(currentStiffness.toExponential(2));

        // Update the stiffness property of all existing link constraints
        links.forEach(link => {
            if (link) { // Check if the link object exists
                link.stiffness = currentStiffness;
            }
        });
        // console.log("Stiffness updated to:", currentStiffness); // Uncomment for debugging
    });
    // --- End Stiffness Slider Creation ---


    // Final setup steps
    filteredPosts = postsData; // Initialize filtered list again (redundant, but safe)
    initializeNodes();         // Create Node class instances for link logic
    createLinks();             // Create initial physics constraints (links)

    createCategoryCheckboxes(); // Dynamically create checkboxes for categories
}

// =========================================================================
// Draw Function - Runs continuously to update and render the simulation
// =========================================================================
function draw() {
    // Semi-transparent background for trails effect, or use clear() for no trails
    background(255, 10);
    // clear(); // Uncomment for a non-trail background

    Engine.update(engine); // Update the Matter.js physics engine
    let now = millis(); // Get current time for animations/interactions

    // Determine pointer position (use first touch if available, else mouse)
    let pointerX = touches.length > 0 ? touches[0].x : mouseX;
    let pointerY = touches.length > 0 ? touches[0].y : mouseY;

    // Update the list of posts to draw based on active category filters
    filteredPosts = postsData.filter((p) =>
        p.body && p.categorias.some((cat) => categoryFilter[cat]) // Check body exists and category is active
    );

    // --- Draw Links (Springs) ---
    push(); // Isolate link drawing styles
    blendMode(OVERLAY); // Blend mode for links (experiment with others)
    stroke(69, 20, 202, 55); // Link color (e.g., light blue, semi-transparent)
    strokeWeight(1); // Thickness of links
    links.forEach((link) => {
        const bodyA = link.bodyA;
        const bodyB = link.bodyB;
        // Ensure both bodies exist before drawing
        if (!bodyA || !bodyB) return;
        // Check if both connected posts are currently visible (in filteredPosts)
        const bodyAVisible = filteredPosts.some((p) => p.body && p.body.id === bodyA.id);
        const bodyBVisible = filteredPosts.some((p) => p.body && p.body.id === bodyB.id);
        if (bodyAVisible && bodyBVisible) {
            line(bodyA.position.x, bodyA.position.y, bodyB.position.x, bodyB.position.y);
        }
    });
    pop(); // Restore previous drawing styles (includes blendMode)
    // --- End Draw Links ---

    blendMode(MULTIPLY);
    // --- Draw Circles (Posts) and Handle Tooltips ---
    filteredPosts.forEach((post) => {
        if (!post.body) return; // Skip if body doesn't exist

        let pos = post.body.position;
        let isHovering = dist(pointerX, pointerY, pos.x, pos.y) < post.radius;
        const tooltip = tooltips[post.body.id];
        let showTooltipThisFrame = false; // Flag to manage tooltip visibility per frame

        // --- State Logic (Hover, Activation) & Tooltip Handling ---
        if (isHovering) {
            // Tooltip: Show immediately on hover and position it
            if (tooltip) {
                tooltip.style("display", "block");
                tooltip.position(pos.x, pos.y - (post.radius * 0.3)); // Position slightly above center
                showTooltipThisFrame = true; // Mark tooltip to stay visible this frame
            }

            // Activation Logic: Start timer, activate after threshold
            if (!post.activated) {
                if (!post.hoverStart) {
                    post.hoverStart = now; // Start hover timer
                } else if (now - post.hoverStart >= hoverThreshold) {
                    post.activated = true; // Activate the node
                }
            }
        } else {
            // Not hovering: Reset hover/activation state
            if (post.activated || post.hoverStart) {
                 post.hoverStart = null;
                 post.activated = false;
                 // Tooltip hiding is handled by the flag below
            }
        }

        // --- Circle Drawing Logic ---
        push(); // Isolate styles and transformations for this circle
        translate(pos.x, pos.y); // Move origin to circle's center

        // Determine fill and stroke based on state (activated, hovering, normal)
        if (post.activated) {
            // State: Activated (e.g., red)
            fill(pal.activeColor);
            noStroke();
        } else if (post.hoverStart) {
            // State: Hovering (fade effect from base color to hover color)
            let pct = constrain((now - post.hoverStart) / fadeDuration, 0, 1); // Fade progress
            let baseColor; // Determine base color by category
            if (post.categorias.includes("code")) { baseColor = pal.codeColor; }
            else if (post.categorias.includes("escuela")) { baseColor = pal.escuelaColor; }
            else if (post.categorias.includes("ideas")) { baseColor = pal.ideaColor; }
            else { baseColor = pal.noteColor; } // Default
            let hoverFill = lerpColor(baseColor, pal.hoverColor, pct); // Interpolate color
            fill(hoverFill);

            // Apply stroke only for specific categories during hover
            if (post.categorias.includes("code")) {
                stroke(pal.codeOutline);
                strokeWeight(2);
            } else {
                noStroke();
            }
        } else {
            // State: Normal (color by category)
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
            } else { // Default category color
                fill(pal.noteColor);
                noStroke();
            }
        }

        // Draw the ellipse (circle) at the translated origin (0, 0)
        ellipse(0, 0, post.radius * 2);

        pop(); // Restore previous drawing state
        // --- End Circle Drawing ---

        // --- Final Tooltip Visibility Control ---
        if (tooltip && !showTooltipThisFrame) {
            tooltip.style("display", "none"); // Hide tooltip if not hovering this frame
        }
    });
    blendMode(BLEND);
    // --- End Draw Circles ---
}

// =========================================================================
// Interaction Functions (Mouse & Touch)
// =========================================================================

// --- Mouse Pressed ---
function mousePressed() {
    if (!filteredPosts || !postsData) return false; // Guard clause

    let clickedOnNode = false;
    // Check if click was on an activated post
    filteredPosts.forEach((post) => {
         if (!post.body) return;
         let pos = post.body.position;
         // Check if node is activated AND click is within its radius
         if (post.activated && dist(mouseX, mouseY, pos.x, pos.y) < post.radius) {
            clickedOnNode = true;
            if (post.url) { // Check if the post object has a URL property
                 window.location.href = post.url; // Navigate to the post URL
            } else {
                 console.log(`Clicked on activated post "${post.titulo}" with no URL.`);
            }
         }
    });
    // Prevent default browser action (like text selection) only if a node was clicked
    return !clickedOnNode; // Return false to prevent default if clicked, true otherwise
}

// --- Touch Started ---
function touchStarted() {
    if (!filteredPosts || !postsData) return false; // Guard clause

    if (touches.length > 0) {
        let pointerX = touches[0].x;
        let pointerY = touches[0].y;
        let touchedNode = false;

        // Check if touch started on any circle (even non-filtered ones for interaction capture)
        postsData.forEach((post) => {
            if (!post.body) return;
            let pos = post.body.position;
            if (dist(pointerX, pointerY, pos.x, pos.y) < post.radius) {
                touchedNode = true;
                // Start hover timer immediately on touch down within radius
                if (!post.hoverStart) {
                    post.hoverStart = millis();
                }
                // Store touch start position to detect dragging vs. tapping
                post.touchStartX = pointerX;
                post.touchStartY = pointerY;
            }
        });
         // Let Matter.js handle dragging if touch starts on a node.
         // If touch starts elsewhere, allow default browser behavior (scrolling).
        return !touchedNode; // Return false (prevent default) if on node, true otherwise
    }
    return true; // Allow default if no touches detected
}

// --- Touch Moved ---
function touchMoved(e) {
 if (!filteredPosts || !postsData) return true; // Allow scroll if data not ready

 let isOverNode = false;

 if (touches.length > 0) {
   let pointerX = touches[0].x;
   let pointerY = touches[0].y;

   // Check all posts to see if drag is currently over one
   postsData.forEach((post) => {
     if (!post.body) return;

     if (dist(pointerX, pointerY, post.body.position.x, post.body.position.y) < post.radius) {
       isOverNode = true; // Mark that the touch is currently over a node

       // If touch has moved significantly from start, cancel hover/activation (treat as drag)
       if (
         post.touchStartX !== undefined &&
         post.touchStartY !== undefined &&
         dist(pointerX, pointerY, post.touchStartX, post.touchStartY) > 10 // Drag threshold (adjust if needed)
       ) {
         post.hoverStart = null;
         post.activated = false;
         // Also hide tooltip immediately if dragging away
         const tooltip = tooltips[post.body.id];
         if (tooltip) tooltip.style('display', 'none');
       }
     }
   });
 }

 // Prevent default scroll ONLY if the touch move is happening over a node
 // This allows scrolling when dragging on the background.
 return !isOverNode; // Return false (prevent scroll) if over node, true (allow scroll) otherwise.
}


// --- Touch Ended ---
function touchEnded() {
    if (!filteredPosts || !postsData) return; // Guard clause

    // Check if touch ended on an *activated* post (indicating a tap)
    postsData.forEach((post) => { // Check all posts
        if (!post.body) return;

        // Check activation state and if it wasn't cancelled by significant dragging
        if (
            post.activated &&
            post.touchStartX !== undefined // Touch start coords exist (i.e., wasn't cancelled by drag)
        ) {
             // Check again if the *final* touch point is still within the radius (optional, but safer)
             // Need a way to get last touch point - mouseX/Y might be fallback
             let lastX = (typeof pwinMouseX !== 'undefined') ? pwinMouseX : mouseX; // Use previous mouse/touch pos if available
             let lastY = (typeof pwinMouseY !== 'undefined') ? pwinMouseY : mouseY;
             if (dist(lastX, lastY, post.body.position.x, post.body.position.y) < post.radius){
                if (post.url) {
                    window.location.href = post.url; // Navigate on tap
                } else {
                     console.log(`Tapped on activated post "${post.titulo}" with no URL.`);
                }
             }
        }

        // --- Reset interaction state for this post regardless of navigation ---
        post.hoverStart = null;
        post.activated = false;
        post.touchStartX = undefined;
        post.touchStartY = undefined;
        // Hide tooltip immediately on touch end
        const tooltip = tooltips[post.body.id];
        if (tooltip) {
            tooltip.style('display', 'none');
        }
        // --- End Reset ---
    });
    // Don't prevent default actions after touch ends
    return true;
}

// =========================================================================
// DOM Element Creation Functions
// =========================================================================

// --- Create Category Filter Checkboxes ---
function createCategoryCheckboxes() {
    const containerId = "category-filters"; // Use a descriptive ID
    let existingContainer = select('#' + containerId);
    if (existingContainer) {
      existingContainer.remove(); // Remove old container if it exists (e.g., on resize)
    }

    // Create main container div for checkboxes
    let container = createDiv().id(containerId);
    container.parent("p5"); // Attach to the main p5 div
    // Basic styling for the checkbox container (flex layout)
    // container.style('display', 'flex');
    // container.style('flex-wrap', 'wrap');
    // container.style('justify-content', 'center');
    // container.style('gap', '10px 15px'); // Row and column gap
    // container.style('padding', '10px 0'); // Vertical padding

    // Get categories from the filter object and sort alphabetically
    let sortedCategories = Object.keys(categoryFilter).sort();

    // Create a checkbox and label for each category
    sortedCategories.forEach((cat) => {
      // Container for label + checkbox (optional, could style label directly)
      // let checkboxContainer = createDiv().parent(container);

      // Create label element (acts as container)
      let label = createElement('label');
      label.parent(container); // Add label directly to the flex container
      // Styling for the label (makes the whole area clickable)
    //   label.style('font-size', '12px');
    //   label.style('font-family', '"Barlow", sans-serif');
    //   label.style('cursor', 'pointer');
    //   label.style('user-select', 'none'); // Prevent text selection on click
    //   label.style('display', 'flex');    // Align checkbox and text nicely
    //   label.style('align-items', 'center');
    //   label.style('line-height', '1');   // Adjust line height

      // Create checkbox input element
      let checkbox = createInput(); // Use createInput for type='checkbox'
      checkbox.attribute('type', 'checkbox');
      checkbox.attribute('id', 'check-' + cat); // Unique ID for the checkbox
      if (categoryFilter[cat]) { // Set initial checked state from filter object
        checkbox.attribute('checked', 'true');
      }
      checkbox.parent(label); // Nest checkbox inside label
    //   checkbox.style('margin-right', '4px'); // Space between checkbox and text

      // Create span for category text
      let span = createSpan(cat);
      span.parent(label); // Add text span to label

      // Add event listener to update filter state when checkbox changes
      checkbox.changed(() => { // Use .changed() for p5 inputs
        categoryFilter[cat] = checkbox.elt.checked;
        // console.log("Category filter updated:", categoryFilter); // Debugging
      });
    });
}

// =========================================================================
// Window Resize Handling
// =========================================================================
function windowResized() {
    // Recalculate canvas size based on new container width
    let w = document.getElementById("p5").offsetWidth;
    let canvasHeight = constrain(w * 0.7, 400, window.innerHeight * 0.8);
    resizeCanvas(w, canvasHeight);

    // Update physics boundaries to match new canvas size
    updateBoundaries();

    // Recreate links (they might need different lengths or initial positions implicitly)
    // Remove old constraints from the world first
    links.forEach(link => { if(link) World.remove(world, link); });
    createLinks(); // Recalculate links (uses currentStiffness)

    // Optional: Gently push bodies away from edges if they are too close after resize
    postsData.forEach(post => {
        if(post.body){
             let buffer = 50; // Distance from edge to apply force
             let forceMagnitude = 0.005; // Adjust force strength
             // Apply force scaled by mass to push towards center
             if (post.body.position.x < buffer) Matter.Body.applyForce(post.body, post.body.position, {x: forceMagnitude * post.body.mass, y:0});
             if (post.body.position.x > width - buffer) Matter.Body.applyForce(post.body, post.body.position, {x: -forceMagnitude * post.body.mass, y:0});
             if (post.body.position.y < buffer) Matter.Body.applyForce(post.body, post.body.position, {y: forceMagnitude * post.body.mass, x:0});
             if (post.body.position.y > height - buffer) Matter.Body.applyForce(post.body, post.body.position, {y: -forceMagnitude * post.body.mass, x:0});
        }
    });

    console.log(`Resized canvas to: ${w} x ${canvasHeight}`);
}

// =========================================================================
// Helper Functions
// =========================================================================

// --- Update Physics Boundaries ---
// Creates or replaces the static boundary rectangles around the canvas
function updateBoundaries() {
    // Remove existing boundaries from the world if they exist
    if (boundaries && boundaries.length > 0) {
        World.remove(world, boundaries);
    }
    boundaries = []; // Clear the boundaries array

    let t = 50000; // Use a very large thickness for effectively impenetrable walls
    // Create new boundary rectangles slightly offset from the canvas edges
    // Bottom
    boundaries.push(Bodies.rectangle(width / 2, height + t / 2, width + 2*t, t, { isStatic: true, label: 'boundary-bottom' }));
    // Top
    boundaries.push(Bodies.rectangle(width / 2, -t / 2, width + 2*t, t, { isStatic: true, label: 'boundary-top' }));
    // Left
    boundaries.push(Bodies.rectangle(-t / 2, height / 2, t, height + 2*t, { isStatic: true, label: 'boundary-left' }));
    // Right
    boundaries.push(Bodies.rectangle(width + t / 2, height / 2, t, height + 2*t, { isStatic: true, label: 'boundary-right' }));

    // Add the new boundaries to the physics world
    World.add(world, boundaries);
}

// --- Node Class (for link logic) ---
// Helper class attached to each post object to manage its links
class Node {
  constructor(post) {
    this.post = post; // Reference to the associated post object
    this.links = [];  // Array to store references to other Node instances it's linked to
  }
  // Check if this node is already linked to another specific node
  hasLinkTo(otherNode) {
    return this.links.includes(otherNode);
  }
  // Add a link to another node if limit not reached and link doesn't exist
  addLink(otherNode) {
    if (this.links.length < MAX_LINKS && !this.hasLinkTo(otherNode)) {
      this.links.push(otherNode);
    }
  }
}

// --- Initialize Node Instances ---
// Creates a new Node instance for each post in postsData
function initializeNodes() {
  postsData.forEach(post => {
    post.node = new Node(post); // Assign a new Node instance to the post object
  });
}

// --- Create Physics Links (Constraints) ---
// Creates Matter.js constraints between related posts based on shared categories
function createLinks() {
  const linkLength = 10; // Desired resting length of the springs
  const dampingValue = 0.005; // Damping factor for the springs

  // Remove existing constraints from the world and clear the links array
  links.forEach(link => { if(link) World.remove(world, link); });
  links = [];

  // Reset the links array within each Node instance
  postsData.forEach(post => {
    if (post.node) post.node.links = [];
  });

  // Iterate through each post to establish potential links
  postsData.forEach(postA => {
    // Ensure postA has required properties
    if (!postA.body || !postA.node) return;

    // Find candidate posts (postB) to link with postA
    let candidates = postsData.filter(postB => {
      // Ensure postB is valid and not the same as postA
      if (postA === postB || !postB.body || !postB.node) return false;
      // Check if they share at least one category
      let shareTag = postA.categorias.some(cat => postB.categorias.includes(cat));
      // Check if postB already has a link pointing back to postA (for bidirectional logic)
      let candidateHasLinkToA = postB.node.hasLinkTo(postA.node);
      return shareTag && !candidateHasLinkToA; // Link if tags shared and no reverse link yet
    });

    // Sort candidates by the number of existing links (link to least connected first)
    candidates.sort((a, b) => a.node.links.length - b.node.links.length);

    // Add links from postA up to the MAX_LINKS limit
    while (postA.node.links.length < MAX_LINKS && candidates.length > 0) {
      let candidate = candidates.shift(); // Get the candidate with the fewest links
      // Check if the selected candidate also has space for a new link
      if (candidate.node.links.length < MAX_LINKS) {
        // Establish bidirectional link in the Node instances
        postA.node.addLink(candidate.node);
        candidate.node.addLink(postA.node);

        // Create the Matter.js Constraint (spring)
        let spring = Constraint.create({
          bodyA: postA.body,
          bodyB: candidate.body,
          length: linkLength,
          stiffness: currentStiffness, // Use the global stiffness value
          damping: dampingValue,
          render: { visible: false } // Don't draw the default Matter constraint line
        });
        links.push(spring);        // Add constraint to our links array
        World.add(world, spring); // Add constraint to the Matter world
      }
    }
  });
  // console.log(`Created ${links.length} links.`); // Debugging
}