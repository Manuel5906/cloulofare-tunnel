#!/bin/bash

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO"
echo "-------------------------------------------"

# 1. AUTO-INSTALACIÓN DE DEPENDENCIAS DEL SISTEMA
echo "🔍 Verificando herramientas del sistema..."

DEPENDENCIAS=("nodejs-lts" "git" "psmisc")

for dep in "${DEPENDENCIAS[@]}"; do
    if ! pkg list-installed | grep -q "$dep"; then
        echo "🎁 Instalando $dep..."
        pkg install "$dep" -y
    fi
done

# 2. Evitar que Android suspenda la CPU
termux-wake-lock

# 3. Asegurar carpeta de persistencia
if [ ! -d "sis" ]; then
    mkdir -p sis
fi

# 4. Verificar dependencias de Node (package.json)
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo "📦 Instalando/Actualizando dependencias de Node..."
        npm install --production
    fi
else
    echo "⚠️ Advertencia: No se encontró package.json"
fi

# 5. LIMPIEZA DE PROCESOS
echo "🧹 Limpiando procesos antiguos en el puerto 3006..."
fuser -k 3006/tcp 2>/dev/null
pkill -f "node index.js" 2>/dev/null

# 6. INICIAR SERVIDOR
echo "🌐 Servidor arrancando en http://localhost:3006"
echo "-------------------------------------------"

# Verificamos si existe index.js antes de lanzarlo
if [ -f "index.js" ]; then
    node index.js
else
    echo "❌ Error: index.js no existe en esta carpeta."
    ls
fi
