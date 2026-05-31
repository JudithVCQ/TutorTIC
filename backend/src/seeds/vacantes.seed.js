const { Vacante } = require('../models');

const seedVacantes = async () => {
  try {
    const count = await Vacante.count();
    if (count > 0) {
      console.log('[Seed] Ya existen vacantes en la base de datos. Saltando seed.');
      return;
    }

    const vacantesMock = [
      {
        titulo: 'Cloud Support Engineer',
        empresa: 'InterCorp Tech · Híbrido',
        logo: 'https://ui-avatars.com/api/?name=INT&background=f3e8d2&color=000&rounded=true',
        tags: ['AWS', 'Linux', 'CI/CD']
      },
      {
        titulo: 'Cybersecurity Analyst',
        empresa: 'BBVA Perú · Presencial',
        logo: 'https://ui-avatars.com/api/?name=BBV&background=004481&color=fff&rounded=true',
        tags: ['OWASP', 'Red Team', 'Pentesting']
      },
      {
        titulo: 'DevOps Engineer',
        empresa: 'NTT Data · Remoto',
        logo: 'https://ui-avatars.com/api/?name=NTT&background=002c6b&color=fff&rounded=true',
        tags: ['Docker', 'Kubernetes', 'Terraform']
      },
      {
        titulo: 'Backend Developer Junior',
        empresa: 'BCP · Lima',
        logo: 'https://ui-avatars.com/api/?name=BCP&background=ff7e00&color=fff&rounded=true',
        tags: ['Node.js', 'PostgreSQL', 'Express']
      }
    ];

    await Vacante.bulkCreate(vacantesMock);
    console.log('[Seed] 4 vacantes insertadas con éxito.');
  } catch (error) {
    console.error('[Seed] Error insertando vacantes:', error);
  }
};

module.exports = seedVacantes;
