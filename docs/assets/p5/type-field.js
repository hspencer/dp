let str =
  "¿no fue el hallazgo ajeno descubrimientos oh marinos sus pájaras salvajes mar incierto gentes desnudas entre sus dioses! porquedon mostrarse equivoca esperanza? no dejó así primera pasión oro navegante ciego esa claridad sin nombre tarde premia destruye apariencia?";
let str_arr = [];

let font;
let sdgreg;

function preload() {
  font = loadFont("/assets/p5/Barlow.ttf");
}

let cnv;

function setup() {
  cnv = createCanvas(document.getElementById("p5").offsetWidth, document.getElementById("p5").offsetWidth, WEBGL);
  cnv.parent("p5");
  
  document.getElementById("p5").style.margin = "3em 0"; 
  document.getElementById("p5").style.borderRadius = "50%"; 
  document.getElementById("p5").style.overflow = "hidden"; 
  document.getElementById("p5").style.boxShadow = "inset 10px 14px 4px #0002"; 

  let strs = str.split(" ");
  for (let i = 0; i < strs.length * 10; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let z = random(-width * 5, width / 2);
    str_arr.push(new Type(strs[i % strs.length], x, y, z));
  }
}

function draw() {
  clear();
  orbitControl();
  for (let i = 0; i < str_arr.length; i++) {
    str_arr[i].update();
    str_arr[i].display();
  }
}

class Type {
  constructor(_str, _x, _y, _z) {
    this.str = _str;
    this.x = _x;
    this.y = _y;
    this.z = _z;
  }

  update() {
    this.z += 2;
    if (this.z > width / 2) {
      this.z = -width * 5;
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(80);
    fill(0, 120);
    text(this.str, 0, 0);
    pop();
  }
}
