const { Vacante, Postulacion, LogAuditoria, Evaluacion } = require('../models');
const sequelize = require('../config/database');

// GET /api/vacantes
exports.getVacantes = async (req, res, next) => {
  try {
    const vacantes = await Vacante.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ vacantes });
  } catch (error) {
    next(error);
  }
};

// POST /api/vacantes/:id/postular
exports.postularVacante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const { cartaPresentacion, cvUrl, pretension, disponibilidad } = req.body;

    const result = await sequelize.transaction(async (t) => {
      // 1. Validar si la vacante existe
      const vacante = await Vacante.findByPk(id, { transaction: t });
      if (!vacante) {
        return { status: 404, error: 'Vacante no encontrada.' };
      }

      // 2. Validar postulación previa duplicada
      const postulacionPrevia = await Postulacion.findOne({
        where: { usuarioId, vacanteId: vacante.id },
        transaction: t
      });

      if (postulacionPrevia) {
        return { status: 400, error: 'Ya te has postulado a esta vacante.' };
      }

      // 3. Obtener la última autoevaluación del usuario para calcular compatibilidad técnica de manera realista
      const latestEval = await Evaluacion.findOne({
        where: { usuarioId },
        order: [['createdAt', 'DESC']],
        transaction: t
      });

      let compatibilidad = 50; // porcentaje base por defecto
      if (latestEval && latestEval.scores) {
        const scores = latestEval.scores;
        let scoreSum = 0;
        let tagCount = 0;
        const tags = vacante.tags || [];

        for (const tag of tags) {
          const tName = tag.toLowerCase();
          let val = 5; // valor neutral por defecto
          if (tName.includes('aws') || tName.includes('cloud') || tName.includes('infra') || tName.includes('gcp') || tName.includes('azure')) {
            val = scores.cloud || 5;
          } else if (tName.includes('docker') || tName.includes('k8s') || tName.includes('kubernetes') || tName.includes('devops') || tName.includes('ci/cd')) {
            val = scores.docker || 5;
          } else if (tName.includes('seguridad') || tName.includes('owasp') || tName.includes('sec')) {
            val = scores.sec || 5;
          } else if (tName.includes('pentest') || tName.includes('hacking')) {
            val = scores.pentest || 5;
          } else if (tName.includes('backend') || tName.includes('node') || tName.includes('python') || tName.includes('go') || tName.includes('django') || tName.includes('sql') || tName.includes('microservicios')) {
            val = scores.backend || 5;
          } else if (tName.includes('frontend') || tName.includes('react') || tName.includes('vue') || tName.includes('css') || tName.includes('figma') || tName.includes('ux')) {
            val = scores.front || 5;
          } else if (tName.includes('comunicación') || tName.includes('liderazgo') || tName.includes('soft') || tName.includes('hablar')) {
            val = scores.comm || 5;
          } else if (tName.includes('agile') || tName.includes('scrum') || tName.includes('metodologías')) {
            val = scores.agile || 5;
          }
          scoreSum += val;
          tagCount++;
        }

        if (tagCount > 0) {
          // El score está de 0 a 10, lo escalamos a 0-100%
          compatibilidad = Math.min(100, Math.round((scoreSum / tagCount) * 10));
        }
      }

      // 4. Crear postulación
      const postulacion = await Postulacion.create({
        usuarioId,
        vacanteId: vacante.id,
        estado: 'Enviada',
        cartaPresentacion,
        cvUrl,
        pretension: pretension ? parseInt(pretension) : null,
        disponibilidad: disponibilidad || 'Inmediata',
        compatibilidad
      }, { transaction: t });

      // 5. Registrar en LogAuditoria de SQA
      await LogAuditoria.create({
        usuarioId,
        accion: 'Postulación a vacante',
        ipAddress: req.ip || req.connection.remoteAddress,
        detalles: { 
          vacanteId: vacante.id, 
          postulacionId: postulacion.id, 
          compatibilidad, 
          pretension, 
          disponibilidad 
        }
      }, { transaction: t });

      return { status: 201, data: postulacion };
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Postulación enviada exitosamente.',
      postulacion: result.data
    });
  } catch (error) {
    next(error);
  }
};
