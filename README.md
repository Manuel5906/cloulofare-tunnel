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

Esta sección optimiza Termux para funcionar como un servidor 24/7, evitando que Android mate el proceso.

### 1. Preparación y Dependencias
Actualiza el núcleo del sistema e instala las herramientas esenciales:
```bash
pkg update && pkg upgrade -y
pkg install nodejs cloudflared git -y

```

### 2. Configuración y Permisos

Es fundamental dar permisos de almacenamiento para manejar los archivos de base de datos:

```bash
git clone https://github.com/Manuel5906/cloulofare-tunnel.git
cd cloulofare-tunnel/app
chmod +x start.sh
./start.sh

```

### 3. Evitar que Android cierre el Servidor (Wake Lock)

Para que los túneles no se caigan al apagar la pantalla:

1. Ejecuta el comando: `termux-wake-lock`
2. Ve a los ajustes de tu móvil > Batería > Optimización de batería > **Termux** > **No optimizar**.

### 4. Iniciar el Sistema

```bash
./start.sh

```

### 5. Comandos Útiles en Termux

* **Ver procesos activos:** `ps aux | grep node`
* **Detener todo:** Presiona `Ctrl + C` y luego ejecuta `termux-wake-unlock`.
* **Saber tu IP local:** Ejecuta `ifconfig`.

---

## 🐳 Instalación con Docker (Servidores/VPS)

Despliegue aislado y persistente en segundos:

```bash
git clone [https://github.com/Manuel5906/cloulofare-tunnel.git](https://github.com/Manuel5906/cloulofare-tunnel.git)
cd cloulofare-tunnel
mkdir -p app/sis
docker-compose up -d --build

```

---

## 🖥️ Uso y Acceso

| Método de Acceso | Dirección |
| --- | --- |
| **Local (Mismo equipo)** | `http://localhost:3006` |
| **Red Local (WiFi)** | `http://[TU-IP-LOCAL]:3006` |

---

## 💡 Tips de Operación

* **Persistencia:** Los datos se guardan en `app/sis/tunnels_db.json`.
* **Seguridad:** Los archivos sensibles están en `.gitignore` para evitar subidas accidentales de tokens.
* **Auto-Arranque:** Puedes añadir `./start.sh` a tu archivo `~/.bashrc` en Termux para inicio automático.

---

## 🛠️ Solución de Problemas (FAQ)

1. **¿Error "Rejected" en Git?** Usa: `git push -u origin main --force`.
2. **¿Cloudflared no abre?** Verifica que tu arquitectura sea compatible (ARM64 para la mayoría de móviles modernos).
3. **¿Puerto ocupado?** Cambia el puerto en `app/index.js` si el 3006 ya está en uso.

---

## 👤 Autor

* **DarkCore** - [Manuel5906](https://www.google.com/search?q=https://github.com/Manuel5906)

---

## 📄 Licencia

Este proyecto está bajo la Licencia **ISC**.

```

¿Lograste copiarlo todo correctamente? Si necesitas que te ayude con el archivo `.gitignore` para proteger tus datos antes del push, dímelo.

```
