import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f7f8fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }

  /* ── Navbar ── */
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

  /* ── Layout principal ── */
  .player-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    min-height: calc(100vh - 60px);
  }

  /* ── Área del video ── */
  .player-main { display: flex; flex-direction: column; }

  .video-area {
    background: var(--blue-dark);
    aspect-ratio: 16/9;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .video-area::before {
    content: '';
    position: absolute; top: -20%; left: -10%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,158,232,0.08) 0%, transparent 70%);
  }

  /* Estado vacío del video */
  .video-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 1rem; position: relative; z-index: 1; text-align: center; padding: 2rem;
  }
  .video-empty-icon {
    width: 80px; height: 80px;
    border: 2px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; color: rgba(255,255,255,0.3);
    margin-bottom: 0.5rem;
  }
  .video-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600;
    color: rgba(255,255,255,0.7); letter-spacing: -0.01em;
  }
  .video-empty-sub {
    font-size: 0.85rem; color: rgba(255,255,255,0.35);
    max-width: 320px; line-height: 1.6;
  }

  /* Barra de controles */
  .video-controls {
    background: #0a1f38;
    padding: 0.7rem 1.5rem;
    display: flex; align-items: center; gap: 1.2rem;
  }
  .ctrl-btn {
    background: none; border: none; color: rgba(255,255,255,0.5);
    cursor: not-allowed; font-size: 1rem; padding: 0.3rem;
    display: flex; align-items: center; transition: color 0.2s;
  }
  .time-display {
    font-size: 0.78rem; color: rgba(255,255,255,0.4);
    font-family: 'DM Sans', sans-serif; white-space: nowrap;
  }
  .progress-track {
    flex: 1; height: 4px; background: rgba(255,255,255,0.15);
    border-radius: 2px; cursor: not-allowed;
  }
  .progress-thumb {
    width: 0%; height: 100%;
    background: var(--blue-light); border-radius: 2px;
  }

  /* Info del módulo */
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

  /* ── Sidebar ── */
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
    width: 0%; transition: width 1s ease;
  }
  .sidebar-progress-text {
    font-size: 0.78rem; color: var(--gray-500);
  }

  /* Lista de módulos */
  .modulos-list { flex: 1; overflow-y: auto; }
  .modulo-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--gray-300);
    cursor: not-allowed; transition: background 0.2s;
    position: relative;
  }
  .modulo-item.disponible { cursor: pointer; }
  .modulo-item.disponible:hover { background: var(--blue-mist); }
  .modulo-item.activo { background: var(--blue-mist); border-left: 3px solid var(--blue-light); }

  .modulo-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
  }
  .modulo-icon.completado { background: var(--blue-dark); color: var(--white); }
  .modulo-icon.activo-icon { background: var(--blue-light); color: var(--white); }
  .modulo-icon.bloqueado { background: var(--gray-100); color: var(--gray-300); border: 1.5px solid var(--gray-300); }
  .modulo-icon.proximo { background: var(--gray-100); color: var(--gray-500); border: 1.5px solid var(--gray-300); }

  .modulo-info { flex: 1; min-width: 0; }
  .modulo-nombre {
    font-size: 0.85rem; font-weight: 500; color: var(--gray-800);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 0.2rem;
  }
  .modulo-item.bloqueado-item .modulo-nombre { color: var(--gray-300); }
  .modulo-duracion {
    font-size: 0.75rem; color: var(--gray-500);
    display: flex; align-items: center; gap: 0.3rem;
  }
  .modulo-item.bloqueado-item .modulo-duracion { color: var(--gray-300); }

  /* Botón evaluación */
  .btn-evaluacion {
    margin: 1.5rem; padding: 1rem;
    background: var(--gray-100); color: var(--gray-300);
    border: 1.5px solid var(--gray-300);
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    cursor: not-allowed; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-evaluacion.activa {
    background: var(--blue-dark); color: var(--white);
    border-color: var(--blue-dark); cursor: pointer;
  }
  .btn-evaluacion.activa:hover {
    background: var(--blue-mid);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(26,95,168,0.25);
  }

  /* Estado vacío sidebar */
  .sidebar-empty {
    padding: 2rem 1.5rem; text-align: center;
  }
  .sidebar-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: var(--blue-dark);
    margin-bottom: 0.5rem;
  }
  .sidebar-empty-desc {
    font-size: 0.8rem; color: var(--gray-500); line-height: 1.6;
  }
  .coming-soon-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: var(--blue-mist); border: 1px solid var(--blue-pale);
    color: var(--blue-mid); padding: 0.35rem 0.8rem;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
    margin-top: 1rem;
  }
  .coming-soon-badge::before {
    content: ''; width: 5px; height: 5px;
    background: var(--blue-light); border-radius: 50%;
  }

  @media (max-width: 900px) {
    .player-layout { grid-template-columns: 1fr; }
    .player-sidebar { border-left: none; border-top: 1px solid var(--gray-300); }
    .player-nav { padding: 0 1rem; }
    .nav-name { display: none; }
  }
