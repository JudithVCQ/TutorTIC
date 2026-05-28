const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición de la relación M:N - Modelo Sesión
const Sesion = sequelize.define('Sesion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Llaves foráneas que referencian a Estudiante y Mentor
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estudiantes',
      key: 'id'
    }
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'mentores',
      key: 'id'
    }
  },
  // Fecha de la sesión de mentoría
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha ingresada debe ser válida.'
      }
    }
  },
  // Hora de la sesión de mentoría
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  // Estado actual de la sesión
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'confirmada', 'completada', 'cancelada']],
        msg: 'El estado de la sesión no es válido.'
      }
    }
  }
}, {
  // Configuración del modelo
  tableName: 'sesiones',
  // Campos createdAt y updatedAt para auditoría
  timestamps: true
});

module.exports = Sesion;
