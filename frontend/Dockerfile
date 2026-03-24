FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generamos la carpeta dist
RUN npm run build

# Usamos un servidor ligero para mostrar el sitio
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]