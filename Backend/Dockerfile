FROM node:22-alpine
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install --production

# Copiamos el resto del código del Backend
COPY . .

# Exponemos el puerto de tu servidor
EXPOSE 8080

# Comando para arrancar el servidor de Node
CMD ["node", "server.js"]