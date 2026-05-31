const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Estudiante (Perfil específico)
const Estudiante = sequelize.define('Estudiante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  intereses: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'estudiantes',
  timestamps: true
});

module.exports = Estudiante;
