# Stage 1: Build the React Frontend
FROM node:18-alpine as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Nginx Gateway (Serves Frontend & Proxies API)
FROM nginx:alpine
# Copy the custom Nginx config
COPY backend/gateway/nginx.conf /etc/nginx/nginx.conf
# Copy the built React app from Stage 1
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
