# Fase 1: Build de la app React/Vite
FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Fase 2: Servir con NGINX
FROM nginx:alpine

# Copiar build de Vite a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Sobrescribir configuración de Nginx (para SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
