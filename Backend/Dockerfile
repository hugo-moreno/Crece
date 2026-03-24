FROM node:22-alpine
WORKDIR /app

# Al estar el Dockerfile dentro de Backend, copiamos lo que hay ahí
COPY package*.json ./
RUN npm install

# Copiamos todo el contenido de la carpeta Backend
COPY . .

# Exponemos el puerto de tu servidor
EXPOSE 8080

# Comando para arrancar
CMD ["node", "server.js"]