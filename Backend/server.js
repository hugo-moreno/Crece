const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 

// --- Importación de Rutas ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const resenaRoutes = require('./routes/resenaRoutes');
const statsRoutes = require('./routes/statsRoutes'); 

// --- Importación de Modelos ---
const Course = require('./models/course');
const Inscripcion = require('./models/Inscripcion'); 
const User = require('./models/User'); // Asegúrate de que User esté importado

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
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/stats', statsRoutes); 

app.get('/', (req, res) => {
    res.send('🚀 El servidor de Crece Online está escuchando correctamente en Railway');
});

// --- Encender Servidor ---
const PORT = process.env.PORT || 8080; // Railway suele preferir el 8080

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor encendido en el puerto: ${PORT}`);

    sequelize.authenticate()
        .then(() => {
            console.log('✅ Conexión exitosa a la base de datos en Railway (MySQL)');
            
            // --- CAMBIO CRÍTICO AQUÍ ---
            // Quitamos { alter: true } para evitar el error ER_TOO_MANY_KEYS
            return sequelize.sync(); 
        })
        .then(() => {
            console.log('✅ Tablas sincronizadas correctamente (Modo Seguro)');
            console.log('🚀 Todo listo, el servidor de Crece Online está operativo');
        })
        .catch(err => {
            console.error('❌ Error en la base de datos:', err);
            console.log('⚠️ El servidor sigue corriendo, pero revisa los índices de la tabla users');
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