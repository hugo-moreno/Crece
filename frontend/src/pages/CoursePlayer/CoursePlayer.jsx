import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cursoContenido } from "../../constants/content";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moduloIndex, setModuloIndex] = useState(0);
  const [subPass, setSubPass] = useState(0); // 0 para la primera diapositiva, 1 para la segunda
  const [fullScreen, setFullScreen] = useState(false);

  const curso = cursoContenido[id] || cursoContenido["1"];
  const moduloActual = curso.modulos[moduloIndex];

  // Función para avanzar considerando el par de diapositivas
  const handleNext = () => {
    if (subPass === 0) {
      setSubPass(1);
    } else if (moduloIndex < curso.modulos.length - 1) {
      setModuloIndex(moduloIndex + 1);
      setSubPass(0);
    }
  };

  const handlePrev = () => {
    if (subPass === 1) {
      setSubPass(0);
    } else if (moduloIndex > 0) {
      setModuloIndex(moduloIndex - 1);
      setSubPass(1);
    }
  };

  return (
    <div className={`player-layout ${fullScreen ? 'is-fullscreen' : ''}`}>
      <style>{`
        .is-fullscreen .player-sidebar, 
        .is-fullscreen .player-nav,
        .is-fullscreen .nav-controls-visible { display: none !important; }
        .is-fullscreen .player-main { width: 100vw; height: 100vh; }
        .btn-fullscreen {
          position: absolute; top: 20px; right: 20px;
          background: rgba(0,0,0,0.5); color: white; border: none;
          padding: 8px; border-radius: 4px; cursor: pointer; z-index: 10;
        }
      `}</style>

      {/* Visor Principal */}
      <div className="player-main">
        <div className="video-area" style={{ position: 'relative', height: fullScreen ? '100vh' : 'auto' }}>
          
          <button className="btn-fullscreen" onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? "✕ Salir" : "⛶ Agrandar"}
          </button>

          <img 
            src={moduloActual.imgs[subPass]} 
            style={{ maxWidth: '100%', maxHeight: fullScreen ? '100vh' : '70vh' }}
            alt="Contenido"
          />

          {/* Controles: Solo aparecen si NO está en FullScreen */}
          {!fullScreen && (
            <div className="nav-controls-visible" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button onClick={handlePrev} disabled={moduloIndex === 0 && subPass === 0}>← Anterior</button>
              <div className="slide-counter">Módulo {moduloIndex + 1} - Parte {subPass + 1}</div>
              <button onClick={handleNext} disabled={moduloIndex === curso.modulos.length - 1 && subPass === 1}>Siguiente →</button>
            </div>
          )}
        </div>
      </div>


        {/* Sidebar Dinámico */}
        <div className="player-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">Contenido del curso</div>
                <div className="sidebar-progress-bar">
                  <div 
                    className="sidebar-progress-fill" 
                    style={{ width: `${((moduloIndex + 1) / curso.modulos.length) * 100}%` }}
                  ></div>
                </div>
                <div className="sidebar-progress-text">
                  Progreso: {Math.round(((moduloIndex + 1) / curso.modulos.length) * 100)}%
                </div>
                <button 
                  className="btn-evaluacion activa" 
                  onClick={() => navigate(`/quiz/${id}`)}
                  style={{marginTop: '15px', width: '100%'}}
                >
                  Realizar Evaluación →
                </button>
            </div>

            <div className="modulos-list">
              {curso.modulos.map((m, index) => (
                <div 
                  key={index} 
                  className={`modulo-item disponible ${moduloIndex === index ? 'activo' : ''}`}
                  onClick={() => setModuloIndex(index)}
                >
                  <div className={`modulo-icon ${moduloIndex === index ? 'activo-icon' : 'proximo'}`}>
                    {m.num}
                  </div>
                  <div className="modulo-info-text">
                    <div className="modulo-nombre">{m.tema}</div>
                    <div className="modulo-duracion">Diapositiva técnica</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
  );
}

const styles = `
  /* ... Tus estilos anteriores se mantienen igual ... */
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f7f8fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }

  .player-nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--white); border-bottom: 1px solid var(--gray-300);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 60px;
  }
  .nav-brand img { height: 38px; width: auto; object-fit: contain; }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .nav-avatar {
    width: 34px; height: 34px; background: var(--blue-dark); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 600; flex-shrink: 0;
  }
  .nav-name { font-size: 0.88rem; font-weight: 500; color: var(--gray-800); }
  .btn-logout {
    background: transparent; color: var(--gray-500);
    border: 1.5px solid var(--gray-300); padding: 0.4rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-logout:hover { border-color: var(--blue-dark); color: var(--blue-dark); }

  .player-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    min-height: calc(100vh - 60px);
  }

  .player-main { display: flex; flex-direction: column; }

  .video-area {
    background: var(--blue-dark);
    aspect-ratio: 16/9;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }

  .ctrl-nav-btn {
    background: var(--blue-light); color: white; border: none;
    padding: 8px 16px; border-radius: 4px; cursor: pointer;
    font-weight: 600; font-size: 0.8rem; transition: 0.2s;
  }
  .ctrl-nav-btn:disabled { background: rgba(255,255,255,0.2); cursor: not-allowed; }
  .slide-counter {
    background: rgba(0,0,0,0.6); color: white; padding: 8px 16px;
    border-radius: 4px; font-size: 0.8rem; font-weight: 600;
  }

  .module-info { padding: 2rem 2.5rem; background: var(--white); border-bottom: 1px solid var(--gray-300); }
  .module-breadcrumb {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.6rem;
  }
  .module-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 700; color: var(--blue-dark);
    letter-spacing: -0.02em; margin-bottom: 0.6rem;
  }
  .module-desc {
    font-size: 0.9rem; color: var(--gray-500); line-height: 1.7; max-width: 680px;
  }

  .player-sidebar {
    background: var(--white);
    border-left: 1px solid var(--gray-300);
    display: flex; flex-direction: column;
  }
  .sidebar-header {
    padding: 1.5rem 1.5rem 0;
    border-bottom: 1px solid var(--gray-300);
    padding-bottom: 1.2rem;
  }
  .sidebar-title {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray-500); margin-bottom: 0.8rem;
  }
  .sidebar-progress-bar {
    height: 3px; background: var(--gray-300); border-radius: 2px; margin-bottom: 0.5rem;
  }
  .sidebar-progress-fill {
    height: 100%; background: var(--blue-light); border-radius: 2px;
    transition: width 0.4s ease;
  }
  .sidebar-progress-text { font-size: 0.78rem; color: var(--gray-500); }

  .modulos-list { flex: 1; overflow-y: auto; }
  .modulo-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--gray-300);
    cursor: pointer; transition: background 0.2s;
  }
  .modulo-item:hover { background: var(--blue-mist); }
  .modulo-item.activo { background: var(--blue-mist); border-left: 3px solid var(--blue-light); }

  .modulo-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; border-radius: 50%;
  }
  .modulo-icon.activo-icon { background: var(--blue-light); color: var(--white); }
  .modulo-icon.proximo { background: var(--gray-100); color: var(--gray-500); border: 1.5px solid var(--gray-300); }

  .modulo-info-text { flex: 1; min-width: 0; }
  .modulo-nombre {
    font-size: 0.85rem; font-weight: 500; color: var(--gray-800);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .modulo-duracion { font-size: 0.75rem; color: var(--gray-500); }

  .btn-evaluacion {
    padding: 1rem;
    background: var(--blue-dark); color: var(--white);
    border: none;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-evaluacion:hover { background: var(--blue-mid); }

  @media (max-width: 900px) {
    .player-layout { grid-template-columns: 1fr; }
    .player-sidebar { border-left: none; border-top: 1px solid var(--gray-300); }
  }
`;