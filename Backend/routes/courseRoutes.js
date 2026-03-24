const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// 1. Ver todos los cursos (Público para alumnos)
router.get('/', courseController.getAllCourses);

// 2. Crear un curso nuevo (Permitido para Admin y Staff)
router.post('/', verifyToken, checkRole(['Admin', 'Staff']), courseController.createCourse);

// 3. Editar un curso existente (Permitido para Admin y Staff)
router.put('/:id', verifyToken, checkRole(['Admin', 'Staff']), courseController.updateCourse);

// 4. ELIMINAR CURSO (Esta es la que faltaba para corregir el error de permisos)
router.delete('/:id', verifyToken, checkRole(['Admin', 'Staff']), courseController.deleteCourse);

module.exports = router;