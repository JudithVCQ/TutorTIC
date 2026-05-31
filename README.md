<<<<<<< Updated upstream
# 🚀 TutorTIC

TutorTIC es una plataforma diseñada para conectar a estudiantes y recién egresados de carreras tecnológicas en Perú con mentores profesionales, ayudándolos a cerrar la brecha entre la academia y el mercado laboral y mejorando su empleabilidad en el sector TIC.

## ✨ ¿Qué hace la app?

* **Gestión de Perfiles:** Roles independientes para Mentorizados (alumnos), Mentores y Gestores de Talento.
* **Autoevaluación de Habilidades:** Un radar interactivo para medir competencias técnicas (Cloud, Docker, Seguridad, Backend, etc.).
* **Agendamiento de Mentorías:** Sistema rápido para que los alumnos reserven sesiones con profesionales del sector.
=======
# TutorTIC - Plataforma de Mentoría y Desarrollo Profesional TI

TutorTIC es una aplicación web full-stack que conecta a estudiantes de TI con mentores expertos y ofertas laborales de manera personalizada. La plataforma incluye módulos de autoevaluación, agendamiento de sesiones y postulación inteligente a vacantes.
>>>>>>> Stashed changes

## 🛠️ Stack Tecnológico

<<<<<<< Updated upstream
* **Frontend:** HTML5, CSS3, JavaScript Vanilla.
* **Backend:** Node.js, Express.
* **Base de Datos:** PostgreSQL (con Sequelize ORM).
* **Infraestructura:** Docker & Docker Compose.
=======
## 🛠️ Arquitectura y Stack Tecnológico

El proyecto está estructurado bajo una arquitectura **Cliente/Servidor** desacoplada:

* **`/frontend`**: Interfaz de usuario (Single Page Application) desarrollada con **React 18**, **Vite** y **TypeScript**. En producción es servida mediante un servidor **Nginx** optimizado.
* **`/backend`**: API RESTful construida con **Node.js** y **Express**, utilizando **Sequelize ORM** para la persistencia. Incorpora prácticas de seguridad SQA como cabeceras Helmet, rate limiting y validación de tokens JWT.
* **Base de Datos**: Base de datos relacional **PostgreSQL 15** persistente.

---

## 🚀 Inicio Rápido con Docker (Recomendado)

La forma más rápida de levantar la arquitectura completa (base de datos, backend y frontend) de manera local es utilizando Docker Compose:

```bash
# Levantar y reconstruir todos los servicios
docker compose up -d --build
```

Una vez iniciados los contenedores, el sistema estará accesible en:
* **Frontend Web**: [http://localhost:8080](http://localhost:8080)
* **Backend API**: [http://localhost:3000](http://localhost:3000)
* **Base de Datos**: Puerto `5432`

---

## 💻 Inicio de Desarrollo Local (Manual)

Si deseas levantar los servicios manualmente para desarrollo activo:

### 1. Servidor Backend
```bash
cd backend
npm install
cp .env.example .env
# Ejecuta el servidor (asegúrate de tener una base de datos Postgres corriendo)
npm run dev
```

### 2. Frontend SPA
```bash
cd frontend
npm install
# Inicia el servidor de desarrollo de Vite
npm run dev
```

---

## 🛡️ Controles DevSecOps y SQA
El repositorio incorpora flujos de verificación automatizados en [.github/workflows/devsecops.yml](.github/workflows/devsecops.yml):
* **SAST (Static Application Security Testing):** Corre análisis de sintaxis y seguridad con ESLint (`npm run lint`).
* **SCA (Software Composition Analysis):** Realiza auditorías automáticas de dependencias en npm para detectar vulnerabilidades (`npm run security-audit`).
>>>>>>> Stashed changes
