const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, vacantesController.getVacantes);
router.post('/:id/postular', authenticateToken, vacantesController.postularVacante);

module.exports = router;
