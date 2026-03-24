FROM node:22-alpine
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código del Backend
COPY . .

# Exponemos el puerto que usa tu Express
EXPOSE 8080

# COMANDO CORRECTO PARA BACKEND (Sin npm run build)
CMD ["node", "server.js"]