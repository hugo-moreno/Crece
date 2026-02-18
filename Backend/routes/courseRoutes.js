const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Cualquier usuario logueado puede ver cursos
router.get('/', verifyToken, courseController.getAllCourses);

// Solo el Admin (Hugo) puede crear cursos nuevos
router.post('/', verifyToken, checkRole(['Admin']), courseController.createCourse);

module.exports = router;