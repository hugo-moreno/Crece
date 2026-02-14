const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Necesario para encriptar

// --- REGISTRO DE USUARIOS ---
exports.register = async (req, res) => {
    try {
        const { nombre_completo, email, password, role } = req.body;

        // Validar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado" });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear en la DB
        const newUser = await User.create({
            nombre_completo,
            email,
            password: hashedPassword,
            role: role || 'User' // Rol por defecto
        });

        res.status(201).json({ success: true, message: "Usuario creado" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar", error: error.message });
    }
};

// --- LOGIN DE USUARIOS ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Usuario no existe" });

        // IMPORTANTE: Ahora comparamos usando bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: "Password incorrecto" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_temporal',
            { expiresIn: '2h' }
        );

        return res.json({ 
            success: true,
            token: token, 
            role: user.role 
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};