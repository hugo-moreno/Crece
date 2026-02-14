const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');

// Cargamos variables de entorno (JWT_SECRET, DB_PASSWORD, etc.)
dotenv.config();

const app = express();

// --- Middlewares Globales ---

// Configuramos CORS para el Frontend de Vite (Puerto 5173)
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Permite leer JSON en las peticiones (Vital para el Login y Registro)
app.use(express.json()); 

// --- Rutas de la Aplicación ---

// Conectamos las rutas de autenticación y los nuevos filtros de roles
app.use('/api/auth', authRoutes);

// --- Verificación de Conexión a la DB ---
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión exitosa a la base de datos en SQLyog');
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err);
    });

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('🚀 El servidor de Hugo David Moreno Llamas está escuchando en el puerto 50644');
});

// --- Encender Servidor ---
const PORT = 50644; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones desde el puerto 5173...`);
});