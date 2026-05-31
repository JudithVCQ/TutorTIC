// Load environment variables as early as possible
require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;
let server;

const seedMentores = require('./seeds/mentores.seed.js');
const seedVacantes = require('./seeds/vacantes.seed.js');

// Sincronizar la base de datos antes de iniciar el servidor HTTP
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('[TutorTIC Backend] Base de datos sincronizada con éxito.');
    await seedMentores();
    await seedVacantes();
    server = app.listen(PORT, () => {
      console.log(`[TutorTIC Backend] Servidor escuchando de manera segura en el puerto ${PORT}`);
      console.log(`[TutorTIC Backend] Entorno actual: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('[TutorTIC Backend] Error crítico al inicializar la base de datos:', err);
    process.exit(1);
  });

// Manejar apagado controlado para liberar recursos de manera limpia
const shutdown = () => {
  console.log('[TutorTIC Backend] Recibida señal de apagado. Cerrando conexiones...');
  if (server) {
    server.close(() => {
      console.log('[TutorTIC Backend] Servidor cerrado. Saliendo del proceso.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
