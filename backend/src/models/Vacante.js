const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vacante = sequelize.define('Vacante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
}, {
  tableName: 'vacantes',
  timestamps: true
});

module.exports = Vacante;
