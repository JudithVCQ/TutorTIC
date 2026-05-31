const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  agendarSesion,
  listarSesiones,
  obtenerSesion,
  actualizarEstado
} = require('../controllers/sesionesController');

/**
 * @route  POST /api/sesiones
 * @desc   Agenda una nueva sesión (Transacción Shift-Left)
 * @access Privado - Solo Mentorizados
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Mentorizado'),
  agendarSesion
);

/**
 * @route  GET /api/sesiones
 * @desc   Lista sesiones según el rol del usuario autenticado
 * @access Privado - Todos los roles autenticados
 */
router.get(
  '/',
  authenticateToken,
  listarSesiones
);

/**
 * @route  GET /api/sesiones/:id
 * @desc   Obtiene el detalle de una sesión específica
 * @access Privado - Participantes de la sesión o Gestor
 */
router.get(
  '/:id',
  authenticateToken,
  obtenerSesion
);

/**
 * @route  PUT /api/sesiones/:id/estado
 * @desc   Actualiza el estado de una sesión
 * @access Privado - Mentor de la sesión o Gestor
 */
router.put(
  '/:id/estado',
  authenticateToken,
  authorizeRoles('Mentor', 'Gestor'),
  actualizarEstado
);

module.exports = router;
