---
layout: post
type: posts
permalink: /2025/02/prologo-dpara-pictonet/
title: "Prólogo para PictoNet"
date: 2025-02-27 05:43:22 -0000
last_modified_at: 2025-03-21 03:00:19 -0000
publish: true
image:
  path: /assets/uploads/2025/02/prologo-pictonet-ia.png
  alt: Pictonet SVG editor
categories:
- notas
- research
tags: [tesis, llm, lenguaje, pictogramas]
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

---

Estoy iniciando un doctorado por proyecto en la Auckland University of Technology (AUT) con una duración aproximada de tres años, y en esta etapa temprana me he propuesto estructurar el trabajo de manera que simultáneamente sirva como base conceptual y operativa para lo que he denominado **PictoNet**. Concebido como una plataforma abierta de generación de pictogramas vectoriales (en formato <acronym title="Scalar Vector Graphics">SVG</acronym>) orientada a la comunicación inclusiva pero no se limita al ámbito académico ni "asistivo": mi intención es que evolucione hacia una iniciativa de bien público, un proyecto de naturaleza _open source_ al que cualquier persona o institución pueda sumarse para contribuir, apropiarse y, ojalá, co-gobernar bajo principios de transparencia y colaboración.

En su dimensión académica, esta propuesta se enmarca en una investigación doctoral de tipo _practice-based_, es decir, una modalidad donde puedo hacer diseño. Incluye e implica la creación de prototipos, la implementación de la plataforma y la verificación de sus usos en entornos de Comunicación Aumentativa y Alternativa (CAA). Todo esto constituye el mismo núcleo de generación de conocimiento: la interacción humano-computador y la inteligencia artificial((Generativa pero estadística, sin conocimiento real. Para un purista, un LLM es un subgrupo menor de la IA.)) y la propuesta concreta del doctorado((De existir una agenda paralela, es PictoNet. El doctorado es un *mal necesario*, en el sentido más trascendente es un sub-producto. Tiendo a pensar que el hecho, *la obra* es lo que otorga sentido.)). Algo que pueda instalarse, funcionar y evolucionar hacia un ecosistema que fomente nuevas formas de comunicación, sobre todo para aquellas personas que poseen necesidades complejas de habla o escritura.

No pretendo quedarme sólo en lo teórico sin implementar y hacer crecer las ideas, desde prototipos básicos a un servicio más complejo. Quiero apuntar a un sistema que pueda tener vida propia, ser parte del “bien común digital” sostenible en el tiempo, nutrido por una comunidad que la haga crecer y que, a la vez, produzca conocimiento aplicado útil localmente. Actualmente, mi plan de trabajo contempla la definición de los fundamentos y la motivación que impulsan PictoNet. 

