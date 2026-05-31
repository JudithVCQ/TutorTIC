import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGetEvaluacion, apiSaveEvaluacion } from '../api/client';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Evaluacion() {
  const [scores, setScores] = useState({
    cloud: 0, docker: 0, sec: 0, pentest: 0,
    backend: 0, front: 0, comm: 0, agile: 0
  });
  const [result, setResult] = useState<{ indice: number, areas: any[] } | null>(null);

  useEffect(() => {
    loadEvaluacion();
  }, []);

  const loadEvaluacion = async () => {
    const res = await apiGetEvaluacion();
    if (res.ok && res.data?.evaluacion?.scores) {
      setScores(res.data.evaluacion.scores as any);
      setResult({
        indice: res.data.evaluacion.indiceEmpleabilidad,
        areas: calcAreas(res.data.evaluacion.scores)
      });
    }
  };

  const calcAreas = (vals: Record<string, number>) => [
    { label: 'Cloud / Infra', val: Math.round(((vals.cloud || 0) + (vals.docker || 0)) / 2 * 10), ideal: 70 },
    { label: 'Seguridad', val: Math.round(((vals.sec || 0) + (vals.pentest || 0)) / 2 * 10), ideal: 60 },
    { label: 'Desarrollo', val: Math.round(((vals.backend || 0) + (vals.front || 0)) / 2 * 10), ideal: 75 },
    { label: 'Soft Skills', val: Math.round(((vals.comm || 0) + (vals.agile || 0)) / 2 * 10), ideal: 80 },
  ];

  const handleCalcular = async () => {
    if (Object.values(scores).some(v => v === 0)) {
      alert('Por favor, evalúa todas las competencias (mínimo 1).');
      return;
    }
    const promedio = Object.values(scores).reduce((a, b) => a + b, 0) / 8;
    const indice = Math.round(promedio * 10);
    const areas = calcAreas(scores);

    const res = await apiSaveEvaluacion({ scores, indiceEmpleabilidad: indice });
    if (res.ok) {
      setResult({ indice, areas });
    }
  };

  const handleChange = (key: keyof typeof scores, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const renderSlider = (label: string, key: keyof typeof scores) => (
    <div className="eval-item" style={{ marginBottom: '1.5rem' }}>
      <div className="eval-item-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
        <span>{label}</span>
        <span>{scores[key]}/10</span>
      </div>
      <input 
        type="range" className="eval-slider" min="0" max="10" 
        value={scores[key]} onChange={e => handleChange(key, parseInt(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--primary)' }}
      />
    </div>
  );

  return (
    <div className="page active">
      <div className="main-content" style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '2rem' }}>
        <div className="page-header">
          <h2>🎯 Autoevaluación de competencias</h2>
        </div>
        <div className="eval-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Mueve cada slider para indicar tu nivel actual.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>☁️ Cloud / Infraestructura</h3>
              {renderSlider('Cloud (AWS / Azure / GCP)', 'cloud')}
              {renderSlider('Contenedores (Docker / K8s)', 'docker')}
              
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary-dark)' }}>🔐 Seguridad</h3>
              {renderSlider('OWASP Top 10 / Seguridad web', 'sec')}
              {renderSlider('Pruebas de penetración', 'pentest')}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>💻 Desarrollo</h3>
              {renderSlider('Backend (Node.js / Python)', 'backend')}
              {renderSlider('Frontend (React / Vue)', 'front')}

              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary-dark)' }}>🗣️ Soft Skills</h3>
              {renderSlider('Comunicación Asertiva', 'comm')}
              {renderSlider('Metodologías Ágiles (Scrum)', 'agile')}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn-primary" onClick={handleCalcular} style={{ padding: '12px 24px', fontSize: '1rem' }}>Calcular mi Índice TIC</button>
          </div>

          {result && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '2rem' }}>Tu Índice de Empleabilidad TIC: {result.indice}%</h3>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <Radar 
                  data={{
                    labels: result.areas.map(a => a.label),
                    datasets: [
                      {
                        label: 'Tu nivel actual',
                        data: result.areas.map(a => a.val),
                        backgroundColor: 'rgba(29, 158, 117, 0.2)',
                        borderColor: 'rgba(29, 158, 117, 1)',
                        pointBackgroundColor: 'rgba(29, 158, 117, 1)',
                      },
                      {
                        label: 'Perfil Ideal Ssr',
                        data: result.areas.map(a => a.ideal),
                        backgroundColor: 'rgba(168, 178, 193, 0.1)',
                        borderColor: 'rgba(168, 178, 193, 0.5)',
                        borderDash: [5, 5]
                      }
                    ]
                  }}
                  options={{ scales: { r: { min: 0, max: 100 } } }}
                />
              </div>

              <div style={{ marginTop: '2.5rem', textAlign: 'left', maxWidth: 650, margin: '2.5rem auto 0 auto' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', marginBottom: '16px' }}>
                  💡 Sugerencias y Recomendaciones de Mentoría
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Según tus resultados frente al perfil ideal de un profesional Ssr, te recomendamos reforzar las siguientes áreas con sesiones de mentoría:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.areas.map(area => {
                    const needsImprovement = area.val < area.ideal;
                    if (!needsImprovement) return null;
                    const queryFilter = area.label.includes('Cloud') ? 'Cloud' : area.label.includes('Seguridad') ? 'Seguridad' : area.label.includes('Desarrollo') ? 'Backend' : 'Agile';
                    return (
                      <div key={area.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                        <div>
                          <strong style={{ color: 'var(--primary-dark)' }}>{area.label}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Tu nivel es de {area.val}% (Ideal: {area.ideal}%)
                          </div>
                        </div>
                        <Link 
                          to={`/mentores?area=${queryFilter}`} 
                          className="btn-primary" 
                          style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Agendar sesión
                        </Link>
                      </div>
                    );
                  })}
                  {result.areas.every(area => area.val >= area.ideal) && (
                    <div style={{ padding: '16px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '8px', fontWeight: 600 }}>
                      🎉 ¡Excelente! Cumples o superas todos los niveles del perfil ideal recomendado. Puedes agendar sesiones avanzadas si lo deseas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
