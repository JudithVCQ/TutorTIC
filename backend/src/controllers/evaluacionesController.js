const { Evaluacion, LogAuditoria } = require('../models');

// POST /api/evaluaciones
exports.saveEvaluacion = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { scores, indiceEmpleabilidad } = req.body;

    if (!scores) {
      return res.status(400).json({ error: 'Faltan los puntajes (scores) de la evaluación.' });
    }

    // Buscamos si ya existe una evaluación para este usuario y la actualizamos, o creamos una nueva
    let evaluacion = await Evaluacion.findOne({ where: { usuarioId } });

    if (evaluacion) {
      await evaluacion.update({ scores, indiceEmpleabilidad });
    } else {
      evaluacion = await Evaluacion.create({ usuarioId, scores, indiceEmpleabilidad });
    }

    // Registrar en auditoría
    await LogAuditoria.create({
      usuarioId,
      accion: 'Autoevaluación guardada',
      ipAddress: req.ip || req.connection.remoteAddress,
      detalles: { evaluacionId: evaluacion.id, indiceEmpleabilidad }
    });

    res.status(200).json({ message: 'Evaluación guardada exitosamente.', evaluacion });
  } catch (error) {
    console.error('[Evaluaciones] Error guardando evaluación:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar evaluación.' });
  }
};

// GET /api/evaluaciones/me
exports.getEvaluacion = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const evaluacion = await Evaluacion.findOne({ where: { usuarioId } });

    if (!evaluacion) {
      return res.status(404).json({ error: 'No se encontró evaluación para este usuario.', evaluacion: null });
    }

    res.status(200).json({ evaluacion });
  } catch (error) {
    console.error('[Evaluaciones] Error obteniendo evaluación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
