import { Link, useLocation } from 'react-router-dom';
import type { User } from '../api/client';
import { LayoutDashboard, Users, CheckSquare, User as UserIcon } from 'lucide-react';

export default function Navbar({ user, onLoginClick, onLogout }: { user: User | null, onLoginClick: () => void, onLogout: () => void }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header style={{ 
      position: isHome ? 'absolute' : 'relative', 
      top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1.5rem 2rem',
      background: isHome ? 'transparent' : 'var(--surface)',
      borderBottom: isHome ? 'none' : '1px solid var(--border)'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isHome ? 'white' : 'var(--primary-dark)', fontFamily: 'Sora' }}>
            Tutor<span style={{ color: isHome ? '#7DD5BB' : 'var(--primary)' }}>TIC</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {user && (
              <>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHome ? 'rgba(255,255,255,0.8)' : 'var(--text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/dashboard' ? 600 : 400 }}><LayoutDashboard size={18} /> Dashboard</Link>
                <Link to="/mentores" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHome ? 'rgba(255,255,255,0.8)' : 'var(--text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/mentores' ? 600 : 400 }}><Users size={18} /> Mentores</Link>
                <Link to="/autoevaluacion" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHome ? 'rgba(255,255,255,0.8)' : 'var(--text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/autoevaluacion' ? 600 : 400 }}><CheckSquare size={18} /> Autoevaluación</Link>
                <Link to="/vacantes" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHome ? 'rgba(255,255,255,0.8)' : 'var(--text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/vacantes' ? 600 : 400 }}><Users size={18} /> Vacantes</Link>
                <Link to="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHome ? 'rgba(255,255,255,0.8)' : 'var(--text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/perfil' ? 600 : 400 }}><UserIcon size={18} /> Mi Perfil</Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="nav-right" id="nav-right">
          {user ? (
            <div className="user-badge" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={onLogout} title="Cerrar sesión">
              <div style={{ background: '#26A582', color: 'white', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.nombre ? user.nombre[0].toUpperCase() : ''}
              </div>
              <span style={{ fontWeight: 600, color: isHome ? 'white' : 'var(--text)' }}>{user.nombre}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'transparent', border: 'none', color: isHome ? 'white' : 'var(--primary-dark)', fontWeight: 600, cursor: 'pointer' }} onClick={onLoginClick}>
                Iniciar Sesión
              </button>
              <button style={{ background: isHome ? 'rgba(255,255,255,0.1)' : 'var(--primary)', border: isHome ? '1px solid rgba(255,255,255,0.3)' : 'none', color: 'white', padding: '8px 24px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }} onClick={onLoginClick}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
