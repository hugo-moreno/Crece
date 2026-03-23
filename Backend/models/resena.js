const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resena = sequelize.define('Resena', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'resenas',
    timestamps: true
});

module.exports = Resena;