import { useNavigate, useParams, useLocation } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f8f9fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }

  .rnav { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 3rem; background: white; border-bottom: 1px solid var(--gray-300); position: sticky; top: 0; z-index: 50; }
  .rnav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .rnav-brand span { color: var(--blue-light); }
  .rnav-right { display: flex; align-items: center; gap: 1.5rem; }
  .rnav-avatar { width: 32px; height: 32px; background: var(--blue-mist); border: 1.5px solid var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; color: var(--blue-mid); }
  .rnav-name { font-size: 0.85rem; color: var(--gray-500); }
  .rnav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .rnav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  .result-page { min-height: calc(100vh - 57px); display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
  .result-card { background: white; width: 100%; max-width: 520px; animation: fadeUp 0.4s ease both; }

  .result-top { padding: 2.5rem; text-align: center; }
  .result-top-pass { background: var(--blue-dark); }
  .result-top-fail { background: var(--gray-800); }

  .result-ring { width: 84px; height: 84px; border: 3px solid var(--blue-light); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 1.2rem; }
  .result-ring-fail { border-color: var(--gray-500); }
  .result-ring-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: white; line-height: 1; }
  .result-ring-sub { font-size: 0.72rem; color: var(--blue-pale); }
  .result-ring-sub-fail { color: var(--gray-300); }

  .result-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; color: white; }
  .result-subtitle { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 0.4rem; }

  .result-body { padding: 2rem 2.5rem; }
  .result-desc { font-size: 0.9rem; color: var(--gray-500); line-height: 1.7; margin-bottom: 1.8rem; }
  .result-desc strong { color: var(--blue-dark); }

  .result-btn-primary { background: var(--blue-dark); color: white; border: none; padding: 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; width: 100%; margin-bottom: 0.8rem; transition: background 0.2s; letter-spacing: 0.02em; }
  .result-btn-primary:hover { background: var(--blue-mid); }
  .result-btn-secondary { background: none; color: var(--gray-500); border: 1px solid var(--gray-300); padding: 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; cursor: pointer; width: 100%; transition: all 0.2s; }
  .result-btn-secondary:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 600px) { .result-body { padding: 1.5rem; } .rnav { padding: 0.9rem 1.5rem; } }
`;

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function Resultado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { correctas = 0, total = 5, curso = 'Curso' } = location.state || {};
  const aprobado = correctas >= 4;
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Usuario"}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  }

  return (
    <>
      <style>{styles}</style>
      <nav className="rnav">
        <div className="rnav-brand" onClick={() => navigate('/dashboard')}>Crece<span>Online</span></div>
        <div className="rnav-right">
          <div className="rnav-avatar">{getInitials(usuario.nombre)}</div>
          <span className="rnav-name">{usuario.nombre}</span>
          <button className="rnav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="result-page">
        <div className="result-card">
          <div className={`result-top ${aprobado ? 'result-top-pass' : 'result-top-fail'}`}>
            <div className={`result-ring ${aprobado ? '' : 'result-ring-fail'}`}>
              <div className="result-ring-num">{correctas}</div>
              <div className={`result-ring-sub ${aprobado ? '' : 'result-ring-sub-fail'}`}>de {total}</div>
            </div>
            <div className="result-title">{aprobado ? '¡Curso completado!' : 'Casi lo logras'}</div>
            <div className="result-subtitle">
              {aprobado ? `Obtuviste ${correctas} de ${total} respuestas correctas` : `Necesitas 4 de ${total} para obtener el certificado`}
            </div>
          </div>
          <div className="result-body">
            {aprobado ? (
              <>
                <p className="result-desc">Felicidades. Has completado el curso <strong>{curso}</strong> satisfactoriamente. Tu certificado ya está disponible.</p>
                <button className="result-btn-primary" onClick={() => navigate(`/certificado/${id}`, { state: { curso, correctas, total } })}>Ver y descargar certificado →</button>
                <button className="result-btn-secondary" onClick={() => navigate('/dashboard')}>Volver al dashboard</button>
              </>
            ) : (
              <>
                <p className="result-desc">Obtuviste <strong>{correctas} respuestas correctas</strong>. Revisa el contenido del curso e intenta de nuevo cuando estés listo.</p>
                <button className="result-btn-primary" onClick={() => navigate(`/quiz/${id}`)}>Reintentar evaluación →</button>
                <button className="result-btn-secondary" onClick={() => navigate(`/curso/${id}`)}>Repasar el curso</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}