const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Modelo Usuario unificado para todos los roles del sistema
const Usuario = sequelize.define('Usuario', {
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
        msg: 'El nombre no puede estar vacío.'
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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Rol del usuario en el sistema TutorTIC
  rol: {
    type: DataTypes.ENUM('Mentorizado', 'Mentor', 'Gestor'),
    allowNull: false,
    defaultValue: 'Mentorizado',
    validate: {
      isIn: {
        args: [['Mentorizado', 'Mentor', 'Gestor']],
        msg: 'El rol debe ser Mentorizado, Mentor o Gestor.'
      }
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    afterCreate: async (usuario, options) => {
      // Usar la misma transacción en la que se creó el usuario
      const transaction = options.transaction;
      const tOption = transaction ? { transaction } : {};

      try {
        // Crear perfil específico
        if (usuario.rol === 'Mentorizado') {
          await sequelize.models.Estudiante.create({ usuarioId: usuario.id }, tOption);
        } else if (usuario.rol === 'Mentor') {
          await sequelize.models.Mentor.create({ usuarioId: usuario.id }, tOption);
        }

        // Registrar auditoría de SQA
        await sequelize.models.LogAuditoria.create({
          usuarioId: usuario.id,
          accion: 'Registro de usuario nuevo',
          detalles: { rol: usuario.rol, email: usuario.correo }
        }, tOption);

      } catch (error) {
        console.error('[Usuario Hook] Error creando dependencias:', error);
        throw error; // Esto causará un rollback automático si hay transacción
      }
    }
  }
});

module.exports = Usuario;
