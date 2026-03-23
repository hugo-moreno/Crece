FROM node:18-alpine
WORKDIR /app
# Fíjate en la ruta: le decimos que busque dentro de Backend
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ .
EXPOSE 3001
CMD ["node", "server.js"]