---
layout: post
permalink: /2009/07/espirales/
title: Espirales
date: 2009-07-09 03:35:23 -0000
last_modified_at: 2015-08-02 22:10:40 -0000
publish: true
categories:
- code
tags:
- processing
- spiral
---
Estos días no he hecho nada porque me la he pasado en puras reuniones. Mientras escucho, dibujo espirales en mi cuaderno y veo como los pequeños errores, engrosamientos y disminuciones de los espacios se acumulan, amplifican o suavizan.

[p5js canvas] Spiral[] s; int numSpirals = 12; void setup(){ size(380, 500); smooth(); s = new Spiral[numSpirals]; for(int i = 0; i < numSpirals; i++){ s[i] = new Spiral(random(width/7, width*6/7), random(height/7, height*6/7)); } noFill(); strokeWeight(0.5); } void draw(){ background(255); for(int i = 0; i < numSpirals; i++){ s[i].draw(); } } class Polar{ float ang, dim; Polar(float a, float d){ ang = a; dim = d; } } class Spiral{ ArrayList polar; int angSteps; float angInc; float ang; float amp, sp; float ox, oy; boolean grow; int seed; color st; float alfa = 255; int fadeSteps; Spiral(float x, float y){ polar = new ArrayList(); reset(); ox = x; oy = y; ang = TWO_PI; } void draw(){ if(grow) { calc(); } else{ fade(); } pushMatrix(); translate(ox, oy); stroke(st, alfa); beginShape(); for(int i = 0; i < polar.size(); i++){ Polar p = (Polar)polar.get(i); float x = cos(p.ang) *p.dim; float y = sin(p.ang)* p.dim; curveVertex(x,y); if(x+ox > width || x+ox < 0 || y+oy > height || y+oy < 0){ grow = false; } } endShape(); popMatrix(); } void calc(){ noiseSeed(seed); float num = (float)millis()/100; int z = polar.size(); if(z > angSteps){ Polar a = (Polar)polar.get(z-angSteps); Polar p = new Polar(ang, a.dim + sp + noise(num)*amp); polar.add(p); } else{ Polar p = new Polar(ang, noise(num)*amp + sp*((float)z/(float)angSteps)); polar.add(p); } ang += angInc; } void fade(){ alfa -= 255/(float)fadeSteps; if (alfa <= 5) reset(); } void reset(){ polar.clear(); ox = random(width/7, width*6/7); oy = random(height/7, height*6/7); grow = true; alfa = 255; amp = random(2, 10); sp = random(0.9, 4); seed = (int)random(100000); st = color(random(10, 50), random(10, 40), random(10, 26)); if(round(random(10)) % 2 == 0) angInc *= -1; fadeSteps = round(random(25, 50)); angSteps = round(random(24, 120)); angInc = TWO_PI / (float)angSteps; } } [/p5js]

Veo como las familias de espirales se multiplican, cruzan y entrelazan. Tal vez así la sensación de no hacer nada desaparezca.
