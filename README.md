# {dp}
## doble página


Este sitio ha tenido un largo recorrido. Comenzó en 2003 como mi carpeta personal de experimentos y reflexiones. Durante muchos años fue administrado en Wordpress pero ahora, porque básicamente se puso "fácil de usar" ya no lo entiendo y prefiero tener control absoluto del HTML y CSS.

Migré todo a jekyll y lo voy a mantener en Github desde ahora en adelante.

### Comandos útiles

  - Limpiar caché
     ```
     rm -rf _site .jekyll-cache .jekyll-metadata
     ```
  - Generar el sitio
     ```
     bundle exec jekyll serve --host 0.0.0.0 --livereload
     ```
  - Chequear entorno
     ```
     rbenv versions
     rbenv install 2.7.6
     rbenv local 2.7.6
     ```   



### cosas de migración 

```
chmod +x reparar_permisos.sh
./reparar_permisos.sh
```


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

```yaml
safe: false  # Permite el uso de plugins personalizados
plugins_dir: _plugins
```
En el ejemplo proporcionado se utiliza:

```liquid
{{ content | convert_footnotes | markdownify }}
```

De este modo, el filtro `convert_footnotes` actúa sobre el contenido original, antes de la conversión a HTML mediante `markdownify`. Confirma que el contenido original contiene exactamente el patrón esperado ((...)) sin espacios, saltos de línea o caracteres adicionales que puedan interferir con la expresión regular.

---

## Uso del script para servir la carpeta _site como raíz

Se propone emplear el siguiente script en Python. Este script establece un servidor HTTP que sirve la carpeta `_site` como directorio raíz.



### Generar el sitio en local

- Antes de ejecutar el servidor, asegúrate de compilar el sitio con Jekyll. En la raíz del proyecto ejecuta:

  ```bash
  bundle exec jekyll build
  ```

  Esto generará la carpeta `_site` con los archivos estáticos.

### Ejecutar el script de python

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
