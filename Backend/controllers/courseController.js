const Course = require('../models/course');

// Obtener todos los cursos (Público para alumnos)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener cursos" });
    }
};

// Crear un curso (Solo para Hugo o alguien con rol Admin)
exports.createCourse = async (req, res) => {
    try {
        const { titulo, descripcion, instructor, imagen_url } = req.body;
        const newCourse = await Course.create({ titulo, descripcion, instructor, imagen_url });
        res.status(201).json({ success: true, message: "Curso creado con éxito", data: newCourse });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error al crear curso" });
    }
};