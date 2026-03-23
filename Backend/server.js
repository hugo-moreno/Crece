const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const resenaRoutes = require('./routes/resenaRoutes'); // <-- IMPORTANTE: Nueva ruta de reseñas
const Course = require('./models/course');

const app = express();

// --- Captura de errores silenciosos ---
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

// --- Middlewares Globales ---
app.use(cors({
    origin: true, // Permite cualquier origen para evitar errores de CORS en Railway
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resenas', resenaRoutes); // <-- IMPORTANTE: Activamos el endpoint de reseñas

app.get('/', (req, res) => {
    res.send('🚀 El servidor de Hugo David Moreno Llamas está escuchando correctamente en Railway');
});

// --- Encender Servidor ---
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor encendido en el puerto: ${PORT}`);

    sequelize.authenticate()
        .then(() => {
            console.log('✅ Conexión exitosa a la base de datos en Railway (MySQL)');
            // Sincronizar modelos con la DB
            return sequelize.sync({ alter: true });
        })
        .then(() => {
            console.log('✅ Tablas sincronizadas correctamente en el servidor');
            console.log('🚀 Todo listo, el servidor de Crece Online está operativo');
        })
        .catch(err => {
            console.error('❌ Error en la base de datos:', err);
            console.log('⚠️ El servidor sigue corriendo, pero revisa las variables de conexión');
        });
});

// --- Captura errores del servidor HTTP ---
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso.`);
    } else {
        console.error('❌ Error en el servidor HTTP:', err);
    }
    process.exit(1);
});

// --- Mantener vivo el proceso (diagnóstico para logs de Railway) ---
setInterval(() => {
    console.log('📡 Servidor operativo y escuchando peticiones...');
}, 60000);