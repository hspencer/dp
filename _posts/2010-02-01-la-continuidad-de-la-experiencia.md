---
layout: post
permalink: /2010/02/la-continuidad-de-la-experiencia/
title: La Continuidad de la Experiencia
description: None
date: 2010-02-02 03:21:50 -0000
last_modified_at: 2010-02-02 03:21:50 -0000
publish: true
pin: false
image:
  path: http://www.herbertspencer.net/wp-content/uploads/2009/05/ixd-scores1.gif
categories:
- "investigaci\xF3n"
- notas
tags:
- continuidad
- experiencia
- grafos
- lenguajes
- UX
---
## Ser y Tiempo

Quisiera hablar del _diseño para la experiencia_ ((Quiero evitar la polémica del concepto _Diseño de Experiencia_ por tratarse, en términos estrictos, de un error: es imposible, si no pretencioso, diseñar una experiencia para alguien. Lo que hacemos es diseñador las formas y comportamientos de aquellos elementos que indirectamente condicionarán la experiencia del lector o usuario. En inglés también existe esta polémica, pero se ha nombrado _Design for Experience_ o simplemente _UX_.)) en general, desde la pregunta _qué es aquello que debemos que diseñar_ para cuidar la experiencia dentro de un sistema o servicio. Ante cualquier proyecto, sabemos que debemos diseñar la **forma** , tanto estructural como visual y sabemos que debemos diseñar su **tiempo** , tanto la información como comportamiento; esto, para todo sistema o servicio. Es decir, debemos**diseñar su ser y su tiempo** , si me permiten esas dos categorías fundamentales que tomo prestadas de Heidegger. Creo que es buena esa división porque definitivamente no dejamos nada afuera y nos permite entender el proceso de diseño desde esta dualidad. En general, y no sé por qué motivo, en casi todas las instancias de un proyecto, las herramientas y los lenguajes que tenemos a disposición dentro del proceso se centran en definir el _ser_ y muy pocas herramientas y lenguajes nos ayudan a definir el _tiempo_. Me explico: hacemos diagramas de afinidad ((o _Card Sorting_)) para generar los mapas de navegación, establecemos jerarquías y estructuras, hacemos esquemas y configuraciones de pantalla, etc. pero muy pocas veces nos centramos en los comportamientos y flujos individuales. Este punto es crítico ya que, si nos centramos en la experiencia como fin, es fundamental tener un lenguaje que nos permita diseñar la cadencia de los elementos para la construcción de su demora. No tenemos cabeza de partitura o de flujo; tenemos cabeza de grafos, de nodos y conectivas, cajas y flechas; que sólo nos permiten comprender el tiempo como momentos discretos.

## Los Grafos

