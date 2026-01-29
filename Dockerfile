# Usamos una imagen ligera de Node.js
FROM node:18-slim

# Instalamos dependencias del sistema y cloudflared
# Se añade soporte para arquitecturas x86_64
RUN apt-get update && apt-get install -y wget curl ca-certificates \
    && curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared \
    && chmod +x /usr/local/bin/cloudflared \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias para aprovechar la caché de capas
COPY package*.json ./
RUN npm install --production

# Copiamos el resto del código del proyecto
COPY . .

# Creamos la carpeta de persistencia 'sis' y aseguramos permisos
# Esto evita errores si el volumen no se monta correctamente al inicio
RUN mkdir -p /app/sis && chmod -R 777 /app/sis

# Exponemos el puerto del dashboard
EXPOSE 3006

# Comando para arrancar la aplicación
CMD ["node", "index.js"]