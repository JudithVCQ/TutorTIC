const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionesController');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas de evaluación requieren estar autenticado
router.use(authenticateToken);

router.post('/', evaluacionesController.saveEvaluacion);
router.get('/me', evaluacionesController.getEvaluacion);

module.exports = router;
