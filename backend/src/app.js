const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8080';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// 4. Payload limit protection
app.use(express.json({ limit: '10kb' })); // Limit body sizes to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Basic API endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 6. 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// 7. Secure global error handler (avoid leaking stack traces in production)
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
