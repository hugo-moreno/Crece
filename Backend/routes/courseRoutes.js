const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Ver cursos (Público)
router.get('/', courseController.getAllCourses);

// Crear curso (Admin y Staff)
router.post('/', verifyToken, checkRole(['Admin', 'Staff']), courseController.createCourse);

// Editar curso (Admin y Staff) - El ID es necesario para saber cuál editar
router.put('/:id', verifyToken, checkRole(['Admin', 'Staff']), courseController.updateCourse);

module.exports = router;