import logo from '../../logo.png'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--gray-800); overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 4rem; background: rgba(255,255,255,0.93); backdrop-filter: blur(12px); border-bottom: 1px solid var(--gray-300); }
  .nav-logo img { height: 48px; width: auto; object-fit: contain; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { text-decoration: none; color: var(--gray-500); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover { color: var(--blue-dark); }
  .nav-cta { background: var(--blue-dark); color: var(--white); border: none; padding: 0.65rem 1.6rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.25s; }
  .nav-cta:hover { background: var(--blue-mid); transform: translateY(-1px); }

  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 80px; overflow: hidden; }
  .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 6rem 4rem 6rem 6rem; }
  .hero-tag { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--blue-mist); border: 1px solid var(--blue-pale); color: var(--blue-mid); padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; width: fit-content; margin-bottom: 2rem; }
  .hero-tag::before { content: ''; width: 6px; height: 6px; background: var(--blue-light); border-radius: 50%; }
  .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5vw, 5rem); font-weight: 700; line-height: 1.05; color: var(--blue-dark); letter-spacing: -0.03em; margin-bottom: 1.5rem; }
  .hero-title em { font-style: italic; color: var(--blue-light); }
  .hero-subtitle { font-size: 1.05rem; color: var(--gray-500); font-weight: 300; line-height: 1.7; max-width: 420px; margin-bottom: 3rem; }
  .hero-buttons { display: flex; gap: 1rem; align-items: center; }
  .btn-primary { background: var(--blue-dark); color: var(--white); border: none; padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.25s; }
  .btn-primary:hover { background: var(--blue-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,95,168,0.25); }
  .btn-secondary { background: transparent; color: var(--blue-dark); border: 1.5px solid var(--blue-dark); padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.25s; }
  .btn-secondary:hover { background: var(--blue-mist); }
  .hero-stats { display: flex; gap: 2.5rem; margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid var(--gray-300); }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--blue-dark); }
  .stat-label { font-size: 0.8rem; color: var(--gray-500); margin-top: 0.15rem; }

  .hero-right { background: var(--blue-mist); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .hero-right::before { content: ''; position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; background: radial-gradient(circle, var(--blue-pale) 0%, transparent 70%); opacity: 0.6; }
  .hero-image-box { position: relative; z-index: 1; width: 75%; max-width: 380px; }
  .hero-card { background: var(--white); padding: 2rem; box-shadow: 0 20px 60px rgba(13,42,74,0.12); position: relative; }
  .hero-card::before { content: ''; position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px; background: linear-gradient(135deg, var(--blue-light), var(--blue-pale)); z-index: -1; }
  .card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--blue-dark); margin-bottom: 0.5rem; }
  .card-desc { font-size: 0.85rem; color: var(--gray-500); line-height: 1.6; }
  .card-progress { margin-top: 1.2rem; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--gray-500); margin-bottom: 0.4rem; }
  .progress-bar { background: var(--gray-300); height: 4px; border-radius: 2px; }
  .progress-fill { background: var(--blue-light); height: 100%; border-radius: 2px; transition: width 1.5s ease; }
  .floating-badge { position: absolute; bottom: -20px; right: -20px; background: var(--blue-dark); color: var(--white); padding: 1rem 1.2rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .badge-num { font-size: 1.8rem; line-height: 1; }
  .badge-text { font-size: 0.7rem; color: var(--blue-pale); margin-top: 0.1rem; }

  .cursos { padding: 8rem 6rem; background: var(--white); }
  .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; }
  .section-tag { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.8rem; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3vw, 3rem); font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; line-height: 1.1; }
  .section-subtitle { font-size: 0.9rem; color: var(--gray-500); max-width: 220px; text-align: right; line-height: 1.6; }
  .cursos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; background: var(--gray-300); }
  .curso-card { background: var(--white); padding: 2.5rem; transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; }
  .curso-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 3px; background: var(--blue-light); transition: width 0.3s; }
  .curso-card:hover { background: var(--blue-mist); }
  .curso-card:hover::after { width: 100%; }
  .curso-icono { margin-bottom: 1.5rem; display: flex; align-items: center; }
  .curso-nivel { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.6rem; }
  .curso-titulo { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--blue-dark); margin-bottom: 0.8rem; line-height: 1.2; }
  .curso-desc { font-size: 0.85rem; color: var(--gray-500); line-height: 1.6; margin-bottom: 1.5rem; }
  .curso-meta { display: flex; justify-content: space-between; align-items: center; padding-top: 1.2rem; border-top: 1px solid var(--gray-300); }
  .curso-instructor { font-size: 0.8rem; color: var(--gray-500); }
  .curso-arrow { width: 32px; height: 32px; background: var(--blue-dark); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: all 0.2s; }
  .curso-card:hover .curso-arrow { background: var(--blue-light); transform: translate(2px, -2px); }

  .sobre { padding: 8rem 6rem; background: var(--blue-dark); display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
  .sobre-left .section-tag { color: var(--blue-pale); }
  .sobre-text { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.8; margin: 1.5rem 0 2.5rem; }
  .sobre-values { display: flex; flex-direction: column; gap: 1rem; }
  .value-item { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 1.5rem; border: 1px solid rgba(255,255,255,0.1); transition: all 0.25s; }
  .value-item:hover { border-color: var(--blue-light); background: rgba(59,158,232,0.08); }
  .value-icon { font-size: 1.3rem; }
  .value-text { font-size: 0.9rem; color: rgba(255,255,255,0.8); }
  .sobre-right { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.1); }
  .metric-box { background: var(--blue-dark); padding: 2.5rem; text-align: center; }
  .metric-box:nth-child(2) { background: var(--blue-mid); }
  .metric-box:nth-child(3) { background: rgba(59,158,232,0.15); }
  .metric-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--white); line-height: 1; }
  .metric-num span { color: var(--blue-light); }
  .metric-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }

  .footer { background: var(--gray-800); color: var(--white); padding: 4rem 6rem 2rem; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .footer-logo img { height: 40px; width: auto; object-fit: contain; margin-bottom: 1rem; filter: brightness(0) invert(1); }
  .footer-desc { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.7; }
  .footer-col-title { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 1.2rem; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .footer-links a { text-decoration: none; font-size: 0.85rem; color: rgba(255,255,255,0.6); transition: color 0.2s; }
  .footer-links a:hover { color: var(--blue-light); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; }
  .footer-copy { font-size: 0.8rem; color: rgba(255,255,255,0.3); }
  .social-links { display: flex; gap: 1rem; }
  .social-link { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); font-size: 0.85rem; text-decoration: none; transition: all 0.2s; }
  .social-link:hover { border-color: var(--blue-light); color: var(--blue-light); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .hero-left > * { animation: fadeUp 0.7s ease both; }
  .hero-left > *:nth-child(1) { animation-delay: 0.1s; }
  .hero-left > *:nth-child(2) { animation-delay: 0.2s; }
  .hero-left > *:nth-child(3) { animation-delay: 0.3s; }
  .hero-left > *:nth-child(4) { animation-delay: 0.4s; }
  .hero-left > *:nth-child(5) { animation-delay: 0.5s; }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; } .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; } .hero-right { display: none; }
    .hero-left { padding: 5rem 2rem 3rem; }
    .cursos { padding: 5rem 2rem; } .cursos-grid { grid-template-columns: 1fr; }
    .sobre { grid-template-columns: 1fr; padding: 5rem 2rem; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; } .footer { padding: 3rem 2rem 2rem; }
    .section-header { flex-direction: column; gap: 1rem; } .section-subtitle { text-align: left; }
  }
