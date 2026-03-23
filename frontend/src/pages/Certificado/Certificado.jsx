import { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f8f9fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }

  .cnav { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 3rem; background: white; border-bottom: 1px solid var(--gray-300); position: sticky; top: 0; z-index: 50; }
  .cnav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .cnav-brand span { color: var(--blue-light); }
  .cnav-right { display: flex; align-items: center; gap: 1.5rem; }
  .cnav-avatar { width: 32px; height: 32px; background: var(--blue-mist); border: 1.5px solid var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; color: var(--blue-mid); }
  .cnav-name { font-size: 0.85rem; color: var(--gray-500); }
  .cnav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .cnav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  .cert-page { min-height: calc(100vh - 57px); display: flex; flex-direction: column; align-items: center; padding: 3rem 1rem; gap: 1.5rem; }
  .cert-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  
  .cert-btn { background: var(--blue-dark); color: white; border: none; padding: 0.8rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
  .cert-btn:hover { background: var(--blue-mid); transform: translateY(-1px); }
  
  .cert-btn-success { background: #28a745; color: white; border: none; padding: 0.8rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .cert-btn-success:hover { background: #218838; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(40,167,69,0.2); }

  .cert-btn-out { background: none; border: 1.5px solid var(--blue-dark); color: var(--blue-dark); padding: 0.8rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .cert-btn-out:hover { background: var(--blue-mist); }

  .certificate { background: white; width: 780px; max-width: 100%; border: 1px solid var(--gray-300); position: relative; overflow: hidden; animation: fadeUp 0.4s ease both; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .cert-top-bar { background: var(--blue-dark); height: 8px; }
  .cert-inner { padding: 3.5rem 4rem; }

  .cert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-300); }
  .cert-id-box { text-align: right; font-size: 0.72rem; color: var(--gray-500); }
  .cert-id-box strong { display: block; font-family: monospace; color: var(--blue-dark); font-size: 0.8rem; margin-top: 0.2rem; }

  .cert-body { text-align: center; margin-bottom: 3rem; }
  .cert-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.8rem; }
  .cert-recipient { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 300; color: var(--blue-dark); letter-spacing: -0.02em; line-height: 1; margin-bottom: 1rem; }
  .cert-text { font-size: 0.9rem; color: var(--gray-500); line-height: 1.7; margin-bottom: 1rem; }
  .cert-course { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--blue-dark); }
  .cert-score { display: inline-block; background: var(--blue-mist); border: 1px solid var(--blue-pale); color: var(--blue-mid); font-size: 0.78rem; font-weight: 600; padding: 0.3rem 1rem; letter-spacing: 0.05em; margin-top: 0.8rem; }

  .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 2rem; border-top: 1px solid var(--gray-300); }
  .cert-sig { text-align: center; }
  .cert-sig-line { width: 140px; height: 1px; background: var(--gray-300); margin-bottom: 0.5rem; }
  .cert-sig-name { font-size: 0.8rem; font-weight: 600; color: var(--blue-dark); }
  .cert-sig-role { font-size: 0.72rem; color: var(--gray-500); }
  .cert-date-box { text-align: right; font-size: 0.78rem; color: var(--gray-500); }
  .cert-date-box strong { display: block; color: var(--blue-dark); font-size: 0.85rem; margin-top: 0.2rem; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 820px) { .certificate { width: 100%; } .cert-inner { padding: 2rem 1.5rem; } .cert-recipient { font-size: 2rem; } }
