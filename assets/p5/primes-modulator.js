/*

    primes modulator (2006)
    ported to p5js in 2025.
    not optimized yet

*/

let primes;
let linesBot, dotsBot;
let PointNumber = [];

let continous = true;
let drawlines = true;
let drawdots = false;
let spiral = 0;
let CURRENT = " ";

let spacer, rot, aspect, scl, sw;
let total, alfa, a;
let toggle = 1;

let minX = 20.0;
let maxX = 90.0;
let minY = minX;
let maxY = 800 - minY;
let widthX = maxX - minX;
let heightY = maxY - minY;
let gap = 9.0;
let mod = (heightY - 2 * gap) / 21;
let val = 0;
let ex = 0.9;
let mapper;
let command;
let value;

function preload() {
    primes = loadTable('/assets/uploads/2007/11/primes.tsv', 'tsv', 'header');
}

function setup() {
    let w = document.getElementById('p5').offsetWidth;
    let cnv = createCanvas(w, windowHeight * .8);
    cnv.parent('p5');
    ellipseMode(CENTER);
    smooth();
    resetSpiral();

    linesBot = new Button("Draw Lines", width - 120, 105);
    dotsBot = new Button("Draw Intergers", width - 120, 135);
    linesBot.press = true;

    let l = primes.getRowCount();
    PointNumber = new Array(l);
    for (let i = 0; i < l; i++) {
        PointNumber[i] = new PointNumberClass(i);
    }
}

function draw() {
    clear();
    stroke(0);
    fill(200, 0, 0);

    push();
    translate(width / 2, height / 2);

    switch (spiral) {
        case 0:
            spiral_0();
            break;
        case 1:
            spiral_1();
            break;
        case 2:
            spiral_2();
            break;
        case 3:
            spiral_3();
            break;
    }
    pop();
    controls();
    renderText();
}

class Button {
    constructor(txt, x, y) {
        this.label = txt;
        this.xpos = x;
        this.ypos = y;
        this.over = false;
        this.press = false;
        textSize(8);
        this.xdim = textWidth(this.label) + 10;
        this.ydim = textAscent() + textDescent() + 10;
    }

    update() {
        if (mouseX > this.xpos && mouseX < this.xpos + this.xdim && mouseY > this.ypos && mouseY < this.ypos + this.ydim) {
            this.over = true;
        } else {
            this.over = false;
        }
    }

    render() {
        textSize(8);
        this.update();
        stroke(200);
        noFill();
        if (this.over) {
            fill(255, 0, 0, 70);
        }
        if (this.press) {
            this.drawVicto(this.xpos + this.xdim + 6, this.ypos + 6);
        }
        strokeWeight(1);
        rect(this.xpos, this.ypos, this.xdim, this.ydim);
        textAlign(CENTER);
        fill(0);
        text(this.label, this.xpos + this.xdim / 2, this.ypos + 14);
        strokeWeight(1);
    }

    drawVicto(xpos, ypos) {
        noFill();
        stroke(255, 0, 0);
        strokeWeight(1);
        beginShape();
        vertex(xpos, ypos + 5);
        vertex(xpos + 3, ypos + 8);
        vertex(xpos + 12, ypos - 4);
        endShape();
        stroke(200);
    }
}

class Controler {
    constructor(txt, x, y) {
        this.label = txt;
        this.xpos = x;
        this.ypos = y;
        textSize(8);
        this.xdim = textWidth(this.label) + 10;
        this.ydim = textAscent() + textDescent() + 10;
    }
}
class PointNumberClass {
    constructor(n) {
        this.num = n;
        this.isPrime = false;
        this.over = false;
        this.xpos = 0;
        this.ypos = 0;
        this.xdim = 0;
        this.ydim = 0;
    }

    render(x, y, xdim, ydim) {
        this.xpos = x;
        this.ypos = y;
        this.xdim = xdim;
        this.ydim = ydim;
    
        // Dibuja el punto
        noStroke();
        fill(this.isPrime ? color(255, 0, 0) : color(0));
        ellipse(this.xpos, this.ypos, this.xdim, this.ydim);
    
        // Calcular posición en pantalla (asumiendo translate(width/2, height/2) en draw)
        let screenX = this.xpos + width / 2;
        let screenY = this.ypos + height / 2;
    
        let distance = dist(mouseX, mouseY, screenX, screenY);
    
        if (distance <= this.xdim/2 && this.isPrime) {
            CURRENT = nf(this.num, 0);
            this.over = true;
        } else {
            if (CURRENT === nf(this.num, 0)) {
                CURRENT = " ";
            }
            this.over = false;
        }
    
        // Dibuja halo si está en hover
        if (this.over) {
            push();
            resetMatrix();
            stroke(0);
            noFill();
            ellipse(screenX, screenY, this.xdim + 4, this.ydim + 4);
            pop();
        }
    }
}

