#!/bin/bash

# 1. Evitar que Android suspenda la CPU
termux-wake-lock

echo "-------------------------------------------"
echo "   🚀 INICIANDO CLOUDFLARE DASHBOARD PRO"
echo "-------------------------------------------"

# 2. Entrar a la carpeta 'app' si el script se ejecuta desde la raíz
if [ -d "app" ]; then
    echo "📂 Entrando a la carpeta /app..."
    cd app
fi

# 3. Asegurar que la carpeta de persistencia 'sis' exista dentro de /app
if [ ! -d "sis" ]; then
    echo "📁 Creando carpeta de persistencia 'sis'..."
    mkdir -p sis
fi

# 4. Verificar e instalar dependencias si faltan
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Node..."
    npm install --production
fi

# 5. Iniciar el servidor
echo "🌐 Servidor arrancando en el puerto 3006..."
node index.js