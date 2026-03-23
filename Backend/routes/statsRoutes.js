const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');

/**
 * 1. OBTENER ESTADÍSTICAS DEL DASHBOARD (ACTUALIZADA)
 * GET /api/stats/dashboard/:usuarioId
 */
router.get('/dashboard/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        // Buscamos todas las inscripciones del usuario
        const todasLasInscripciones = await Inscripcion.findAll({ 
            where: { usuarioId } 
        });

        // Separamos para los contadores
        const cursando = todasLasInscripciones.filter(i => i.estado === 'cursando');
        const completadas = todasLasInscripciones.filter(i => i.estado === 'completado');

        // CLAVE 1: Lista de IDs para filtrar (se queda igual para no romper el filter)
        const idsUsuario = todasLasInscripciones.map(i => i.cursoId);
        
        // CLAVE 2: Objeto detallado para saber qué texto poner en cada tarjeta
        const detallesCursos = todasLasInscripciones.reduce((acc, curr) => {
            acc[curr.cursoId] = curr.estado; // Ej: { "1": "completado", "2": "cursando" }
            return acc;
        }, {});

        // Promedio de calificaciones
        let promedioStr = "—";
        if (completadas.length > 0) {
            const suma = completadas.reduce((acc, curr) => acc + curr.calificacion, 0);
            promedioStr = `${Math.round(suma / completadas.length)}%`;
        }
        
        res.json({
            enProgreso: cursando.length,
            completados: completadas.length,
            disponibles: 6,
            promedio: promedioStr,
            idsUsuario,
            detallesCursos // <-- Nuevo campo para el Frontend
        });
    } catch (error) {
        console.error('Error en dashboard stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

/**
 * 2. REGISTRAR INICIO DE CURSO (INSCRIPCIÓN)
 * Se mantiene igual...
 */
router.post('/inscribir', async (req, res) => {
    try {
        const { usuarioId, cursoId } = req.body;
        if (!usuarioId || !cursoId) return res.status(400).json({ error: 'Faltan datos' });

        const [inscripcion, created] = await Inscripcion.findOrCreate({
            where: { usuarioId, cursoId },
            defaults: { estado: 'cursando' }
        });

        res.json({ success: true, message: created ? 'Inscrito' : 'Ya cursando', inscripcion });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar' });
    }
});

/**
 * 3. FINALIZAR CURSO Y GUARDAR CALIFICACIÓN
 * Se mantiene igual...
 */
router.post('/finalizar', async (req, res) => {
    try {
        const { usuarioId, cursoId, calificacion } = req.body;
        if (!usuarioId || !cursoId) return res.status(400).json({ error: 'Faltan datos' });

        let inscripcion = await Inscripcion.findOne({ where: { usuarioId, cursoId } });

        if (inscripcion) {
            inscripcion.estado = 'completado';
            inscripcion.calificacion = calificacion;
            await inscripcion.save();
        } else {
            inscripcion = await Inscripcion.create({
                usuarioId, cursoId, estado: 'completado', calificacion
            });
        }

        res.json({ success: true, message: 'Curso finalizado con éxito', inscripcion });
    } catch (error) {
        res.status(500).json({ error: 'Error al finalizar' });
    }
});

module.exports = router;