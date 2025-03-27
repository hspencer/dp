# {dp}
## doble página


Este sitio ha tenido un largo recorrido. Comenzó en 2003 como mi carpeta personal de experimentos y reflexiones. Durante muchos años fue administrado en Wordpress pero ahora, porque básicamente se puso "fácil de usar" ya no lo entiendo y prefiero tener control absoluto del HTML y CSS.

Migré todo a jekyll y lo voy a mantener en Github.


Esta rama (la 3.10) está retrasada para ser compatible con github. Utiliza la gema especial.

```
bundle exec jekyll serve --host 0.0.0.0 --livereload

rm -rf _site .jekyll-cache .jekyll-metadata

```


### cosas de migración 

```
chmod +x reparar_permisos.sh
./reparar_permisos.sh
```

### rbenv para github

```
rbenv versions
rbenv install 2.7.6
rbenv local 2.7.6
```

### ToDo

- citePage
- Arreglar Axis Mundae y revisar todos los posts en general
- formatear para footnotes
- hacer el colofón


### Gestión del sidebar en los posts

```
---
title: Mi Post
sidebar: >
  <div class="extra-info">
    <p>Este post fue presentado en el seminario 2025.</p>
    {% include compartir.html %}
  </div>
---
```


A continuación se proporcionan instrucciones detalladas para que puedas utilizar el script de servidor y se exponen algunas consideraciones respecto al procesamiento del plugin de notas al pie.

---

## Revisión del plugin de notas al pie

El código del plugin, según se muestra, realiza el procesamiento del contenido que se encuentra entre dobles paréntesis. No obstante, la razón más probable de que no se procese correctamente es la activación del modo seguro en Jekyll, lo que impide la carga de plugins personalizados. Es imprescindible comprobar que en el archivo `_config.yml` se encuentre la siguiente configuración:

```yaml
safe: false        # Permite el uso de plugins personalizados
plugins_dir: _plugins
```

Se debe asegurar además que el archivo `footnotes.rb` se encuentre en el directorio `_plugins` de la raíz del proyecto. Otra consideración es el orden de aplicación de filtros en el layout. En el ejemplo proporcionado se utiliza:

```liquid
{{ content | convert_footnotes | markdownify }}
```

De este modo, el filtro `convert_footnotes` actúa sobre el contenido original, antes de la conversión a HTML mediante `markdownify`. Confirma que el contenido original contiene exactamente el patrón esperado ((...)) sin espacios, saltos de línea o caracteres adicionales que puedan interferir con la expresión regular.

---

## Uso del script para servir la carpeta _site como raíz

Se propone emplear el siguiente script en Python. Este script establece un servidor HTTP que sirve la carpeta `_site` como directorio raíz.

### 1. Guardar el script

- Crea un archivo en la raíz de tu proyecto (en el mismo nivel donde se encuentra la carpeta `_site`) y nómbralo, por ejemplo, `serve_site.py`.
- Copia y pega el siguiente código en dicho archivo:

  ```python
  #!/usr/bin/env python3
  # Script para servir la carpeta _site como raíz de un servidor HTTP local

  import http.server  # Módulo para gestionar peticiones HTTP
  import socketserver  # Módulo para establecer el servidor TCP
  import os  # Módulo para interacciones con el sistema operativo

  PORT = 8000  # Puerto en el que se ejecutará el servidor

  # Definir la ruta absoluta de la carpeta _site, asumiendo que el script se encuentra en la raíz del proyecto
  SITE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_site')

  # Cambiar el directorio de trabajo a la carpeta _site
  os.chdir(SITE_DIR)

  # Configurar el manejador de peticiones HTTP
  Handler = http.server.SimpleHTTPRequestHandler

  # Crear e iniciar el servidor TCP en el puerto especificado con el manejador definido
  with socketserver.TCPServer(("", PORT), Handler) as httpd:
      print(f"Servidor corriendo en http://localhost:{PORT}")
      # Servir de forma indefinida hasta ser interrumpido
      httpd.serve_forever()
  ```

### 2. Configurar permisos (opcional, para sistemas tipo Unix)

- Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para hacer el script ejecutable:

  ```bash
  chmod +x serve_site.py
  ```

### 3. Generar el sitio en local

- Antes de ejecutar el servidor, asegúrate de compilar el sitio con Jekyll. En la raíz del proyecto ejecuta:

  ```bash
  bundle exec jekyll build
  ```

  Esto generará la carpeta `_site` con los archivos estáticos.

### 4. Ejecutar el script

- En la terminal, estando en la raíz del proyecto, ejecuta el script de una de las siguientes formas:

  - Si estás en un sistema Unix y configuraste el script como ejecutable:

    ```bash
    ./serve_site.py
    ```

  - O mediante Python directamente:

    ```bash
    python3 serve_site.py
    ```

- Al ejecutarse, el script mostrará en la terminal un mensaje similar a:

  ```
  Servidor corriendo en http://localhost:8000
  ```

- Abre tu navegador web y navega a `http://localhost:8000` para visualizar el sitio. El servidor servirá la carpeta `_site` como directorio raíz.

### 5. Publicar en GitHub

- Dado que GitHub Pages no admite plugins personalizados, se recomienda compilar el sitio de forma local con `jekyll build` y subir el contenido de la carpeta `_site` a la rama designada para GitHub Pages (por ejemplo, `gh-pages`). De esta forma, GitHub servirá los archivos estáticos sin procesar el sitio.

---

Con estas instrucciones se facilita la verificación del plugin y el uso del script para servir la carpeta compilada del sitio, permitiéndote tanto el desarrollo local como la publicación en GitHub sin inconvenientes relacionados con los plugins personalizados.