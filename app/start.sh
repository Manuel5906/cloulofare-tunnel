#!/bin/bash

# 1. Evitar que Android suspenda la CPU
termux-wake-lock

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO"
echo "-------------------------------------------"

# 2. ACTUALIZACIÓN AUTOMÁTICA
echo "🔄 Comprobando actualizaciones en GitHub..."
# Intentar descargar los últimos cambios
if git pull origin main; then
    echo "✅ Repositorio actualizado correctamente."
else
    echo "⚠️ No se pudo conectar con GitHub (revisa tu internet), iniciando versión local."
fi

# 3. Moverse a la carpeta de la app
if [ -d "app" ]; then
    cd app
fi

# 4. Asegurar carpeta de persistencia
if [ ! -d "sis" ]; then
    mkdir -p sis
fi

# 5. Verificar dependencias (por si el nuevo código necesita librerías nuevas)
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Actualizando dependencias de Node..."
    npm install --production
fi

# 6. LIMPIEZA DE PROCESOS (Para evitar errores de puerto 3006)
echo "🧹 Limpiando procesos antiguos..."
pkill -f "node index.js" 2>/dev/null

# 7. INICIAR CON PM2 (Opcional) o NODE directo
echo "🌐 Servidor arrancando en http://localhost:3006"
echo "-------------------------------------------"

# Si tienes pm2 instalado, úsalo para que no se cierre:
if command -v pm2 &> /dev/null; then
    pm2 restart all --name "cf-dash" || pm2 start index.js --name "cf-dash"
    pm2 logs
else
    # Si no tienes pm2, iniciamos normal
    node index.js
fi