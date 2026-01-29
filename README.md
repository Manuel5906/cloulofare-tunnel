# 🚀 Cloudflare Tunnel Dashboard PRO

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

Un panel de control web moderno y ligero para gestionar múltiples túneles de Cloudflare de forma simultánea. Diseñado para ofrecer persistencia y facilidad de uso en **Docker**, **Termux** (Android), **Linux** y **Windows**.

---

## 📂 Estructura del Proyecto

* `app/`: Núcleo del sistema (Backend & Frontend).
* `app/sis/`: Carpeta de persistencia (Base de datos JSON).
* `docker-compose.yml`: Orquestación de contenedores.
* `start.sh`: Script de inicio optimizado para móviles.

---

## 🛠️ Instalación en Termux (Android)

Ideal para mantener tus túneles activos desde un dispositivo móvil 24/7.

### 1. Preparación del Sistema
```bash
pkg update && pkg upgrade
pkg install nodejs cloudflared git
