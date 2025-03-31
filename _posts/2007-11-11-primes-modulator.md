---
layout: post
type: posts
permalink: /2007/11/primes-modulator/
title: "Modulador de Números Primos"
date: 2007-11-12 05:27:29 -0000
last_modified_at: 2017-02-26 16:38:24 -0000
publish: true
image:
  path: /assets/uploads/2007/11/ulams-rose.png
categories:
- code
tags:
- infovis
- math
- processing
- tool
---
Los números primos son los diamantes de los números naturales. Todos los demás números pueden construirse desde factorizaciones únicas de números primos; ellos son las piezas clave, los otros números son sólo relleno. No existe modo de anticipar la distribución de estos números como secuencia regular y han existido muchos intentos para predecir su aparición. Nadie ha podido estabalecer un patrón claro para describirlos. En 1963, [Stanislaw Ulam](http://en.wikipedia.org/wiki/Stanislaw_Ulam), un matemático polaco, decidió disponerlos en una espiral cuadrada como la que muestro en la imagen. Este arreglo consiste en comenzar desde el número 1 al centro del espiral y avanzar girando hacia afuera manteniendo la unidad de distancia entre números constante; los puntos rojos representan números primos. Este arreglo reveló un misterioso patrón de diagonales que se mantení­a sin importar la cantidad de números representados o si se cambiaba el primer número del espiral por otro distinto de 1. Este hallazgo le significó a Ulam aparecer con su diagrama en la portada de la revista [Scientific American](http://www.sciam.com/). Con la idea de poder encontrar patrones ocultos en los números primos hice un pequeño programa para modular distintos tipos de espirales, partiendo del famoso espiral de Ulam. Se trata de una herramienta de visualización para descubrir algo que nadie haya visto. Tal vez puedas descubrir un patrón oculto y tener un espiral con tu nombre.

## Primes Modulator

Este programa fue realizado en processing y permite generar documentos PDF de los espirales (Actualización) Debido a los cambios del lenguaje de [Processing](http://processing.org) en los últimos 10 años, he dejado una versión estable y compatible con la versión actual en un [repositorio de Github](http://www.github.com/hspencer/primes_modulator).
