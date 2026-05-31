import { useEffect, useState } from 'react';
import type { User } from '../api/client';
import { apiGetPerfil, apiUpdatePerfil } from '../api/client';
import { User as UserIcon, Phone, FileText, Award, Layers, Save, CheckCircle } from 'lucide-react';

export default function Perfil({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState(user.nombre);
  const [bio, setBio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [intereses, setIntereses] = useState('');
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    async function loadPerfil() {
      const res = await apiGetPerfil();
      if (res.ok && res.data) {
        const u = res.data.usuario;
        const p = res.data.perfil;
        setNombre(u.nombre);
        if (p) {
          setBio(p.bio || '');
          setTelefono(p.telefono || '');
          if ('especialidad' in p) {
            setEspecialidad(p.especialidad || '');
          }
          if ('intereses' in p) {
            setIntereses(p.intereses || '');
          }
          if ('categorias' in p && Array.isArray(p.categorias)) {
            setTagsText(p.categorias.map((c: any) => c.nombre).join(', '));
          }
        }
      }
      setLoading(false);
    }
    loadPerfil();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    const tagsArray = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const res = await apiUpdatePerfil({
      nombre,
      bio,
      telefono,
      especialidad: user.rol === 'Mentor' ? especialidad : undefined,
      intereses: user.rol !== 'Mentor' ? intereses : undefined,
      tags: user.rol === 'Mentor' ? tagsArray : undefined
    });

    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      // Actualizar nombre en localStorage si cambió
      const current = localStorage.getItem('tutortic_current');
      if (current) {
        const parsed = JSON.parse(current);
        parsed.nombre = nombre;
        localStorage.setItem('tutortic_current', JSON.stringify(parsed));
      }
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(res.error || 'Error al guardar los cambios');
    }
  };

  if (loading) {
    return (
      <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando información de tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="page active" style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '2rem 5%' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: '0 0 8px 0' }}>Mi Perfil</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Completa tu información para mejorar tu experiencia en TutorTIC.</p>
        </div>

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#D1FAE5', color: '#065F46', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 600, border: '1px solid #A7F3D0' }}>
            <CheckCircle size={20} /> ¡Perfil actualizado exitosamente! Los cambios se han guardado.
          </div>
        )}

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 600, border: '1px solid #FCA5A5' }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card Principal: Datos de Cuenta */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserIcon size={20} color="var(--primary)" /> Datos de la Cuenta
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>NOMBRE COMPLETO</label>
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                  required 
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>CORREO ELECTRÓNICO</label>
                <input 
                  type="email" 
                  value={user.correo} 
                  disabled 
                  style={{ ...inputStyle, background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }} 
                />
              </div>
              <div>
                <label style={labelStyle}>TELÉFONO DE CONTACTO</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                  <input 
                    type="tel" 
                    placeholder="Ej: +51 987654321" 
                    value={telefono} 
                    onChange={e => setTelefono(e.target.value)} 
                    style={{ ...inputStyle, paddingLeft: '40px' }} 
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>ROL EN EL SISTEMA</label>
                <span style={{ 
                  display: 'inline-block', 
                  marginTop: '6px',
                  background: 'var(--primary-light)', 
                  color: 'var(--primary-dark)', 
                  padding: '6px 16px', 
                  borderRadius: '99px', 
                  fontWeight: 600, 
                  fontSize: '0.9rem' 
                }}>
                  {user.rol === 'Mentorizado' ? 'Estudiante / Profesional' : user.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Card Secundaria: Detalles del Perfil */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} color="var(--primary)" /> Detalles Profesionales
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {user.rol === 'Mentor' ? (
                <>
                  <div>
                    <label style={labelStyle}>ESPECIALIDAD PRINCIPAL</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Cloud Architect / DevOps Lead / Senior React Developer" 
                      value={especialidad} 
                      onChange={e => setEspecialidad(e.target.value)} 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>HABILIDADES Y TECNOLOGÍAS (Separadas por comas)</label>
                    <div style={{ position: 'relative' }}>
                      <Layers size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                      <input 
                        type="text" 
                        placeholder="Ej: AWS, Docker, Kubernetes, CI/CD, Terraform" 
                        value={tagsText} 
                        onChange={e => setTagsText(e.target.value)} 
                        style={{ ...inputStyle, paddingLeft: '40px' }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Estas etiquetas ayudarán a los estudiantes a encontrarte.</span>
                  </div>
                </>
              ) : (
                <div>
                  <label style={labelStyle}>INTERESES O ÁREAS A MEJORAR (Separadas por comas)</label>
                  <div style={{ position: 'relative' }}>
                    <Layers size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="Ej: Backend, Seguridad, Docker, Soft Skills" 
                      value={intereses} 
                      onChange={e => setIntereses(e.target.value)} 
                      style={{ ...inputStyle, paddingLeft: '40px' }} 
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={labelStyle}>BIOGRAFÍA / PRESENTACIÓN</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                  <textarea 
                    placeholder={user.rol === 'Mentor' ? "Cuéntale a los estudiantes sobre tu experiencia, tu trayectoria y en qué puedes ayudarlos..." : "Háblale a los mentores sobre tus metas, lo que estás aprendiendo y en qué te gustaría mejorar..."} 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    style={{ ...inputStyle, paddingLeft: '40px', minHeight: '120px', resize: 'vertical' }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={saving} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', fontSize: '1rem', width: 'auto' }}
            >
              <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '6px',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color 0.2s'
};
