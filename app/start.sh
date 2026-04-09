#!/bin/bash

# 1. Evitar que Android suspenda la CPU
termux-wake-lock

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO (PM2)"
echo "-------------------------------------------"

# 2. AUTO-INSTALACIÓN DE HERRAMIENTAS
echo "🔍 Verificando herramientas del sistema..."
pkg update -y && pkg upgrade -y
for pkg in nodejs-lts psmisc git; do
    if ! command -v $pkg &> /dev/null; then
        echo "🎁 Instalando $pkg..."
        pkg install $pkg -y
    fi
done

# 3. INSTALACIÓN/VERIFICACIÓN DE PM2
if ! command -v pm2 &> /dev/null; then
    echo "🚀 Instalando PM2 globalmente..."
    npm install -g pm2
fi

# 4. Asegurar carpetas y dependencias
if [ ! -d "sis" ]; then mkdir -p sis; fi

if [ -f "package.json" ]; then
    echo "📦 Verificando dependencias locales..."
    npm install --production
fi

# 5. GESTIÓN DE PROCESOS CON PM2 (MODIFICADO)
echo "🧹 Limpiando procesos previos..."
# Matar procesos en el puerto 3006
fuser -k 3006/tcp 2>/dev/null

# Intentar eliminar el proceso anterior para evitar conflictos de nombre
pm2 delete "cloud-dash" 2>/dev/null

# Iniciar desde cero (esto asegura que PM2 tome los cambios de index.js)
echo "🆕 Iniciando proceso en PM2..."
pm2 start index.js --name "cloud-dash"

# Guardar lista para que inicie tras fallos
pm2 save

echo "-------------------------------------------"
echo "✅ Servidor gestionado por PM2"
echo "👉 Escribe: pm2 logs cloud-dash"
echo "👉 Escribe: pm2 status"
echo "-------------------------------------------"
