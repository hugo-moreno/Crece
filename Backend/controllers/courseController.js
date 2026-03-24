const Course = require('../models/course');

// 1. Obtener todos los cursos
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener cursos" });
    }
};

// 2. Crear un curso (Admin o Staff)
exports.createCourse = async (req, res) => {
    try {
        // Agregamos nivel y videos que vienen del formulario del Admin.jsx
        const { titulo, descripcion, instructor, imagen_url, nivel, videos } = req.body;
        
        const newCourse = await Course.create({ 
            titulo, 
            descripcion, 
            instructor, 
            imagen_url,
            nivel: nivel || 'Principiante',
            videos: videos || 0
        });

        res.status(201).json({ success: true, message: "Curso creado con éxito", data: newCourse });
    } catch (error) {
        console.error("Error al crear curso:", error);
        res.status(400).json({ success: false, message: "Error al crear curso" });
    }
};

// 3. Actualizar un curso (Función vital para el Staff)
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, instructor, imagen_url, nivel, videos } = req.body;

        const curso = await Course.findByPk(id);
        if (!curso) {
            return res.status(404).json({ success: false, message: "Curso no encontrado" });
        }

        await curso.update({
            titulo,
            descripcion,
            instructor,
            imagen_url,
            nivel,
            videos
        });

        res.json({ success: true, message: "Curso actualizado correctamente", data: curso });
    } catch (error) {
        console.error("Error al actualizar curso:", error);
        res.status(400).json({ success: false, message: "Error al actualizar el curso" });
    }
};

// Eliminar un curso
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Course.findByPk(id);

        if (!curso) {
            return res.status(404).json({ success: false, message: "Curso no encontrado" });
        }

        await curso.destroy();
        res.json({ success: true, message: "Curso eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar curso:", error);
        res.status(500).json({ success: false, message: "Error interno al eliminar" });
    }
};