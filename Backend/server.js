const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Importamos las nuevas rutas de cursos
const Course = require('./models/course'); // Importamos el modelo para la sincronización

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

// Rutas de autenticación (Login, Registro, Perfil, Roles)
app.use('/api/auth', authRoutes);

// Rutas de cursos (CRUD para la Escuela Virtual)
app.use('/api/courses', courseRoutes);

// --- Verificación y Sincronización de la DB ---
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión exitosa a la base de datos en SQLyog');
        
        // Sincronizamos los modelos con las tablas de la DB
        // 'alter: true' ajusta las tablas si les haces cambios en el código
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('📅 Tablas de Usuarios y Cursos sincronizadas correctamente');
    })
    .catch(err => {
        console.error('❌ Error en la base de datos:', err);
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