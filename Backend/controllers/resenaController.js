const Resena = require('../models/resena');

// Obtener reseñas para la Landing
exports.getResenasPublicas = async (req, res) => {
    try {
        const results = await Resena.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']]
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Guardar una nueva reseña
exports.crearResena = async (req, res) => {
    try {
        const { nombre, texto } = req.body;
        await Resena.create({ nombre, texto });
        res.status(201).json({ message: "Reseña guardada con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};