const User = require('../models/User');
const Inscripcion = require('../models/Inscripcion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// --- 0. CONFIGURACIÓN DE NODEMAILER (OPTIMIZADA PARA RAILWAY) ---
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // false para puerto 587 (usa STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Tu contraseña de aplicación (sin espacios)
    },
    tls: {
        rejectUnauthorized: false, // Evita errores de certificados en servidores externos
        minVersion: "TLSv1.2"
    }
});

// --- 1. REGISTRO DE USUARIOS ---
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

// --- 2. LOGIN DE USUARIOS ---
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

// --- 3. SOLICITAR RECUPERACIÓN (FORGOT PASSWORD) ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "No existe un usuario con ese correo." });
        }

        // Generar un token aleatorio
        const token = crypto.randomBytes(20).toString('hex');
        
        // Guardar token y expiración (1 hora)
        user.resetToken = token;
        user.resetExpires = Date.now() + 3600000; 
        await user.save();

        // Enlace para el frontend (Sin diagonal al final)
        const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
        const resetUrl = `${baseUrl}/reset-password/${token}`;

        const mailOptions = {
            from: `"Crece Online" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Recuperación de contraseña - Crece Online',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #0d2a4a; text-align: center;">Crece Online</h2>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p>Hola, <strong>${user.nombre_completo}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #0d2a4a; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Restablecer mi contraseña</a>
                    </div>
                    <p style="color: #777; font-size: 0.8em; text-align: center;">Este enlace expirará en 1 hora por motivos de seguridad.</p>
                </div>
            `
        };

        // Verificamos la conexión antes de enviar
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "Correo de recuperación enviado con éxito." });

    } catch (error) {
        console.error("Error detallado en forgotPassword:", error);
        res.status(500).json({ 
            success: false, 
            message: "Hubo un problema técnico al enviar el correo. Por favor, intenta más tarde." 
        });
    }
};

// --- 4. RESTABLECER CONTRASEÑA (RESET PASSWORD) ---
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            where: {
                resetToken: token,
                resetExpires: { [Op.gt]: Date.now() } // Verifica que el token sea válido y vigente
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "El enlace es inválido o ha caducado." });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Limpiar campos de token para que no se use dos veces
        user.resetToken = null;
        user.resetExpires = null;
        await user.save();

        res.json({ success: true, message: "Tu contraseña ha sido actualizada. Ya puedes iniciar sesión." });

    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la contraseña." });
    }
};

// --- 5. OBTENER USUARIOS CON ESTADÍSTICAS (PARA ADMIN) ---
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