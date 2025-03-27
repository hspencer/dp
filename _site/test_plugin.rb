#!/usr/bin/env ruby
require 'jekyll'
# Intentar cargar manualmente el plugin (ajuste la ruta si es necesario)
begin
  require_relative './_plugins/footnotes'
  puts "El plugin footnotes se cargó correctamente."
rescue LoadError => e
  puts "Error al cargar el plugin: #{e.message}"
end
