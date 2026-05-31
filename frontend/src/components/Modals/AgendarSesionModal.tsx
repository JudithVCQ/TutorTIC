import React, { useState } from 'react';
import { apiAgendarSesion } from '../../api/client';
import { X, CheckCircle, CreditCard } from 'lucide-react';

interface Props {
  mentorId: number;
  mentorName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AgendarSesionModal({ mentorId, mentorName, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    duracion: '15 minutos',
    objetivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.fecha || !formData.hora) {
      setError('Elige una fecha y hora.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    const res = await apiAgendarSesion({
      mentorId,
      fecha: formData.fecha,
      hora: formData.hora,
      duracion: formData.duracion,
      objetivo: formData.objetivo
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error || 'Error al agendar sesión.');
    } else {
      setStep(3);
    }
  };

  const isFree = formData.duracion === '15 minutos';

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>Agendar sesión de mentoría</h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={24} /></button>
        </div>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-muted)' }}>
          <div style={step === 1 ? stepActiveStyle : stepInactiveStyle}>1</div>
          <div style={{ flex: 1, height: '2px', background: step > 1 ? 'var(--primary)' : 'var(--border)' }}></div>
          <div style={step === 2 ? stepActiveStyle : stepInactiveStyle}>2</div>
          <div style={{ flex: 1, height: '2px', background: step > 2 ? 'var(--primary)' : 'var(--border)' }}></div>
          <div style={step === 3 ? stepActiveStyle : stepInactiveStyle}>3</div>
          <span style={{ fontSize: '0.85rem', marginLeft: '8px' }}>
            {step === 1 ? 'Paso 1 de 3 — Selección' : step === 2 ? 'Paso 2 de 3 — Confirmación' : 'Paso 3 de 3 — Comprobante'}
          </span>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>MENTOR</label>
              <input type="text" value={mentorName} disabled style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>FECHA</label>
                <div style={{ position: 'relative' }}>
                  <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>HORA</label>
                <input type="time" name="hora" value={formData.hora} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>DURACIÓN</label>
              <select name="duracion" value={formData.duracion} onChange={handleChange} style={inputStyle}>
                <option value="15 minutos">15 minutos</option>
                <option value="30 minutos">30 minutos</option>
                <option value="60 minutos">60 minutos</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>OBJETIVO DE LA SESIÓN</label>
              <textarea 
                name="objetivo" 
                value={formData.objetivo} 
                onChange={handleChange} 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                placeholder="¿En qué área quieres enfocarte?"
              />
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '8px' }}>
              Continuar →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Confirmar sesión</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Revisa los datos antes de confirmar tu reserva</p>
            
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Mentor:</strong> {mentorName}</div>
              <div><strong>Fecha:</strong> {formData.fecha} a las {formData.hora}</div>
              <div><strong>Duración:</strong> {formData.duracion}</div>
              <div><strong>Objetivo:</strong> {formData.objetivo || 'No especificado'}</div>
              <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '6px', color: 'var(--primary-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} /> Costo de la sesión: {isFree ? 'GRATIS (Diagnóstico)' : 'S/ 50.00 (Tarifa Estándar)'}
              </div>
            </div>

            {isFree ? (
              <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text)' }}>
                🎁 ¡Felicidades! Al ser una sesión corta de 15 minutos, califica como beneficio gratuito de diagnóstico. No se requiere tarjeta de crédito.
              </div>
            ) : (
              <div style={{ background: '#FFF3CD', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#856404' }}>
                💳 Las sesiones mayores a 15 minutos tienen un costo. Por ahora, esto es una simulación y no se te cobrará.
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setStep(1)} style={{ ...inputStyle, flex: 1, textAlign: 'center', cursor: 'pointer', background: 'white' }}>← Volver</button>
              <button className="btn-primary" onClick={handleConfirm} disabled={loading} style={{ flex: 2 }}>
                {loading ? 'Confirmando...' : 'Confirmar sesión'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', padding: '24px 0' }}>
            <div style={{ background: '#10B981', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>¡Solicitud enviada!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Tu solicitud ha sido registrada. El mentor deberá aprobarla para generar el enlace de Meet.</p>
            
            <div style={{ width: '100%', background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--primary-light)', textAlign: 'left', marginTop: '16px' }}>
              <div style={{ color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '12px' }}>📋 Solicitud enviada</div>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><strong>Mentor:</strong> {mentorName}</div>
                <div><strong>Fecha:</strong> {formData.fecha} a las {formData.hora}</div>
                <div><strong>Duración:</strong> {formData.duracion}</div>
                <div><strong>Costo:</strong> <span style={{ color: 'var(--primary)' }}>{isFree ? 'GRATIS (Diagnóstico)' : 'S/ 50.00'}</span></div>
                <div><strong>Estado actual:</strong> ⏳ <span style={{ color: '#F59E0B' }}>Pendiente de aprobación</span></div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => { onSuccess(); onClose(); }} style={{ width: '100%', marginTop: '16px' }}>
              Ver mis sesiones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS INLINE PARA EL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15, 44, 35, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const modalStyle: React.CSSProperties = {
  background: 'white',
  padding: '32px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: 'var(--shadow-glow)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

const closeBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted)'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '4px',
  display: 'block',
  textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  color: 'var(--text)'
};

const stepActiveStyle: React.CSSProperties = {
  width: '28px', height: '28px',
  borderRadius: '50%',
  background: 'var(--primary)',
  color: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 'bold', fontSize: '0.9rem'
};

const stepInactiveStyle: React.CSSProperties = {
  width: '28px', height: '28px',
  borderRadius: '50%',
  background: 'var(--bg)',
  color: 'var(--text-muted)',
  border: '1px solid var(--border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 'bold', fontSize: '0.9rem'
};