`;

const modulosEjemplo = [
  { nombre: "Módulo 1 — Introducción", duracion: "— min", estado: "proximo" },
  { nombre: "Módulo 2 — Contenido principal", duracion: "— min", estado: "proximo" },
  { nombre: "Módulo 3 — Práctica avanzada", duracion: "— min", estado: "bloqueado" },
];

export default function CoursePlayer() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsuario(payload);
    } catch {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (nombre) => {
    if (!nombre) return "U";
    const parts = nombre.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : nombre.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(usuario?.nombre_completo || "");

  return (
    <>
      <style>{styles}</style>

      {/* Navbar */}
      <nav className="player-nav">
        <div className="nav-brand">
          <img src="/logo.png" alt="Crece Online" />
        </div>
        <div className="nav-right">
          <div className="nav-avatar">{initials}</div>
          <span className="nav-name">{usuario?.nombre_completo || "Usuario"}</span>
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      {/* Layout */}
      <div className="player-layout">

        {/* Área principal */}
        <div className="player-main">

          {/* Video */}
          <div className="video-area">
            <div className="video-empty">
              <div className="video-empty-icon">▶</div>
              <div className="video-empty-title">Contenido no disponible aún</div>
              <p className="video-empty-sub">
                Los videos del curso estarán disponibles próximamente. Te notificaremos cuando estén listos.
              </p>
            </div>
          </div>

          {/* Controles del reproductor */}
          <div className="video-controls">
            <button className="ctrl-btn">◀◀</button>
            <button className="ctrl-btn">▶</button>
            <span className="time-display">0:00 / 0:00</span>
            <div className="progress-track">
              <div className="progress-thumb" />
            </div>
            <span className="time-display">—:——</span>
          </div>

          {/* Info del módulo */}
          <div className="module-info">
            <div className="module-breadcrumb">Curso · Módulo — de —</div>
            <div className="module-title">Contenido próximamente disponible</div>
            <p className="module-desc">
              El contenido de este curso está en preparación. En cuanto esté listo podrás ver los módulos, seguir tu progreso y presentar la evaluación final.
            </p>
          </div>

        </div>

        {/* Sidebar */}
        <div className="player-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Contenido del curso</div>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" />
            </div>
            <div className="sidebar-progress-text">0 de — módulos completados</div>
          </div>

          <div className="modulos-list">
            <div className="sidebar-empty">
              <div className="sidebar-empty-title">Sin módulos disponibles</div>
              <p className="sidebar-empty-desc">
                Los módulos aparecerán aquí una vez que el curso sea publicado.
              </p>
              <div className="coming-soon-badge">Próximamente</div>
            </div>

            {/* Preview de estructura */}
            {modulosEjemplo.map((mod, i) => (
              <div
                className={`modulo-item ${mod.estado === "bloqueado" ? "bloqueado-item" : ""}`}
                key={i}
              >
                <div className={`modulo-icon ${mod.estado === "bloqueado" ? "bloqueado" : "proximo"}`}>
                  {mod.estado === "bloqueado" ? "🔒" : "○"}
                </div>
                <div className="modulo-info">
                  <div className="modulo-nombre">{mod.nombre}</div>
                  <div className="modulo-duracion">{mod.duracion} · Pendiente</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-evaluacion">
            Presentar evaluación final →
          </button>
        </div>

      </div>
    </>
  );
}