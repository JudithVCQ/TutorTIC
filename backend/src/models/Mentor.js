const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Mentor (Perfil específico)
const Mentor = sequelize.define('Mentor', {
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
  especialidad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'mentores',
  timestamps: true
});

module.exports = Mentor;
