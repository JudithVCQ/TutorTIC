const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Estudiante = require('./Estudiante');
const Mentor = require('./Mentor');
const Sesion = require('./Sesion');
const Categoria = require('./Categoria');
const LogAuditoria = require('./LogAuditoria');
const Notificacion = require('./Notificacion');
const Evaluacion = require('./Evaluacion');
const Vacante = require('./Vacante');
const Postulacion = require('./Postulacion');
const Compromiso = require('./Compromiso');

// ─────────────────────────────────────────────────────────────────────────────
// Relaciones 1:1 (Auth -> Perfiles)
// ─────────────────────────────────────────────────────────────────────────────
Usuario.hasOne(Estudiante, { foreignKey: 'usuarioId', as: 'perfilEstudiante' });
Estudiante.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasOne(Mentor, { foreignKey: 'usuarioId', as: 'perfilMentor' });
Mentor.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ─────────────────────────────────────────────────────────────────────────────
// Relaciones M:N (Sesiones Intermedias)
// ─────────────────────────────────────────────────────────────────────────────
Estudiante.belongsToMany(Mentor, {
  through: Sesion,
  foreignKey: 'estudianteId',
  otherKey: 'mentorId',
  as: 'mentores'
});

Mentor.belongsToMany(Estudiante, {
  through: Sesion,
  foreignKey: 'mentorId',
  otherKey: 'estudianteId',
  as: 'estudiantes'
});

// Relaciones directas adicionales con Sesion para facilitar consultas
Estudiante.hasMany(Sesion, { foreignKey: 'estudianteId', as: 'sesiones' });
Sesion.belongsTo(Estudiante, { foreignKey: 'estudianteId', as: 'estudiante' });

Mentor.hasMany(Sesion, { foreignKey: 'mentorId', as: 'sesiones' });
Sesion.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'mentor' });

// ─────────────────────────────────────────────────────────────────────────────
// Relaciones M:N (Catálogo de Skills)
// ─────────────────────────────────────────────────────────────────────────────
Mentor.belongsToMany(Categoria, { through: 'MentorCategoria', as: 'categorias', foreignKey: 'mentorId' });
Categoria.belongsToMany(Mentor, { through: 'MentorCategoria', as: 'mentores', foreignKey: 'categoriaId' });

// ─────────────────────────────────────────────────────────────────────────────
// Relaciones 1:N (Usuario -> Utilidades)
// ─────────────────────────────────────────────────────────────────────────────
Usuario.hasMany(Notificacion, { foreignKey: 'usuarioId', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasMany(LogAuditoria, { foreignKey: 'usuarioId', as: 'logs' });
LogAuditoria.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasMany(Evaluacion, { foreignKey: 'usuarioId', as: 'evaluaciones' });
Evaluacion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasMany(Compromiso, { foreignKey: 'usuarioId', as: 'compromisos' });
Compromiso.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ─────────────────────────────────────────────────────────────────────────────
// Relaciones M:N (Bolsa de Trabajo)
// ─────────────────────────────────────────────────────────────────────────────
Usuario.belongsToMany(Vacante, { through: Postulacion, foreignKey: 'usuarioId', as: 'postulaciones' });
Vacante.belongsToMany(Usuario, { through: Postulacion, foreignKey: 'vacanteId', as: 'postulantes' });

module.exports = {
  sequelize,
  Usuario,
  Estudiante,
  Mentor,
  Sesion,
  Categoria,
  LogAuditoria,
  Notificacion,
  Evaluacion,
  Vacante,
  Postulacion,
  Compromiso
};
