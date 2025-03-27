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
