FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos en modo desarrollo para que Railway no pida el build por ahora
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]