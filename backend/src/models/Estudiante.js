const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Estudiante
const Estudiante = sequelize.define('Estudiante', {
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
        msg: 'El nombre del estudiante no puede estar vacío.'
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
  }
}, {
  // Configuración del modelo
  tableName: 'estudiantes',
  // Habilita los campos automáticos createdAt y updatedAt (auditoría básica DevSecOps)
  timestamps: true
});

module.exports = Estudiante;
