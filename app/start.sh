#!/bin/bash

# 1. Evitar que Android suspenda la CPU (Importante para que no se apague el stream)
termux-wake-lock

echo "-------------------------------------------"
echo "    🚀 CLOUDFLARE DASHBOARD PRO"
echo "-------------------------------------------"

# 2. ACTUALIZACIÓN AUTOMÁTICA
echo "🔄 Comprobando actualizaciones en GitHub..."
if git pull origin main; then
    echo "✅ Repositorio actualizado correctamente."
else
    echo "⚠️ No se pudo conectar con GitHub, iniciando versión local."
fi

# 3. Moverse a la carpeta de la app
if [ -d "app" ]; then
    cd app
else
    echo "❌ Error: No se encontró la carpeta 'app'"
    exit 1
fi

# 4. Asegurar carpeta de persistencia
if [ ! -d "sis" ]; then
    mkdir -p sis
fi

# 5. Verificar dependencias
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Instalando/Actualizando dependencias de Node..."
    npm install --production
fi

# 6. LIMPIEZA DE PROCESOS (Para liberar el puerto 3006 antes de iniciar)
echo "🧹 Limpiando procesos antiguos en el puerto 3006..."
# Buscamos el proceso que usa el puerto 3006 y lo cerramos
fuser -k 3006/tcp 2>/dev/null
pkill -f "node index.js" 2>/dev/null

# 7. INICIAR CON NODE DIRECTO
echo "🌐 Servidor arrancando en http://localhost:3006"
echo "-------------------------------------------"

# Iniciamos el servidor de forma normal
node index.js