function function_ExponentialEmphasis(x, a) {
    let epsilon = 0.00001;
    let min_param_a = 0.0 + epsilon;
    let max_param_a = 1.0 - epsilon;
    a = constrain(a, min_param_a, max_param_a);

    if (a < 0.5) {
        // emphasis
        a = 2 * a;
        let y = pow(x, a);
        return y;
    } else {
        // de-emphasis
        a = 2 * (a - 0.5);
        let y = pow(x, 1.0 / (1 - a));
        return y;
    }
}

function controls() {
    linesBot.render();
    dotsBot.render();

    // Redefinimos áreas verticales
    let topBoxY = minY;
    let topBoxH = 10 * mod;

    let centerBoxY = topBoxY + topBoxH + gap;
    let centerBoxH = mod;

    let bottomBoxY = centerBoxY + centerBoxH + gap;
    let bottomBoxH = 10 * mod;

    // Guarda los valores para usarlos también en mousePressed
    window.controlZones = {
        top: { y: topBoxY, h: topBoxH },
        center: { y: centerBoxY, h: centerBoxH },
        bottom: { y: bottomBoxY, h: bottomBoxH }
    };

    strokeWeight(1);
    stroke(0, 100);
    noFill();

    // Dibujo con hover
    if (mouseIsPressed) {
        if (mouseX > minX && mouseX < maxX) {
            if (mouseY > topBoxY && mouseY < topBoxY + topBoxH) {
                fill(255, 0, 0, 70);
            }
        }
    }
    rect(minX, topBoxY, widthX, topBoxH); // Arriba

    noFill();
    rect(minX, centerBoxY, widthX, centerBoxH); // Centro

    if (mouseIsPressed) {
        if (mouseX > minX && mouseX < maxX) {
            if (mouseY > bottomBoxY && mouseY < bottomBoxY + bottomBoxH) {
                fill(255, 0, 0, 70);
            }
        }
    }
    rect(minX, bottomBoxY, widthX, bottomBoxH); // Abajo

    // Triángulos centrados
    let centerY = centerBoxY + centerBoxH / 2;
    fill(0);
    noStroke();
    triangle(
        minX - gap, centerY,
        minX - gap / 2, centerY - gap / 2,
        minX - gap / 2, centerY + gap / 2
    );
    triangle(
        maxX + gap, centerY,
        maxX + gap / 2, centerY - gap / 2,
        maxX + gap / 2, centerY + gap / 2
    );

    // Textos centrados en bloques
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(0);
    text("+", minX + widthX / 2, topBoxY + topBoxH / 2);
    text("−", minX + widthX / 2, bottomBoxY + bottomBoxH / 2);
    textSize(11);
    text(`${command}\n${value}`, minX + widthX / 2, centerY);

    // Determinar si es modo continuo
    continous = !(toggle === 2 || toggle === 3 || toggle === 9);

    // Actualizar valor si mouse está en zona continua
    if (continous && mouseIsPressed) {
        if (mouseX > minX && mouseX < maxX) {
            if (mouseY > topBoxY && mouseY < topBoxY + topBoxH) {
                let mapper = map(mouseY, topBoxY, topBoxY + topBoxH, 1, 0);
                val = function_ExponentialEmphasis(mapper, ex);
            }
            if (mouseY > bottomBoxY && mouseY < bottomBoxY + bottomBoxH) {
                let mapper = map(mouseY, bottomBoxY, bottomBoxY + bottomBoxH, 0, 1);
                val = -function_ExponentialEmphasis(mapper, ex);
            }
        }
        if (sw < 0.01) sw = 0.1;
    }

    // Aplicar valor al parámetro actual
    switch (toggle) {
        case 1:
            rot += val;
            command = "rotation";
            value = nfc(rot, 3);
            break;
        case 2:
            a += int(val);
            command = "a value";
            value = nfc(a, 0);
            break;
        case 3:
            total += int(val * 5);
            command = "total";
            value = nfc(total, 0);
            break;
        case 4:
            spacer += val;
            command = "scale";
            value = nfc(spacer, 3);
            break;
        case 5:
            scl += val;
            command = "ball scale";
            value = nfc(scl, 3);
            break;
        case 6:
            sw += val;
            command = "strk weight";
            value = nfc(sw, 3);
            break;
        case 7:
            alfa += int(val * 4);
            command = "alpha";
            value = nfc(alfa, 0);
            break;
        case 8:
            aspect += val;
            command = "ball aspect";
            value = nfc(aspect, 3);
            break;
        case 9:
            spiral += int(val * 5);
            if (spiral > 3) spiral = 0;
            if (spiral < 0) spiral = 3;
            value = nfc(spiral, 0);
            break;
    }
}

