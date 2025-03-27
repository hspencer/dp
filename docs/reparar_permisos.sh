#!/bin/bash

# Repara permisos para un proyecto Jekyll

# Asignar permisos 644 a todos los archivos (rw-r--r--)
find . -type f -exec chmod 644 {} \;

# Asignar permisos 755 a todos los directorios (rwxr-xr-x)
find . -type d -exec chmod 755 {} \;

# Dar permisos de ejecución a scripts comunes (.sh, .rb)
find . -type f \( -name "*.sh" -o -name "*.rb" \) -exec chmod +x {} \;

# Opcional: si usas binarios locales en .jekyll-cache o .vendor
if [ -d ".jekyll-cache" ]; then
  chmod -R 755 .jekyll-cache
fi

if [ -d "vendor" ]; then
  chmod -R 755 vendor
fi

echo "✅ Permisos reparados para el proyecto Jekyll"
