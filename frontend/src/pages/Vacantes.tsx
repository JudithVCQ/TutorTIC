import { useState, useEffect } from 'react';
import type { Vacante } from '../api/client';
import { apiGetVacantes } from '../api/client';
import PostularVacanteModal from '../components/Modals/PostularVacanteModal';
import { Building, MapPin, Search } from 'lucide-react';

export default function Vacantes() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVacante, setSelectedVacante] = useState<Vacante | null>(null);

  useEffect(() => {
    async function fetchVacantes() {
      const res = await apiGetVacantes();
      if (res.ok && res.data) {
        setVacantes(res.data.vacantes);
      }
      setLoading(false);
    }
    fetchVacantes();
  }, []);

  if (loading) return <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando vacantes...</div>;

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 5%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Bolsa de Trabajo</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Encuentra tu próxima oportunidad en las mejores empresas tech.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar vacante..." style={{ padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {vacantes.map(vac => {
          // Generar una compatibilidad random para la demo, basada en el id para que sea consistente
          const compatibilidad = 60 + (vac.id * 7 % 35); 
          return (
            <div key={vac.id} style={{ background: 'var(--surface)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <img src={vac.logo} alt={vac.empresa} style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{vac.titulo}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Building size={14} /> {vac.empresa.split('·')[0].trim()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <MapPin size={14} /> {vac.empresa.split('·')[1]?.trim() || 'Remoto'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {vac.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--info-light)', color: 'var(--info)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>COMPATIBILIDAD</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: compatibilidad >= 70 ? 'var(--primary)' : '#F59E0B' }}>{compatibilidad}%</div>
                </div>
                <button className="btn-primary" onClick={() => setSelectedVacante(vac)}>
                  Postular
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVacante && (
        <PostularVacanteModal 
          vacante={selectedVacante}
          compatibilidad={60 + (selectedVacante.id * 7 % 35)}
          onClose={() => setSelectedVacante(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
