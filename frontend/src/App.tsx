import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Mentores from './pages/Mentores';
import Evaluacion from './pages/Evaluacion';
import Vacantes from './pages/Vacantes';
import Perfil from './pages/Perfil';
import AuthModal from './components/AuthModal';
import { useState, useEffect } from 'react';
import type { User } from './api/client';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // Check auth from localStorage on load
    try {
      const current = localStorage.getItem('tutortic_current');
      if (current) {
        setUser(JSON.parse(current));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tutortic_token');
    localStorage.removeItem('tutortic_current');
  };

  return (
    <Router>
      <Navbar user={user} onLoginClick={() => setIsAuthOpen(true)} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" replace />} />
        <Route path="/mentores" element={user ? <Mentores /> : <Navigate to="/" replace />} />
        <Route path="/autoevaluacion" element={user ? <Evaluacion /> : <Navigate to="/" replace />} />
        <Route path="/vacantes" element={user ? <Vacantes /> : <Navigate to="/" replace />} />
        <Route path="/perfil" element={user ? <Perfil user={user} /> : <Navigate to="/" replace />} />
      </Routes>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLogin} />}
    </Router>
  );
}
