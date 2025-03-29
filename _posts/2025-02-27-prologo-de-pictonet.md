---
layout: posts
permalink: /2025/02/prologo-de-pictonet/
title: "Prólogo de PictoNet"
date: 2025-02-27 05:43:22 -0000
last_modified_at: 2025-03-21 03:00:19 -0000
publish: true
image:
  path: /assets/uploads/2025/02/prologo-pictonet-ia.png
  alt: Pictonet SVG editor
categories:
- notas
tags: [tesis, llm]
---
A lo largo de los años (como diseñador, profesor e investigador) me ha tocado participar en múltiples proyectos que integran tecnología, comunicación y diseño para fomentar la participación comunitaria. Diría que ese es el hilo conductor de todo: cierta idea respecto a la “activación social” que determinada plataforma permite o habilita.

Podría tratarse de la idea de la “[convivencialidad](https://es.wikipedia.org/wiki/Convivialidad)” por aproximación y afinidad. Esto ha estado presente en proyectos como **[Con§tel](https://wiki.ead.pucv.cl/Con§tel)** (2005-2006) que exploraba la idea de la _marginalia compartida_ dentro del estudio dentro de una escuela de pensamiento. Y la plataforma permitía, a cada uno, ubicarse en un mapa conceptual observado por todos (no relativizado en un _timeline_ subjetivo producto de un algoritmo de recomendación, como ocurre hoy). Otro proyecto significativo en este ámbito es la Wiki **[Casiopea](https://wiki.ead.pucv.cl/)** , donde cada página es editable, mejorable y actualizable; no impone ni determina sino que está abierta y disponible para ser construida y reconstruida.

En esta línea, y más específicamente en el ámbito de la accesibilidad cognitiva (entendiendo accesibilidad como hospitalidad real) desarrollamos **[PICTOS](https://pictos.cl)** , un sistema de apoyos secuenciales pictográficos para mejorar la accesibilidad de los trámites y procedimientos en los servicios públicos (asunto que se supone está garantizado por ley desde 2016, al menos en Chile), permitiendo a personas con discapacidad intelectual comprender y realizar trámites de manera autónoma.

Los pictogramas de PICTOS se estructuran en tres capas:

  1. la acción del protagonista,
  2. los artefactos o elementos de interacción,
  3. y el espacio o contexto.

Esta composición facilita la comprensión de interacciones cotidianas al desglosar visualmente cada componente de una acción. Esto es particularmente significativo porque conecta el espacio de la palabra, en este caso de la instrucción de cada paso, con el espacio de la imagen pictográfica, estableciendo una correspondencia muy nítida entre elementos lingüísticos y elementos visuales.

De esta experiencia con PICTOS (donde ya hemos implementado estos apoyos en más de 600 trámites reales) surge **[PictoNet](https://github.com/hspencer/pictonet)**. Esta será mi investigación doctoral (basada en la praxis) que me mantendrá ocupado en los próximos 3 años.

### ¿Qué es PictoNet?

**PictoNet** es un proyecto de investigación y desarrollo que explora cómo crear un sistema de comunicación visual para personas con discapacidad intelectual, autismo u otras condiciones que afectan el lenguaje. Busca ofrecer una alternativa basada en pictogramas (dibujos simples con significado) que pueda adaptarse a cada persona y contexto.

Mis preguntas de investigación son:

  1. ¿Cómo puede un sistema de pictogramas generar apoyos comprensibles para personas que tienen dificultades de comunicación verbal?
  2. ¿De qué forma la inteligencia artificial puede aprender de las personas que usan pictogramas y mejorar con sus correcciones?
  3. ¿Cómo pueden estas tecnologías ser sensibles a las culturas locales y no imponer una lógica única, rígida o ajena?

Actualmente, los sistemas de comunicación aumentativa y alternativa suelen usar bancos de pictogramas fijos, diseñados de forma centralizada. Esto genera varios problemas:

* No siempre representan bien la cultura local ni los objetos reales que usan las personas.
* No se adaptan fácilmente a necesidades particulares.
* No permiten que los propios usuarios corrijan o ajusten los pictogramas según lo que necesitan comunicar.

**PictoNet propone algo distinto** : una plataforma abierta, colaborativa y adaptativa. Los pictogramas se generan automáticamente desde una frase, y los usuarios pueden editarlos, mejorarlos y alimentar el sistema con sus correcciones.
  
    +------------------------------------------------------------+
    |                     PictoNet-SVG-editor                    |
    +------------------------------------------------------------+
    | Instruction:                                               |
    | [ I want to play with my tablet ]                          |
    +------------------------------------------------------------+
    | Elements:                    | Pictogram                   |
    |  + Left hand                 |  +----------------------+   |
    |  + Right hand                |  [ Hands interacting ]  |   |
    |  + Tablet                    |  |  ┌───────────────┐   |   |
    |     + Screen                 |  |  │  ◻︎◻︎       ☻   │   |   |
    |        + Game icons          |  |  │  ##           |   |   |
    |                              |  |  │   ▲    ◯      │   |   |
    |                              |  |  └───────────────┘   |   |
    |                              |  |        ✌︎    ☞        |   |
    |                              |  +----------------------+   |
    +------------------------------------------------------------+

PictoNet, en el tiempo, apunta a ser un software libre y modular, compuesto por tres elementos principales:

  1. **Generador de pictogramas** : un modelo de inteligencia artificial que recibe una frase en texto (como “lavarse las manos”) y crea un pictograma en formato SVG, dibujando sólo las líneas esenciales.
  2. **Editor web de SVG** : una herramienta para que las personas puedan modificar los pictogramas generados, cambiando detalles, reordenando elementos o ajustando el estilo visual.
  3. **Sistema de retroalimentación** : los usuarios registrados pueden guardar sus correcciones, que son evaluadas y, si resultan útiles, incorporadas al modelo. Así el sistema “aprende” de su comunidad de uso.

Todo esto funciona como un proyecto de código abierto, que puede ser descargado, modificado o adaptado a diferentes contextos (como escuelas, hospitales, hogares, etc.).

La interfaz de PictoNet ofrece control total sobre la generación y edición de pictogramas. Cada elemento es editable y regenerable, permitiendo al usuario construir su propio vocabulario gráfico. Esto plantea una pregunta crucial: ¿cómo se almacena y visualiza el "archivo de personalización" de cada usuario? No se trata únicamente de guardar preferencias, sino de diseñar una manera de representar visualmente la evolución del estilo propio de cada persona.

Además de ser una herramienta de comunicación aumentativa y alternativa, PictoNet tiene el potencial de funcionar como **motor** para diversos servicios que requieran traducir texto, voz o imágenes en representaciones visuales comprensibles. Desde interfaces en realidad aumentada que superpongan instrucciones sobre el mundo físico, hasta sistemas de apoyo en realidad virtual que generen entornos interactivos con pictogramas personalizados. En cada uno de estos escenarios, la clave es la capacidad del usuario para entrenar y modificar el sistema según sus propias necesidades.

La pregunta final no es únicamente tecnológica, sino también política: **¿cómo diseñamos sistemas que permitan a los usuarios ser autores de su propio lenguaje sin quedar atrapados en una homogeneización impuesta?** La única manera de evitar esta uniformidad es asegurando que cada nodo sea único. PictoNet, en este sentido, es una herramienta de transición hacia modelos federados y situados de comunicación, donde cada persona o comunidad pueda desarrollar su propia gramática pictográfica sin perder la capacidad de interconectar con otros.

Porque el lenguaje visual no es estático; es negociado, construido y situado. Y PictoNet es, en esencia, un intento por diseñar una infraestructura para esa transformación constante de forma justa en la nueva economía.

#### **PictoNet: Hacia una Lengua Visual Generativa**

La comunicación es una de las dimensiones más fundamentales de la experiencia humana. Sin embargo, para muchas personas con necesidades complejas de comunicación (CCN), el acceso a un sistema eficaz de expresión sigue siendo un desafío. En este contexto, **PictoNet** es una exploración en el diseño de un sistema pictográfico generativo, capaz de adaptarse a diferentes entornos y usuarios mediante inteligencia artificial y una arquitectura colaborativa. A diferencia de los sistemas tradicionales de pictogramas para la comunicación aumentativa y alternativa (CAA), que dependen de bibliotecas predefinidas de imágenes, PictoNet plantea una perspectiva diferente: **una lengua visual generativa**. Esto implica que, en lugar de una colección fija de pictogramas, el sistema será capaz de **generar imágenes en tiempo real** en respuesta a las necesidades comunicativas del usuario. Aquí la inteligencia artificial no se concibe como un mero procesador de imágenes, sino como _material de diseño_ que permite la creación dinámica de representaciones visuales, asegurando (o permitiendo... uno nunca puede asegurar) coherencia, adaptabilidad y transparencia en su funcionamiento. Esto habilita una personalización que no se limita a la selección de íconos existentes, sino que permite la **construcción de significados a partir de la composición visual**.

##### **Diseño, autonomía y autodeterminación**

En el ámbito de la CAA, la capacidad de elegir y expresar intenciones es crucial para la autodeterminación. Tradicionalmente, los pictogramas han sido diseñados desde perspectivas funcionales, con énfasis en la accesibilidad, pero sin explorar a fondo su potencial como herramientas de empoderamiento. PictoNet pretende mejorar la representación pictográfica en términos de diseño visual y en términos de **agencia del usuario**. Inspirado en la Teoría de la Agencia Causal (Shogren et al., 2017), este proyecto busca proporcionar herramientas que permitan a las personas con CCN tomar decisiones más autónomas en su vida cotidiana, facilitando una comunicación fluida y personalizada.

Además, este enfoque incluye un **modelo de aprendizaje colaborativo** (federado) que permitirá a las comunidades de usuarios y especialistas contribuir con ajustes y variaciones que enriquezcan el repertorio visual del sistema. En lugar de imponer una visión única del diseño pictográfico, PictoNet se concibe como un ecosistema en evolución, donde el lenguaje visual se construye de manera descentralizada.

##### **El papel de la máquina en la representación pictográfica**

La inteligencia artificial desempeña un papel central en este sistema generativo (no determinístico). Dentro de las directrices de diseño está definido centrarse en:

  1. **Claridad semántica:** Las imágenes generadas deben preservar la precisión en la comunicación (establecer la correspondencia directa entre texto y su representación)((Un intento temprano en esta línea es el conjunto de pictogramas desarrollados para [Lectogram](https://github.com/hspencer/lectogram). Este conjunto de pictogramas está pensado desde el texto de las tareas del hogar.))
  2. **Adaptabilidad cultural:** Los pictogramas deben ser ajustables a distintos contextos culturales sin perder universalidad. Esto no se planifica centralmente sino que se habilita la posibilidad de la divergencia en la arquitectura del software. Sin duda existirán aspecto convergentes pero se debe permitir la absoluta personalización y control del usuario. Lo convergente o divergente (la eterna tensión entre lo particular y lo universal) es algo que deberá constatarse en el uso de la herramienta.
  3. **Transparencia y control del usuario:** Los usuarios deben tener la capacidad de modificar y validar las imágenes generadas, evitando resultados erróneos o inexactos. Esto implicará también que el tiempo que se invierta en entrenar esta herramienta pueda ser propiedad del usuario (ser portable y transferible) para que puedan generarse modelos locales con curatoría colectiva.

La salida pictográfica se plantea como una imagen descrita por un **[SVG](https://www.w3.org/TR/SVG2/) (Scalable Vector Graphics)**, lo que permitirá una representación flexible, editable y (re)entrenable. A diferencia de los formatos de imagen _bitmap_ , los SVG contienen información humanamente legible y manipulable a nivel de código, siendo más breve, elegante y accesible.

![Una y tres sillas](/assets/uploads/2025/02/3-chairs.png)

<p class='caption'>En un guiño a [Joseph Kosuth](https://www.moma.org/collection/works/81435), estas tres representaciones hablan de lo mismo: una silla. La diferencia está en que SVG sirve de puente entre imagen y texto, ofreciendo un texto-que-es-imagen puesto que es legible y visualizable. Trae una nueva “estética de la accesibilidad”.</p>

##### **Hacia una comunidad de diseño pictográfico abierta y participativa**

Uno de los aportes más especulativos de PictoNet es su modelo de colaboración pública y abierta de un proyecto que trata con un modelo generativo de IA. En lugar de depender de una única fuente de diseño, el sistema permitirá que los usuarios contribuyan con sus propios ajustes visuales, integrando sus experiencias en el desarrollo continuo de la plataforma.

Este enfoque de _aprendizaje federado_ permitirá que el sistema mejore con el tiempo a partir de las interacciones de los usuarios, sin comprometer la privacidad ni la coherencia del lenguaje visual. Se plantea así un **modelo de gobernanza abierta** , en el que los pictogramas puedan ser revisados, corregidos y validados por una comunidad activa de profesionales, investigadores y personas con CCN. Se trata un experimento en diseño (o prueba de concepto) para la accesibilidad y autodeterminación. No se trata solo de mejorar los pictogramas existentes, sino de **reinventar la relación entre palabras e imágenes** en un entorno dinámico, generativo y participativo. No es solamente un desafío técnico, sino también un planteamiento filosófico sobre cómo entendemos el lenguaje visual en la era de la inteligencia artificial. En última instancia, el éxito de PictoNet dependerá de su capacidad para crear un espacio donde las personas con CCN puedan no solo comunicarse, sino también apropiarse y transformar su propia lengua visual.
