const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS configuration
// Soporta múltiples orígenes: frontend estático (file://, localhost) y origen configurable
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || 'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173',   // Vite Dev Server
  'http://127.0.0.1:5500',  // Live Server de VS Code
  'http://localhost:5500'    // Live Server alternativo
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (ej: curl, Postman, o archivos locales file://)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed.`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Rate Limiting to prevent brute-force / DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.' }
});
app.use('/api/', limiter);

// Rate Limiting más estricto para rutas de autenticación (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Máximo 10 intentos de login por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación. Por favor espere 15 minutos.' }
});

// 4. Payload limit protection
app.use(express.json({ limit: '10kb' })); // Limit body sizes to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Importación de rutas
const authRoutes = require('./routes/authRoutes');
const sesionesRoutes = require('./routes/sesionesRoutes');
const mentoresRoutes = require('./routes/mentoresRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const evaluacionesRoutes = require('./routes/evaluacionesRoutes');
const compromisosRoutes = require('./routes/compromisosRoutes');
const vacantesRoutes = require('./routes/vacantesRoutes');

// Montaje de rutas
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/mentores', mentoresRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/compromisos', compromisosRoutes);
app.use('/api/vacantes', vacantesRoutes);

// 6. Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 7. 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// 8. Secure global error handler (avoid leaking stack traces in production)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const response = {
    error: 'Error interno del servidor'
  };
  
  if (process.env.NODE_ENV !== 'production') {
    response.message = err.message;
    response.stack = err.stack;
  }
  
  res.status(status).json(response);
});

module.exports = app;
