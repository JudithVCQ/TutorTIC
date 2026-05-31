const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authMiddleware = require('../middleware/auth');

// Rutas protegidas
router.get('/me', authMiddleware.authenticateToken, perfilController.getPerfilMe);
router.put('/me', authMiddleware.authenticateToken, perfilController.updatePerfilMe);

module.exports = router;
