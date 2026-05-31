const bcrypt = require('bcryptjs');
const { Usuario, Mentor, Categoria } = require('../models');

const mentoresDemo = [
  {
    nombre: 'Ricardo Chávez',
    correo: 'ricardo.chavez@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Más de 8 años de experiencia en arquitectura de software y liderando equipos ágiles. Apasionado por el mentoring y el desarrollo de talento joven.',
    especialidad: 'Tech Lead / Arquitecto de Software',
    tags: ['Arquitectura', 'Node.js', 'React', 'Agile', 'Liderazgo']
  },
  {
    nombre: 'María Palomino',
    correo: 'maria.palomino@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Especialista en ciberseguridad con certificaciones CISSP y CEH. Experiencia en auditorías y ethical hacking para entidades financieras.',
    especialidad: 'Especialista Ciberseguridad',
    tags: ['Seguridad', 'OWASP', 'Auditoría', 'Pentest', 'Criptografía']
  },
  {
    nombre: 'Ana Torres',
    correo: 'ana.torres@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Desarrolladora Backend Senior enfocada en microservicios y sistemas de alta concurrencia. Entusiasta de Python y Go.',
    especialidad: 'Backend Developer Senior',
    tags: ['Python', 'Django', 'Go', 'Microservicios', 'Backend']
  },
  {
    nombre: 'Jorge Vargas',
    correo: 'jorge.vargas@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Ingeniero de Datos con amplia experiencia construyendo pipelines ETL y data lakes en AWS y GCP.',
    especialidad: 'Data Engineer / Big Data',
    tags: ['Data Engineering', 'AWS', 'Python', 'SQL', 'ETL']
  },
  {
    nombre: 'Luis Quispe',
    correo: 'luis.quispe@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Ingeniero DevOps certificado en AWS y Kubernetes. Ayudo a los equipos a automatizar y escalar sus despliegues de forma segura.',
    especialidad: 'DevOps & Cloud Engineer',
    tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    nombre: 'Sofia Castro',
    correo: 'sofia.castro@tutortic.pe',
    password: 'password123',
    rol: 'Mentor',
    bio: 'Diseñadora UX/UI y Frontend Developer. Me encanta crear interfaces accesibles y experiencias de usuario memorables.',
    especialidad: 'UX/UI & Frontend',
    tags: ['UX/UI', 'Figma', 'React', 'Accesibilidad', 'CSS']
  }
];

async function seedMentores() {
  try {
    const mentoresCount = await Usuario.count({ where: { rol: 'Mentor' } });
    if (mentoresCount === 0) {
      console.log('[Seed] No se encontraron mentores. Insertando mentores de prueba...');
      
      const salt = await bcrypt.genSalt(10);
      
      for (const mentor of mentoresDemo) {
        const hashedPassword = await bcrypt.hash(mentor.password, salt);
        
        // El hook de Usuario creará automáticamente el registro en Mentor y LogAuditoria
        const nuevoUsuario = await Usuario.create({
          nombre: mentor.nombre,
          correo: mentor.correo,
          password: hashedPassword,
          rol: mentor.rol
        });

        // Recuperar el perfil creado por el hook para actualizar bio y vincular categorías
        const mentorPerfil = await Mentor.findOne({ where: { usuarioId: nuevoUsuario.id } });
        
        if (mentorPerfil) {
          // Actualizar campos específicos
          await mentorPerfil.update({ bio: mentor.bio });
          
          // Crear o vincular categorías (tags y especialidad)
          const allTags = [...mentor.tags, mentor.especialidad];
          const categoriasInstances = [];
          
          for (const tagName of allTags) {
            const [cat] = await Categoria.findOrCreate({ where: { nombre: tagName } });
            categoriasInstances.push(cat);
          }
          
          // Establecer la relación M:N
          await mentorPerfil.setCategorias(categoriasInstances);
        }
      }
      
      console.log('[Seed] Mentores de prueba, categorías y perfiles insertados correctamente.');
    } else {
      console.log(`[Seed] Ya existen ${mentoresCount} mentores en la base de datos. Saltando seed.`);
    }
  } catch (error) {
    console.error('[Seed] Error insertando mentores:', error);
  }
}

module.exports = seedMentores;
