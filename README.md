# 🚀 Cloudflare Tunnel Dashboard PRO

![License](https://img.shields.io/badge/license-ISC-blue.svg) ![Node](https://img.shields.io/badge/node-18+-green.svg) ![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

Un panel de control web moderno y ligero para gestionar múltiples túneles de Cloudflare de forma simultánea. Optimizado para **Termux** (Android), **Docker** (Servidores/VPS), **Linux** y **Windows**.

---

## 📂 Estructura del Proyecto

* `app/`: Directorio principal del código fuente (Backend & Frontend).
* `app/sis/`: Carpeta de persistencia para la base de datos JSON (`tunnels_db.json`).
* `docker-compose.yml`: Configuración para despliegue rápido con contenedores.
* `start.sh`: Script de automatización para ejecución en móviles.
* `.dockerignore`: Optimización para subidas rápidas y construcción de imágenes.

---

## 📱 Instalación Maestra en Termux (Android)

Esta sección cubre desde la instalación básica hasta la optimización para que el servidor nunca se detenga.

### 1. Preparación del Sistema
Actualiza los repositorios e instala las dependencias necesarias:
```bash
pkg update && pkg upgrade -y
pkg install nodejs cloudflared git -y

2. Configuración y PermisosEs fundamental dar permisos de almacenamiento para manejar los archivos de base de datos:Bashtermux-setup-storage
git clone [https://github.com/Manuel5906/cloulofare-tunnel.git](https://github.com/Manuel5906/cloulofare-tunnel.git)
cd cloulofare-tunnel
chmod +x start.sh
3. Evitar que Android cierre el Servidor (Wake Lock)Para que los túneles no se caigan al apagar la pantalla, el script start.sh intenta activar el Wake Lock automáticamente. Si lo haces manual, usa:Ejecuta el comando: termux-wake-lockVe a los ajustes de tu móvil -> Batería -> Optimización de batería -> Termux -> No optimizar.4. Iniciar el SistemaBash./start.sh
5. Comandos Útiles en TermuxVer Logs: El dashboard mostrará el estado, pero puedes ver procesos con ps aux | grep node.Detener todo: Presiona Ctrl + C y luego ejecuta termux-wake-unlock.Saber tu IP: Ejecuta ifconfig para ver tu dirección local y entrar desde otro dispositivo.🐳 Instalación con Docker (Servidores/VPS)Despliegue aislado y persistente en segundos:Bashgit clone [https://github.com/Manuel5906/cloulofare-tunnel.git](https://github.com/Manuel5906/cloulofare-tunnel.git)
cd cloulofare-tunnel
mkdir -p app/sis
docker-compose up -d --build
🖥️ Uso y AccesoMétodo de AccesoDirecciónLocal (Mismo equipo)http://localhost:3006Red Local (WiFi)http://[TU-IP-LOCAL]:3006💡 Tips de OperaciónPersistencia: Los datos se guardan en app/sis/tunnels_db.json.Seguridad: Los archivos sensibles están en .gitignore para que nunca se suban a tu repo por error.Auto-Arranque: Puedes añadir ./start.sh a tu archivo ~/.bashrc en Termux para que inicie al abrir la app.🛠️ Solución de Problemas (FAQ)¿Error "Rejected" en Git? Usa: git push -u origin main --force.¿Cloudflared no abre? Verifica que tu arquitectura sea compatible (ARM64 para la mayoría de móviles modernos).¿Puerto ocupado? Cambia el puerto en app/index.js si el 3006 ya está en uso.👤 AutorDarkCore - Manuel5906📄 LicenciaEste proyecto está bajo la Licencia ISC.
¿Lograste copiarlo todo esta vez? Si te funciona, avísame para celebrar. 🚀
