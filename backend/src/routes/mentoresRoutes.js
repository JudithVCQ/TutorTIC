const express = require('express');
const router = express.Router();
const mentoresController = require('../controllers/mentoresController');

// Rutas públicas
router.get('/', mentoresController.getMentores);

module.exports = router;
