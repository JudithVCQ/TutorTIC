import React, { useState } from 'react';
import type { Vacante } from '../../api/client';
import { apiPostularVacante } from '../../api/client';
import { X, CheckCircle, FileText } from 'lucide-react';

interface Props {
  vacante: Vacante;
  compatibilidad: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostularVacanteModal({ vacante, compatibilidad, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    carta: `Estimado equipo de ${vacante.empresa.split('·')[0].trim()},\n\nMe dirijo a ustedes para postular a la vacante de ${vacante.titulo}. Soy un profesional en desarrollo y me entusiasma aportar mis habilidades en ${vacante.tags.join(', ')}.`,
    cvUrl: 'cv-demo.pdf',
    pretension: '',
    disponibilidad: 'Inmediata'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await apiPostularVacante(vacante.id, {
      cartaPresentacion: formData.carta,
      cvUrl: formData.cvUrl,
      pretension: formData.pretension ? parseInt(formData.pretension) : undefined,
      disponibilidad: formData.disponibilidad
    });
    setLoading(false);

    if (res.ok) {
      setStep(4);
    } else {
      alert(res.error || 'Error al postular');
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>Postular a una vacante</h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={24} /></button>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px', color: 'var(--text-muted)' }}>
          {[1,2,3,4].map(num => (
            <React.Fragment key={num}>
              <div style={step >= num ? stepActiveStyle : stepInactiveStyle}>{num}</div>
              {num < 4 && <div style={{ flex: 1, height: '2px', background: step > num ? 'var(--primary)' : 'var(--border)' }}></div>}
            </React.Fragment>
          ))}
          <span style={{ fontSize: '0.85rem', marginLeft: '8px' }}>
            {step === 1 && 'Paso 1 de 4 — Vacante'}
            {step === 2 && 'Paso 2 de 4 — Datos'}
            {step === 3 && 'Paso 3 de 4 — Carta y CV'}
            {step === 4 && 'Paso 4 de 4 — Éxito'}
          </span>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <img src={vacante.logo} alt="Logo" style={{ width: 64, height: 64, borderRadius: '12px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{vacante.titulo}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{vacante.empresa}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {vacante.tags.map(tag => (
                    <span key={tag} style={{ background: 'var(--info-light)', color: 'var(--info)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMPATIBILIDAD</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{compatibilidad}%</div>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <div style={labelStyle}>DESGLOSE POR ÁREA (Autoevaluación)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <SkillBar label="Cloud / Infra" value={80} color="var(--primary)" />
                <SkillBar label="Seguridad" value={70} color="var(--primary)" />
                <SkillBar label="Desarrollo" value={60} color="#F59E0B" />
                <SkillBar label="Soft Skills" value={60} color="#F59E0B" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={onClose} style={{ ...inputStyle, flex: 1, background: 'white', cursor: 'pointer', textAlign: 'center' }}>Cancelar</button>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ flex: 2 }}>Continuar →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Confirmar Datos Personales</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tus datos del perfil serán enviados a la empresa.</p>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>PRETENSION SALARIAL (S/)</label>
                <input type="number" name="pretension" placeholder="Ej: 3500" value={formData.pretension} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>DISPONIBILIDAD</label>
                <select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange} style={inputStyle}>
                  <option value="Inmediata">Inmediata</option>
                  <option value="15 días">15 días</option>
                  <option value="1 mes">1 mes</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <input type="checkbox" defaultChecked />
              Autorizo el tratamiento de mis datos con fines de selección.
            </label>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setStep(1)} style={{ ...inputStyle, flex: 1, background: 'white', cursor: 'pointer', textAlign: 'center' }}>← Volver</button>
              <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 2 }}>Continuar →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Carta y Preguntas</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Personaliza tu postulación según el perfil solicitado.</p>

            <div>
              <label style={labelStyle}>CARTA DE PRESENTACIÓN</label>
              <textarea name="carta" value={formData.carta} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px' }} />
            </div>

            <div>
              <label style={labelStyle}>CV (PDF)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px dashed var(--border)', borderRadius: '8px', background: 'var(--bg)' }}>
                <FileText size={24} color="var(--primary)" />
                <div style={{ flex: 1, fontSize: '0.95rem' }}>{formData.cvUrl}</div>
                <button style={{ background: 'var(--primary-light)', border: 'none', color: 'var(--primary-dark)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Cambiar</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setStep(2)} style={{ ...inputStyle, flex: 1, background: 'white', cursor: 'pointer', textAlign: 'center' }}>← Volver</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                {loading ? 'Enviando...' : 'Revisar y Enviar →'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', padding: '24px 0' }}>
            <div style={{ background: '#10B981', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>¡Postulación exitosa!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Tu perfil ha sido enviado a {vacante.empresa}.</p>
            
            <button className="btn-primary" onClick={() => { onSuccess(); onClose(); }} style={{ width: '100%', marginTop: '16px' }}>
              Ver mis postulaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
      <div style={{ width: '100px', color: 'var(--text)' }}>{label}</div>
      <div style={{ flex: 1, height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color }}></div>
      </div>
      <div style={{ width: '40px', textAlign: 'right', fontWeight: 600, color }}>{value}%</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS INLINE PARA EL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15, 44, 35, 0.7)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle: React.CSSProperties = {
  background: 'white', padding: '32px', borderRadius: '16px',
  width: '100%', maxWidth: '550px', boxShadow: 'var(--shadow-glow)',
  maxHeight: '90vh', overflowY: 'auto'
};
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const closeBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' };
const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', display: 'block', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', color: 'var(--text)' };
const stepActiveStyle: React.CSSProperties = { width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' };
const stepInactiveStyle: React.CSSProperties = { width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' };
