# frozen_string_literal: true

# Usamos la fuente de gems:
source "https://rubygems.org"

# Puedes dejar 'rails' comentado si no lo necesitas:
# gem "rails"

# Incluir 'github-pages' en el grupo :jekyll_plugins 
# hace que uses la misma versión de Jekyll/Sass que GitHub Pages.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  # GitHub Pages ya incluye jekyll-sass-converter,
  # si prefieres forzar una versión específica, mantenlo.
  gem "jekyll-sass-converter"

  # jekyll-assets no está soportado oficialmente por GitHub Pages,
  # pero si lo necesitas localmente, lo mantienes.
  gem "jekyll-assets", github: "envygeeks/jekyll-assets"
end