Por un lado, existe una necesidad social clara: la mayoría de los recursos o bibliotecas de pictogramas((Y con mayor intensidad el ámbito de la CAA. Creo que el repositorio extendido, mejor documentado y accesible de forma gratuita es [ARASAAC](http://arasaac.org) diseñado e iniciado por [Sergio Palao](https://www.palao.es/) de Zaragoza.)) son acervos estáticos que no permiten adaptaciones culturales o lingüísticas fluidas, y no brindan posibilidades para refinar estilos gráficos ni ajustar la semántica a contextos muy específicos (por ejemplo, vocabularios científicos, institucionales, de índole terapéutica, etc.). Además, no vienen desde el diseño. En su mayoría han sido hechos por personas de otras profesiones que no lo piensan como un sistema gráfico armónico, como homogeneidad de trazos, niveles de abstración, geometría o grilla, por nombrar sólo algunos criterios gráficos escenciales para el diseño de una familia pictográfica. Estos sistemas requieren un alto nivel de sintetización((Se pueden revisar, a modo de caso emblemático, los juegos pictográficos para representar las disciplinas deportivas de cada olimpíada.)) lo que no asegura que sean accesibles cognitivamente. Para esto se requiere una validación posterior.

Quiero entender cómo funcionará la economía en un mercado de distintas IAs y aplicar una alternativa federada que permita ramificaciones y aplicaciones locales. Si el sentido que tiene es la traducción de palabras (o frases) a imágenes, aborda un problema fundamental de la comunicación, el de la *espacialización*. Las variaciones e interpretaciones son potencialmente infinitas. PictoNet se concibe bajo unos principios de diseño que abarcan la apertura del código y de los datos (_open source_), la “recursividad social” (implicando ciclos de aprendizaje y reentrenamiento continuo, donde la comunidad retroalimenta al sistema con cada mejora) y la especialización creciente mediante la creación de mini-modelos afinados que puedan cubrir ámbitos temáticos puntuales. Esto último abre la posibilidad de que existan submodelos especializados —por ejemplo, en vocabularios médicos, en terminología escolar para niños con autismo, en expresiones propias de un dialecto concreto— y que, una vez consolidados, puedan ofrecerse como servicios técnicos adaptados a nichos muy concretos((Modelos compilables a nivel de hardware. Pictonet es un traductor mínimo, un *core engine* gráfico para la comunicación.)).

¿Será la nueva economía un mercado colaborativo de pequeños modelos de generación de pictogramas? Todos basados en el mismo núcleo abierto. Así es como funcionan la mayoría de los proyectos colaborativos actualmente.((Esto es un ejemplo [del diseño de transición en la era del tecnofeudalismo](https://www.herbertspencer.net/2025/02/diseno-de-transicion-en-la-era-del-tecno-feudalismo/).)) Esta parte todavía es muy incierta pero guardo cierta intuición de que mantener cierta soberanía digital sobre los aspectos que nos contituyen, es fundamental. Además constituye una forma de participación constructiva y menos frágil, más segura y ojalá menos sujeta a la cohersión o manipulación de una autoridad central hostil.

##### Qué hace
La plataforma en sí misma incluye un proceso de generación **text-to-SVG** : el usuario ingresa una frase o palabra, se ejecuta un análisis semántico que descompone el texto en sus elementos esenciales, y el sistema genera uno o varios archivos vectoriales con la representación pictográfica. Estos archivos pueden incorporar un metadato que describa las capas, los nodos y la lógica compositiva, lo cual facilita la trazabilidad y la posterior edición o personalización. El objetivo es que cada imagen vectorial sea manipulable, no sólo en su apariencia (grosor de línea, color, dimensiones) sino también en la posibilidad de animaciones básicas o adición de símbolos complementarios. La plataforma incluye un editor visual muy simple y, al mismo tiempo, un editor de código SVG que muestra el dibujo a la derecha, permitiendo un control fino de la estructura a usuarios más experimentados. La idea es que se fusione la sencillez para el usuario genérico con la potencia para desarrolladores o diseñadores interesados en afinar cada pictograma al detalle.

En relación con la gobernanza y el modelo de negocio potencial, la propuesta es que el núcleo de PictoNet (su base de datos de pictogramas, los modelos de IA, el motor de generación y edición) sea de acceso libre y abierto, manteniendo licencias que permitan su auditoría y uso irrestricto siempre y cuando se respeten los criterios de acceso universal. Sin embargo, se abre la puerta a que aparezcan servicios de venta o de encargo de submodelos altamente especializados. En ese escenario, quienes contribuyeron al entrenamiento de dichos submodelos con su experiencia o con sus datos recibirían parte de la retribución en forma de créditos o tokens, reforzando así la idea de que la plataforma se sostenga en la economía de reputación y en un criterio de equidad para quienes aportan. De ese modo, PictoNet se ubica en un punto intermedio entre la gratuidad de la base común y la posibilidad de generar un rendimiento económico para grupos o individuos que ofrezcan mejoras o variaciones muy específicas. Esto no sólo busca la sostenibilidad del proyecto a largo plazo, sino también configurar un incentivo real para investigadores, profesionales y creativos que dediquen tiempo a entrenar y perfeccionar submodelos.

La factibilidad técnica descansa (en la ayuda de mis amigos ingenieros) en la adopción de un stack que facilite la escalabilidad y la colaboración distribuida, incluyendo contenedores((¿Docker?)) para la ejecución del sistema, repositorios de modelos en plataformas como sencillas como Hugging Face, un backend modular (tal vez con FastAPI) y un frontend que privilegie la simplicidad y la capacidad de versionado. En términos de arquitectura, considero una serie de microservicios que se comuniquen entre sí para cubrir las distintas etapas de la generación de pictogramas, mientras que la base de datos (posiblemente MongoDB o similar) almacena tanto los archivos resultantes en SVG como la información de versionado, metadatos semánticos y el histórico de commits que describen cada contribución de la comunidad. Todo esto no está definido.

En la **Figura 1** se representa de manera esquemática cómo la investigación de PictoNet avanza en varias capas: la primera ligada a los pictogramas como facilitadores de la autodeterminación de las personas con necesidades comunicativas; la segunda centrada en la implementación de un modelo generativo que permita la transformación de texto en imágenes vectoriales personalizables; la tercera enfocada en la conformación de una plataforma socio-técnica abierta al aporte colectivo. Esta aproximación progresiva, inspirada en marcos de práctica e iteración, se actualiza permanentemente según la retroalimentación que recibo tanto de usuarios finales como de especialistas.

![Esquema de 3 capas](/assets/uploads/2025/03/3-layers.png)
<p class='caption'>**Figura 1.** Expanding Inquiry in PictoNet. Representación de cómo se articulan los distintos niveles de alcance: desde la base semántica de los pictogramas hasta su integración en un ecosistema colaborativo de alcance global.</p>



<br><br><br>


|**Nivel**| **Enfoque**| **Elementos**  |
---|---|---  
**Nivel 1 – Autodeterminación y AAC pictográfica**|  Examina cómo las herramientas de Comunicación Aumentativa y Alternativa (CAA), en particular los pictogramas, promueven la autodeterminación a través de la volición y la agencia causal.| Los pictogramas como facilitadores de la toma de decisiones autónoma; la CAA como refuerzo de comportamientos con poder de agencia; perspectivas de profesionales sobre el rol de la CAA en la promoción de la autodeterminación; evaluación de cómo estas herramientas fortalecen la creencia de control-acción; modalidades de personalización y localización de pictogramas para distintos contextos culturales.  
**Nivel 2 – Metamodelo Generativo de Pictogramas e IA**|  Centrado en el desarrollo de un meta-modelo y un marco computacional para la generación dinámica de pictogramas.| Pipeline de modelo generativo (estructuración de datos, entrenamiento, ajuste fino); reglas de composición visual para la creación modular de pictogramas; editor basado en SVG que habilita interacción y corrección en tiempo real; la IA entendida como “material de diseño” para una representación pictográfica adaptativa.  
**Nivel 3 – Colaboración Abierta y Aprendizaje Federado**|  Plantea un repositorio descentralizado y gestionado por la comunidad para un aprendizaje y enriquecimiento continuo.| Modelos de aprendizaje federado que equilibren personalización y mejoras compartidas; gestión de repositorios y documentación para contribuciones estructuradas; adaptaciones locales (lanzamientos de modelos para distintos contextos culturales); mecanismos curatoriales que definan una gobernanza colaborativa en la estandarización de pictogramas.  

<p class='caption'>**Tabla 1**. Enfoque de investigación en tres niveles donde se resume el enfoque general de la plataforma como proyecto de investigación, asociando cada nivel de trabajo con elementos clave, que van desde la generación de los pictogramas, hasta su implementación técnica y el tejido social que se requiere para garantizar una gobernanza responsable y un continuo perfeccionamiento de la herramienta.</p>

Como toda iniciativa _open source_, PictoNet requiere de colaboradores y de simpatía en diversos frentes. Invito, en un llamado explícito a investigadores, desarrolladores, artistas y profesionales de la CAA, para que se sumen a la empresa de co-crear una generatriz de lenguaje, de vocación universal o aspiración universalista, pero con la posibilidad de periferia, de particularización((En términos técnicos, una forma de trascender la hipótesis Sapir-Worf.)) permitiendo la generación y personalización local.

#### Tesis

El objetivo de esta investigación es que, al concluir el periodo doctoral, PictoNet se constituya en una plataforma que trascienda la contribución personal y aporte al campo de la comunicación inclusiva. La tesis fundamentará y validará el enfoque metodológico y conceptual que orienta el desarrollo de la plataforma, de modo que la iniciativa subsista de forma autónoma mediante la participación de una comunidad internacional dedicada a identificar y aplicar usos alternativos. Este espacio experimental integra la práctica docente, la investigación en diseño y el compromiso con una comunicación inclusiva. Se prevé que la interacción social inherente a PictoNet propicie un ciclo recursivo en el que cada aporte contribuya a la actualización del sistema, al registro de mejoras y al fortalecimiento de la trayectoria de quienes participan en el desarrollo de una herramienta orientada a la diversidad comunicativa.

Se facilitará el acceso a un repositorio que incluya documentación precisa, demostraciones operativas y un espacio colaborativo para orientar a los nuevos participantes. Asimismo, se plantea transformar PictoNet en un modelo cuantificable, considerando que su salida es breve (por ejemplo, en formato SVG) en relación con la capacidad de procesamiento de los modelos actuales de lenguaje. La posibilidad de integrar este modelo en hardware, como componente de sistemas más complejos, se presenta como un elemento central. Durante el primer año de MediaFranca (denominación que aparece en la interfaz y que corresponde al título oficial de la tesis), se desarrollarán escenarios de uso situados en actos comunicativos que abarquen diversos contextos, tales como la comunicación en la infancia, en colectivos con discapacidad y en personas neurodivergentes. Este planteamiento propone concebir la inteligencia artificial como material de diseño, facilitando su incorporación en sistemas que requieran modularidad y adaptabilidad.

El propósito fundamental de este trabajo es configurar a PictoNet como una plataforma operativa y accesible para una comunidad internacional, trascendiendo la contribución individual. La tesis doctoral, que se inscribe en el contexto del proyecto MediaFranca, establece el marco metodológico y conceptual, sin ser el fin último de la iniciativa. El proyecto se orienta a generar escenarios de uso situados en actos comunicativos —por ejemplo, en interacciones dirigidas a la infancia, a personas con discapacidad y a individuos neurodivergentes— donde la inteligencia artificial se conciba como material de diseño para la comunicación inclusiva.

Dada su especialización y la brevedad de su salida (en formato SVG), es posible optimizar el modelo radicalmente. Esto permite explorar la viabilidad de integrar el sistema en hardware((Sistemas de visión, sistemas de proyección, CAA para agentes que proyectan, entre otros posibles usos y aplicaciones. Recordemos que la primera cámara fotográfica digital con función de reconocimiento de sonrisas y ojos abiertos apareció en el mercado alrededor de 2007-2008.)), para operar como *core engine* para la comunicación dentro de sistemas de mayor sofisticación. Durante este 2025, se desarrollarán y evaluarán estos escenarios de uso, situando a PictoNet en contextos comunicativos concretos y facilitando su adaptación a distintas aplicaciones prácticas. Ahora debemos pasar a construirla.
