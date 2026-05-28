# TutorTIC - Cliente/Servidor & DevSecOps

Este proyecto establece una arquitectura base Cliente/Servidor orientada a prácticas DevSecOps.

## Estructura del Proyecto

*   **`/frontend`**: Interfaz de usuario con HTML, CSS, y JS estático, servido mediante un contenedor Nginx configurado de manera segura.
*   **`/backend`**: API REST construida con Node.js y Express, con middlewares de seguridad (`helmet`, `cors`, rate limiting) y auditorías de código estático (ESLint + rules de seguridad).

---

## Requisitos Previos

*   [Node.js](https://nodejs.org/) (Versión 18 o superior)
*   [Docker](https://www.docker.com/) y Docker Compose (opcional, para ejecución en contenedores)

---

## Inicio Rápido (Desarrollo Local)

### 1. Servidor Backend
1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de variables de entorno de ejemplo y configúralo:
   ```bash
   cp .env.example .env
   ```
4. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### 2. Frontend
Dado que el frontend es estático, puedes abrir el archivo `frontend/index.html` directamente en tu navegador o levantarlo usando una extensión como Live Server. En producción o entornos de staging, se sirve a través de Docker y Nginx.

---

## Ejecución con Docker Compose (Recomendado)

Para levantar la arquitectura completa (Cliente y Servidor) en contenedores Docker aislados y preconfigurados:

```bash
docker-compose up --build
```

*   **Frontend**: Disponible en `http://localhost:8080`
*   **Backend**: Disponible en `http://localhost:3000`

---

## Controles DevSecOps Incorporados

El proyecto incluye las siguientes herramientas de seguridad automatizables en pipelines de CI/CD:

### 1. Auditoría de Dependencias (SCA)
Para buscar vulnerabilidades conocidas en las dependencias de Node.js:
```bash
cd backend
npm run security-audit
```

### 2. Análisis Estático de Código (SAST)
Linter configurado con plugins específicos de seguridad (`eslint-plugin-security`):
```bash
cd backend
npm run lint
```

### 3. Pipeline de Integración Continua (CI)
Ubicado en `.github/workflows/devsecops.yml`, se ejecuta automáticamente en cada push o pull request a la rama `main` y realiza auditorías de dependencias y validaciones de sintaxis.
