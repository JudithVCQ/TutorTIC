const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Compromiso = sequelize.define('Compromiso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'compromisos',
  timestamps: true
});

module.exports = Compromiso;
