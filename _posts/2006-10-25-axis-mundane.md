---
layout: posts
permalink: /2006/10/axis-mundane/
title: Axis Mundane
description: None
date: 2006-10-25 15:43:41 -0000
last_modified_at: 2006-10-25 15:43:41 -0000
publish: true
pin: false
categories:
- code
tags:
- experiment
- particles
- processing
- simulation
---
Las partí­culas son atraí­das entre ellas; cuando la distacia que separa cualquier par de partí­culas es mayor a la suma de sus radios, los radios de ambas partí­culas se incrementarán en 0.025 pixel. Cuando el radio llega a 80 pixeles la partí­cula revienta transformándose en una pequeña de nuevo y cambiando de color, así da paso a la nueva generación. Exiten un total de 20 generaciones y a cada cual se le asigna un color. _(ver tabla de colores más abajo)_ Las partí­culas pequeñas son más fluí­das (menos masa) y al ser atraí­das por las otras pasan hacia el centro del arreglo, dejando a las partí­culas jóvenes al centro y las viejas en el perí­metro, simulando una colonia de búfalos.

* [link to code](http://www.herbertspencer.net/processing/particles7/ "Link al código fuente para Processing")

### Ciclo de Colores

| **HEX:** #CD540A **RGB:** 205,84,10  
---|---  
| **HEX:** #AE7450 **RGB:** 174,116,80  
| **HEX:** #AD611E **RGB:** 173,97,30  
| **HEX:** #E97913 **RGB:** 233,121,19  
| **HEX:** #4D3711 **RGB:** 77,55,17  
| **HEX:** #E4CC62 **RGB:** 228,204,98  
| **HEX:** #AFAC37 **RGB:** 175,172,55  
| **HEX:** #B1AF4F **RGB:** 177,175,79  
| **HEX:** #929553 **RGB:** 146,149,83  
| **HEX:** #D1DE8C **RGB:** 209,222,140  
| **HEX:** #D0E5AA **RGB:** 208,229,170  
| **HEX:** #5A8D67 **RGB:** 90,141,103  
| **HEX:** #5A8D67 **RGB:** 90,141,103  
| **HEX:** #334B4E **RGB:** 51,75,78  
| **HEX:** #3D737D **RGB:** 61,115,125  
| **HEX:** #8798C9 **RGB:** 135,152,201  
| **HEX:** #6D7590 **RGB:** 109,117,144  
| **HEX:** #8B95BA **RGB:** 139,149,186  
| **HEX:** #A9A8B9 **RGB:** 169,168,185  
| **HEX:** #F7F5F6 **RGB:** 247,245,246