Pareciera que la metáfora visual de [los grafos](http://es.wikipedia.org/wiki/Teor%C3%ADa_de_grafos) se ha instalado como una suerte de [meme](http://es.wikipedia.org/wiki/Meme) imperialista que sirve para explicar todo; relaciones entre entidades reales o abstractas, mapas conceptuales, esquemas semánticos, sociogramas, gestión de recursos y/o proyectos, redes neuronales, computacionales, hipertextos, etc. Cualquier objeto puede tratarse como nodo y cualquier relación como vínculo. No deja de ser sospechosa una metáfora visual que pueda representar tantas cosas, pero sin duda la simpleza de su gramática es la que le da su fuerza. En resumen, creo que vivimos en el tiempo de las redes y, por lo tanto, pensamos con grafos. ![](http://herbertspencer.net/wp-content/uploads/2010/01/grafo-bike1.png)Por ejemplo, el grafo de la figura podría representar la estructura de un hipertexto cualquiera, con nodos y vínculos. Una vez trabajaba en un grafo similar y lo vio un amigo, algo mayor, y me preguntó por qué estaba yo diseñando una bicicleta. Él vió en el grafo una bicileta. Lo que yo llamaba nodos, él llamaba vínculos y vice-versa. Era el choque de dos visiones culturales distintas: para él la sustancia son los fierros y las uniones son las soldaduras; yo, por mi parte, con mi cabeza de hipertexto veía la sustancia en los nodos y las líneas como saltos inmateriales. Si uno mira el marco de bicicleta es porque entiende que los protagonistas son los tubos y las uniones son la forma de construir una estructura ad-hoc. Para avanzar en una cabeza centrada en la experiencia que cuida la forma en que las personas que usan, activan, recorren nuestros servicios y sistemas, debemos comenzar por mirar la bicicleta, entender los tipos de tubos, sus largos, sus materiales, etc. Hoy en día esta realidad es cada vez más concreta, ya que los modelos tradicionales basados en "la filosofía nodo" no sirven para proyectos complejos de alta interacción. Es decir, los mapas de navegación son una guía preliminar, pero que no sirve para comenzar a documentar y planear el diseño de experiencia: no hay espacio para "los tubos", que son demasiados.  |  |  |  |  |  |  |  |  | 1 |  |  |  |  |  |  |  |  |  
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  
|  |  |  |  |  |  |  | 1 |  | 1 |  |  |  |  |  |  |  |  
|  |  |  |  |  |  | **1** |  | 2 |  | 1 |  |  |  |  |  |  |  
|  |  |  |  |  | 1 |  | **3** |  | 3 |  | 1 |  |  |  |  |  |  
|  |  |  |  | 1 |  | 4 |  | **6** |  | 4 |  | 1 |  |  |  |  |  
|  |  |  | 1 |  | 5 |  | 10 |  | **10** |  | 5 |  | 1 |  |  |  |  
|  |  | 1 |  | 6 |  | 15 |  | 20 |  | **15** |  | 6 |  | 1 |  |  |  
|  | 1 |  | 7 |  | 21 |  | 35 |  | 35 |  | **21** |  | 7 |  | 1 |  |  
| 1 |  | 8 |  | 28 |  | 56 |  | 70 |  | 56 |  | **28** |  | 8 |  | 1 |  
1 |  | 9 |  | 36 |  | 84 |  | 126 |  | 126 |  | 84 |  | **36** |  | 9 |  | 1  
A cada _n_ cantidad de nodos, los máximos vínculos posibles serán _(n *(n-1))/2,_ que corresponde a la tercera fila del triángulo de Pascal. Ésto si los consideramos sólo como conexiones reversibles, pero ocurre en realidad que son el doble: _n* (n-1)_ ya que _ir y venir no da lo mismo_ si seguimos pensando en diseñar experiencias. Éso es comenzar a mirar la bicicleta.

## ¿Y el Tiempo?

La bicicleta no resuelve el problema fundamental del tiempo, es sólo el primer paso para entender _el material con el que está hecha_ la experiencia en un sistema. Así como las conversaciones, las experiencias tienen un comienzo, un desarrollo y un final. Esta obviedad debe cumplirse y diseñarse pero suele ser pasada por alto la mayoría de las veces. Por eso diseñamos [las partituras de interacción](http://www.herbertspencer.net/2008/partituras-de-interaccion/): para poder formalizar el modo del diálogo entre la persona y el sistema. Este lenguaje es heredado del llamado _service blueprinting_ que permite dibujar el recorrido de una persona a través de un sistema. [caption id="attachment_435" align="alignnone" width="470" caption="Paritura realizada por Dámaris Sepúlveda para el diseño del servicio de atención primaria de Quilpué. http://blogs.ead.pucv.cl/servicios/"][![](http://herbertspencer.net/wp-content/uploads/2010/02/Blueprint-unidad-emergencia-adulto1-470x193.jpg)](http://herbertspencer.net/wp-content/uploads/2010/02/Blueprint-unidad-emergencia-adulto1.jpg)[/caption] Nótese que esta mirada permite literalmente _curvar el sistema en torno de la experiencia del usuario_. Acá no importa la complejidad completa del hospital, sino que solamente ilustramos el recorrido de la persona a través de él. Ló único del "sistema" son las capas que nos permiten distinguir qué clases de procesos están involucrados. En el caso de las [las partituras de interacción](../../2008/partituras-de-interaccion/) esta situación está simplificada para poder construir un lenguaje más elemental que permita comunicarse tanto al cliente como a los desarrolladores: se trata de un lenguaje que intenta ser transversal a todo el proceso ya que la experiencia, en su sutil delicadeza, es lo más frájil del diseño y lo primero que suele sucumbir al proceso mismo. Este tema da para mucho más porque estamos recién partiendo seriamente con esto.
