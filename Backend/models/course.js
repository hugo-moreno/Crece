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
    nivel: { 
        type: DataTypes.ENUM('Principiante', 'Intermedio', 'Avanzado'), 
        defaultValue: 'Principiante' 
    },
    // CAMBIO: Ahora contamos lecciones/diapositivas
    lecciones: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    // NUEVO: Aquí guardaremos la ruta de tus carpetas (ej: /assets/cursos/word)
    ruta_assets: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagen_url: {
        type: DataTypes.STRING,
        defaultValue: '/logo2.png' // Puedes usar tu logo como default
    }
}, {
    tableName: 'courses',
    timestamps: true 
});

module.exports = Course;