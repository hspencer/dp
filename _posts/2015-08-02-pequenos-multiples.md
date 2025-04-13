---
layout: post
type: posts
permalink: /2015/08/pequenos-multiples/
url: /2015/08/pequenos-multiples/
title: "Pequeños Múltiples"
seo_title: "Visualización por \"pequeños múltiples\""
date: 2015-08-02 23:48:30 -0000
last_modified_at: 2015-08-05 19:50:18 -0000
publish: true
image:
  path: /assets/uploads/2015/08/citipulse-small-multiples.png
categories:
- code
- imagen
tags:
- citisent
- "visualización"
p5:
  script: /assets/p5/flor.js
  sidebar: false
---

{% include p5.html script="/assets/p5/flor.js" %}


Había una vez una empresa llamada **[CitiSent](https://vimeo.com/61097795)** , donde una de las primeras ideas que tuvimos para ofrecer servicios de visualización se refería a comprender y comparar la calidad de vida de las distintas ciudades del país((a este servicio lo llamamos _CitiPulse_)).

Para construir esta visualización desarrollamos un tesauro((Un tesaurio es un diccionario jerárquico de palabras. En el caso de **Citipulse** definimos 6 grandes categorías: Medioambiente, Movilidad, Entorno Urbano, Sociabilidad, Gobernanza y Economía Local y Oportunidades. Cada una de ella dividias, a su vez, en otras sub-categorías, hasta completar un vocabulario de alrededor de 500 palabras.)) de 6 grandes temas urbanos que generaban un indicador de percepción a partir del análisis de texto ([sentiment analysis](https://en.wikipedia.org/wiki/Sentiment_analysis)) en redes sociales. Cada uno de estos indicadores determina el tamaño de un pétalo, debidamente codificado con un color. La idea es que este sistema de representar (y condensar) la imformación permite comparar muy eficientemente las diferencias y contrastes entre los datos (las disparidades). Esta modalidad se denomina _pequenos múltiples_ ([small multiples](https://en.wikipedia.org/wiki/Small_multiple)). Esto es similar a las [caras de Chernoff](https://en.wikipedia.org/wiki/Chernoff_face).

Este ejemplo de la unidad de visualización puede ser regenerado al presionar `ESPACIO`, pero es preciso ganar foco sobre el elemento haciendo click sobre él
