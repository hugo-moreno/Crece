FROM node:22-alpine
WORKDIR /app

# Al estar ya en la carpeta Backend, usamos ./
COPY package*.json ./
RUN npm install

# Copiamos todo lo que está dentro de Backend a la carpeta /app del contenedor
COPY . .

# Importante: Tu servidor usa el 8080 en Railway, asegúrate de que coincida
EXPOSE 8080
CMD ["node", "server.js"]