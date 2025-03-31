---
layout: post
type: posts
permalink: /2008/02/buscando-un-nombre/
title: buscando un nombre
date: 2008-02-28 04:17:03 -0000
last_modified_at: 2008-02-28 04:17:03 -0000
publish: true
categories:
- code
tags:
- processing
- tool
---
![duwa](/assets/uploads/2008/02/duwa1.gif)

En muy poco tiempo más seré nuevamente padre, esta vez de una [niña](http://www.flickr.com/photos/herbert-spencer/2233829830/ "ecografía 3D de la nena"). El problema es que no se nos ocurre qué nombre ponerle. Hemos buscado miles, pero mi decepción fue mayor al ver que todos mis esfuerzos creativos no eran más que [el lugar común que todos transitan](http://www.registrocivil.cl/Servicios/Estadisticas/Archivos/NombresComunes/Nombres_Annos.htm "Estadísticas del Registro Civil para los nombres más comunes en Chile"). Entonces se me ocurrió que podría tener un nombre inventado, nuevo. Para eso hice un programa llamado **nameGenerator** que genera nombres a partir de distintos patrones de consonates y vocales:

* [nameGenerator para Mac](/assets/uploads/2008/02/namegeneratormacosx1.zip "nameGenerator para Mac")
* [nameGenerator para Linux](/assets/uploads/2008/02/namegeneratorlinux1.zip "NameGenerator para Linux")
* [nameGenerator para Windows](/assets/uploads/2008/02/namegeneratorwindows1.zip "NameGenerator para Windows")

### Instrucciones

Este programa se maneja con el teclado (No tuve el tiempo ni la dedicación para esmerarme en una interfaz más amistosa, pero el teclado funciona bien). Para generar un nombre nuevo, hay que apretar cualquier número, 0 inclusive. Cada uno de los números representa un patrón de consonantes y vocales distinto. Arriba, al medio dice que patrón se está utilizando. Por ejemplo: "C V V C V" ('C' para consonante y 'V' para vocal) podría arrojar "paula". Dentro de la carpeta del programa viene un archivo de texto llamado "nombres.txt" que está vacío (!) Este archivo es necesario para grabar los _nombres buenos_ que puedan ir saliendo. Para grabar un nombre sólo hay que apretar la barra de ESPACIO. Además, dentro de los chiches inútiles, está el catastro de todas las letras representado por unos pequeños gráficos de barra de 1 pixel para ir contando cuantas veces cada letra es utilizada. Como ya dije, no tiene mayor utilidad; sólo lo hice para ver si la función `random()` que elige las letras es realmente aleatoria. La letra 'ñ' fue eliminada a propósito. Bueno... como no le tengo mucha fe a este programa (que es enfermo de nerd) Acepto feliz cualquier tipo de sugerencia para el nombre de la beba. Gracias y que disfruten de este útil programa. Se me olvidaba: **es muy importante** salir del programa presionando la letra **Q** , de otro modo, el archivo de texto quedará mal cerrado... detalles... ; )
