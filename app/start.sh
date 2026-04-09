#!/bin/bash

# 1. Evitar que Android suspenda la CPU
termux-wake-lock

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO"
echo "-------------------------------------------"

# 2. Asegurar carpeta de persistencia
if [ ! -d "sis" ]; then
    mkdir -p sis
fi

# 3. Verificar dependencias
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Instalando/Actualizando dependencias de Node..."
    npm install --production
fi

# 4. LIMPIEZA DE PROCESOS
echo "🧹 Limpiando procesos antiguos en el puerto 3006..."
fuser -k 3006/tcp 2>/dev/null
pkill -f "node index.js" 2>/dev/null

# 5. INICIAR CON NODE DIRECTO
echo "🌐 Servidor arrancando en http://localhost:3006"
echo "-------------------------------------------"

# Iniciamos el servidor
node index.js
