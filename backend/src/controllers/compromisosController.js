const { Compromiso, LogAuditoria } = require('../models');

// POST /api/compromisos
exports.crearCompromiso = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { descripcion } = req.body;

    if (!descripcion || descripcion.trim() === '') {
      return res.status(400).json({ error: 'La descripción del compromiso es obligatoria.' });
    }

    const compromiso = await Compromiso.create({
      usuarioId,
      descripcion,
      completado: false
    });

    res.status(201).json({ message: 'Compromiso creado exitosamente.', compromiso });
  } catch (error) {
    console.error('[Compromisos] Error creando compromiso:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear compromiso.' });
  }
};

// GET /api/compromisos/me
exports.getCompromisos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const compromisos = await Compromiso.findAll({
      where: { usuarioId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ compromisos });
  } catch (error) {
    console.error('[Compromisos] Error obteniendo compromisos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// PUT /api/compromisos/:id/estado
exports.actualizarEstado = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;
    const { completado } = req.body;

    if (typeof completado !== 'boolean') {
      return res.status(400).json({ error: 'El estado completado debe ser un booleano.' });
    }

    const compromiso = await Compromiso.findOne({ where: { id, usuarioId } });

    if (!compromiso) {
      return res.status(404).json({ error: 'Compromiso no encontrado o no autorizado.' });
    }

    await compromiso.update({ completado });

    // Auditoría si completó
    if (completado) {
      await LogAuditoria.create({
        usuarioId,
        accion: 'Compromiso completado',
        ipAddress: req.ip || req.connection.remoteAddress,
        detalles: { compromisoId: id }
      });
    }

    res.status(200).json({ message: 'Compromiso actualizado.', compromiso });
  } catch (error) {
    console.error('[Compromisos] Error actualizando compromiso:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// DELETE /api/compromisos/:id
exports.eliminarCompromiso = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const compromiso = await Compromiso.findOne({ where: { id, usuarioId } });

    if (!compromiso) {
      return res.status(404).json({ error: 'Compromiso no encontrado o no autorizado.' });
    }

    await compromiso.destroy();

    res.status(200).json({ message: 'Compromiso eliminado.' });
  } catch (error) {
    console.error('[Compromisos] Error eliminando compromiso:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
