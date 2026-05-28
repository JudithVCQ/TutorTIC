const { Sequelize } = require('sequelize');

// Inicializar la instancia de Sequelize con la configuración de PostgreSQL.
// Se leen las variables de entorno configuradas o se usan valores por defecto para desarrollo local.
const sequelize = new Sequelize(
  process.env.DB_NAME || 'tutortic_db',
  process.env.DB_USER || 'tutortic_user',
  process.env.DB_PASS || 'tutortic_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    // Habilitar los logs SQL solo en entorno de desarrollo para mantener limpia la consola en producción
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // Configuración del pool de conexiones para optimizar el rendimiento y evitar fugas de recursos
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
