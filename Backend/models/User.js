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
        field: 'PASSWORD', // Asegúrate que en SQLyog sea minúsculas como en tus capturas previas
        allowNull: false,
        validate: {
            // Regra 1: Longitud entre 13 y 15 caracteres
            len: {
                args: [13, 15],
                msg: "La contraseña debe tener entre 13 y 15 caracteres."
            },
            // Regla 2: Mayúsculas, minúsculas y carácter especial
            isComplex(value) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
                if (!regex.test(value)) {
                    throw new Error("La contraseña debe incluir mayúsculas, minúsculas y al menos un carácter especial.");
                }
            }
        }
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Staff', 'User'),
        field: 'role', 
        defaultValue: 'User'
    },
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