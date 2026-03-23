const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usamos los nombres exactos que Railway genera por defecto
const sequelize = new Sequelize(
    process.env.MYSQLDATABASE, // Cambiado de DB_NAME
    process.env.MYSQLUSER,     // Cambiado de DB_USER
    process.env.MYSQLPASSWORD, // Cambiado de DB_PASSWORD
    {
        host: process.env.MYSQLHOST, // Cambiado de DB_HOST
        port: process.env.MYSQLPORT || 3306, // Agregamos el puerto
        dialect: 'mysql',
        logging: false 
    }
);

module.exports = sequelize;