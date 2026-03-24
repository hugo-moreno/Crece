const Course = require('../models/course');

// 1. Obtener todos los cursos (Para Dashboard de Alumno y Admin)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        // Respondemos con success y data para que el frontend lo lea bien
        res.json({ success: true, data: courses });
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        res.status(500).json({ success: false, message: "Error al obtener cursos" });
    }
};

// 2. Crear un curso (Admin o Staff)
exports.createCourse = async (req, res) => {
    try {
        const { titulo, descripcion, instructor, nivel, lecciones, ruta_assets, imagen_url } = req.body;
        
        const nuevoCurso = await Course.create({
            titulo,
            descripcion,
            instructor,
            nivel,
            lecciones,      // Sincronizado con el modelo
            ruta_assets,    // Sincronizado con el modelo
            imagen_url
        });

        res.status(201).json({ success: true, data: nuevoCurso });
    } catch (error) {
        console.error("Error al crear curso:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Actualizar un curso (Vital para corregir rutas o lecciones)
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        // Agregamos lecciones y ruta_assets aquí para que se puedan editar
        const { titulo, descripcion, instructor, imagen_url, nivel, lecciones, ruta_assets } = req.body;

        const curso = await Course.findByPk(id);
        if (!curso) {
            return res.status(404).json({ success: false, message: "Curso no encontrado" });
        }

        // Actualizamos con los nombres exactos de las columnas en la DB
        await curso.update({
            titulo,
            descripcion,
            instructor,
            imagen_url,
            nivel,
            lecciones,
            ruta_assets
        });

        res.json({ success: true, message: "Curso actualizado correctamente", data: curso });
    } catch (error) {
        console.error("Error al actualizar curso:", error);
        res.status(400).json({ success: false, message: "Error al actualizar el curso" });
    }
};

// 4. Eliminar un curso
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