function mousePressed() {
    if (dotsBot.over) {
        dotsBot.press = !dotsBot.press;
    }

    if (linesBot.over) {
        linesBot.press = !linesBot.press;
    }

    if (mouseX < minX && mouseY > minY + 10 * mod + gap && mouseY < minY + 11 * mod + gap) {
        fill(255, 0, 0);
        triangle(gap / 2, height / 2, minX - gap, height / 2 - gap / 2, minX - gap, height / 2 + gap / 2);
        if (toggle === 1) {
            toggle = 9;
        } else {
            toggle -= 1;
        }
    }
    if (mouseX > maxX && mouseX < maxX + mod && mouseY > minY + 10 * mod + gap && mouseY < minY + 11 * mod + gap) {
        fill(255, 0, 0);
        triangle(maxX + gap, height / 2 - gap / 2, maxX + minX - gap / 2, height / 2, maxX + gap, height / 2 + gap / 2);
        if (toggle === 9) {
            toggle = 1;
        } else {
            toggle += 1;
        }
    }

    if (!continous) {
        if (mouseX > minX && mouseX < maxX && mouseY > minY && mouseY < minY + 10 * mod) {
            switch (toggle) {
                case 2:
                    a += 1;
                    break;
                case 3:
                    total += 1;
                    break;
                case 9:
                    spiral += 1;
                    if (spiral > 3) {
                        spiral = 0;
                    }
                    resetSpiral();
                    break;
            }
        }
        if (mouseX > minX && mouseX < maxX && mouseY > minY + 11 * mod + 2 * gap && mouseY < maxY) {
            switch (toggle) {
                case 2:
                    a -= 1;
                    break;
                case 3:
                    total -= 1;
                    break;
                case 9:
                    spiral -= 1;
                    if (spiral < 0) {
                        spiral = 3;
                    }
                    resetSpiral();
                    break;
            }
        }
    }
}

function mouseReleased() {
    val = 0;
}

function renderText() {
    textFont("Barlow")
    textSize(10);

    let rotat = -(PI / a) * rot;
    let ra = nfc(rot, 3);
    let rb = nfc(rotat, 3);
    let sp = nfc(spacer, 3);

    fill(0);
    // textAlign(CENTER);
    // text(command, minX + widthX / 2, height / 2 - 5);
    // text(value, minX + widthX / 2, height / 2 + 10);
    textAlign(LEFT);
    text(
        "toggle = " +
        toggle +
        "  rot = " +
        ra +
        "    rotate(" +
        rb +
        ")" +
        "  spacer = " +
        sp +
        "  a = " +
        a +
        "  aspect = " +
        aspect +
        "    total = " +
        total,
        100,
        height - 20
    );
    if (!continous) {
        fill(255, 0, 0);
        text("discreet mode", width - 100, height - 20);
    }
    push();
    resetMatrix(); 
    textSize(48);
    let idx = parseInt(CURRENT);
    if (!isNaN(idx) && idx >= 0 && idx < PointNumber.length) {
        fill(PointNumber[idx].isPrime ? color(255, 0, 0) : color(0));
        text(CURRENT, width - 100, 50);
    } else {
        text(" ", width - 100, 50);
    }
    pop();
}

function keyPressed() {
    if (key === "s") {
        spiral += 1;
        spiral %= 4;
    }

    if (key === "d") {
        total += 1;
    }

    if (key === "c") {
        total -= 1;
    }

    if (key === " ") {
        resetSpiral();
    }
}

function spiral_0() {
    let n;
    let side = 1;
    let num = 1;

    for (let i = 0; i < total; i++) {
        for (let j = 0; j < a; j++) {
            for (let k = 0; k < side; k++) {
                strokeWeight(sw);
                stroke(0, alfa);

                if (linesBot.press) {
                    line(k * spacer, 0, k * spacer + spacer, 0);
                }

                n = primes.getNum(num - 1, 1);

                if (n !== 0) {
                    noStroke();
                    fill(255, 0, 0);
                    PointNumber[num - 1].isPrime = true;
                    PointNumber[num - 1].render(
                        k * spacer,
                        0,
                        scl * spacer * 0.9,
                        scl * spacer * 0.9 * aspect
                    );
                }

                if (n === 0 && dotsBot.press) {
                    noStroke();
                    fill(0, alfa);
                    PointNumber[num - 1].render(
                        k * spacer,
                        0,
                        scl * spacer * 0.7,
                        scl * spacer * 0.7 * aspect
                    );
                }

                num += 1;

                if (num >= 10000) {
                    num = 0;
                }

                if (k === side - 1) {
                    translate(k * spacer + spacer, 0);
                }
            }
            rotate(-(PI / a) * rot);
        }
        side += 1;
    }
}

