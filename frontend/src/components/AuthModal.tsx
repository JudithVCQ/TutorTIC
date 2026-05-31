import { useState } from 'react';
import { apiLogin, apiRegister } from '../api/client';
import type { User } from '../api/client';

export default function AuthModal({ onClose, onLoginSuccess }: { onClose: () => void, onLoginSuccess: (u: User) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [rol, setRol] = useState('Estudiante');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const res = await apiLogin(email, pass);
      if (res.ok && res.data) {
        localStorage.setItem('tutortic_token', res.data.token);
        localStorage.setItem('tutortic_current', JSON.stringify(res.data.usuario));
        onLoginSuccess(res.data.usuario);
      } else {
        setError(res.error || 'Error al iniciar sesión');
      }
    } else {
      const res = await apiRegister({ nombres, apellidos, email, pass, rol });
      if (res.ok && res.data) {
        localStorage.setItem('tutortic_token', res.data.token);
        localStorage.setItem('tutortic_current', JSON.stringify(res.data.usuario));
        onLoginSuccess(res.data.usuario);
      } else {
        setError(res.error || 'Error al registrarse');
      }
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
        
        {error && <div className="post-warn" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Nombres</label>
                <input type="text" className="form-input" required value={nombres} onChange={e => setNombres(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Apellidos</label>
                <input type="text" className="form-input" required value={apellidos} onChange={e => setApellidos(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Perfil</label>
                <select className="form-input" value={rol} onChange={e => setRol(e.target.value)}>
                  <option value="Estudiante">Estudiante / Profesional</option>
                  <option value="Mentor">Mentor / Experto TIC</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-input" required value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          {isLogin ? (
            <>¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate aquí</a></>
          ) : (
            <>¿Ya tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia sesión</a></>
          )}
        </div>
      </div>
    </div>
  );
}
