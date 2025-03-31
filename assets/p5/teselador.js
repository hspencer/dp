/** Teselador */


// p5.js – Teselación de triángulos equiláteros con margen (mortar) controlado
// -----------------------------------------------------------------------------
// FUNCIONALIDAD:
// 1) Dos sliders principales:
//    - sliderTile: controla el lado de cada triángulo (side).
//    - sliderA: controla la argamasa o separación adicional (mortar) entre triángulos.
//    - sliderGrosor: controla el grosor del trazo interno.
//
// 2) Se construye una malla “densa” de triángulos equiláteros, alternando
//    orientación hacia arriba y hacia abajo, con un offset en filas impares
//    para encajar correctamente.
//
// 3) Al presionar la barra espaciadora (SPACE), se asigna un tipo aleatorio (1–7)
//    a cada triángulo (manteniendo posición y orientación).
//    Al presionar cualquier otra tecla, se cicla el tipo de cada triángulo.
//
// 4) Para evitar que las teselas queden recortadas al inicio, se define un margen
//    (margin) que desplaza la primera tesela más al interior del canvas.
//    El usuario puede girar las teselas (por ejemplo) en el futuro si se desea.
//
// -----------------------------------------------------------------------------
// VARIABLES GLOBALES
let sliderTile, sliderA, sliderGrosor; // Sliders
let triangles = [];                    // Arreglo que contiene las teselas
let numCols, numRows;                 // Dimensiones de la grilla en columnas y filas

function setup() {
  // Crear canvas según el ancho del div 'p5'
  let w = round(document.getElementById('p5').offsetWidth / 1.2);
  let cnv = createCanvas(w, w*.6);
  cnv.parent('p5');
  
  // Crear contenedor de controles
  let controlsDiv = createDiv('');
  controlsDiv.id('controls');
  
  // Slider para el lado de los triángulos
  sliderTile = createSlider(30, 150, 80, 1);
  sliderTile.parent(controlsDiv);
  createSpan(" Lado del triángulo ").parent(controlsDiv);
  sliderTile.changed(buildGrid); // Al cambiar, recalcular la grilla
  
  // Slider para la argamasa (mortar) entre triángulos
  sliderA = createSlider(0, 100, 20, 1);
  sliderA.parent(controlsDiv);
  createSpan(" Argamasa (A) ").parent(controlsDiv);
  sliderA.changed(buildGrid);
  
  // Slider para el grosor de trazo
  sliderGrosor = createSlider(0.5, 5, 1, 0.1);
  sliderGrosor.parent(controlsDiv);
  createSpan(" Grosor del trazo ").parent(controlsDiv);
  
  // Construir la grilla inicial
  buildGrid();
  
    let controls = document.getElementById("controls");
    let p5Div = document.getElementById("p5");
  if (controls) {
    controls.style.maxWidth = "50%";
    controls.style.margin = "0 auto";
    controls.style.fontSize = ".8rem";
    controls.style.fontFamily = "Arial";
    controls.style.textTransform = "uppercase";
    controls.style.display = "flex";
    controls.style.justifyContent = "space-around";
    controls.style.flexFlow = "column";
    p5Div.style.margin = "0 auto";
    
    // Asignar estilos a los hijos directos de #controls
    let children = controls.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.width = "80%";
    }
    
    // Asignar estilos a los inputs de tipo range dentro de #controls
    let rangeInputs = controls.querySelectorAll("input[type='range']");
    rangeInputs.forEach(input => {
      input.style.margin = "3em 0 0 0";
    });
  }
}

function draw() {
  background(255);
  
  // Dibujar cada triángulo
  for (let t of triangles) {
    t.drawTriangle();
  }
}

// -----------------------------------------------------------------------------
// EVENTOS DE TECLADO
// -----------------------------------------------------------------------------
function keyPressed() {
  if (key === ' ') {
    // Al presionar ESPACIO, cada triángulo recibe un tipo aleatorio
    for (let t of triangles) {
      t.type = floor(random(7)) + 1;
    }
  } else {
    // Cualquier otra tecla: ciclar el tipo de cada triángulo
    for (let t of triangles) {
      t.type = (t.type % 7) + 1;
    }
  }
}

