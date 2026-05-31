import { useEffect, useState } from 'react';
import type { User, Compromiso, Sesion } from '../api/client';
import { apiGetCompromisos, apiSaveCompromiso, apiActualizarEstadoCompromiso, apiDeleteCompromiso, apiGetEvaluacion, apiGetSesiones, apiActualizarEstadoSesion } from '../api/client';
import { Check, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }: { user: User }) {
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);
  const [newCompromiso, setNewCompromiso] = useState('');
  const [evalIndice, setEvalIndice] = useState<number | null>(null);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const compRes = await apiGetCompromisos();
    if (compRes.ok && compRes.data) {
      setCompromisos(compRes.data.compromisos);
    }
    const evalRes = await apiGetEvaluacion();
    if (evalRes.ok && evalRes.data?.evaluacion) {
      setEvalIndice(evalRes.data.evaluacion.indiceEmpleabilidad);
    }
    const sesRes = await apiGetSesiones();
    if (sesRes.ok && sesRes.data) {
      setSesiones(sesRes.data.sesiones);
    }
  };

  const handleAddCompromiso = async () => {
    if (!newCompromiso.trim()) return;
    const res = await apiSaveCompromiso(newCompromiso.trim());
    if (res.ok) {
      setNewCompromiso('');
      loadData();
    }
  };

  const toggleCompromiso = async (id: number, currentStatus: boolean) => {
    const res = await apiActualizarEstadoCompromiso(id, !currentStatus);
    if (res.ok) loadData();
  };

  const deleteCompromiso = async (id: number) => {
    const res = await apiDeleteCompromiso(id);
    if (res.ok) loadData();
  };

  const handleStatusSesion = async (id: number, estado: string) => {
    const res = await apiActualizarEstadoSesion(id, estado);
    if (res.ok) loadData();
  };

  const pendingSesiones = sesiones.filter(s => s.estado === 'pendiente');
  const confirmedSesiones = sesiones.filter(s => s.estado === 'confirmada' || s.estado === 'completada');

  return (
    <div className="page active" style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <main className="main-content" style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '2rem' }}>
        <div className="page-header">
          <div>
            <h2>Bienvenido/a {user.nombre.split(' ')[0]} 👋</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {user.rol === 'Mentor' ? 'Panel de control para mentores.' : 'Bienvenido/a a tu espacio de desarrollo profesional'}
            </p>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">SESIONES AGENDADAS</div>
            <div className="metric-value">{confirmedSesiones.length}</div>
            <div className="metric-change" style={{ color: 'var(--text-muted)' }}>{pendingSesiones.length} pendientes</div>
          </div>
          {user.rol !== 'Mentor' && (
            <>
              <div className="metric-card">
                <div className="metric-label">COMPROMISOS ACTIVOS</div>
                <div className="metric-value">{compromisos.filter(c => !c.completado).length}</div>
                <div className="metric-change" style={{ color: 'var(--text-muted)' }}>{compromisos.length} totales</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">ÍNDICE EMPLEABILIDAD</div>
                <div className="metric-value" style={{ color: evalIndice ? 'var(--primary)' : 'var(--text-muted)' }}>{evalIndice ? `${evalIndice}%` : '—'}</div>
                <div className="metric-change" style={{ color: 'var(--text-muted)' }}>{evalIndice ? 'Actualizado' : 'Completa autoevaluación'}</div>
              </div>
            </>
          )}
        </div>

        <div className="cards-row" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Mentor view: Pending Requests */}
          {user.rol === 'Mentor' && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-title">📝 Solicitudes Pendientes</div>
              {pendingSesiones.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No tienes solicitudes pendientes.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingSesiones.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Sesión con {(s as any).estudiante?.usuario?.nombre}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={14}/> {s.fecha}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {s.hora} ({s.duracion})</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>Objetivo: {s.objetivo || 'Ninguno especificado'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleStatusSesion(s.id, 'confirmada')} style={{ background: '#10B981', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Aceptar">
                          <Check size={16} />
                        </button>
                        <button onClick={() => handleStatusSesion(s.id, 'cancelada')} style={{ background: '#EF4444', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Rechazar">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Estudiante view: Pending Requests */}
          {user.rol !== 'Mentor' && pendingSesiones.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-title">⌛ Sesiones Pendientes de Aprobación</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingSesiones.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', borderLeft: '4px solid #F59E0B' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Sesión con {(s as any).mentor?.usuario?.nombre}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={14}/> {s.fecha}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {s.hora} ({s.duracion})</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>Objetivo: {s.objetivo || 'Ninguno especificado'}</div>
                    </div>
                    <span style={{ background: '#FFF3CD', color: '#856404', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>Esperando al Mentor</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Both: Confirmed Sessions */}
          <div className="card">
            <div className="card-title">📅 Próximas Sesiones</div>
            {confirmedSesiones.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No tienes sesiones próximas.</p>
            ) : (
              confirmedSesiones.slice(0, 3).map(s => (
                <div key={s.id} style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.fecha} a las {s.hora}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Con {user.rol === 'Mentor' ? (s as any).estudiante?.usuario?.nombre : (s as any).mentor?.usuario?.nombre}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', display: 'inline-block', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>{s.estado.toUpperCase()}</div>
                </div>
              ))
            )}
          </div>

          {/* Estudiante view: Autoevaluacion Suggestion */}
          {user.rol !== 'Mentor' && (
            <div className="card">
              <div className="card-title">💡 Sugerencia de Mejora</div>
              {evalIndice === null ? (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Completa tu <Link to="/autoevaluacion" style={{ color: 'var(--primary)', fontWeight: 600 }}>autoevaluación</Link> para recibir recomendaciones personalizadas.
                </div>
              ) : (
                <div style={{ background: 'var(--info-light)', padding: '16px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontWeight: 600, color: 'var(--info)', marginBottom: '8px' }}>Área de oportunidad detectada</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: 0, marginBottom: '12px' }}>
                    Tus resultados indican que podrías fortalecer tus <strong>Soft Skills</strong> y conocimientos en <strong>Cloud (AWS)</strong>. Te sugerimos agendar una sesión de mentoría de diagnóstico gratuita para trazar un plan.
                  </p>
                  <Link to="/mentores" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.85rem', padding: '8px 16px' }}>Encontrar Mentor</Link>
                </div>
              )}

              <div className="card-title" style={{ marginTop: '24px' }}>✅ Compromisos</div>
              <div>
                {compromisos.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No tienes compromisos.</p>
                ) : (
                  compromisos.slice(0,4).map(c => (
                    <div key={c.id} className="session-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input type="checkbox" checked={c.completado} onChange={() => toggleCompromiso(c.id, c.completado)} style={{ accentColor: 'var(--primary)', width: 16, height: 16, cursor: 'pointer', flexShrink: 0, marginRight: 8 }} />
                      <span style={{ flex: 1, fontSize: '0.875rem', textDecoration: c.completado ? 'line-through' : 'none', color: c.completado ? 'var(--text-muted)' : 'inherit' }}>{c.descripcion}</span>
                      <button onClick={() => deleteCompromiso(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <input type="text" className="search-input" placeholder="Nuevo compromiso..." style={{ flex: 1 }} value={newCompromiso} onChange={e => setNewCompromiso(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCompromiso()} />
                <button className="btn-primary" style={{ width: 'auto', padding: '9px 12px' }} onClick={handleAddCompromiso}>+</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
