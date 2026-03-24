const User = require('../models/User');
const Inscripcion = require('../models/Inscripcion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// --- 0. CONFIGURACIÓN DE NODEMAILER (MODO COMPATIBLE IPv4 PARA RAILWAY) ---
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para puerto 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    },
    // Forzamos a Node.js a usar IPv4 (familia 4) para evitar ENETUNREACH
    family: 4, 
    connectionTimeout: 15000, 
    greetingTimeout: 15000,
    socketTimeout: 15000,
    tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com'
    }
});

// --- 1. REGISTRO DE USUARIOS ---
exports.register = async (req, res) => {
    try {
        const { nombre_completo, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "El correo ya está registrado" });
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
        res.status(500).json({ success: false, message: "Error interno" });
    }
};

// --- 2. LOGIN DE USUARIOS ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        const token = jwt.sign(
            { id: user.id, role: user.role, nombre: user.nombre_completo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        return res.json({ success: true, token, id: user.id, role: user.role, nombre: user.nombre_completo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno" });
    }
};

// --- 3. SOLICITAR RECUPERACIÓN (FORGOT PASSWORD) ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "No existe el usuario." });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetExpires = Date.now() + 3600000; 
        await user.save();

        const rawUrl = process.env.FRONTEND_URL || "https://crece-production.up.railway.app";
        const baseUrl = rawUrl.replace(/\/$/, ""); 
        const resetUrl = `${baseUrl}/reset-password/${token}`;

        const mailOptions = {
            from: `"Crece Online" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Recuperación de contraseña - Crece Online',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #0d2a4a; text-align: center;">Crece Online</h2>
                    <p>Hola <strong>${user.nombre_completo}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #0d2a4a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
                    </div>
                    <p style="color: #777; font-size: 0.8em;">Este enlace es válido por 1 hora.</p>
                </div>
            `
        };

        // Verificamos conexión y enviamos
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "Correo enviado correctamente." });
    } catch (error) {
        console.error("Error detallado en el envío:", error);
        res.status(500).json({ 
            success: false, 
            message: "No se pudo enviar el correo. Revisa la configuración del servidor." 
        });
    }
};

// --- 4. RESTABLECER CONTRASEÑA (RESET PASSWORD) ---
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            where: { resetToken: token, resetExpires: { [Op.gt]: Date.now() } }
        });
        if (!user) return res.status(400).json({ success: false, message: "El enlace es inválido o ha caducado." });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = null;
        user.resetExpires = null;
        await user.save();
        
        res.json({ success: true, message: "Tu contraseña ha sido actualizada correctamente." });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la contraseña." });
    }
};

// --- 5. OBTENER USUARIOS ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'nombre_completo', 'email', 'role'] });
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const certCount = await Inscripcion.count({ where: { usuarioId: user.id, estado: 'completado' } });
            return { ...user.toJSON(), completados: certCount };
        }));
        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};