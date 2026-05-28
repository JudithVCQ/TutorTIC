const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Mentor
const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del mentor no puede estar vacío.'
      }
    }
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'El correo electrónico ya está registrado.'
    },
    validate: {
      isEmail: {
        msg: 'El formato del correo electrónico es inválido.'
      },
      notEmpty: {
        msg: 'El correo electrónico no puede estar vacío.'
      }
    }
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General'
  }
}, {
  // Configuración del modelo
  tableName: 'mentores',
  // Auditoría automática (createdAt, updatedAt)
  timestamps: true
});

module.exports = Mentor;
