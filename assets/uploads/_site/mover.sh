#!/bin/bash

BASE_DIR="."

find "$BASE_DIR" -type f -print0 | while IFS= read -r -d '' filepath; do
  filename=$(basename "$filepath")
  parentdir=$(dirname "$filepath")
  parentbasename=$(basename "$parentdir")

  if [[ "$filename" == "$parentbasename" ]]; then
    grandparentdir=$(dirname "$parentdir")
    target_path="$grandparentdir/$filename"

    # Si ya existe un archivo con ese nombre en el destino, no se mueve
    if [[ -f "$target_path" ]]; then
      echo "⚠️  Ya existe archivo en destino: $target_path. No se moverá $filepath"
      continue
    fi

    # Si existe una carpeta con el mismo nombre, la renombramos temporalmente
    if [[ -d "$target_path" ]]; then
      tmpdir="$target_path.dir"
      mv "$target_path" "$tmpdir"
      echo "📁 Carpeta renombrada: $target_path → $tmpdir"

      # Recalculamos la ruta del archivo
      filepath="$tmpdir/$filename"
      parentdir="$tmpdir"
    fi

    # Mover el archivo
    mv "$filepath" "$grandparentdir/"
    echo "✅ Archivo movido: $filename"

    # Intentar eliminar la carpeta si quedó vacía
    rmdir "$parentdir" 2>/dev/null && echo "🗑️  Carpeta eliminada: $parentdir"
  fi
done
