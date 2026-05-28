const sequelize = require('../config/database');
const Estudiante = require('./Estudiante');
const Mentor = require('./Mentor');
const Sesion = require('./Sesion');

// Establecer la relación de Muchos a Muchos (M:N)
// Un Estudiante puede agendar muchas Sesiones con diferentes Mentores
Estudiante.belongsToMany(Mentor, {
  through: Sesion,
  foreignKey: 'estudianteId',
  otherKey: 'mentorId',
  as: 'mentores'
});

// Un Mentor puede dar muchas Sesiones a diferentes Estudiantes
Mentor.belongsToMany(Estudiante, {
  through: Sesion,
  foreignKey: 'mentorId',
  otherKey: 'estudianteId',
  as: 'estudiantes'
});

// Relaciones adicionales directas con el modelo de unión 'Sesion'
// Esto facilita consultar directamente la tabla 'sesiones'
Estudiante.hasMany(Sesion, {
  foreignKey: 'estudianteId',
  as: 'sesiones'
});
Sesion.belongsTo(Estudiante, {
  foreignKey: 'estudianteId',
  as: 'estudiante'
});

Mentor.hasMany(Sesion, {
  foreignKey: 'mentorId',
  as: 'sesiones'
});
Sesion.belongsTo(Mentor, {
  foreignKey: 'mentorId',
  as: 'mentor'
});

module.exports = {
  sequelize,
  Estudiante,
  Mentor,
  Sesion
};
