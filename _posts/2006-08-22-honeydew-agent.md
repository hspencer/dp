---
layout: posts
permalink: /2006/08/honeydew-agent/
title: Honeydew Agent
date: 2006-08-22 16:42:13 -0000
last_modified_at: 2006-08-22 16:42:13 -0000
publish: true
categories:
- "investigación"
tags:
- agent
- calendar
- "diseño de interacción"
- project
- scheduling
---
![Honeydew Logo](http://web.archive.org/web/20061013125929//assets/uploads/2006/08/honeydew_logo_small.jpg)****

[![](/assets/uploads/2006/08/honeydew_logo_small1.png)](/assets/uploads/2006/08/honeydew_logo_small1.png)

**Honeydew Agent** es un software que administra y negocia reuniones para el usuario, sobre la base de preferencias y de su capacidad de analizar el lenguaje natural (NLP o Natural Language Processing) contenido en los correos electrónicos.Se llama _agente_ pues el software actúa bajo la autorización y supervisión del usuario e interactúa con terceras personas. Esto no significa que desde el diseño se haya dotado de un aura especial o carisma sino que, se ha construído una mediación entre la persona y su red de contactos para acelerar y mejorar la calidad de los acuerdos resultantes de dichas negociaciones.

### El problema para el Diseño

Para que el agente pueda adaptarse y aprender de cada usuario y pueda, a su vez, construir negociaciones realistas, requiere de información precisa expresada en el caledario o agenda de la persona. En nuestra investigación nos encontramos con un sinnúmero de conductas y técnicas que promueven —en cierta medida— a la deshonestidad al momento de mantener un calendario público. Entre algunas de ellas, se destacan:

* En el caso de grandes compañias, los empleados deben tener un calendario visible para que sus superiores puedan concertar citas fácilmente. En la práctica, estos medios son utilizados para monitorizar a los empleados y vigilar que trabajen las horas asignadas. Esto lleva a sobrepoblar el calendario con información impresisa sólo para aparentar estar más ocupado.
* Similar al caso anterior, algunas personas usan el calendario de un modo defensivo. Esto es, llenan el calendario con eventos ambiguos e imprecisos para luego tener escusas para poder rechazar eventuales invitaciones a reuniones no deseadas.
* Y por último, yo diría lo más común, personas que no son consistentes al momento de construir una agenda. Incluyen sólo los eventos de periodicidad semanal y no mantienen actualizada la información con lo que realmente hacen o los mantiene ocupados, lo que significa que el calendario está subpoblado y el usuario está más ocupado de lo que realmente aparece disponible a terceros. Esto se debe en parte a lo poco natural que resulta incorporar eventos al calendario a medida que estos van apareciendo: el usuario no quiere —ni debe— ser esclavo de su software porque ¡claro! está hecho para facilitarle la vida y no para inventarle nuevas tareas y responsabilidades. De esta última se desprende la pregunta: ¿qué beneficios obtengo al tener una agenda (o calendario) ajustada a la realidad?

### Modelo Honeydew

El diseño de interacción se centró en la complejidad social de las interacciones implícitas en este tipo de negociación. Esto considera que la persona vive en distintos ámbitos sociales simultáneamente, tiene distintos intereses y compromisos para distintos grupos, tiene distintos grados de cercanía con sus contactos y prioriza de manera distinta cada uno de los compromisos adquiridos en cada uno de los distintos ámbitos. Honeydew se propone, entonces, construir un diálogo honesto entre las partes que minimize la candidad de mails (ping-pong) para llegar a un acuerdo multilateral que sea de la máxima conveniencia para todos. Algunos modelos de negociación existentes:

* **Método de Agregado** : El iniciador de la negociación reúne todos los tiempos disponibles e identifica las posibles instancias de coincidencia. Este modelo centra la responsabilidad en una persona y requiere mucho tiempo para recolectar y confirmar la información
* **Método de Negociación** : El iniciador ofrece una cantidad cerrada de posibilidades. Las contrapartes pueden elegir o realizar contraofertas.

Nuestro modelo corresponde a una combinación de estos dos métodos: el iniciador ofrece opciones basado en las preferencias de las contrapartes. De este modo, el conjunto inicial de opciones tiene más posibilidades de ser aceptado. A partir de estas opciones “informadas” los demás involucrados pueden elejir o hacer contraofertas siguiendo el modelo de negociación. Asimismo, consideramos a las preferencias como una envolvente (_envelope_ siguiendo la metáfora de los editores de sonido) del calendario, ponderando los tiempos de disponibilidad con distinta intensidad. [![](/assets/uploads/2006/08/screenshot_preferences11.jpg)](/assets/uploads/2006/08/screenshot_preferences11.jpg) Este modo de espeficicar las preferencias a través de gradientes permite desarrollar un lenguaje visual consistente a lo largo del software para expresar “calidades de tiempos” y garantiza el seteo de preferencias sólidas, sin vacíos, pues la gradiente representa una función **spline**. Ud. puede ver los prototipos funcionales [**aquí**](http://web.archive.org/web/20061013125929/http://www.herbertspencer.net/projects/honeydew/).

### Instrucciones

* El programa se activa desde el _tray icon_ con el logo de **Honeydew**
* El logo de Windows (Start) activa la notificación de correo saliente
* En el editor de correo (New Meeting) el ícono smiley de la barra de formato permite cambiar entre un formulario lleno y uno vacío
Este encargo fue realizado por [ISRI](http://web.archive.org/web/20061013125929/http://www.isri.cmu.edu/index.jsp "Institute for Software Research International") de CMU en el marco de un proyecto de investigación. La implementación de este diseño puede sufrir variaciones desde la posibilidad de desarrollar una aplicación por sí sola completamente independiente de los clientes de correo y calendario o bien, un plug-in para Microsoft Outlook… esa desición, al ser tan importante, fue dejada para el final.
