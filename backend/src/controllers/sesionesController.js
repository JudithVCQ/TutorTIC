const { Sesion, Usuario, Mentor, Estudiante, LogAuditoria, Notificacion, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * POST /api/sesiones
 * Transacción Shift-Left: Un alumno (Mentorizado) agenda una sesión con un Mentor.
 */
const agendarSesion = async (req, res, next) => {
  try {
    const { mentorId, fecha, hora, estado, objetivo, duracion } = req.body; // mentorId aquí es el usuarioId del mentor (del frontend)
    const usuarioEstudianteId = req.user.id;

    if (!mentorId || !fecha || !hora) {
      return res.status(400).json({ error: 'Los campos mentorId, fecha y hora son obligatorios.' });
    }

    const result = await sequelize.transaction(async (t) => {
      // 1. Obtener perfil de Estudiante
      const estudiante = await Estudiante.findOne({ 
        where: { usuarioId: usuarioEstudianteId },
        transaction: t
      });
      if (!estudiante) {
        return { status: 404, error: 'Perfil de estudiante no encontrado.' };
      }

      // 2. Obtener perfil de Mentor (buscando por usuarioId)
      const mentor = await Mentor.findOne({ 
        where: { usuarioId: mentorId },
        include: [{ model: Usuario, as: 'usuario' }],
        transaction: t
      });
      
      if (!mentor) {
        return { status: 404, error: 'El mentor especificado no existe.' };
      }

      // Evitar que el mentor agende una sesión consigo mismo
      if (mentor.usuarioId === usuarioEstudianteId) {
        return { status: 400, error: 'No puedes agendar una sesión de mentoría contigo mismo.' };
      }

      // 3. Verificar si el mentor ya tiene una sesión agendada en esa fecha y hora
      const sesionDuplicadaMentor = await Sesion.findOne({
        where: {
          mentorId: mentor.id,
          fecha,
          hora,
          estado: { [Op.not]: 'cancelada' }
        },
        transaction: t
      });

      if (sesionDuplicadaMentor) {
        return { status: 409, error: 'El mentor ya tiene una sesión agendada en esa fecha y hora.' };
      }

      // 4. Verificar si el estudiante ya tiene una sesión agendada en esa misma fecha y hora
      const sesionDuplicadaEstudiante = await Sesion.findOne({
        where: {
          estudianteId: estudiante.id,
          fecha,
          hora,
          estado: { [Op.not]: 'cancelada' }
        },
        transaction: t
      });

      if (sesionDuplicadaEstudiante) {
        return { status: 409, error: 'Ya tienes otra sesión agendada en esta misma fecha y hora.' };
      }

      const estadoValido = ['pendiente', 'confirmada', 'completada', 'cancelada'];
      const estadoSesion = estado && estadoValido.includes(estado) ? estado : 'pendiente';

      const nuevaSesion = await Sesion.create({
        estudianteId: estudiante.id,
        mentorId: mentor.id,
        fecha,
        hora,
        duracion: duracion || '15 minutos',
        objetivo,
        estado: estadoSesion
      }, { transaction: t });

      // 5. Crear log de auditoría SQA
      await LogAuditoria.create({
        usuarioId: usuarioEstudianteId,
        accion: 'Sesión agendada',
        ipAddress: req.ip || req.connection.remoteAddress,
        detalles: { sesionId: nuevaSesion.id, mentorUsuarioId: mentorId }
      }, { transaction: t });

      // 6. Crear notificación para el mentor
      await Notificacion.create({
        usuarioId: mentorId, 
        mensaje: `Tienes una nueva solicitud de mentoría programada para el ${fecha} a las ${hora}.`
      }, { transaction: t });

      return { status: 201, sesionId: nuevaSesion.id };
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    // Incluir datos para respuesta
    const sesionConDetalles = await Sesion.findByPk(result.sesionId, {
      include: [
        {
          model: Mentor,
          as: 'mentor',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }]
        }
      ]
    });

    return res.status(201).json({
      message: 'Sesión agendada exitosamente.',
      sesion: sesionConDetalles
    });

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    next(err);
  }
};

/**
 * GET /api/sesiones
 * Lista las sesiones según el rol del usuario autenticado.
 */
const listarSesiones = async (req, res, next) => {
  try {
    const { id: userId, rol } = req.user;
    const { estado, fecha } = req.query;

    const where = {};
    if (rol === 'Mentorizado') {
      const estudiante = await Estudiante.findOne({ where: { usuarioId: userId } });
      if (estudiante) where.estudianteId = estudiante.id;
    } else if (rol === 'Mentor') {
      const mentor = await Mentor.findOne({ where: { usuarioId: userId } });
      if (mentor) where.mentorId = mentor.id;
    }

    if (estado) where.estado = estado;
    if (fecha) where.fecha = fecha;

    const sesiones = await Sesion.findAll({
      where,
      include: [
        {
          model: Mentor,
          as: 'mentor',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }]
        },
        {
          model: Estudiante,
          as: 'estudiante',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }]
        }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    return res.status(200).json({
      total: sesiones.length,
      sesiones
    });

  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sesiones/:id
 */
const obtenerSesion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, rol } = req.user;

    const sesion = await Sesion.findByPk(id, {
      include: [
        {
          model: Mentor,
          as: 'mentor',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }]
        },
        {
          model: Estudiante,
          as: 'estudiante',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }]
        }
      ]
    });

    if (!sesion) {
      return res.status(404).json({ error: 'Sesión no encontrada.' });
    }

    const esParticipante = (sesion.estudiante && sesion.estudiante.usuarioId === userId) || 
                           (sesion.mentor && sesion.mentor.usuarioId === userId);
                           
    if (rol !== 'Gestor' && !esParticipante) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta sesión.' });
    }

    return res.status(200).json({ sesion });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/sesiones/:id/estado
 */
const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const { id: userId, rol } = req.user;

    const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: `El estado debe ser uno de: ${estadosValidos.join(', ')}.` });
    }

    const sesion = await Sesion.findByPk(id, {
      include: [{ model: Mentor, as: 'mentor' }]
    });
    
    if (!sesion) {
      return res.status(404).json({ error: 'Sesión no encontrada.' });
    }

    if (rol !== 'Gestor' && sesion.mentor.usuarioId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta sesión.' });
    }

    await sesion.update({ estado });
    
    // Log de auditoría
    await LogAuditoria.create({
      usuarioId: userId,
      accion: 'Estado de sesión actualizado',
      ipAddress: req.ip || req.connection.remoteAddress,
      detalles: { sesionId: sesion.id, nuevoEstado: estado }
    });

    return res.status(200).json({
      message: 'Estado de la sesión actualizado exitosamente.',
      sesion: { id: sesion.id, estado: sesion.estado }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { agendarSesion, listarSesiones, obtenerSesion, actualizarEstado };
