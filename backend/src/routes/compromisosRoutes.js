const express = require('express');
const router = express.Router();
const compromisosController = require('../controllers/compromisosController');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas de compromisos requieren estar autenticado
router.use(authenticateToken);

router.post('/', compromisosController.crearCompromiso);
router.get('/me', compromisosController.getCompromisos);
router.put('/:id/estado', compromisosController.actualizarEstado);
router.delete('/:id', compromisosController.eliminarCompromiso);

module.exports = router;
