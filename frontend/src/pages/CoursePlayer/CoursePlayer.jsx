import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NUEVA LÓGICA DE NAVEGACIÓN
  const [moduloIndex, setModuloIndex] = useState(1); // El módulo actual (1, 2, 3...)
  const [subSlide, setSubSlide] = useState(1);      // 1 para la primera imagen, 2 para la segunda
  const [fullScreen, setFullScreen] = useState(false);

  const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!token) { navigate("/login"); return; }
    setUsuario(storedUser);

    const fetchCurso = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`);
        const resData = await res.json();
        const todosLosCursos = Array.isArray(resData) ? resData : (resData.data || []);
        const cursoActual = todosLosCursos.find(c => c.id === parseInt(id));
        if (cursoActual) { setCurso(cursoActual); }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar curso:", error);
        setLoading(false);
      }
    };
    fetchCurso();
  }, [id, navigate]);

  if (loading) return <div style={{color: 'white', background: '#0d2a4a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif'}}>Cargando material técnico...</div>;
  if (!curso) return <div style={{textAlign: 'center', marginTop: '50px', fontFamily: 'DM Sans, sans-serif'}}>Curso no encontrado.</div>;

  // CÁLCULO DE LA DIAPOSITIVA REAL (Fórmula: (Modulo-1)*2 + SubSlide)
  const currentSlideFile = (moduloIndex - 1) * 2 + subSlide;
  const totalModulos = Math.ceil(curso.lecciones / 2);

  const handleNext = () => {
    if (subSlide === 1) {
      setSubSlide(2);
    } else if (moduloIndex < totalModulos) {
      setModuloIndex(moduloIndex + 1);
      setSubSlide(1);
    }
  };

  const handlePrev = () => {
    if (subSlide === 2) {
      setSubSlide(1);
    } else if (moduloIndex > 1) {
      setModuloIndex(moduloIndex - 1);
      setSubSlide(2);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const initials = usuario?.nombre ? (usuario.nombre.split(" ").map(n => n[0]).join("").toUpperCase()) : "U";

  return (
    <>
      <style>{styles}</style>
      
      {!fullScreen && (
        <nav className="player-nav">
          <div className="nav-brand" onClick={() => navigate("/dashboard")} style={{cursor: 'pointer'}}>
            <img src="/logo2.png" alt="Crece Online" />
          </div>
          <div className="nav-right">
            <div className="nav-avatar">{initials}</div>
            <span className="nav-name">{usuario?.nombre || "Usuario"}</span>
            <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </nav>
      )}

      <div className={`player-layout ${fullScreen ? 'fullscreen-active' : ''}`}>
        <div className="player-main">
          <div className="video-area" style={fullScreen ? {height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000} : {}}>
            
            <button onClick={() => setFullScreen(!fullScreen)} className="btn-fullscreen">
              {fullScreen ? "✕ Salir" : "⛶ Agrandar"}
            </button>

            {/* IMAGEN DINÁMICA: DiapositivaX.PNG */}
            <img 
              src={`${curso.ruta_assets}/Diapositiva${currentSlideFile}.PNG`} 
              alt={`Módulo ${moduloIndex} Parte ${subSlide}`}
              className="slide-image"
              onError={(e) => { if (!e.target.src.includes('logo2.png')) { e.target.src = "/logo2.png"; } }}
            />
            
            <div className="player-controls">
              <button className="ctrl-nav-btn" onClick={handlePrev} disabled={moduloIndex === 1 && subSlide === 1}>
                ← Anterior
              </button>
              <div className="slide-counter">
                Módulo {moduloIndex} - Parte {subSlide} de 2
              </div>
              <button className="ctrl-nav-btn" onClick={handleNext} disabled={moduloIndex === totalModulos && subSlide === 2}>
                Siguiente →
              </button>
            </div>
          </div>

          {!fullScreen && (
            <div className="module-info">
              <div className="module-breadcrumb">Curso: {curso.titulo}</div>
              <div className="module-title">Módulo {moduloIndex}: Contenido de Estudio</div>
              <p className="module-desc">Instructor: {curso.instructor}. Estás viendo la diapositiva {currentSlideFile} del total de material técnico.</p>
            </div>
          )}
        </div>

        {!fullScreen && (
          <div className="player-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Progreso por Módulos</div>
              <div className="sidebar-progress-bar">
                <div className="sidebar-progress-fill" style={{ width: `${(moduloIndex / totalModulos) * 100}%` }}></div>
              </div>
              <button className="btn-evaluacion activa" onClick={() => navigate(`/quiz/${id}`)}>
                Ir al Quiz →
              </button>
            </div>
            <div className="modulos-list">
              {/* Generamos la lista de módulos dinámicamente basándonos en las lecciones / 2 */}
              {Array.from({ length: totalModulos }, (_, i) => i + 1).map((num) => (
                <div 
                  key={num} 
                  className={`modulo-item ${moduloIndex === num ? 'activo' : ''}`}
                  onClick={() => { setModuloIndex(num); setSubSlide(1); }}
                >
                  <div className={`modulo-icon ${moduloIndex === num ? 'activo-icon' : ''}`}>{num}</div>
                  <div className="modulo-info-text">
                    <div className="modulo-nombre">Módulo {num}</div>
                    <div className="modulo-duracion">2 Diapositivas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f7f8fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }
  .player-nav { position: sticky; top: 0; z-index: 100; background: var(--white); border-bottom: 1px solid var(--gray-300); display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; }
  .nav-brand img { height: 38px; width: auto; }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .nav-avatar { width: 34px; height: 34px; background: var(--blue-dark); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; border-radius: 50%; }
  .btn-logout { background: transparent; color: var(--gray-500); border: 1.5px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; cursor: pointer; }
  .player-layout { display: grid; grid-template-columns: 1fr 320px; min-height: calc(100vh - 60px); }
  .video-area { background: var(--blue-dark); aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .slide-image { max-width: 95%; max-height: 85%; border-radius: 8px; boxShadow: 0 20px 40px rgba(0,0,0,0.5); }
  .btn-fullscreen { position: absolute; top: 20px; right: 20px; z-index: 1001; background: rgba(255,255,255,0.1); border: 1px solid white; color: white; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
  .player-controls { margin-top: 20px; display: flex; gap: 15px; z-index: 1001; }
  .ctrl-nav-btn { background: var(--blue-light); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; }
  .ctrl-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .slide-counter { background: rgba(0,0,0,0.6); color: white; padding: 8px 16px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
  .module-info { padding: 2rem 2.5rem; background: var(--white); border-bottom: 1px solid var(--gray-300); }
  .module-breadcrumb { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.6rem; }
  .module-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--blue-dark); }
  .player-sidebar { background: var(--white); border-left: 1px solid var(--gray-300); overflow-y: auto; }
  .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--gray-300); }
  .sidebar-progress-bar { height: 3px; background: var(--gray-300); margin-bottom: 1rem; }
  .sidebar-progress-fill { height: 100%; background: var(--blue-light); transition: width 0.4s ease; }
  .modulos-list { display: flex; flex-direction: column; }
  .modulo-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--gray-300); cursor: pointer; }
  .modulo-item.activo { background: var(--blue-mist); border-left: 4px solid var(--blue-light); }
  .modulo-icon { width: 30px; height: 30px; background: var(--gray-300); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
  .modulo-icon.activo-icon { background: var(--blue-light); color: white; }
  .btn-evaluacion { width: 100%; padding: 1rem; background: var(--blue-dark); color: white; border: none; cursor: pointer; font-weight: 500; }
`;