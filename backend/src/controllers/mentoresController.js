const { Mentor, Usuario, Categoria } = require('../models');

// GET /api/mentores
exports.getMentores = async (req, res) => {
  try {
    const mentores = await Mentor.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'correo']
        },
        {
          model: Categoria,
          as: 'categorias',
          attributes: ['nombre']
        }
      ]
    });

    res.json({
      mentores: mentores.map(m => {
        const nombre = m.usuario ? m.usuario.nombre : 'Sin nombre';
        const partes = nombre.split(' ');
        const init = partes[0].charAt(0) + (partes[1] ? partes[1].charAt(0) : '');
        const tags = m.categorias ? m.categorias.map(c => c.nombre) : [];
        
        return {
          id: m.usuarioId, // Retornamos usuarioId para compatibilidad con el frontend actual
          mentorPerfilId: m.id,
          name: nombre,
          role: 'Mentor',
          bio: m.bio || '',
          tags: tags,
          init: init.toUpperCase(),
          color: '#1D9E75',
          sessions: Math.floor(Math.random() * 50) + 10,
          rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)
        };
      })
    });
  } catch (error) {
    console.error('[Mentores] Error obteniendo mentores:', error);
    res.status(500).json({ error: 'Error al obtener mentores' });
  }
};
