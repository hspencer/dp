let teselas = [];
let numX, numY;
let A = 100.0;
let lineas = false;
let grosor = 7;

function setup() {
  let w = document.getElementById('p5').offsetWidth;
  let divP5 = document.getElementById('p5');
  let cnv = createCanvas(w, w);
  
  cnv.style.borderRadius = "50%";
  cnv.style.border = "2px solid #0003";

  cnv.parent('p5');
  smooth();
  strokeCap(SQUARE);
  calcularNumeroDeTeselas();
  crearTeselas();
  ubicarTeselas();
}

function draw() {
  clear(); // Usamos clear() en lugar de background()
  dibujarTeselas();
}

class Tesela {
  constructor(_a, _xpos, _ypos, _parada) {
    this.a = _a;
    this.xpos = _xpos;
    this.ypos = _ypos;
    this.parada = _parada;
    this.giros = int(random(4));
    this.rot = TWO_PI/3.0 * float(this.giros);
    this.tipo = int(random(7)) + 1;
  }

  dibujar() {
    this.hTercio = sqrt(3)*this.a/6;
    let dif;
    if (this.girando) {
      dif = this.rotTarget - this.rot;
      this.rot += dif * 0.2;
      if (dif < 0.01) {
        this.rot = this.rotTarget;
        this.girando = false;
      }
    }
    push();
    translate(this.xpos, this.ypos);
    if (!this.parada) {
      rotate(PI/3);
    }
    rotate(this.rot);
    fill(255); // Fondo blanco para todas las teselas
    
    if (this.sobre) {
      stroke('#E51515'); // Trazo rojo en rollover
    } 

    noStroke();
    beginShape();
    vertex(-this.a/2, this.hTercio);
    vertex(this.a/2, this.hTercio);
    vertex(0, -2*this.hTercio);
    endShape(CLOSE);
    
    if (lineas) {
      strokeWeight(0.5);
      stroke(0, 100);
      beginShape();
      vertex(-this.a/2, this.hTercio);
      vertex(this.a/2, this.hTercio);
      vertex(0, -2*this.hTercio);
      endShape(CLOSE);
    }
    noFill();
    stroke(0);
    switch(this.tipo) {
    case 1:
      this.tipo1();
      break;
    case 2:
      this.tipo2();
      break;
    case 3:
      this.tipo3();
      break;
    case 4:
      this.tipo4();
      break;
    case 5:
      this.tipo5();
      break;
    case 6:
      this.tipo6();
      break;
    case 7:
      this.tipo7();
      break;
    }
    pop();
    this.calc();
  }

  tipo1() {
    strokeWeight(grosor);
    arc(0, -2*this.hTercio, this.a, this.a, PI/3, TWO_PI/3);
    line(0, this.hTercio, 0, this.hTercio*0.7);
  }

  tipo2() {
    strokeWeight(grosor);
    beginShape();
    vertex(-this.a/4, -this.hTercio/2);
    vertex(0, 0);
    vertex(this.a/4, -this.hTercio/2);
    endShape();
    beginShape();
    vertex(0, this.hTercio);
    vertex(0, this.hTercio*0.8);
    vertex(this.a*0.15, this.hTercio*0.5);
    endShape();
  }

  tipo3() {
    strokeWeight(grosor);
    bezier(-this.a/4, -this.hTercio/2, 0, 0, 0, 0, this.a/4, -this.hTercio/2);
    arc(this.a/4, this.hTercio, this.a/2, this.a/2, PI*3, -PI/2);
  }

  tipo4() {
    strokeWeight(grosor);
    arc(0, -2*this.hTercio, this.a, this.a, PI/3, TWO_PI/3);
    noStroke();
    fill(this.sobre ? '#E51515' : 0);
    arc(0, this.hTercio, grosor, grosor, PI, -TWO_PI);
    noFill();
  }

  tipo5() {
    strokeWeight(grosor);
    strokeCap(SQUARE);
    line(-this.a/4, -this.hTercio/2, this.a/4, -this.hTercio/2);
    line(0, this.hTercio, this.hTercio*0.15, this.hTercio*0.7);
    strokeCap(SQUARE);
  }

