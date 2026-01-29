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

### 2. Configuración y Permisos
Es fundamental dar permisos de almacenamiento para manejar los archivos de base de datos:

```bash
termux-setup-storage
git clone [https://github.com/Manuel5906/cloulofare-tunnel.git](https://github.com/Manuel5906/cloulofare-tunnel.git)
cd cloulofare-tunnel
chmod +x start.sh

¡Ya te entendí! El chat se corta y lo que sigue después del código lo pone como texto normal, rompiendo el archivo.

Para que no pase más, aquí tienes absolutamente todo dentro de un solo bloque. No hay texto afuera. Copia desde la primera línea hasta la última dentro del cuadro negro:

Markdown
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
2. Configuración y Permisos
Es fundamental dar permisos de almacenamiento para manejar los archivos de base de datos:

```bash
termux-setup-storage
git clone [https://github.com/Manuel5906/cloulofare-tunnel.git](https://github.com/Manuel5906/cloulofare-tunnel.git)
cd cloulofare-tunnel
chmod +x start.sh


### 3. Evitar que Android cierre el Servidor (Wake Lock)
Para que los túneles no se caigan al apagar la pantalla, el script start.sh intenta activar el Wake Lock automáticamente. Si lo haces manual, usa:

Ejecuta el comando:
```bash
termux-wake-lock

Ve a los ajustes de tu móvil -> Batería -> Optimización de batería -> Termux -> No optimizar.

### 4. Iniciar el Sistema
```bash
