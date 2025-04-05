
/**
 **
 **     Face Qualify ~ for cognitive accesibility    (cc) @hspencer
 **
 **/


/* global variables */
var canvas;                                          // the current canvas
var output;                                          // output HTML container (currently hidden as #val)
var colorc, color1, color2, color3, color4, color5;  // colors
var m = 20;                                          // margin 
var M = 2 * m;                                       // real margin
var face;
var touched;                                         // boolean
var sc;                                              // global scale factor
var qualified;                                       // if the user has done something


/* x values */
var rX;          // real x constrained value within margins
var nX;          // normalized x
var sX;          // smoothed x between 1 and 5
var qX;          // qualified x (rounded from 1 to 5)

let side;        // the width of container div in html context

function setup() {
	regen();
	sc = map(sc, 240, 920, .5, 3);
	face = new Face(width/3, height/2, sc);
	strokeJoin(ROUND);
	
	/* define colors */
	color1 = color(211, 60, 47);
	color2 = color(242, 165, 45);
	color3 = color(242, 231, 69);
	color4 = color(136, 190, 70);
	color5 = color(91, 235, 74)
	colorc = color(255);
	
	output = document.getElementById('val');
	output.innerHTML = "";

	/* initialize default */
	rX = width/2;
	nX = .5;
	sX = 3;
    qX = 0;

	touched = false;
	qualified = false;
}

/* regenerate when window resized*/
function regen(){
    side = document.getElementById('canvasContainer').offsetWidth;
	canvas = createCanvas(side, side);
	canvas.parent('canvasContainer');
}

function deviceTurned(){
	regen();
}

function touchStarted() {
	if(overSlider()){
		qualified = true;
		touched = true;
		return false;
	}
}

function mouseReleased(){
	face.calcRounded();
	touched = false;
	rX = map(qX, 1, 5, m * 2, width - m * 2);
	return false;
}

function touchEnded() {
	face.calcRounded();
	rX = map(qX, 1, 5, m * 2, width - m * 2);
	touched = false;
	return false;
}

function overSlider(){
	if (mouseX > 0 && 
		  mouseX < width &&
		  mouseY > canvas.height - 60 &&
		  mouseY < canvas.height - 60+3*m){
		return true;
	}else{
		return false;
	}
}

function drawSlider(y) {
	fill(222);
	noStroke();
	rectMode(CORNER);
	rect(m, y+m, width-2*m, 2*m, m);
	fill(150);
	let x = (width-2*M) / 4;
	rectMode(CENTER);
	for(var i = 0; i < 5; i++){

		if(i == 0){
			rect(2*m + i * x, y+2*m, m, m/4);
		}else if(i == 4){
			rect(2*m + i * x, y+2*m, m, m/4);
			rect(2*m + i * x, y+2*m, m/4, m);
		}else{
			rect(2*m + i * x, y+2*m, m/4, 2*m);
		}
		
	}
	fill(colorc);
	stroke(0);
	strokeWeight(m/5);
	ellipse(rX, y+m*2, m*1.5, m*1.5);
}

function drawVal(){
	var val; // value
	if(qualified){
		face.calcRounded();
		val = qX;
	}else{
		val = "";
	}
	
	var fSize = 97  // font size
	fill(0);
	noStroke();
	textFont('Barlow', fSize);
	textAlign(CENTER, CENTER);
	text(val, width/3 * 2, height/2);

	// output.innerHTML = qX;
}

function draw() {
	clear();
	if(mouseIsPressed && overSlider() || touched && overSlider()){
		face.calc();
	}else{
		face.calcRounded();
	}

	face.drawFace();
	drawSlider(canvas.height - 4 * m);
	drawVal();
	// debug();
}

function debug(){
	output.innerHTML = "tap over slider: " + overSlider()
										+ "\nrX = " + rX.toPrecision(3) 
										+ "\t nX = " + nX.toPrecision(3) 
										+ "\nsX = " + sX.toPrecision(3) 
										+ "\t qX = " + qX;
										
}

