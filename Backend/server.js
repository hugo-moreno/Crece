const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// --- Middlewares Globales ---

// Configuramos CORS para abrir el puente con tu Frontend de Vite
app.use(cors({
    origin: 'http://localhost:5173', // Puerto de tu Frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); // Permite leer los datos que manda el formulario de React

// --- Rutas de la Aplicación ---
app.use('/api/auth', authRoutes);

// --- Verificación de Conexión a la DB ---
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión exitosa a la base de datos en SQLyog');
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err);
    });

// Ruta simple para probar en el navegador
app.get('/', (req, res) => {
    res.send('🚀 El servidor de Hugo Moreno está escuchando en el puerto 50644');
});

// --- Encender Servidor ---
// Forzamos el puerto 50644 para que coincida con tu Frontend y Postman
const PORT = 50644; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones desde el puerto 5173...`);
});