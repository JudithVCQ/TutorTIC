const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notificaciones',
  timestamps: true,
  updatedAt: false
});

module.exports = Notificacion;
