/*
 * Recursive Hypotenuse
 * by Herbert Spencer
 * February 2014
 */

let ang;    // this is the global angle
let levels; // this is the amount of tree levels or how many times we will call the recursive function
let cnv;

function setup() {
  cnv = createCanvas(document.getElementById('p5').offsetWidth, 500);
  noStroke();
  smooth();
  levels = 3;       // start with something small
  mouseX = width/2; // place the mouse in the middle
  mouseY = height*0.7;
  
}

function draw() {
  clear();
  blendMode(MULTIPLY);

  // the global angle can be modified by de 'x' movement of the mouse
  ang = map(mouseX, 0, width, -HALF_PI, 0); 
  levels = round(map(mouseY, 0, height, 10, 0));
  levels = constrain(levels, 0, 16);
  
  // this is where we call the recursive function
  hypotenuse(width/2 - 35, height, width/2 + 35, height, levels);
}

// this is the recursive function
// it requeres 4 floats and 1 int. The floats represent the position of 2 points, which define the hypotenuse
// the level defines how many times are we calling this function recursevely

function hypotenuse(x1, y1, x2, y2, level) {

  // determine the length, which is the distance between the points. We'll call it 'side', the side of the square
  let side = dist(x1, y1, x2, y2);

  // determine the angle between the two points... not so tricky
  let t = atan2(y2- y1, x2 - x1);

  // reset the coordinate system, just to be polite
  push();
  {
    // translate our axis to the first point, our new (0,0)
    translate(x1, y1);

    // align space to the hypothenuse, using the angle we've just calculated
    rotate(t);

    // draw the square
    fill(col(level)); // nice color with transparency
    rect(0, -side, side, side);

    // translate to the new hypothenuse
    translate(0, -side);

    // determine the lengths of the triangle sides given a global angle 'ang'. 
    // 'a, b, c'; where 'c' is the hypotenuse. We have 'c', it's the distance between the first two points, ok?

    let a = cos(ang) * side;
    let b = sin(ang) * side;

    // draw the triangle
    fill(col(level));
    beginShape();
    {
      vertex(0, 0);                       // first vertex
      vertex(cos(ang) * a, sin(ang) * a); // tricky second vertex
      vertex(side, 0);                    // third vertex
    }
    endShape();

    // this is a method to eventually escape from this recursive fuction
    if (level > 0) {
      hypotenuse(0, 0, cos(ang) * a, sin(ang) * a, level-1);
      hypotenuse(cos(ang) * a, sin(ang) * a, side, 0, level-1);
    }
  }
  pop();
}


function col(level){
  let colorRoot = color(0, 30, 200, 200);
  let colorLeaf = color(190, 245, 200, 250);
  let c = color(lerpColor(colorLeaf, colorRoot, level/16));
  return c;
}