`;

const INSTRUCTORES = { 1: 'Leonel Martínez', 2: 'Susana Morales', 3: 'Susana Morales', 4: 'Leonel Martínez', 5: 'Hugo Moreno', 6: 'Alexis Alfano' };

function generarId() { return 'CO-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000); }
function fechaHoy() { return new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); }
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function Certificado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { curso = 'Curso', correctas = 5, total = 5 } = location.state || {};
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Usuario"}');
  const nombre = usuario.nombre || 'Usuario';
  
  const [certId] = useState(generarId());
  const [fecha] = useState(fechaHoy());
  const instructor = INSTRUCTORES[Number(id)] || 'Instructor';

  // FUNCIÓN PARA GUARDAR PROGRESO EN BD
  const finalizarCurso = async () => {
  try {
    // 1. Extraemos el usuario y verificamos qué trae exactamente
    const storageUser = JSON.parse(localStorage.getItem("usuario") || "{}");
    
    // Intentamos obtener el ID de varias formas por si acaso
    const userId = storageUser.id || storageUser.usuarioId || storageUser.id_usuario;

    if (!userId) {
      console.error("No se encontró el ID del usuario en localStorage", storageUser);
      alert("Error de sesión: No se pudo identificar al usuario. Intenta cerrar sesión y volver a entrar.");
      return;
    }

    const API_URL = "https://respectful-manifestation-production-5441.up.railway.app"; 
    
    const response = await fetch(`${API_URL}/api/stats/finalizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: userId, // Ahora enviamos el userId verificado
        cursoId: id,
        calificacion: Math.round((correctas / total) * 100)
      })
    });

    if (response.ok) {
      alert("¡Felicidades! Tu progreso ha sido guardado exitosamente.");
      navigate('/dashboard');
    } else {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      alert("Error al guardar el progreso en el servidor.");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("No se pudo conectar con el servidor.");
  }
};

  const descargarPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const W = doc.internal.pageSize.getWidth();
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 216, 'F');
    doc.setFillColor(13, 42, 74); doc.rect(0, 0, W, 6, 'F');
    doc.setDrawColor(179, 216, 245); doc.setLineWidth(0.5); doc.rect(10, 10, W - 20, 196);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(13, 42, 74); doc.text('Crece', 20, 30);
    doc.setTextColor(59, 158, 232); doc.text('Online', 41, 30);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(138, 144, 153); doc.text('PLATAFORMA DE APRENDIZAJE EN LÍNEA', 20, 36);
    doc.setFontSize(7); doc.text(`ID: ${certId}`, W - 20, 30, { align: 'right' });
    doc.setDrawColor(212, 216, 222); doc.setLineWidth(0.3); doc.line(20, 42, W - 20, 42);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(59, 158, 232); doc.text('CERTIFICADO DE FINALIZACIÓN', W / 2, 58, { align: 'center' });
    doc.setFont('times', 'normal'); doc.setFontSize(36); doc.setTextColor(13, 42, 74); doc.text(nombre, W / 2, 78, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(138, 144, 153); doc.text('Ha completado satisfactoriamente el curso', W / 2, 90, { align: 'center' });
    doc.setFont('times', 'bold'); doc.setFontSize(22); doc.setTextColor(13, 42, 74); doc.text(curso, W / 2, 104, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(26, 95, 168); doc.text(`Calificación: ${correctas} / ${total} · ${Math.round((correctas / total) * 100)}%`, W / 2, 114, { align: 'center' });
    doc.setDrawColor(212, 216, 222); doc.setLineWidth(0.3); doc.line(20, 125, W - 20, 125);
    doc.line(30, 142, 100, 142);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(13, 42, 74); doc.text(instructor, 65, 148, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(138, 144, 153); doc.text('Instructor del curso', 65, 153, { align: 'center' });
    doc.line(W - 100, 142, W - 30, 142);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(13, 42, 74); doc.text('Crece Online', W - 65, 148, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(138, 144, 153); doc.text('UTSC — Desarrollo Web Integral', W - 65, 153, { align: 'center' });
    doc.setFontSize(8); doc.setTextColor(138, 144, 153); doc.text('Fecha de emisión', W / 2, 143, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setTextColor(13, 42, 74); doc.text(fecha, W / 2, 149, { align: 'center' });
    doc.save(`Certificado_${curso.replace(/ /g, '_')}_${nombre.split(' ')[0]}.pdf`);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <>
      <style>{styles}</style>
      <nav className="cnav">
        <div className="cnav-brand" onClick={() => navigate('/dashboard')}>Crece<span>Online</span></div>
        <div className="cnav-right">
          <div className="cnav-avatar">{getInitials(nombre)}</div>
          <span className="cnav-name">{nombre}</span>
          <button className="cnav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="cert-page">
        <div className="cert-actions">
          <button className="cert-btn" onClick={descargarPDF}>Descargar PDF →</button>
          
          {/* BOTÓN DE FINALIZAR Y GUARDAR */}
          <button className="cert-btn-success" onClick={finalizarCurso}>
            Finalizar y Guardar Curso ✓
          </button>
          
          <button className="cert-btn-out" onClick={() => navigate('/dashboard')}>Volver al dashboard</button>
        </div>

        <div className="certificate">
          <div className="cert-top-bar"></div>
          <div className="cert-inner">
            <div className="cert-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <img src="/logo2.png" alt="Crece Online" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                <div style={{ width: '1px', height: '40px', background: 'var(--gray-300)' }}></div>
                <img src="/utsc-logo.png" alt="UTSC" style={{ height: '40px', width: 'auto', objectFit: 'contain', opacity: 0.75 }} />
              </div>
              <div className="cert-id-box">ID de certificado<strong>{certId}</strong></div>
            </div>
            <div className="cert-body">
              <div className="cert-label">Certificado de finalización</div>
              <div className="cert-recipient">{nombre}</div>
              <div className="cert-text">Ha completado satisfactoriamente el curso</div>
              <div className="cert-course">{curso}</div>
              <div className="cert-score">Calificación: {correctas} / {total} · {Math.round((correctas / total) * 100)}%</div>
            </div>
            <div className="cert-footer">
              <div className="cert-sig"><div className="cert-sig-line"></div><div className="cert-sig-name">{instructor}</div><div className="cert-sig-role">Instructor del curso</div></div>
              <div className="cert-sig"><div className="cert-sig-line"></div><div className="cert-sig-name">Crece Online</div><div className="cert-sig-role">UTSC — Desarrollo Web Integral</div></div>
              <div className="cert-date-box">Fecha de emisión<strong>{fecha}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}