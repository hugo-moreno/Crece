const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');

/**
 * 1. OBTENER ESTADÍSTICAS DEL DASHBOARD
 * GET /api/stats/dashboard/:usuarioId
 */
router.get('/dashboard/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        // Buscamos todas las inscripciones (cursando y completadas)
        const todasLasInscripciones = await Inscripcion.findAll({ 
            where: { usuarioId } 
        });

        // Filtramos para obtener los contadores
        const enProgreso = todasLasInscripciones.filter(i => i.estado === 'cursando').length;
        const completadas = todasLasInscripciones.filter(i => i.estado === 'completado');

        // CLAVE: Creamos un array con solo los IDs de los cursos del usuario
        // Esto servirá para el filtrado en el Dashboard.jsx
        const idsUsuario = todasLasInscripciones.map(i => i.cursoId);
        
        // Calculamos el promedio real de los cursos completados
        let promedioStr = "—";
        if (completadas.length > 0) {
            const suma = completadas.reduce((acc, curr) => acc + curr.calificacion, 0);
            promedioStr = `${Math.round(suma / completadas.length)}%`;
        }
        
        res.json({
            enProgreso,
            completados: completadas.length,
            disponibles: 6,
            promedio: promedioStr,
            idsUsuario // <-- El Frontend usará esto para filtrar las listas
        });
    } catch (error) {
        console.error('Error en dashboard stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

/**
 * 2. REGISTRAR INICIO DE CURSO (INSCRIPCIÓN)
 * POST /api/stats/inscribir
 */
router.post('/inscribir', async (req, res) => {
    try {
        const { usuarioId, cursoId } = req.body;

        if (!usuarioId || !cursoId) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        // findOrCreate: si no existe lo crea, si existe lo ignora
        const [inscripcion, created] = await Inscripcion.findOrCreate({
            where: { usuarioId, cursoId },
            defaults: { estado: 'cursando' }
        });

        res.json({ 
            success: true,
            message: created ? 'Inscrito con éxito' : 'Ya estás cursando este curso', 
            inscripcion 
        });
    } catch (error) {
        console.error('Error al inscribir:', error);
        res.status(500).json({ error: 'Error al iniciar el curso' });
    }
});

/**
 * 3. FINALIZAR CURSO Y GUARDAR CALIFICACIÓN
 * POST /api/stats/finalizar
 */
router.post('/finalizar', async (req, res) => {
    try {
        const { usuarioId, cursoId, calificacion } = req.body;

        if (!usuarioId || !cursoId) {
            return res.status(400).json({ error: 'ID de usuario o curso no detectado' });
        }

        let inscripcion = await Inscripcion.findOne({ where: { usuarioId, cursoId } });

        if (inscripcion) {
            // Actualizamos registro existente
            inscripcion.estado = 'completado';
            inscripcion.calificacion = calificacion;
            await inscripcion.save();
        } else {
            // Si no existía el registro de inicio, lo creamos directamente como completado
            inscripcion = await Inscripcion.create({
                usuarioId,
                cursoId,
                estado: 'completado',
                calificacion
            });
        }

        res.json({ success: true, message: 'Curso finalizado y guardado con éxito', inscripcion });
    } catch (error) {
        console.error('Error al finalizar curso:', error);
        res.status(500).json({ error: 'Error al procesar la finalización' });
    }
});

module.exports = router;