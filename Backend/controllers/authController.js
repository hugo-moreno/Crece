const User = require('../models/User');
const Inscripcion = require('../models/Inscripcion'); // Importación necesaria para las estadísticas
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
        const userValidation = User.build({ nombre_completo, email, password, role: role || 'User' });
        
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

        // 4. CREACIÓN
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

        // 1. Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        // 2. Comparar contraseñas
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        // 3. Generar TOKEN
        if (!process.env.JWT_SECRET) {
            console.error("ERROR: No se encontró la variable JWT_SECRET en el entorno.");
            return res.status(500).json({ success: false, message: "Error de configuración en el servidor" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, nombre: user.nombre_completo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 4. RESPUESTA EXITOSA
        return res.json({ 
            success: true,
            token: token, 
            id: user.id,
            role: user.role,
            nombre: user.nombre_completo 
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ success: false, message: "Error interno en el servidor" });
    }
};

// --- OBTENER USUARIOS CON ESTADÍSTICAS (PARA ADMIN) ---
exports.getAllUsers = async (req, res) => {
    try {
        // 1. Obtenemos los usuarios base
        const users = await User.findAll({
            attributes: ['id', 'nombre_completo', 'email', 'role']
        });

        // 2. Cruzamos con la tabla Inscripcion para contar certificados completados
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const certCount = await Inscripcion.count({
                where: { 
                    usuarioId: user.id, 
                    estado: 'completado' 
                }
            });
            
            return {
                ...user.toJSON(),
                completados: certCount // Enviamos el conteo real al frontend
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        console.error("Error al obtener usuarios con certificados:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};