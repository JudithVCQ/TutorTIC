const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogAuditoria = sequelize.define('LogAuditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true // Puede ser null si la acción es anónima (ej. intento fallido de login sin usuario)
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  detalles: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'logs_auditoria',
  timestamps: true,
  updatedAt: false // Solo nos interesa cuándo se creó el log
});

module.exports = LogAuditoria;
