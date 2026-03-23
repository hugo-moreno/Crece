import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true // Esto le dice a Vite que acepte cualquier dominio
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true // Esto es para cuando corres la versión de producción
  }
})