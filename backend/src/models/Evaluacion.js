const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluacion = sequelize.define('Evaluacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  indiceEmpleabilidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  scores: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'evaluaciones',
  timestamps: true,
  updatedAt: false
});

module.exports = Evaluacion;
