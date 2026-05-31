const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'tutortic_secret_dev_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = 12; // Factor de coste para bcrypt (recomendado >= 10)

/**
 * POST /api/auth/register
 * Registra un nuevo usuario con rol: Mentorizado | Mentor | Gestor
 */
const register = async (req, res, next) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validaciones de entrada
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Los campos nombre, correo y password son obligatorios.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const rolesValidos = ['Mentorizado', 'Mentor', 'Gestor'];
    const rolAsignado = rol && rolesValidos.includes(rol) ? rol : 'Mentorizado';

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Hash de la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: hashedPassword,
      rol: rolAsignado
    });

    // No devolver el hash de la contraseña en la respuesta
    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (err) {
    // Captura de errores de validación de Sequelize
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Autentica un usuario y devuelve un token JWT
 */
const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Los campos correo y password son obligatorios.' });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    // Mensaje genérico para evitar enumeración de usuarios (DevSecOps)
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Comparar la contraseña con el hash almacenado
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar token JWT con payload mínimo
    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Registro de auditoría (SQA)
    const { LogAuditoria } = require('../models');
    await LogAuditoria.create({
      usuarioId: usuario.id,
      accion: 'Login exitoso',
      ipAddress: req.ip || req.connection.remoteAddress,
      detalles: { rol: usuario.rol }
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
