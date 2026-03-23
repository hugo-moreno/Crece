const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// --- REGISTRO DE USUARIOS ---
exports.register = async (req, res) => {
    try {
        const { nombre_completo, email, password, role } = req.body;

        // 1. Validar si el correo ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "El correo ya está registrado" 
            });
        }

        // 2. VALIDACIÓN PREVIA (Texto plano)
        // Creamos la instancia para validar los 13-15 caracteres originales
        const userValidation = User.build({ nombre_completo, email, password, role });
        
        try {
            await userValidation.validate(); 
        } catch (validationError) {
            return res.status(400).json({ 
                success: false, 
                message: validationError.errors[0].message 
            });
        }

        // 3. ENCRIPTACIÓN
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. CREACIÓN (Desactivando la segunda validación)
        // Usamos { validate: false } para que Sequelize no se queje del tamaño del hash
        await User.create({
            nombre_completo,
            email,
            password: hashedPassword,
            role: role || 'User'
        }, { validate: false }); 

        res.status(201).json({ 
            success: true, 
            message: "Usuario creado con éxito" 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor", 
            error: error.message 
        });
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
            { id: user.id, role: user.role, nombre_completo: user.nombre_completo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({ 
            success: true,
            token: token, 
            role: user.role 
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};