// -----------------------------------------------------------------------------
// RECONSTRUYE LA GRILLA DE TRIÁNGULOS
// -----------------------------------------------------------------------------
function buildGrid() {
  triangles = [];  // Vaciar el arreglo
  
  // Leer valores de los sliders
  let side = sliderTile.value();    // Lado real de cada triángulo
  let mortar = sliderA.value();     // Argamasa entre triángulos
  let margin = side;                // Margen para no recortar la primera tesela
  
  // Definir pasos de la retícula
  // hStep: paso horizontal para cada columna
  // vStep: paso vertical para cada fila
  // Se suman 'side' y 'mortar' para espaciar correctamente.
  // En una teselación equilateral “clásica” sin mortar, el paso horizontal
  // entre columnas es side/2, y cada fila se desplaza side/2 adicional
  // en columnas impares. Aquí ajustamos a (side + mortar).
  let hStep = (side + mortar) * 0.5;
  let vStep = (side + mortar) * (sqrt(3) / 2);
  
  // Calcular cuántas columnas y filas caben con este margen
  numCols = floor((width - 2 * margin) / hStep) + 1;
  numRows = floor((height - 2 * margin) / vStep) + 1;
  
  // Llenar la grilla
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // Calcular la posición (x, y) del centro de la tesela
      // Fila impar: offset horizontal extra de hStep*0.5
      let x = margin + col * hStep;
      if (row % 2 === 1) {
        x += hStep * 0.5;
      }
      let y = margin + row * vStep;
      
      // Orientación alternada: (row + col) % 2 => 0 => arriba, 1 => abajo
      let orientation = (row + col) % 2; 
      
      // Tipo aleatorio inicial (1–7)
      let ttype = floor(random(7)) + 1;
      
      // Crear y almacenar
      triangles.push(new Triangle(x, y, side, orientation, ttype));
    }
  }
}

// -----------------------------------------------------------------------------
// CLASE TRIANGLE
// -----------------------------------------------------------------------------
class Triangle {
  constructor(x, y, side, orientation, ttype) {
    this.x = x;
    this.y = y;
    this.side = side;
    this.orientation = orientation;  // 0 => triángulo hacia arriba, 1 => abajo
    this.type = ttype;
  }
  
  drawTriangle() {
    // Calcular grosor de trazo en cada frame
    let sw = sliderGrosor.value();
    
    // Trasladar al centro de la tesela
    push();
      translate(this.x, this.y);
      // Si la orientación es 1 => girar 180° para apuntar hacia abajo
      if (this.orientation === 1) {
        rotate(PI);
      }
      
      // Dibujar el contorno del triángulo
      // Centrado en (0,0) con altura side*sqrt(3)/2
      let hTercio = (this.side * sqrt(3)) / 6; 
      stroke(150);
      strokeWeight(0.5);
      noFill();
      beginShape();
        vertex(-this.side / 2,  hTercio);
        vertex( this.side / 2,  hTercio);
        vertex( 0,            -2 * hTercio);
      endShape(CLOSE);
      
      // Dibujar el trazo interno según el tipo
      stroke(0);
      strokeWeight(sw);
      switch (this.type) {
        case 1: this.type1(hTercio); break;
        case 2: this.type2(hTercio); break;
        case 3: this.type3(hTercio); break;
        case 4: this.type4(hTercio); break;
        case 5: this.type5(hTercio); break;
        case 6: this.type6(hTercio); break;
        case 7: this.type7(hTercio); break;
      }
    pop();
  }
  
  // ---------------------------------------------------------------------------
  // EJEMPLOS DE DIBUJO PARA CADA TIPO DE TESELA
  // ---------------------------------------------------------------------------
  type1(hTercio) {
    arc(0, -2 * hTercio, this.side, this.side, PI / 3, TWO_PI / 3);
    line(0, hTercio, 0, 0.7 * hTercio);
  }
  type2(hTercio) {
    beginShape();
      vertex(-this.side / 4, -hTercio / 2);
      vertex(0, 0);
      vertex(this.side / 4, -hTercio / 2);
    endShape();
    beginShape();
      vertex(0, hTercio);
      vertex(0, 0.8 * hTercio);
      vertex(0.15 * this.side, 0.5 * hTercio);
    endShape();
  }
  type3(hTercio) {
    bezier(-this.side / 4, -hTercio / 2, 0, 0, 0, 0, this.side / 4, -hTercio / 2);
    arc(this.side / 4, hTercio, this.side / 2, this.side / 2, PI * 3, -PI / 2);
  }
  type4(hTercio) {
    arc(0, -2 * hTercio, this.side, this.side, PI / 3, TWO_PI / 3);
    noStroke();
    fill(0);
    arc(0, hTercio, sliderGrosor.value(), sliderGrosor.value(), PI, -TWO_PI);
    noFill();
    stroke(0);
  }
  type5(hTercio) {
    strokeCap(SQUARE);
    line(-this.side / 4, -hTercio / 2, this.side / 4, -hTercio / 2);
    line(0, hTercio, 0.15 * hTercio, 0.7 * hTercio);
    strokeCap(ROUND);
  }
  type6(hTercio) {
    strokeCap(SQUARE);
    noFill();
    arc(0, 4 * hTercio, 2 * this.side, 2 * this.side, -(2 * PI) / 3, -PI / 3);
    arc(0, -2 * hTercio, this.side, this.side, PI / 3, TWO_PI / 3);
    strokeCap(ROUND);
  }
  type7(hTercio) {
    strokeCap(SQUARE);
    noFill();
    arc(0, 4 * hTercio, 2 * this.side, 2 * this.side, -(2 * PI) / 3, -PI / 3);
    arc(0, -2 * hTercio, this.side, this.side, PI / 3, TWO_PI / 3);
    strokeCap(ROUND);
  }
}