  tipo6() {
    strokeWeight(grosor);
    noFill();
    strokeCap(SQUARE);
    arc(0, 4*this.hTercio, 2*this.a, 2*this.a, -PI*2/3, -PI/3);
    strokeCap(SQUARE);
    arc(0, -2*this.hTercio, this.a, this.a, PI/3, TWO_PI/3);
  }

  tipo7() {
    strokeWeight(grosor);
    noFill();
    strokeCap(SQUARE);
    arc(0, 4*this.hTercio, 2*this.a, 2*this.a, -PI*2/3, -PI/3);
    strokeCap(SQUARE);
  }

  calc() {
    this.distanciaMouse = dist(this.xpos, this.ypos, mouseX, mouseY);
    this.sobre = this.distanciaMouse < sqrt(3)*this.a/6;
  }
}

function calcularNumeroDeTeselas() {
  numX = int(width/(A/2))+1;
  numY = int(height/(sqrt(3)*A/2))+1;
  teselas = new Array(numX*numY);
}

function crearTeselas() {
  for (let i = 0; i < teselas.length; i++) {
    teselas[i] = new Tesela(A*0.95, -1000, -1000, false);
  }
}

function ubicarTeselas() {
  let c = 0;
  let filaPar = true;
  for (let y = 0; y < numY; y++) {
    let teselaDerecha = true;
    let xOffset = (filaPar && teselaDerecha) || (!filaPar && !teselaDerecha) ? 0 : A / 2;
    for (let x = 0; x < numX; x++) {
      teselas[c].xpos = (A / 2 * x) + xOffset;
      teselas[c].ypos = (sqrt(3) * A / 2 * y) - (teselaDerecha ? 0 : sqrt(3) * A / 6);
      teselas[c].parada = teselaDerecha;
      c++;
      teselaDerecha = !teselaDerecha;
    }
    filaPar = !filaPar;
  }
}

function dibujarTeselas() {
  for (let tesela of teselas) {
    tesela.dibujar();
  }
}

function agrandarTeselas() {
  for (let tesela of teselas) {
    tesela.a++;
  }
}

function achicarTeselas() {
  for (let tesela of teselas) {
    tesela.a--;
  }
}

function agrandarEspacio() {
  A++;
  ubicarTeselas();
}

function achicarEspacio() {
  if (teselas[0].a <= A) A--;
  ubicarTeselas();
}

function todasMismoTipo(tipo) {
  for (let tesela of teselas) {
    tesela.tipo = tipo;
  }
}

function todasTipoCualquiera() {
  for (let tesela of teselas) {
    tesela.tipo = int(random(7))+1;
  }
}

function todasGiran() {
  for (let tesela of teselas) {
    if (!tesela.girando) {
      tesela.rotTarget = tesela.rot + TWO_PI/3 * float(int(random(2))+1);
      tesela.girando = true;
    }
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    for (let tesela of teselas) {
      if (tesela.sobre && !tesela.girando) {
        tesela.rotTarget = tesela.rot + TWO_PI/3;
        tesela.girando = true;
      }
    }
  }
  if (mouseButton === RIGHT) {
    for (let tesela of teselas) {
      if (tesela.sobre && !tesela.girando) {
        tesela.tipo = (tesela.tipo % 7) + 1;
      }
    }
  }
}

function keyPressed() {
  if ((key === 'a' || key === 'A') && teselas[0].a <= A) agrandarTeselas();
  if (key === 'z' || key === 'Z') achicarTeselas();
  if (key === 's' || key === 'S') agrandarEspacio();
  if (key === 'x' || key === 'X') achicarEspacio();
  if (key === 'd' || key === 'D') grosor += 0.5;
  if (key === 'c' || key === 'C' && grosor > 1) grosor -= 0.5;
  if (key === 'g' || key === 'G') todasGiran();
  if (key === 'l' || key === 'L') lineas = !lineas;
  if (key === '1') todasMismoTipo(1);
  if (key === '2') todasMismoTipo(2);
  if (key === '3') todasMismoTipo(3);
  if (key === '4') todasMismoTipo(4);
  if (key === '5') todasMismoTipo(5);
  if (key === '6') todasMismoTipo(6);
  if (key === '7') todasMismoTipo(7);
  if (key === '0') todasTipoCualquiera();
  if (key === 'r' || key === 'R') {
    calcularNumeroDeTeselas();
    crearTeselas();
    ubicarTeselas();
  }
}