import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { MentorProfile } from '../api/client';
import { apiGetMentores } from '../api/client';
import AgendarSesionModal from '../components/Modals/AgendarSesionModal';

export default function Mentores() {
  const [mentores, setMentores] = useState<MentorProfile[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);

  const location = useLocation();

  useEffect(() => {
    loadMentores();
    const params = new URLSearchParams(location.search);
    const area = params.get('area');
    if (area) {
      setFilter(area);
    }
  }, [location.search]);

  const loadMentores = async () => {
    const res = await apiGetMentores();
    if (res.ok && res.data) {
      setMentores(res.data.mentores);
    }
  };

  const filteredMentores = mentores.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) || m.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === '' || m.tags?.some(t => t.includes(filter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page active">
      <div className="main-content" style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '2rem' }}>
        <div className="page-header">
          <h2>🤝 Mentores disponibles</h2>
        </div>
        
        <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre o especialidad..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <select 
            className="filter-select" 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <option value="">Todas las áreas</option>
            <option value="Cloud">Cloud / AWS</option>
            <option value="DevOps">DevOps</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Backend">Backend</option>
            <option value="Mobile">Mobile</option>
            <option value="IA">IA / ML</option>
          </select>
        </div>

        <div className="mentors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredMentores.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No se encontraron mentores.</p>
          ) : (
            filteredMentores.map(m => (
              <div key={m.id} className="mentor-card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div className="mentor-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div className="mentor-avatar" style={{ background: m.color || 'var(--primary)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {m.init || (m.name ? m.name.substring(0,2).toUpperCase() : 'M')}
                  </div>
                  <div>
                    <div className="mentor-name" style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{m.name}</div>
                    <div className="mentor-role" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, fontStyle: 'italic' }}>
                  "{m.bio}"
                </div>
                <div className="mentor-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                  {m.tags?.map(t => <span key={t} className="tag" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>{t}</span>)}
                </div>
                <div className="mentor-stats" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', textAlign: 'center' }}>
                  <div><strong>{m.sessions || 0}</strong><br />Sesiones</div>
                  <div><strong>⭐ {m.rating || 'N/A'}</strong><br />Valoración</div>
                  <div><strong>Libre</strong><br />Disponibilidad</div>
                </div>
                <button className="btn-primary" style={{ marginTop: 'auto', padding: '10px' }} onClick={() => setSelectedMentor(m)}>
                  Agendar sesión
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMentor && (
        <AgendarSesionModal 
          mentorId={selectedMentor.id} 
          mentorName={selectedMentor.name} 
          onClose={() => setSelectedMentor(null)} 
          onSuccess={() => loadMentores()} 
        />
      )}
    </div>
  );
}
