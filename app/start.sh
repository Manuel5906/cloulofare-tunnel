#!/bin/bash

# 1. Evitar que Android suspenda la CPU
termux-wake-lock

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO (PM2)"
echo "-------------------------------------------"

# 2. AUTO-INSTALACIÓN DE HERRAMIENTAS DEL SISTEMA
echo "🔍 Verificando herramientas del sistema..."
for pkg in nodejs-lts psmisc git; do
    if ! command -v $pkg &> /dev/null; then
        echo "🎁 Instalando $pkg..."
        pkg install $pkg -y
    fi
done

# 3. INSTALACIÓN GLOBAL DE PM2 (Si no existe)
if ! command -v pm2 &> /dev/null; then
    echo "🚀 Instalando PM2 globalmente..."
    npm install -g pm2
fi

# 4. Asegurar carpetas y dependencias del proyecto
if [ ! -d "sis" ]; then mkdir -p sis; fi

if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo "📦 Instalando dependencias locales..."
        npm install --production
    fi
fi

# 5. GESTIÓN DE PROCESOS CON PM2
echo "🧹 Limpiando procesos en puerto 3006..."
fuser -k 3006/tcp 2>/dev/null

# Verificamos si ya existe el proceso en PM2 para reiniciarlo o crearlo
if pm2 list | grep -q "cloud-dash"; then
    echo "🔄 Reiniciando servidor..."
    pm2 restart cloud-dash
else
    echo "🆕 Iniciando nuevo proceso..."
    pm2 start index.js --name "cloud-dash"
fi

echo "-------------------------------------------"
echo "✅ Servidor gestionado por PM2"
echo "👉 Usa 'pm2 logs' para ver la consola"
echo "👉 Usa 'pm2 status' para ver el estado"
echo "-------------------------------------------"
