const db = require('../config/db');

// Obtener reseñas para la Landing (Público)
exports.getResenasPublicas = (req, res) => {
    const query = "SELECT nombre, texto FROM resenas ORDER BY creado_en DESC LIMIT 10";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Guardar una nueva reseña
exports.crearResena = (req, res) => {
    const { nombre, texto } = req.body;
    const query = "INSERT INTO resenas (nombre, texto) VALUES (?, ?)";
    db.query(query, [nombre, texto], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Reseña guardada con éxito" });
    });
};