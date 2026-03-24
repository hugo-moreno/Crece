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
    // --- AGREGAMOS ESTOS DOS PARA EL STAFF ---
    nivel: { 
        type: DataTypes.ENUM('Principiante', 'Intermedio', 'Avanzado'), 
        defaultValue: 'Principiante' 
    },
    videos: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    // -----------------------------------------
    imagen_url: {
        type: DataTypes.STRING,
        defaultValue: 'https://via.placeholder.com/150'
    }
}, {
    tableName: 'courses',
    timestamps: true 
});

module.exports = Course;