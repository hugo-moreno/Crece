const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos que la ruta para el login sea un método POST
router.post('/login', authController.login);

router.post('/register', authController.register);

module.exports = router;