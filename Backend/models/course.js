const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    instructor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen_url: {
        type: DataTypes.STRING,
        defaultValue: 'https://via.placeholder.com/150' // Para que el frontend siempre tenga algo que mostrar
    }
}, {
    tableName: 'courses',
    timestamps: true // Esto crea 'createdAt' y 'updatedAt' automáticamente
});

module.exports = Course;