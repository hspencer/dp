---
layout: post
type: posts
permalink: /2018/11/face-input/
description: Mapear emociones a través de pictogramas como método de entrada de datos en el contexto de la creación de interfaces digitales ¿Es más claro ingresar una emoción o un número?
title: "HTML input: Pictograma"
date: 2018-11-11 20:15:05 -0000
last_modified_at: 2025-03-04 03:36:22 -0000
publish: true
image:
  path: /assets/uploads/2018/11/faces.png
categories:
- "investigación"
- idea
tags:
- "accesibilidad"
- "interacción"
- "pictogramas"
- interfaz
---
### Hipótesis: Mapear emociones a través de pictogramas como método de entrada de datos

En el ámbito de la [investigación inclusiva](http://accesibilidad-inclusion.cl) y el [trabajo con personas con discapacidad intelectual](https://dl.acm.org/doi/10.1145/3385010.3385023), nuestro equipo ha desarrollado herramientas específicas para la recolección de datos. Estos instrumentos deben ser concebidos desde su origen bajo principios de accesibilidad cognitiva, integrando la accesibilidad como un componente esencial de su diseño.

Planteamos la hipótesis de que el uso de pictogramas faciales para representar emociones podría constituir un mecanismo accesible y eficaz para la entrada de datos en contextos donde la comunicación simbólica convencional presenta barreras. La expresión facial es una de las formas primarias de comunicación interpersonal, y los seres humanos estamos especialmente capacitados para interpretarlas. Nuestras habilidades para leer rostros y detectar sutilezas expresivas han sido fundamentales para establecer alineaciones cognitivas en contextos sociales, permitiendo anticipar intenciones, emociones y respuestas.

Esta idea se fundamenta en la teoría semiótica cognitiva desarrollada por Line Brandt en *The Communicative Mind*, donde se plantea que la comunicación no es simplemente un intercambio de señales, sino un proceso mental y social en el que dos o más mentes se alinean temporalmente en una escena compartida de significación. Esta "mente comunicativa" emerge de la coordinación dinámica entre expresiones (lo que se manifiesta en un cuerpo) y comprensiones (lo que se configura en una mente), en un contexto determinado. En este sentido, las expresiones faciales cumplen una función de alto nivel, ya que condensan información emocional compleja en patrones reconocibles que operan como "anclas" para la interpretación situacional((Brandt, L. (2013). *The Communicative Mind: A Linguistic Exploration of Conceptual Integration and Meaning Construction*. Cambridge Scholars Publishing.)). 

### Desarrollo de Herramientas: Face Input, Face Qualify y Face Edit

Basándonos en esta hipótesis, desarrollamos una serie de herramientas destinadas a facilitar la entrada y edición de datos emocionales mediante pictogramas faciales:


<iframe src="https://hspencer.github.io/face-qualify" style="display: block; margin: 0 auto; width: 100%; height: 600px; border: none"></iframe>

- **[```face-input```](https://github.com/hspencer/face-input)**: Una biblioteca JavaScript que permite la creación de entradas basadas en expresiones faciales, funcionando como un control deslizante que representa una gama de emociones. Primer prototipo.

- **[```face-qualify```](https://github.com/hspencer/face-qualify)**: Una biblioteca complementaria que ofrece una interfaz sencilla para que los usuarios califiquen elementos utilizando expresiones faciales en una escala de cinco niveles escalonados. 

- **[```face-edit```](https://github.com/hspencer/face-edit)**: Una herramienta desarrollada con P5.js para editar y definir nuevas expresiones faciales, permitiendo la personalización de pictogramas utilizados en las herramientas anteriores para su interpolación((Acá surgió la idea, un poco más complejo y por lo tanto menos accesible, de mensar inputs bidimensionales, siguiendo 2 ejes en la línea de lo que nos muestra Edward Tufte en este gráfico: <br><br>![](/assets/uploads/2018/11/tufte-wolf.png))) .

### Validación y Resultados

Durante una validación preliminar realizada con el grupo asesor del proyecto, nos enfocamos en las expresiones faciales utilizadas como elementos de entrada, específicamente en los pictogramas de la familia [Pixograms](https://eadpucv.github.io/pixograms/), empleados también en las Partituras de Interacción PiX. Observamos una divergencia sustancial en la interpretación de las expresiones emocionales. Algunas expresiones que, desde una perspectiva de diseño convencional, habíamos clasificado como "positivas" (por ejemplo, una sonrisa amplia con ojos semicerrados y cejas levantadas) fueron interpretadas como sarcasmo, incredulidad o incluso incomodidad por algunos participantes. Del mismo modo, rostros considerados "neutros" o "negativos" fueron asociados con calma o concentración, dependiendo del contexto subjetivo de cada individuo.

Este resultado subraya la complejidad de la interpretación emocional cuando se utilizan patrones visuales estandarizados. La hipótesis inicial, aunque plausible desde un enfoque semiótico y empático, no fue confirmada en la práctica. En su lugar, una escala numérica acompañada de leyendas en lectura fácil resultó ser más clara, permitiendo recoger datos de forma consistente y comprensible para los participantes. La lectura fácil, al estructurar la información de manera explícita, reduce la ambigüedad semántica y facilita la alineación entre la intención del emisor (en este caso, el instrumento de recolección de datos) y la comprensión del receptor.

### Reflexiones y Futuras Direcciones

Aunque este resultado no invalida la idea de utilizar pictogramas faciales como canal expresivo, sí destaca la necesidad de incorporar una fase más robusta de codiseño, especialmente en la elección y validación de las expresiones utilizadas. La cognición no es un proceso automático de decodificación, sino una construcción contextual e intersubjetiva. En consecuencia, el diseño de interfaces accesibles debe considerar tanto la legibilidad formal de los símbolos como también su interpretabilidad cultural, afectiva y situacional.

Desde estas humildes herramientas ha quedado claro que cualquier propuesta que busque trabajar con emociones como entrada de datos debe estar sustentada en una comprensión profunda de los procesos comunicativos. Más que en su dimensión técnica o perceptual, en su dimensión intersubjetiva y cultural.