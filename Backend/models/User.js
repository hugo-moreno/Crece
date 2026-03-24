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
        unique: true,
        validate: {
            isEmail: { msg: "Debe ser un correo electrónico válido." }
        }
    },
    password: {
        type: DataTypes.STRING,
        field: 'password', 
        allowNull: false,
        validate: {
            len: {
                args: [13, 100], // Aumenté el máximo porque al encriptar se vuelve larga
                msg: "La contraseña debe tener al menos 13 caracteres."
            }
        }
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Staff', 'User'),
        field: 'role', 
        defaultValue: 'User'
    },
    // --- NUEVOS CAMPOS PARA RECUPERACIÓN ---
    resetToken: {
        type: DataTypes.STRING,
        field: 'reset_token',
        allowNull: true
    },
    resetExpires: {
        type: DataTypes.DATE,
        field: 'reset_expires',
        allowNull: true
    },
    // ---------------------------------------
    fechaRegistro: {
        type: DataTypes.DATE,
        field: 'fecha_registro',
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false 
});

module.exports = User;