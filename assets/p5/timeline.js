let startTime = 1990;
let endTime = 2030;
let graphStart = 0;
let currentYear = startTime;
let thisYear;
let yearEvents = {
    1990: "Internet",
    1991: "Linux",
    1992: "Windows 3.1",
    1993: "Mosaic",
    1994: "Amazon",
    1995: "Windows 95",
    1996: "Nokia 9000",
    1997: "Google",
    1998: "iMac G3",
    1999: "Napster",
    2000: "Burbuja Punto-com",
    2001: "Wikipedia",
    2002: "Bluetooth",
    2003: "Skype",
    2004: "Facebook",
    2005: "YouTube",
    2006: "Twitter",
    2007: "iPhone",
    2008: "Android",
    2009: "Bitcoin",
    2010: "iPad",
    2011: "Siri",
    2012: "Google Glass",
    2013: "PS4",
    2014: "Oculus Rift",
    2015: "Apple Watch",
    2016: "Pokémon GO",
    2017: "AI",
    2018: "GDPR",
    2019: "5G",
    2020: "COVID-19",
    2021: "NFTs",
    2022: "Computación Cuántica",
    2023: "ChatGPT 4",
    2024: "IA Agents",
    2025: "AGI ?"
};
let fadeValues = {};
let canvas;

function setup() {
    let w = document.getElementById("p5").offsetWidth;
    canvas = createCanvas(w, 400);
    canvas.parent("p5");
    thisYear = year();
    for (let year in yearEvents) {
        fadeValues[year] = 255;
    }
}

function draw() {
    clear();
    drawExponentialGraph();
    displayYear();
    drawLegends();
}

function drawExponentialGraph() {
    beginShape();
    noFill();
    stroke(166, 49, 23);
    for (let x = 0; x <= currentYear - startTime; x += 0.02) {
        // Avanza un pixel a la vez
        let y = pow(2, x / 5);
        vertex(
            map(x + startTime, startTime, endTime, 0, width),
            map(y, 1, pow(2, (endTime - startTime) / 5), height, 0)
        );
    }
    endShape();
}

function displayYear() {
    textFont("Barlow");
    textSize(14);
    fill(0, 150);
    noStroke();
    if (currentYear < thisYear) {
        text(nf(Math.floor(currentYear), 4), 10, 52); // Muestra el año en la esquina superior izquierda
    } else {
        text(thisYear + "...", 10, 52);
    }
    if (currentYear < endTime) {
        currentYear += (endTime - startTime) / width; // Ajusta la velocidad de avance del tiempo
    }
}

function drawLegends() {
    textSize(16);
    textFont("EB Garamond");
    noStroke();
    for (let year in yearEvents) {
        let yearInt = parseInt(year);
        if (currentYear >= yearInt) {
            fill(0, 255 - fadeValues[year]);
            let xPos = map(yearInt, startTime, endTime, 0, width);
            let yPos = height * 0.9 - (yearInt % 10) * 20; // Escalonado vertical
            text(yearEvents[year], xPos, yPos);

            push();
            {
                translate(xPos, yPos);
                rotate(-HALF_PI);
                textFont("Barlow");
                textSize(11);
                fill(166, 49, 23, 130);
                text(yearInt, 15, 9);
            }

            pop();
            if (fadeValues[year] > 10) {
                fadeValues[year]--;
            }
        }
    }
}