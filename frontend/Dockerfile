FROM node:22-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
EXPOSE 5173
# Si usas Vite, asegúrate de que el comando sea el correcto para producción
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]