function spiral_1() {
    let num = 1;
    let x1, y1, x2, y2, fraq, r, t1, t2, n;

    for (let i = 1; i <= total; i++) {
        fraq = i / total;
        r = spacer * i;
        t1 = rot * fraq * TWO_PI;

        strokeWeight(sw);
        stroke(0, alfa);
        x1 = r * sin(t1);
        y1 = r * cos(t1);

        fraq = (i + 1) / total;
        r = spacer * (i + 1);
        t2 = rot * fraq * TWO_PI;

        x2 = r * sin(t2);
        y2 = r * cos(t2);
        if (linesBot.press) {
            line(x1, y1, x2, y2);
        }

        n = primes.getNum(num - 1, 1);

        if (n === 0 && dotsBot.press) {
            fill(0, alfa);
            push();
            translate(x1, y1);
            rotate(atan2(y1, x1) + HALF_PI);
            PointNumber[num - 1].render(
                0,
                0,
                scl * spacer * 0.7,
                scl * spacer * 0.7 * aspect
            );
            pop();
        }

        if (n !== 0) {
            noStroke();
            fill(255, 0, 0);
            push();
            translate(x1, y1);
            rotate(atan2(y1, x1) + HALF_PI);
            PointNumber[num - 1].isPrime = true;
            PointNumber[num - 1].render(
                0,
                0,
                scl * spacer * 0.9,
                scl * spacer * 0.9 * aspect
            );
            pop();
        }
        num += 1;

        if (num >= 10000) {
            num = 0;
        }
    }
}

function spiral_2() {
    let n, em, coe;
    let num = 1;

    push();
    for (let i = 0; i < total; i++) {

        n = primes.getNum(num - 1, 1);
        strokeWeight(sw);
        stroke(0, alfa);
        coe = i / total;
        em = function_ExponentialEmphasis(coe, 0.2);

        if (linesBot.press) {
            line(0, 0, spacer, 0);
        }

        if (n !== 0) {
            PointNumber[i].isPrime = true;
            PointNumber[i].render(
                0,
                0,
                scl * spacer * 0.9,
                scl * spacer * 0.9 * aspect
            );
        } else {
            PointNumber[i].isPrime = false;
        }

        if (n === 0 && dotsBot.press) {
            PointNumber[i].render(
                0,
                0,
                scl * spacer * 0.7,
                scl * spacer * 0.7 * aspect
            );
        }

        translate(spacer, 0);
        rotate(em / rot);

        if (PointNumber[i].over) {
            fill(255, 0, 0);
            text(PointNumber[i].num + 1, 0, 0);
        }

        num += 1;
        if (num >= 10000) {
            num = 0;
        }
    }
    pop();
}

function spiral_3() {
    let n, em, coe;
    let num = 1;

    translate(-width / 2, 0);
    push();
    for (let i = 0; i < total; i++) {

        n = primes.getNum(num - 1, 1);
        strokeWeight(sw);
        stroke(0, alfa);
        coe = total / (i + 1);
        em = function_ExponentialEmphasis(coe, 0.12);

        if (linesBot.press) {
            line(0, 0, spacer * em, 0);
        }

        if (n !== 0) {
            PointNumber[i].isPrime = true;
            PointNumber[i].render(
                0,
                0,
                scl * spacer * 0.9,
                scl * spacer * 0.9 * aspect
            );
        } else {
            PointNumber[i].isPrime = false;
        }

        if (n === 0 && dotsBot.press) {
            PointNumber[i].render(
                0,
                0,
                scl * spacer * 0.7,
                scl * spacer * 0.7 * aspect
            );
        }

        translate(spacer * em, 0);
        rotate(rot * (i / a) / TWO_PI);

        if (PointNumber[i].over) {
            fill(255, 0, 0);
            text(PointNumber[i].num + 1, 0, 0);
        }

        num += 1;
        if (num >= 10000) {
            num = 0;
        }
    }
    pop();
}

function resetSpiral() {
    if (spiral === 0) {
        total = 24;
        alfa = 40;
        spacer = 25.0;
        rot = 1.0;
        a = 2;
        aspect = 1.0;
        scl = 0.4;
        sw = 5.0;
    }

    if (spiral === 1) {
        total = 600;
        alfa = 100;
        spacer = 0.559;
        rot = -14.275;
        a = 2;
        aspect = 1.0;
        scl = 7.85;
        sw = 0.25;
    }

    if (spiral === 2) {
        total = 376;
        alfa = 50;
        spacer = 22.132;
        rot = 1.36;
        a = 2;
        aspect = 1.0;
        scl = 0.3;
        sw = 0.5;
    }

    if (spiral === 3) {
        total = 376;
        alfa = 50;
        spacer = 22.132;
        rot = 1.36;
        a = 2;
        aspect = 1.0;
        scl = 0.3;
        sw = 0.5;
    }
}