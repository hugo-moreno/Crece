import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f7f8fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body, html { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
  
  .dash-nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--white); border-bottom: 1px solid var(--gray-300);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 64px;
  }
  .nav-brand { display: flex; align-items: center; text-decoration: none; }
  .nav-brand img { height: 40px; width: auto; object-fit: contain; }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .nav-avatar {
    width: 36px; height: 36px; background: var(--blue-dark); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 600; flex-shrink: 0;
  }
  .nav-name { font-size: 0.9rem; font-weight: 500; color: var(--gray-800); }
  .btn-logout {
    background: transparent; color: var(--gray-500);
    border: 1.5px solid var(--gray-300); padding: 0.45rem 1.1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-logout:hover { border-color: var(--blue-dark); color: var(--blue-dark); }

  .dash-hero {
    background: var(--blue-dark); padding: 3rem 3rem 3.5rem;
    position: relative; overflow: hidden;
  }
  .dash-hero::before {
    content: ''; position: absolute; top: -30%; right: -5%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,158,232,0.12) 0%, transparent 70%);
  }
  .hero-tag {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--blue-pale);
    margin-bottom: 0.6rem; position: relative; z-index: 1;
  }
  .hero-greeting {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 700;
    color: var(--white); line-height: 1.1; letter-spacing: -0.02em;
    position: relative; z-index: 1;
  }
  .hero-greeting em { font-style: italic; color: var(--blue-light); }

  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: rgba(255,255,255,0.08);
    margin-top: 2.5rem; position: relative; z-index: 1;
  }
  .stat-box { background: rgba(255,255,255,0.05); padding: 1.5rem 2rem; transition: background 0.2s; }
  .stat-box:hover { background: rgba(255,255,255,0.08); }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 700; color: var(--white); line-height: 1;
  }
  .stat-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 0.4rem;
  }

  .dash-content { padding: 2.5rem 3rem; }
  .section-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--blue-light); margin-bottom: 1.5rem;
  }

  .empty-state {
    background: var(--white); border: 1.5px dashed var(--gray-300);
    padding: 4rem 2rem;
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;
  }
  .empty-icon {
    width: 56px; height: 56px; background: var(--blue-mist);
    border: 1px solid var(--blue-pale);
    display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;
  }
  .empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: var(--blue-dark);
  }
  .empty-subtitle { font-size: 0.88rem; color: var(--gray-500); line-height: 1.6; max-width: 360px; }

  .cursos-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.5px; background: var(--gray-300);
  }
  .curso-card {
    background: var(--white); padding: 2rem;
    transition: all 0.25s; cursor: pointer; position: relative;
    animation: fadeUp 0.4s ease both;
  }
  .curso-card:hover { background: var(--blue-mist); }
  .curso-card::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 3px; background: var(--blue-light); transition: width 0.3s;
  }
  .curso-card:hover::after { width: 100%; }
  .curso-nivel {
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.6rem;
  }
  .curso-titulo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 600; color: var(--blue-dark);
    margin-bottom: 0.3rem; line-height: 1.2;
  }
  .curso-instructor { font-size: 0.8rem; color: var(--gray-500); margin-bottom: 1.2rem; }
  .curso-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 1rem; border-top: 1px solid var(--gray-300);
  }
  
  .badge-disponible {
    font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.7rem;
    background: var(--blue-mist); color: var(--blue-mid); border: 1px solid var(--blue-pale);
  }

  .badge-completado {
    font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.7rem;
    background: #e6ffed; color: #28a745; border: 1px solid #b7eb8f;
  }

  .curso-arrow {
    width: 28px; height: 28px; background: var(--blue-dark); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; transition: all 0.2s;
  }
  .curso-card:hover .curso-arrow { background: var(--blue-light); transform: translate(2px, -2px); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 900px) {
    .dash-nav { padding: 0 1.5rem; }
    .dash-hero { padding: 2rem 1.5rem 2.5rem; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .dash-content { padding: 2rem 1.5rem; }
    .cursos-grid { grid-template-columns: 1fr; }
  }
`;

const cursosDisponibles = [
  { id: 1, nivel: "Principiante", titulo: "Word desde Cero", instructor: "Leonel Martínez" },
  { id: 2, nivel: "Avanzado", titulo: "Excel y Análisis de Datos", instructor: "Susana Morales" },
  { id: 3, nivel: "Principiante", titulo: "PowerPoint desde Cero", instructor: "Susana Morales" },
  { id: 4, nivel: "Principiante", titulo: "Administración y Finanzas", instructor: "Leonel Martínez" },
  { id: 5, nivel: "Principiante", titulo: "Introducción a Lengua de Señas", instructor: "Hugo Moreno" },
  { id: 6, nivel: "Avanzado", titulo: "Marketing Digital", instructor: "Alexis Alfano" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({
    enProgreso: 0,
    completados: 0,
    disponibles: cursosDisponibles.length,
    promedio: "—",
    idsUsuario: [],
    detallesCursos: {} 
  });

  const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) { navigate("/login"); return; }

    // --- PROTECCIÓN ANTI-BUCLE ---
    if (role === "Staff" || role === "Admin") {
        console.log(`Acceso administrativo (${role}) detectado. Redirigiendo a panel de control...`);
        navigate("/admin", { replace: true });
        return; // IMPORTANTE: Detenemos la ejecución aquí
    }
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const localUser = JSON.parse(localStorage.getItem("usuario"));
      const userData = {
        id: payload.id || localUser?.id,
        nombre: payload.nombre || localUser?.nombre || "Usuario",
        role: role
      };
      setUsuario(userData);

      const fetchStats = async () => {
        try {
          const res = await fetch(`${API_URL}/api/stats/dashboard/${userData.id}`);
          if (res.ok) {
            const data = await res.json();
            setStats(data);
          }
        } catch (error) {
          console.error("Error cargando estadísticas:", error);
        }
      };

      if (userData.id) fetchStats();
    } catch (error) {
      console.error("Error de sesión:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCourseClick = async (id) => {
    if (stats.detallesCursos?.[id] === 'completado') {
        navigate(`/certificado/${id}`);
        return;
    }

    if (!stats.idsUsuario?.includes(id)) {
      try {
        await fetch(`${API_URL}/api/stats/inscribir`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: usuario.id, cursoId: id })
        });
      } catch (e) {
        console.log("Error al inscribir");
      }
    }
    navigate(`/curso/${id}`);
  };

  const disponiblesFiltrados = cursosDisponibles.filter(c => !stats.idsUsuario?.includes(c.id));
  const misCursosReal = cursosDisponibles.filter(c => stats.idsUsuario?.includes(c.id));

  const displayName = usuario?.nombre || "Usuario";
  const firstName = displayName.split(" ")[0];
  const initials = (displayName.split(" ")[0][0] + (displayName.split(" ")[1]?.[0] || "")).toUpperCase();

  return (
    <>
      <style>{styles}</style>

      <nav className="dash-nav">
        <div className="nav-brand" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <img src="/logo2.png" alt="Crece Online" />
        </div>
        <div className="nav-right">
          <div className="nav-avatar">{initials}</div>
          <span className="nav-name">{displayName}</span>
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="dash-hero">
        <div className="hero-tag">Bienvenido de vuelta</div>
        <div className="hero-greeting">Hola, <em>{firstName}.</em></div>
        
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-num">{stats.enProgreso}</div>
            <div className="stat-label">Cursos en progreso</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{stats.completados}</div>
            <div className="stat-label">Completados</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{disponiblesFiltrados.length}</div>
            <div className="stat-label">Disponibles</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{stats.promedio}</div>
            <div className="stat-label">Promedio Quiz</div>
          </div>
        </div>
      </div>

      <div className="dash-content">
        <div className="section-label">Mis cursos</div>
        
        {misCursosReal.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div className="empty-title">Aún no has iniciado ningún curso</div>
            <p className="empty-subtitle">Explora el catálogo de cursos disponibles y comienza tu aprendizaje.</p>
          </div>
        ) : (
          <div className="cursos-grid">
            {misCursosReal.map((curso, i) => {
              const estado = stats.detallesCursos?.[curso.id];
              return (
                <div className="curso-card" key={i} onClick={() => handleCourseClick(curso.id)}>
                  <div className="curso-nivel">{curso.nivel}</div>
                  <div className="curso-titulo">{curso.titulo}</div>
                  <div className="curso-instructor">{curso.instructor}</div>
                  <div className="curso-footer">
                    <div className={estado === 'completado' ? "badge-completado" : "badge-disponible"}>
                      {estado === 'completado' ? '✓ Finalizado' : 'En progreso'}
                    </div>
                    <div className="curso-arrow">→</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {disponiblesFiltrados.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: "3rem" }}>Cursos disponibles</div>
            <div className="cursos-grid">
              {disponiblesFiltrados.map((curso, i) => (
                <div className="curso-card" key={i} onClick={() => handleCourseClick(curso.id)}>
                  <div className="curso-nivel">{curso.nivel}</div>
                  <div className="curso-titulo">{curso.titulo}</div>
                  <div className="curso-instructor">{curso.instructor}</div>
                  <div className="curso-footer">
                    <div className="badge-disponible">Disponible</div>
                    <div className="curso-arrow">→</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}