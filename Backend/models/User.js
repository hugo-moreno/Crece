const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // En tu captura de SQLyog la columna se llama 'PASSWORD' (mayúsculas)
    password: {
        type: DataTypes.STRING,
        field: 'PASSWORD', 
        allowNull: false
    },
    // En tu captura la columna se llama 'ROLE' (mayúsculas)
    role: {
        type: DataTypes.ENUM('Admin', 'Staff', 'User'),
        field: 'ROLE', 
        defaultValue: 'User'
    },
    // Cambiamos el nombre del campo para que coincida con 'fecha_registro'
    fechaRegistro: {
        type: DataTypes.DATE,
        field: 'fecha_registro',
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users', // Nombre de la tabla en SQLyog
    freezeTableName: true,
    timestamps: false // Como usas 'fecha_registro' manualmente, desactivamos los automáticos
});

module.exports = User;