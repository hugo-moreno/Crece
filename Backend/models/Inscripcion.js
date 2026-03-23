const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inscripcion = sequelize.define('Inscripcion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    cursoId: { type: DataTypes.INTEGER, allowNull: false },
    estado: { 
        type: DataTypes.ENUM('cursando', 'completado'), 
        defaultValue: 'cursando' 
    },
    calificacion: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Inscripcion;