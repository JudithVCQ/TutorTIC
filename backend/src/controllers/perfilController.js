const { Usuario, Estudiante, Mentor, Categoria } = require('../models');

// GET /api/perfil/me
exports.getPerfilMe = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'nombre', 'correo', 'rol', 'createdAt']
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let perfil = null;
    if (usuario.rol === 'Mentorizado') {
      perfil = await Estudiante.findOne({ where: { usuarioId } });
    } else if (usuario.rol === 'Mentor') {
      perfil = await Mentor.findOne({
        where: { usuarioId },
        include: [{ model: Categoria, as: 'categorias', attributes: ['nombre'] }]
      });
    }

    return res.status(200).json({
      usuario,
      perfil
    });
  } catch (error) {
    console.error('[Perfil] Error obteniendo perfil:', error);
    return res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// PUT /api/perfil/me
exports.updatePerfilMe = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nombre, bio, telefono, especialidad, intereses, tags } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (nombre) {
      await usuario.update({ nombre });
    }

    let perfil = null;
    if (usuario.rol === 'Mentorizado') {
      perfil = await Estudiante.findOne({ where: { usuarioId } });
      if (perfil) {
        await perfil.update({
          bio: bio !== undefined ? bio : perfil.bio,
          intereses: intereses !== undefined ? intereses : perfil.intereses,
          telefono: telefono !== undefined ? telefono : perfil.telefono
        });
      }
    } else if (usuario.rol === 'Mentor') {
      perfil = await Mentor.findOne({ where: { usuarioId } });
      if (perfil) {
        await perfil.update({
          bio: bio !== undefined ? bio : perfil.bio,
          especialidad: especialidad !== undefined ? especialidad : perfil.especialidad,
          telefono: telefono !== undefined ? telefono : perfil.telefono
        });

        if (tags && Array.isArray(tags)) {
          const categoriasInstances = [];
          for (const tagName of tags) {
            if (tagName && tagName.trim()) {
              const [cat] = await Categoria.findOrCreate({ where: { nombre: tagName.trim() } });
              categoriasInstances.push(cat);
            }
          }
          await perfil.setCategorias(categoriasInstances);
        }
      }
    }

    // Volver a cargar el perfil actualizado
    let perfilActualizado = null;
    if (usuario.rol === 'Mentorizado') {
      perfilActualizado = await Estudiante.findOne({ where: { usuarioId } });
    } else if (usuario.rol === 'Mentor') {
      perfilActualizado = await Mentor.findOne({
        where: { usuarioId },
        include: [{ model: Categoria, as: 'categorias', attributes: ['nombre'] }]
      });
    }

    return res.status(200).json({
      message: 'Perfil actualizado exitosamente.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      perfil: perfilActualizado
    });
  } catch (error) {
    console.error('[Perfil] Error actualizando perfil:', error);
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};
