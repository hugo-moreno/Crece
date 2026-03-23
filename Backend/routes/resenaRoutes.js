const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

// Ruta para la Landing
router.get('/publicas', resenaController.getResenasPublicas);

// Ruta para que tus compas escriban (puedes protegerla después)
router.post('/crear', resenaController.crearResena);

module.exports = router;