export default function Landing() {
  return (
    <div className="page active" id="page-landing" style={{ display: 'flex', flexDirection: 'column', background: '#EBF6F2' }}>
      {/* Hero Section */}
      <section className="hero" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '0 2rem 8rem', 
        minHeight: '100vh',
        background: 'radial-gradient(circle at 15% 65%, #258164 0%, #154134 35%, #0F2C23 100%)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '4rem', marginTop: '60px', position: 'relative', zIndex: 10 }}>
          
          {/* Left Content */}
          <div style={{ flex: 1, textAlign: 'left', paddingRight: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.2)', padding: '8px 20px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 500, marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              🚀 La plataforma #1 de Mentoring TIC
            </div>
            
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
              Acelera tu carrera<br/>en la <span style={{ color: '#E8D59E' }}>industria<br/>tecnológica</span>
            </h1>
            
            <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: 500, marginBottom: '3rem', lineHeight: 1.6, color: 'white', fontWeight: 400 }}>
              Evalúa tus competencias, conéctate con expertos top da industria y encuentra la vacante perfecta para tu perfil profisional.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ background: 'linear-gradient(90deg, #A6EAD7 0%, #7DD5BB 100%)', color: '#0D261E', padding: '14px 32px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '99px', boxShadow: '0 0 35px rgba(125, 213, 187, 0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => document.querySelector<HTMLButtonElement>('.nav-right button')?.click()}>
                Comenzar gratis
              </button>
              <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '14px 32px', fontSize: '1.05rem', borderRadius: '99px', backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => window.location.href = '/mentores'}>
                Explorar Mentores
              </button>
            </div>
          </div>

          {/* Right Mockup */}
          <div style={{ flex: 1.2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <img src="/hero_mockup.png" alt="TutorTIC App Mockup" style={{ width: '130%', maxWidth: '800px', transform: 'translateX(10%)', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.4))' }} />
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <div style={{ background: '#EEF8F4', padding: '4rem 2rem', display: 'flex', justifyContent: 'center', gap: '8rem', flexWrap: 'wrap', position: 'relative', zIndex: 20, marginTop: '-3rem', borderRadius: '40px 40px 0 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora', fontSize: '4rem', fontWeight: 800, color: '#133F33', lineHeight: 1 }}>47+</div>
          <div style={{ fontSize: '0.9rem', color: '#597D71', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', marginBottom: '16px' }}>Mentores Activos</div>
          <div style={{ fontSize: '2.5rem' }}>🤝</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora', fontSize: '4rem', fontWeight: 800, color: '#133F33', lineHeight: 1 }}>300+</div>
          <div style={{ fontSize: '0.9rem', color: '#597D71', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', marginBottom: '16px' }}>Estudiantes</div>
          <div style={{ fontSize: '2.5rem' }}>🎓</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora', fontSize: '4rem', fontWeight: 800, color: '#133F33', lineHeight: 1 }}>89%</div>
          <div style={{ fontSize: '0.9rem', color: '#597D71', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', marginBottom: '16px' }}>Casos de Éxito</div>
          <div style={{ fontSize: '2.5rem' }}>🏆</div>
        </div>
      </div>
      {/* Features Section */}
      <section style={{ maxWidth: 1200, margin: '8rem auto', padding: '0 2rem' }}>
        <div className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Diseñado para tu crecimiento</div>
        <div className="section-sub" style={{ fontSize: '1.15rem', marginBottom: '4rem', textAlign: 'center' }}>Todo lo que necesitas para destacar en el mercado laboral tecnológico peruano.</div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="feature-card" style={{ padding: '3rem 2.5rem', background: 'white' }}>
            <div className="feature-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '2rem', width: 64, height: 64, marginBottom: '2rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Evaluación de Skills</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Mide tu nivel en áreas clave del mercado y recibe un reporte detallado de tus brechas tecnológicas.</p>
          </div>
          <div className="feature-card" style={{ padding: '3rem 2.5rem', background: 'white' }}>
            <div className="feature-icon" style={{ background: 'var(--info-light)', color: 'var(--info)', fontSize: '2rem', width: 64, height: 64, marginBottom: '2rem' }}>🤝</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Matching Inteligente</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Nuestro algoritmo conecta tu perfil exacto con el mentor más adecuado para tu objetivo.</p>
          </div>
          <div className="feature-card" style={{ padding: '3rem 2.5rem', background: 'white' }}>
            <div className="feature-icon" style={{ background: 'var(--accent-light)', color: '#D97706', fontSize: '2rem', width: 64, height: 64, marginBottom: '2rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Sesiones Ágiles</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Mentorías 1:1 de 30 minutos enfocadas en desbloquear tu potencial y definir planes de acción.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
