# 🚀 Cloudflare Tunnel Dashboard PRO

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

Un panel de control web moderno y ligero para gestionar múltiples túneles de Cloudflare de forma simultánea. Optimizado para **Termux** (Android), **Docker** (Servidores/VPS), **Linux** y **Windows**.

---

## 📂 Estructura del Proyecto

* `app/`: Directorio principal del código fuente (Backend & Frontend).
* `app/sis/`: Carpeta de persistencia para la base de datos JSON (`tunnels_db.json`).
* `docker-compose.yml`: Configuración para despliegue rápido con contenedores.
* `start.sh`: Script de automatización para ejecución en móviles.
* `.dockerignore`: Optimización para subidas rápidas y construcción de imágenes.

---

## 📱 Instalación en Termux (Android)

Ideal para transformar tu móvil en un servidor de túneles 24/7.

### 1. Preparación del Sistema
```bash
pkg update && pkg upgrade
pkg install nodejs cloudflared git
