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
        
        // Contamos basándonos en el estado del modelo Inscripcion
        const enProgreso = await Inscripcion.count({ where: { usuarioId, estado: 'cursando' } });
        const completados = await Inscripcion.count({ where: { usuarioId, estado: 'completado' } });
        
        // Calculamos el promedio real de las calificaciones de los cursos completados
        const inscripcionesCompletadas = await Inscripcion.findAll({ 
            where: { usuarioId, estado: 'completado' } 
        });

        let promedioStr = "—";
        if (inscripcionesCompletadas.length > 0) {
            const suma = inscripcionesCompletadas.reduce((acc, curr) => acc + curr.calificacion, 0);
            promedioStr = `${Math.round(suma / inscripcionesCompletadas.length)}%`;
        }
        
        res.json({
            enProgreso,
            completados,
            disponibles: 6, // Tus 6 cursos base
            promedio: promedioStr
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

        // Buscamos si ya existe para no duplicar
        const [inscripcion, created] = await Inscripcion.findOrCreate({
            where: { usuarioId, cursoId },
            defaults: { estado: 'cursando' }
        });

        res.json({ message: created ? 'Inscrito con éxito' : 'Ya estás cursando este curso', inscripcion });
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

        // Buscamos la inscripción existente
        let inscripcion = await Inscripcion.findOne({ where: { usuarioId, cursoId } });

        if (inscripcion) {
            // Si ya existe, actualizamos a completado
            inscripcion.estado = 'completado';
            inscripcion.calificacion = calificacion;
            await inscripcion.save();
        } else {
            // Si por alguna razón no existía el registro de 'cursando', lo creamos directo
            inscripcion = await Inscripcion.create({
                usuarioId,
                cursoId,
                estado: 'completado',
                calificacion
            });
        }

        res.json({ message: 'Curso finalizado y guardado con éxito', inscripcion });
    } catch (error) {
        console.error('Error al finalizar curso:', error);
        res.status(500).json({ error: 'Error al procesar la finalización' });
    }
});

module.exports = router;