function Face(x, y, s) {
	this.x = x; // x position
	this.y = y; // y position
	this.s = s; // scale
	
	// current, start, middle and target expression
	this.expC = this.exp1 = this.exp2 = this.exp3 = this.exp4 = this.exp5 = [];
	this.exp1 = expressionAnguish;
	this.exp2 = expressionSad;
	this.exp3 = expressionNeutral;
	this.exp4 = expressionOk;
	this.exp5 = expressionHappy;
	this.expC = this.exp3;
	
	this.calc = function() {
			
		rX = constrain(mouseX, M, width-M);  // real x constrained value within margins
		nX = map(rX, M, width-M, 0, 1);      // normalized value of nX
		sX = nX * 4 + 1;                     // smoothed x between 1 and 5
		
		var interval;

		if(sX >= 1 && sX < 2){
			interval = map(sX, 1, 2, 0, 1);
			this.interpolateExpression(this.exp1, this.exp2, interval);
			colorc = lerpColor(color1, color2, interval);
		}else if(sX >= 2 && sX < 3){
			interval = map(sX, 2, 3, 0, 1);
			this.interpolateExpression(this.exp2, this.exp3, interval);
			colorc = lerpColor(color2, color3, interval);
		}else if(sX >= 3 && sX < 4){
			interval = map(sX, 3, 4, 0, 1);
			this.interpolateExpression(this.exp3, this.exp4, interval);
			colorc = lerpColor(color3, color4, interval);
		}else if(sX >= 4 && sX <= 5){
			interval = map(sX, 4, 5, 0, 1);
			this.interpolateExpression(this.exp4, this.exp5, interval);
			colorc = lerpColor(color4, color5, interval);
		}
	}

	this.interpolateExpression = function(expression1, expression2, percentage){
		for(var i = 0; i < this.expC.length; i++){
			this.expC[i][0] = lerp(expression1[i][0], expression2[i][0], percentage);
			this.expC[i][1] = lerp(expression1[i][1], expression2[i][1], percentage);
		}
	}

	this.calcRounded = function(){
		
		qX = Math.round(sX);

		if(qualified){
			switch(qX){
				case 1:
				this.expC = this.exp1;
				colorc = color1;
				break;
				case 2:
				this.expC = this.exp2;
				colorc = color2;
				break;
				case 3:
				this.expC = this.exp3;
				colorc = color3;
				break;
				case 4:
				this.expC = this.exp4;
				colorc = color4;
				break;
				case 5:
				this.expC = this.exp5;
				colorc = color5;
				break;
			}
		}else{
			colorc = color(255);
		} 
	}

	this.drawFace = function() {
		push();
		translate(this.x, this.y);
		scale(this.s);
		this.drawContour();
		this.drawEyes();
		this.drawNose();
		this.drawEyebrows();
		this.drawMouth();
		pop();
	}

	this.drawContour = function() {
		var a = createVector(-68.0, -32.0);
		var b = createVector(-75.0, -146.0);
		var c = createVector(-64.0, 115.0);
		noStroke();
		fill(colorc);
		beginShape();
		vertex(a.x, a.y);
		bezierVertex(b.x, b.y, -b.x, b.y, -a.x, a.y);
		vertex(-a.x, a.y);
		bezierVertex(-c.x, c.y, c.x, c.y, a.x, a.y);
		endShape();
	}

	this.drawEyes = function() {
		fill(0);
		noStroke();
		ellipse(this.expC[10][0], this.expC[10][1], 10, 10);
		ellipse(-this.expC[10][0], this.expC[10][1], 10, 10);
	}

	this.drawNose = function() {
		stroke(0);
		strokeWeight(3);
		noFill();
		beginShape();
		vertex(this.expC[4][0], this.expC[4][1]);
		vertex(this.expC[5][0], this.expC[5][1]);
		vertex(this.expC[6][0], this.expC[6][1]);
		endShape();
	}

	this.drawEyebrow = function() {
		stroke(0);
		strokeWeight(3);
		noFill();
		bezier(
			this.expC[0][0], this.expC[0][1], 
			this.expC[1][0], this.expC[1][1], 
			this.expC[2][0], this.expC[2][1], 
			this.expC[3][0], this.expC[3][1]);
	}

	this.drawEyebrows = function() {
		// left
		this.drawEyebrow();
		// right
		push();
		scale(-1, 1);
		this.drawEyebrow();
		pop();
	}

	this.drawMouth = function() {
		fill(0);
		beginShape();  
		vertex(this.expC[7][0], this.expC[7][1]);  
		bezierVertex(this.expC[8][0], this.expC[8][1], -this.expC[8][0], this.expC[8][1], -this.expC[7][0], this.expC[7][1]);
		vertex(-this.expC[7][0], this.expC[7][1]);
		bezierVertex(-this.expC[9][0], this.expC[9][1], this.expC[9][0], this.expC[9][1], this.expC[7][0], this.expC[7][1]);
		endShape(CLOSE);
	}
}


//======================= expression data =======================


/* 1 */
var expressionAnguish = [
[-57, -40], 
[-43, -57], 
[-27, -54], 
[-12, -56], 
[-5, -37], 
[-12, 2], 
[3, 2], 
[-32, 41], 
[-18, 18], 
[-12, 36], 
[-32, -32]
];


/* 2 */
var expressionSad = [
[-55, -38], // 0
[-43, -52], // 1
[-27, -54], // 2
[-13, -50], // 3
[-5, -37],  // 4
[-12, 2],   // 5
[3, 2],     // 6
[-24, 33],  // 7
[-2, 29],   // 8
[-12, 29],  // 9
[-32, -32]  // 10
];

/* 3 */
var expressionNeutral = [
[-55, -38], 
[-43, -52], 
[-27, -54], 
[-13, -44], 
[-5, -37], 
[-12, 2], 
[3, 2], 
[-20, 28], 
[-2, 29], 
[-12, 29], 
[-32, -32]
];

/* 4 */
var expressionOk = [
[-55, -38], 
[-43, -52], 
[-27, -54], 
[-13, -44], 
[-5, -37], 
[-12, 2], 
[3, 2], 
[-22, 25], 
[-4, 33], 
[-4, 33], 
[-32, -32]
];

/* 5 */
var expressionHappy = [
[-57, -40], 
[-43, -57], 
[-27, -54], 
[-15, -49], 
[-5, -37], 
[-12, 2], 
[3, 2], 
[-29, 22], 
[-4, 28], 
[-14, 52], 
[-32, -32]
];