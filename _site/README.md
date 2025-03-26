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