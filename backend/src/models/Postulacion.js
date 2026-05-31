const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Postulacion = sequelize.define('Postulacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vacanteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Enviada', 'En proceso', 'Rechazada'),
    defaultValue: 'Enviada'
  },
  cartaPresentacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pretension: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  disponibilidad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  compatibilidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'postulaciones',
  timestamps: true,
  updatedAt: false
});

module.exports = Postulacion;