`;

const IconoWeb = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const IconoExcel = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconoDiseño = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/>
  </svg>
);
const IconoMarketing = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconoIA = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1" fill="#1a5fa8"/><circle cx="15" cy="13" r="1" fill="#1a5fa8"/><path d="M9 17c1 1 5 1 6 0"/>
  </svg>
);
const IconoApp = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a5fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const cursos = [
  { icono: <IconoWeb />, nivel: "Principiante", titulo: "Word desde Cero", desc: "Aprende a crear y dar formato a documentos profesionales paso a paso. Verás: formato de texto, tablas, imágenes, encabezados, cartas y documentos formales.", instructor: "Leonel Martínez" },
  { icono: <IconoExcel />, nivel: "Avanzado", titulo: "Excel y Análisis de Datos", desc: "Domina Excel avanzado, tablas dinámicas y visualización de datos para tu empresa.", instructor: "Susana Morales" },
  { icono: <IconoDiseño />, nivel: "Principiante", titulo: "PowerPoint desde Cero", desc: "Crea presentaciones claras y profesionales. Verás: diseño de diapositivas, animaciones, transiciones e inserción de multimedia.", instructor: "Susana Morales" },
  { icono: <IconoMarketing />, nivel: "Principiante", titulo: "Administración y Finanzas", desc: "Aprende a gestionar recursos y tomar decisiones financieras básicas. Verás: administración empresarial, presupuestos, ingresos, egresos y control financiero.", instructor: "Leonel Martínez" },
  { icono: <IconoIA />, nivel: "Principiante", titulo: "Introducción a Lengua de Señas", desc: "Comunícate de manera inclusiva y efectiva. Verás: alfabeto, saludos, frases básicas y vocabulario cotidiano.", instructor: "Hugo Moreno" },
  { icono: <IconoApp />, nivel: "Avanzado", titulo: "Marketing Digital", desc: "Impulsa marcas y proyectos en el mundo digital. Verás: redes sociales, estrategias básicas, contenido y publicidad digital.", instructor: "Alexis Alfano" }
];

export default function Landing() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setProgress(72), 500); }, []);

  return (
    <>
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo"><img src="logo.png" alt="Crece Online" /></div>
        <ul className="nav-links">
          <li><a href="#cursos">Cursos</a></li>
          <li><a href="#sobre">Nosotros</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <button className="nav-cta" onClick={() => navigate('/login')}>Iniciar Sesión →</button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Plataforma de aprendizaje en línea</div>
          <h1 className="hero-title">Aprende.<br /><em>Crece.</em><br />Transforma.</h1>
          <p className="hero-subtitle">Cursos diseñados por expertos para que desarrolles habilidades reales y avances en tu carrera profesional a tu propio ritmo.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>Comenzar ahora →</button>
            <button className="btn-secondary" onClick={() => document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' })}>Ver cursos</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">4</div><div className="stat-label">Estudiantes activos</div></div>
            <div><div className="stat-num">6</div><div className="stat-label">Cursos disponibles</div></div>
            <div><div className="stat-num">98%</div><div className="stat-label">Satisfacción</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-box">
            <div className="hero-card">
              <div className="card-icon" style={{ width: 10, height: 10, background: 'var(--blue-light)', marginBottom: '1.2rem' }}></div>
              <div className="card-title">Tu progreso esta semana</div>
              <div className="card-desc">Desarrollo Web desde Cero — Módulo 4 de 7</div>
              <div className="card-progress">
                <div className="progress-label"><span>Progreso general</span><span>{progress}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
              </div>
              <div className="floating-badge">
                <div className="badge-num" style={{ width: 8, height: 8, background: 'var(--blue-pale)', marginBottom: '0.4rem' }}></div>
                <div className="badge-text">Racha de 7 días</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cursos" id="cursos">
        <div className="section-header">
          <div><div className="section-tag">Catálogo</div><h2 className="section-title">Cursos destacados</h2></div>
          <p className="section-subtitle">Aprende con instructores expertos en áreas que importan hoy</p>
        </div>
        <div className="cursos-grid">
          {cursos.map((curso, i) => (
            <div className="curso-card" key={i}>
              <div className="curso-icono">{curso.icono}</div>
              <div className="curso-nivel">{curso.nivel}</div>
              <div className="curso-titulo">{curso.titulo}</div>
              <div className="curso-desc">{curso.desc}</div>
              <div className="curso-meta">
                <div className="curso-instructor">Por {curso.instructor}</div>
                <div className="curso-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sobre" id="sobre">
        <div className="sobre-left">
          <div className="section-tag">Sobre nosotros</div>
          <h2 className="section-title" style={{ color: 'white' }}>Educación que<br />transforma vidas</h2>
          <p className="sobre-text">Crece Online nació con una misión clara: hacer que el aprendizaje profesional sea accesible, práctico y efectivo para todos en México y América Latina. Cada curso está diseñado para que aprendas haciendo.</p>
          <div className="sobre-values">
            {[
              { text: "Contenido práctico con proyectos reales" },
              { text: "Aprende a tu ritmo, sin horarios fijos" },
              { text: "Comunidad activa de estudiantes y mentores" },
              { text: "Certificados reconocidos por empresas" }
            ].map((v, i) => (
              <div className="value-item" key={i}>
                <span style={{ width: 6, height: 6, background: 'var(--blue-light)', display: 'inline-block', flexShrink: 0 }}></span>
                <span className="value-text">{v.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sobre-right">
          {[
            { num: "2,4", suffix: "K+", label: "Estudiantes activos" },
            { num: "48", suffix: "", label: "Cursos disponibles" },
            { num: "96", suffix: "%", label: "Tasa de satisfacción" },
            { num: "3", suffix: " años", label: "De experiencia" }
          ].map((m, i) => (
            <div className="metric-box" key={i}>
              <div className="metric-num">{m.num}<span>{m.suffix}</span></div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-logo"><img src="/logo.png" alt="Crece Online" /></div>
            <p className="footer-desc">La plataforma de aprendizaje en línea diseñada para profesionales que quieren crecer sin límites.</p>
          </div>
          <div>
            <div className="footer-col-title">Plataforma</div>
            <ul className="footer-links">
              <li><a href="#">Cursos</a></li><li><a href="#">Instructores</a></li>
              <li><a href="#">Certificados</a></li><li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Empresa</div>
            <ul className="footer-links">
              <li><a href="#">Sobre nosotros</a></li><li><a href="#">Carreras</a></li>
              <li><a href="#">Prensa</a></li><li><a href="#">Contacto</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Privacidad</a></li><li><a href="#">Términos</a></li><li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Crece Online / UTSC / Desarrollo Web Integral. Todos los derechos reservados.</div>
          <div className="social-links">
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">in</a>
            <a href="#" className="social-link">▶</a>
            <a href="#" className="social-link">◎</a>
          </div>
        </div>
      </footer>
    </>
  );
}