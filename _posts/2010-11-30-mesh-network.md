---
layout: post
permalink: /2010/11/mesh-network/
title: Mesh Network
seo_title: Mesh Network, an example
description: This is an interactive demosntration depicting a mesh network at work.
  This is an example of how communication networks should work during crises.
date: 2010-11-30 21:42:19 -0000
last_modified_at: 2015-08-02 21:30:39 -0000
publish: true
categories:
- code
tags:
- "catástrofe"
- concepto
- "ilustración"
- mesh
- network
- processing.js
- red mesh
---
Esta ilustración fue generada para explicar el funcionamiento de una red enmallada (mesh network) en cuanto figura de distribución y conexión entre nodos. La aplicación práctica de esta red fue discutida en el [post anterior](http://herbertspencer.net/2010/10/internet-como-bien-publico/), describiendo la necesidad de una arquitectura de red resistente a cataclismos como el pasado terremoto y donde todos los nodos aportan, yendo más allá de ser meros clientes. Una red pública es aquella donde cada participante expande su alcance por el simple hecho de pertenecer.

[p5js code canvas] void setup() { size(500, 500); NODES = new ArrayList(); for (int i = 0; i < numNodes; i++) { Node n = new Node(random(margin, width-margin), random(margin, height-margin)); if (random(1) >0.25) { n.device = true; } else { n.r *= 1.5; } NODES.add(n); } newNode = false; smooth(); } void draw() { background(255); if (newNode) { NODES.add(current); newNode = false; } for (int i = 0; i < NODES.size (); i++) { Node n = (Node)NODES.get(i); n.calc(); n.renderLinks(); } for (int i = 0; i < NODES.size (); i++) { Node n = (Node)NODES.get(i); n.calc(); if (n.device) { n.renderDevice(); } else { n.renderNode(); } } } class Node { int id; // the ID of this node float x, y; // position float r; // radius float signal; // ammount of signal boolean on; // is it on? boolean over; // is the mouse over this one? ArrayList nodes; // list of nodes that are connected to this one boolean device = false; float angle, step; Node(float X, float Y) { count++; id = count; x = X; y = Y; signal = 0; on = true; nodes = new ArrayList(); r = 7.0; angle = random(TWO_PI); step = random(1); } void renderNode() { if (over) { noFill(); stroke(linkColor); strokeWeight(.50); ellipse(x, y, nodeScope, nodeScope); fill(nodeFillColor); stroke(nodeStrokeColor); } else { fill(nodeFillColor, 150); stroke(nodeStrokeColor, 50); } if (on) { strokeWeight(3); } else { strokeWeight(0.5); } ellipse(x, y, r, r); } void renderDevice() { move(); if (over) { noFill(); stroke(linkColor); strokeWeight(.5); ellipse(x, y, nodeScope, nodeScope); fill(deviceFillColor); stroke(deviceStrokeColor); } else { fill(deviceFillColor, 150); stroke(deviceStrokeColor, 150); } if (on) { strokeWeight(1); } else { noStroke(); } ellipse(x, y, r, r); } void renderLinks() { if (on) { stroke(linkColor, 100); for (int i = 0; i < nodes.size (); i++) { Node n = (Node)nodes.get(i); float d = dist(x, y, n.x, n.y); float sw = map(d, r, nodeScope, 5, 0.1); sw = constrain(sw, 0.01, 20); strokeWeight(sw); line(x, y, n.x, n.y); } } } void calc() { nodes.clear(); for (int i = 0; i < NODES.size (); i++) { Node n = (Node)NODES.get(i); if (id != n.id) { float nodeDist = dist(x, y, n.x, n.y); if (nodeDist <= nodeScope && n.on) { nodes.add(n); } } } } void move() { noiseSeed(id); angle += (noise((float)millis()/100.0) - .5)* HALF_PI; x += cos(angle)*step; y += sin(angle)*step; } } boolean OVER; ArrayList NODES; int numNodes = 50; int count = 0; float margin = 100; float nodeScope = 60; boolean newNode; Node current; color nodeFillColor = #F06E1D; color nodeStrokeColor = #8E3E0B; color linkColor = color(86, 115, 124, 80); color deviceFillColor = #1FCCFF; color deviceStrokeColor = #02A8D8; void keyPressed() { if (key == 'a') { nodeScope += 5; println("node scope = "+nodeScope); } if (key == 'z') { nodeScope -= 5; println("node scope = "+nodeScope); } if (key == ' ') { for (int i = 0; i < NODES.size (); i++) { Node n = (Node)NODES.get(i); n.on = !n.on; } } if (key == 'x') { setup(); } nodeScope = constrain(nodeScope, 5, width); } void mouseMoved() { float d; for (int i = 0; i < NODES.size (); i++) { Node n = (Node)NODES.get(i); d = dist(mouseX, mouseY, n.x, n.y); if (n.r*1.5 >= d) { OVER = true; n.over = true; current = n; } else { OVER = false; n.over = false; } } } void mouseDragged() { if (OVER) { if (current.over) { current.x = mouseX; current.y = mouseY; } } } void mouseReleased() { if (current.over && mouseButton==RIGHT) { current.on = !current.on; } } [/p5js]

### Cómo funciona

* arrastre nodos para reconfigurar la red
* teclas **a** y **z** modifican el alcance de cada nodo
* botón derecho sobre el nodo lo enciende o apaga
* tecla **i** sirve para invertir encendido/apagado de todos los nodos
* **x** regenera la distribución de nodos
