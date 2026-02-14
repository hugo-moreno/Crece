const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// --- RUTAS PÚBLICAS ---
router.post('/login', authController.login);
router.post('/register', authController.register);

// --- RUTAS PROTEGIDAS (Requieren Token) ---

// Validar token (Vital para que el Frontend mantenga la sesión iniciada)
router.get('/validate', verifyToken, (req, res) => {
    res.json({ 
        success: true, 
        message: "Token válido", 
        user: req.user 
    });
});

// Perfil General (Accesible para Admin, Staff y User)
router.get('/perfil', verifyToken, (req, res) => {
    res.json({ 
        success: true,
        message: `Hola ${req.user.role}, bienvenido a la Escuela Virtual`,
        usuario: req.user 
    });
});

// Reportes (Solo Admin y Staff - Susana y Hugo)
router.get('/reportes', verifyToken, checkRole(['Admin', 'Staff']), (req, res) => {
    res.json({ 
        success: true,
        message: "Acceso concedido a reportes académicos." 
    });
});

// Panel de Control Maestro (Solo Admin - Hugo)
router.get('/admin-total', verifyToken, checkRole(['Admin']), (req, res) => {
    res.json({ 
        success: true,
        message: "Acceso total al sistema de Lubral concedido." 
    });
});

module.exports = router;