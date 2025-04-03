---
layout: post
type: posts
permalink: /2008/11/partituras-de-interaccion/
title: "Partituras de Interacción"
date: 2008-11-25 22:24:15 -0000
last_modified_at: 2008-11-25 22:24:15 -0000
publish: true
categories:
- escuela
- imagen
- "investigación"
tags:
- "diseño de interacción"
- graphic notation
- "notación gráfica"
- visual language
image:
  path: /assets/uploads/2008/11/partitura1.png
---
Este lenguaje visual propone((El artículo original no fue publicado en su momento pero se encuentra disponible [acá](https://www.researchgate.net/publication/387997690_PiX_Language_Proposal_Interaction_Notation_for_Digital_Systems_Design).)) un sistema de notación gráfica para formalizar los flujos de interacción en una plataforma o servicio digital.

![Imagen de una partitura en la herramienta en línea, disponible en github](/assets/uploads/2008/11/pix.png)
<p class='caption'>La herramienta online está disponible en el [repositorio público](https://eadpucv.github.io/pix)</p>

### Descargar
Estos archivos corresponden a los primeros insumos que generamos, que posteriormente quedaron deprecados en favor de la herramienta online. También se encuentra disponible una plantilla para Miro (inglés).

* [Plantilla para Omnigraffle](http://wiki.ead.pucv.cl/images/c/c1/Alfa_2.0.stencil.zip)
* [**Plantilla Omnigraffle 2**](http://www.herbertspencer.net/archivo/interaction-score.gstencil.zip), versión correjida y aumentada (nueva)
* [Archivo Illustrator CS3](http://wiki.ead.pucv.cl/images/8/83/Alfa_2.0.ait.zip)

Estos archivos están bajo licencia [Creative Commons Atribución-Licenciar Igual 2.0 Chile](http://creativecommons.org/licenses/by-sa/2.0/cl/ "Licencia del trabajo") desarrollado en la **e[ad] Escuela de Arquitectura y Diseño** por **Katherine Exss** (2007-2008) y **Nicole Dupré** (2008) como proyecto de título de Diseño Gráfico. **Update** : La última versión de las partituras se encuentra en [Github](https://github.com/hspencer/Partituras-de-Interaccion).

### Introducción

La complejidad de un proyecto de desarrollo Web requiere de una metodología escalonada que normalmente es abordada por un equipo multidisciplinario. Dentro de este proceso podemos distinguir:

  1. Estrategia
  2. Investigación de usuarios
  3. Definición de arquitectura de información
  4. Definición de interacción
  5. Diseño de interfaz
  6. Producción
  7. Testeo

A lo largo de este proceso, los lenguajes de representación y formalización (mapas de navegación, wireframes, esquemas de datos, diagramas de flujo, etc.) van marcando cada etapa pero carecemos de un sistema que permita transversalizar el producto final: la experiencia del usuario. Este lenguaje propone un sistema de notación que pueda acompañar el proyecto desde la etapa de estrategia (alto grado de abstracción) hasta la etapa final de implementación en código (alto grado de especificidad), permitiendo a cada actor del proyecto (estrategas, diseñadores y programadores) comprender el total y cuidar el cumplimiento de la visión original. Se trata de un sistema que permite coreografiar y orquestar cuidadamente el díagolo en continuidad entre la persona y el servicio.

### Cómo funciona

Las partituras de interacción descomponen el diálogo entre la persona y el servicio en 3 distintas capas horizontales:

  1. **Acciones del usuario** : la intensionalidad del usuario expresada en sus acciones concretas _———————— línea de interacción ————————_
  2. **Contacto directo** : los elementos de interfaz que permiten al usuario ejecutar tales acciones _———————— línea de visibilidad ————————_
  3. **Proceso** : las funciones que permiten al sistema (servidor) dar respuesta en el diálogo con el usuario

Cada módulo de interacción se compone como un compás en esta partitura. Estos compases (o patrones de interacción) permiten ensamblarse para verificar la lógica y la calidad de la experiencia en determinados escenarios de uso, así como detectar incosistencias o puntos críticos en el servicio. Esperamos que esta herramienta se constituya como una ayuda para el desarrollo de aplicaciones y servicios para Internet, así como un facilitador del diálogo dentro de los equipos de diseño. Este proyecto se encuentra en fase de evaluación, por lo tanto, para poder avanzar en su afinación es de vital contar con tus comentarios.

#### Links

* [Documentación de Katherine Exss](http://wiki.ead.pucv.cl/index.php/Lenguajes_Visuales_para_la_Interacci%C3%B3n "en Wiki Casiopea")
* [Documentación de Nicole Dupré](http://wiki.ead.pucv.cl/index.php/Partituras_de_Interacci%C3%B3n "en Wiki Casiopea")
