const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * @route  POST /api/auth/register
 * @desc   Registra un nuevo usuario (Mentorizado | Mentor | Gestor)
 * @access Public
 */
router.post('/register', register);

/**
 * @route  POST /api/auth/login
 * @desc   Autentica usuario y devuelve token JWT
 * @access Public
 */
router.post('/login', login);

module.exports = router;
