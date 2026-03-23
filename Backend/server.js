const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const Course = require('./models/course');

const app = express();

// --- Captura de errores silenciosos ---
process.on('uncaughtException', (err) => {
    console.error(' Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(' Promesa rechazada no manejada:', reason);
});

// --- Middlewares Globales ---
app.use(cors({
    origin: ['http://localhost:5173', 'http://creceonline-frontend:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
    res.send('🚀 El servidor de Hugo David Moreno Llamas está escuchando en el puerto 3001');
});

// --- Encender Servidor ---
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(` Servidor encendido en: http://localhost:${PORT}`);
    console.log(` Esperando peticiones desde el puerto 5173...`);

    sequelize.authenticate()
        .then(() => {
            console.log(' Conexión exitosa a la base de datos en SQLyog');
            return sequelize.sync({ alter: true });
        })
        .then(() => {
            console.log(' Tablas sincronizadas correctamente');
            console.log(' Todo listo, el servidor está operativo');
        })
        .catch(err => {
            console.error(' Error en la base de datos:', err);
            console.log('  El servidor sigue corriendo, pero sin conexión a la DB');
        });
});

// --- Captura errores del servidor HTTP ---
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(` El puerto ${PORT} ya está en uso.`);
    } else {
        console.error(' Error en el servidor HTTP:', err);
    }
    process.exit(1);
});

// --- Mantener vivo el proceso (diagnóstico) ---
setInterval(() => {
    console.log(' Servidor fokin vivo!!...');
}, 3000);