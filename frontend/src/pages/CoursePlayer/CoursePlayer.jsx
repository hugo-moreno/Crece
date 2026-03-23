import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cursoContenido } from "../../constants/content"; // Importamos tus datos de diapositivas

export default function CoursePlayer() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [moduloIndex, setModuloIndex] = useState(0); // Controla qué diapositiva se ve

  // Buscamos la data del curso real. Si no existe, usamos Word por default.
  const curso = cursoContenido[id] || cursoContenido["1"];
  const moduloActual = curso.modulos[moduloIndex];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!token) {
      navigate("/login");
      return;
    }
    setUsuario(storedUser);
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getInitials = (nombre) => {
    if (!nombre || nombre === "Usuario") return "U";
    const parts = nombre.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : nombre.slice(0, 2).toUpperCase();
  };

  const nombreMostrar = usuario?.nombre || "Usuario";
  const initials = getInitials(nombreMostrar);

  return (
    <>
      <style>{styles}</style>

      {/* Navbar */}
      <nav className="player-nav">
        <div className="nav-brand" onClick={() => navigate("/dashboard")} style={{cursor: 'pointer'}}>
          <img src="/logo2.png" alt="Crece Online" />
        </div>
        <div className="nav-right">
          <div className="nav-avatar">{initials}</div>
          <span className="nav-name">{nombreMostrar}</span>
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="player-layout">
        <div className="player-main">
          {/* VISOR DE DIAPOSITIVAS (Reemplaza el video-empty) */}
          <div className="video-area" style={{ padding: '20px' }}>
            <div className="slide-wrapper" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={moduloActual.img} 
                alt={moduloActual.tema}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  borderRadius: '8px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  objectFit: 'contain' 
                }}
              />
              
              {/* Controles flotantes sobre la imagen */}
              <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '15px' }}>
                <button 
                  className="ctrl-nav-btn" 
                  disabled={moduloIndex === 0}
                  onClick={() => setModuloIndex(moduloIndex - 1)}
                >
                  ← Anterior
                </button>
                <div className="slide-counter">
                  {moduloIndex + 1} / {curso.modulos.length}
                </div>
                <button 
                  className="ctrl-nav-btn" 
                  disabled={moduloIndex === curso.modulos.length - 1}
                  onClick={() => setModuloIndex(moduloIndex + 1)}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
          
          <div className="module-info">
            <div className="module-breadcrumb">Curso: {curso.titulo} • Instructor: {curso.instructor}</div>
            <div className="module-title">{moduloActual.tema}</div>
            <p className="module-desc">Visualiza las diapositivas del módulo para completar tu aprendizaje. Al terminar, no olvides realizar la evaluación final.</p>
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
    </>
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