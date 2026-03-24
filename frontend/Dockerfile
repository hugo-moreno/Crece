FROM node:22-alpine
WORKDIR /app

# Al estar ya en la carpeta frontend, usamos ./
COPY package*.json ./
RUN npm install

COPY . .

# Para producción en Vite es mejor hacer el build
RUN npm run build

# Exponemos el puerto que usa Vite para el preview
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]