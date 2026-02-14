const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó un token válido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Usamos estrictamente la clave de tu .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Esto te ayudará a ver en la terminal si el rol viene dentro
        console.log("Token decodificado:", decoded); 
        
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        // Si no hay usuario o el rol no está en la lista, bloqueamos
        if (!req.user || !rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Tu rol (${req.user ? req.user.role : 'desconocido'}) no tiene permiso aquí.` 
            });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };