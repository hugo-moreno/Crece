const User = require('../models/User');
const Inscripcion = require('../models/Inscripcion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// --- REGISTRO DE USUARIOS ---
exports.register = async (req, res) => {
    try {
        const { nombre_completo, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "El correo ya está registrado" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            nombre_completo,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        res.status(201).json({ success: true, message: "Usuario creado con éxito" });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// --- LOGIN DE USUARIOS ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, nombre: user.nombre_completo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({ 
            success: true,
            token, 
            id: user.id,
            role: user.role,
            nombre: user.nombre_completo 
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ success: false, message: "Error interno" });
    }
};

// --- OBTENER USUARIOS CON ESTADÍSTICAS ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nombre_completo', 'email', 'role']
        });

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const certCount = await Inscripcion.count({
                where: { usuarioId: user.id, estado: 'completado' }
            });
            return { ...user.toJSON(), completados: certCount };
        }));

        res.json(usersWithStats);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};