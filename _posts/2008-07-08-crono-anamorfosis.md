---
layout: posts
permalink: /2008/07/crono-anamorfosis/
title: Crono-anamorfosis
date: 2008-07-08 22:34:03 -0000
last_modified_at: 2008-07-08 22:34:03 -0000
publish: true
categories:
- code
tags:
- code
- experimental
- processing
- slitscan
- tiempo
- video
---
![secuencia](/assets/uploads/2008/07/timescan-normal1.png) Nuestra comprensión del tiempo es discreta, es decir concebimos la suceción de "instantes" como el único modo de reconstruir el flujo del tiempo. Cada vez que grabamos un video, recolectamos una gran catidad de fotogramas que luego son reproducidos —normalmente— a la misma velocidad con la que fueron captados. Tenemos entonces un _solido_ o _volumen_ de fotogramas cuyo espesor corresponde al tiempo. Siempre que reproducimos el video, elegimos verlo en sucesivos cortes transversales perpendiculares al tiempo, tratando de volver a esos instantes fotográficos. Pero ¿podemos verlo de otro modo? ¿qué ocurriría si elegimos ver este sólido de tiempo haciendo un corte con una inclinación ligeramente distinta? ![secuencia inclinada con anamorfosis temporal](/assets/uploads/2008/07/timescan-inclinado1.png) Por ejemplo, imaginemos que el programa que captura video va almacenando un _buffer_ de fotogramas que tiene un espesor igual al alto en pixeles del fotograma (aquí en el esquema: y = z). Es decir, si tengo un fotograma de 320 pixeles de ancho por 240 pixeles de alto, tengo un buffer de 240 fotogramas de espesor. Entonces el fotograma actual puede construirse a partir de la diagonal de este volumen: la primera línea es la actual, la segunda es de 1 fotograma atrás, la tercera de 2 fotogramas atras, y así hasta completar el alto de la imágen.  [TimeTwist](http://www.vimeo.com/1304091?pg=embed&sec=1304091) de [Herbert Spencer](http://www.vimeo.com/hspencer?pg=embed&sec=1304091) en [Vimeo](http://vimeo.com?pg=embed&sec=1304091).

#### Código

El código presentado a continuación fue generado para captura en tiempo real en el entorno [processing](http://www.processing.org/ "Baja processing si no lo tienes"). Se debe tener en consideración que el programa **requiere mucha memoria RAM** para ejecutarse por lo que se hace necesario modificar las preferencias de processing (ojalá más de 1GB). Esto dependerá del tamaño de captura. Normalmente las cámaras para videoconferencias integradas admiten un máximo de 640 x 480. Este código no está optimizado, ojo. Si hacen algo con el código pongan el link para ver los experimentos en los comentarios de más abajo ¡Suerte! Bajar: [timetwist](http://www.herbertspencer.net/wp/wp-content/uploads/2008/07/timetwist.pde).pde

#### Referencias

* [Zbig Rybczynski](http://www.zbigvision.com/The4Dim.html "Sitio de Zbig")
* [Flong](http://www.flong.com/texts/lists/slit_scan/ "catálogo informal de Golan Levin"), en una recopilación completa de **slitscan** (catálogo informal)
