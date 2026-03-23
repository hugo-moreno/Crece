import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f8f9fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--gray-800); }

  .anav { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 3rem; background: white; border-bottom: 1px solid var(--gray-300); position: sticky; top: 0; z-index: 50; }
  .anav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .anav-brand span { color: var(--blue-light); }
  .anav-right { display: flex; align-items: center; gap: 1.5rem; }
  .anav-avatar { width: 32px; height: 32px; background: var(--blue-mist); border: 1.5px solid var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; color: var(--blue-mid); }
  .anav-name { font-size: 0.85rem; color: var(--gray-500); }
  .anav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .anav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 57px); }

  .admin-sidebar { background: var(--blue-dark); padding: 1.5rem 0; }
  .admin-nav-section { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 0.8rem 1.5rem 0.3rem; margin-top: 0.5rem; }
  .admin-nav-item { display: flex; align-items: center; gap: 0.8rem; padding: 0.75rem 1.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.55); cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
  .admin-nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
  .admin-nav-item.active { background: rgba(59,158,232,0.12); color: white; border-left-color: var(--blue-light); }
  .admin-dot { width: 5px; height: 5px; background: currentColor; opacity: 0.5; flex-shrink: 0; }
  .admin-nav-item.active .admin-dot { opacity: 1; background: var(--blue-light); }

  .admin-main { background: var(--gray-100); padding: 2.5rem; overflow-y: auto; }
  .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
  .admin-page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--blue-dark); }
  .admin-page-sub { font-size: 0.82rem; color: var(--gray-500); margin-top: 0.2rem; }

  .btn-add { background: var(--blue-dark); color: white; border: none; padding: 0.65rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s; }
  .btn-add:hover { background: var(--blue-mid); }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5px; background: var(--gray-300); margin-bottom: 2rem; }
  .stat-box { background: white; padding: 1.2rem 1.5rem; }
  .stat-box-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--blue-dark); }
  .stat-box-label { font-size: 0.72rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.2rem; }

  .table-wrap { background: white; margin-bottom: 2rem; }
  .table-head { padding: 1rem 1.5rem; border-bottom: 1px solid var(--gray-300); display: flex; justify-content: space-between; align-items: center; }
  .table-head-title { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-500); }
  .table-search { border: 1px solid var(--gray-300); padding: 0.4rem 0.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--gray-800); width: 200px; outline: none; }
  .table-search:focus { border-color: var(--blue-mid); }

  table { width: 100%; border-collapse: collapse; }
  th { background: var(--gray-100); padding: 0.7rem 1.5rem; text-align: left; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-500); border-bottom: 1px solid var(--gray-300); }
  td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--gray-300); font-size: 0.85rem; color: var(--gray-800); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--blue-mist); }

  .role-badge { display: inline-block; padding: 0.2rem 0.7rem; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .badge-admin { background: var(--blue-dark); color: white; }
  .badge-staff { background: var(--blue-mist); color: var(--blue-mid); border: 1px solid var(--blue-pale); }
  .badge-user, .badge-alumno { background: var(--gray-100); color: var(--gray-500); border: 1px solid var(--gray-300); }
  .badge-avanzado { background: var(--blue-mid); color: white; }
  .badge-principiante { background: var(--blue-mist); color: var(--blue-mid); border: 1px solid var(--blue-pale); }

  .video-count { background: var(--blue-mist); border: 1px solid var(--blue-pale); color: var(--blue-mid); font-size: 0.72rem; padding: 0.15rem 0.5rem; }
  .course-cell { display: flex; align-items: center; gap: 0.8rem; }
  .course-thumb { width: 40px; height: 28px; background: var(--blue-mist); border: 1px solid var(--blue-pale); flex-shrink: 0; }

  .action-btn { border: none; background: none; cursor: pointer; padding: 0.3rem 0.6rem; font-size: 0.78rem; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-edit { color: var(--blue-mid); }
  .btn-edit:hover { background: var(--blue-mist); }
  .btn-del { color: #ef4444; }
  .btn-del:hover { background: #fef2f2; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: white; width: 100%; max-width: 480px; animation: fadeUp 0.25s ease both; }
  .modal-header { background: var(--blue-dark); padding: 1.5rem 2rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: white; }
  .modal-body { padding: 1.5rem 2rem; }
  .modal-field { margin-bottom: 1.2rem; }
  .modal-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-500); display: block; margin-bottom: 0.4rem; }
  .modal-input { width: 100%; border: 1.5px solid var(--gray-300); padding: 0.65rem 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--gray-800); outline: none; transition: border-color 0.2s; }
  .modal-input:focus { border-color: var(--blue-mid); }
  .modal-select { width: 100%; border: 1.5px solid var(--gray-300); padding: 0.65rem 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--gray-800); background: white; outline: none; }
  .modal-footer { display: flex; gap: 0.8rem; padding: 0 2rem 1.5rem; }
  .modal-btn-confirm { background: var(--blue-dark); color: white; border: none; padding: 0.75rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; flex: 1; transition: background 0.2s; }
  .modal-btn-confirm:hover { background: var(--blue-mid); }
  .modal-btn-cancel { background: none; border: 1px solid var(--gray-300); color: var(--gray-500); padding: 0.75rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer; flex: 1; }
  .modal-btn-del { background: #ef4444; color: white; border: none; padding: 0.75rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; flex: 1; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 900px) { .admin-layout { grid-template-columns: 1fr; } .admin-sidebar { display: none; } .admin-main { padding: 1.5rem; } .stats-row { grid-template-columns: repeat(2, 1fr); } .anav { padding: 0.9rem 1.5rem; } }
`;

const CURSOS_INICIAL = [
  { id: 1, titulo: 'Word desde Cero', instructor: 'Leonel Martínez', nivel: 'Principiante', videos: 3 },
  { id: 2, titulo: 'Excel y Análisis de Datos', instructor: 'Susana Morales', nivel: 'Avanzado', videos: 3 },
  { id: 3, titulo: 'PowerPoint desde Cero', instructor: 'Susana Morales', nivel: 'Principiante', videos: 3 },
  { id: 4, titulo: 'Administración y Finanzas', instructor: 'Leonel Martínez', nivel: 'Principiante', videos: 3 },
  { id: 5, titulo: 'Introducción a Lengua de Señas', instructor: 'Hugo Moreno', nivel: 'Principiante', videos: 3 },
  { id: 6, titulo: 'Marketing Digital', instructor: 'Alexis Alfano', nivel: 'Avanzado', videos: 3 },
];

const USUARIOS_INICIAL = [
  { id: 1, nombre: 'Hugo David Moreno Llamas', correo: 'hugo@ejemplo.com', rol: 'admin', completados: 1 },
  { id: 2, nombre: 'Leonel Martínez', correo: 'leonel@ejemplo.com', rol: 'staff', completados: 0 },
  { id: 3, nombre: 'Susana Morales', correo: 'susana@ejemplo.com', rol: 'staff', completados: 2 },
  { id: 4, nombre: 'Alexis Alfano', correo: 'alexis@ejemplo.com', rol: 'alumno', completados: 0 },
];

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function Admin() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('dashboard');
  const [cursos, setCursos] = useState(CURSOS_INICIAL);
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAL);
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Admin"}');

  function handleLogout() { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/'); }

  function abrirNuevoCurso() { setForm({ titulo: '', instructor: '', nivel: 'Principiante', videos: 3 }); setModal({ tipo: 'nuevo-curso' }); }
  function abrirEditarCurso(curso) { setForm({ ...curso }); setModal({ tipo: 'editar-curso' }); }
  function confirmarNuevoCurso() { setCursos([...cursos, { ...form, id: Date.now(), videos: Number(form.videos) }]); setModal(null); }
  function confirmarEditarCurso() { setCursos(cursos.map(c => c.id === form.id ? { ...form, videos: Number(form.videos) } : c)); setModal(null); }
  function confirmarEliminarCurso() { setCursos(cursos.filter(c => c.id !== modal.datos.id)); setModal(null); }
  function confirmarEliminarUsuario() { setUsuarios(usuarios.filter(u => u.id !== modal.datos.id)); setModal(null); }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );
  const certificadosEmitidos = usuarios.reduce((acc, u) => acc + u.completados, 0);

  return (
    <>
      <style>{styles}</style>
      <nav className="anav">
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <img src="/logo3.png" alt="Crece Online" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div className="anav-right">
          <div className="anav-avatar">{getInitials(usuario.nombre)}</div>
          <span className="anav-name">{usuario.nombre}</span>
          <button className="anav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <div className="admin-nav-section">General</div>
          {['dashboard', 'cursos'].map(s => (
            <div key={s} className={`admin-nav-item ${seccion === s ? 'active' : ''}`} onClick={() => setSeccion(s)}>
              <div className="admin-dot"></div>{s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
          <div className="admin-nav-section">Usuarios</div>
          <div className={`admin-nav-item ${seccion === 'usuarios' ? 'active' : ''}`} onClick={() => setSeccion('usuarios')}>
            <div className="admin-dot"></div>Todos los usuarios
          </div>
        </div>

        <div className="admin-main">
          <div className="admin-page-header">
            <div>
              <div className="admin-page-title">
                {seccion === 'dashboard' && 'Panel de administración'}
                {seccion === 'cursos' && 'Cursos'}
                {seccion === 'usuarios' && 'Usuarios registrados'}
              </div>
              <div className="admin-page-sub">Crece Online · UTSC</div>
            </div>
            {seccion === 'cursos' && (
              <button className="btn-add" onClick={abrirNuevoCurso}><span style={{ fontSize: '1.1rem' }}>+</span> Nuevo curso</button>
            )}
          </div>

          {(seccion === 'dashboard' || seccion === 'cursos') && (
            <>
              {seccion === 'dashboard' && (
                <div className="stats-row">
                  <div className="stat-box"><div className="stat-box-num">{cursos.length}</div><div className="stat-box-label">Cursos activos</div></div>
                  <div className="stat-box"><div className="stat-box-num">{usuarios.length}</div><div className="stat-box-label">Usuarios</div></div>
                  <div className="stat-box"><div className="stat-box-num">{certificadosEmitidos}</div><div className="stat-box-label">Certificados</div></div>
                  <div className="stat-box"><div className="stat-box-num">80%</div><div className="stat-box-label">Aprobación</div></div>
                </div>
              )}
              <div className="table-wrap">
                <div className="table-head"><div className="table-head-title">Cursos ({cursos.length})</div></div>
                <table>
                  <thead><tr><th>Curso</th><th>Instructor</th><th>Nivel</th><th>Videos</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {cursos.map(c => (
                      <tr key={c.id}>
                        <td><div className="course-cell"><div className="course-thumb"></div>{c.titulo}</div></td>
                        <td>{c.instructor}</td>
                        <td><span className={`role-badge badge-${c.nivel.toLowerCase()}`}>{c.nivel}</span></td>
                        <td><span className="video-count">{c.videos} videos</span></td>
                        <td>
                          <button className="action-btn btn-edit" onClick={() => abrirEditarCurso(c)}>Editar</button>
                          <button className="action-btn btn-del" onClick={() => setModal({ tipo: 'eliminar-curso', datos: c })}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {seccion === 'usuarios' && (
            <div className="table-wrap">
              <div className="table-head">
                <div className="table-head-title">Usuarios ({usuariosFiltrados.length})</div>
                <input className="table-search" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table>
                <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Completados</th><th>Acciones</th></tr></thead>
                <tbody>
                  {usuariosFiltrados.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td><td>{u.correo}</td>
                      <td><span className={`role-badge badge-${u.rol}`}>{u.rol}</span></td>
                      <td>{u.completados}</td>
                      <td><button className="action-btn btn-del" onClick={() => setModal({ tipo: 'eliminar-usuario', datos: u })}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal?.tipo === 'nuevo-curso' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Nuevo curso</div></div>
            <div className="modal-body">
              <div className="modal-field"><label className="modal-label">Título</label><input className="modal-input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Excel Avanzado" /></div>
              <div className="modal-field"><label className="modal-label">Instructor</label><input className="modal-input" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="Nombre del instructor" /></div>
              <div className="modal-field"><label className="modal-label">Nivel</label><select className="modal-select" value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}><option>Principiante</option><option>Avanzado</option></select></div>
            </div>
            <div className="modal-footer"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancelar</button><button className="modal-btn-confirm" onClick={confirmarNuevoCurso}>Crear curso</button></div>
          </div>
        </div>
      )}

      {modal?.tipo === 'editar-curso' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Editar curso</div></div>
            <div className="modal-body">
              <div className="modal-field"><label className="modal-label">Título</label><input className="modal-input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
              <div className="modal-field"><label className="modal-label">Instructor</label><input className="modal-input" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} /></div>
              <div className="modal-field"><label className="modal-label">Nivel</label><select className="modal-select" value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}><option>Principiante</option><option>Avanzado</option></select></div>
            </div>
            <div className="modal-footer"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancelar</button><button className="modal-btn-confirm" onClick={confirmarEditarCurso}>Guardar cambios</button></div>
          </div>
        </div>
      )}

      {modal?.tipo === 'eliminar-curso' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">¿Eliminar curso?</div></div>
            <div className="modal-body"><p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>Vas a eliminar <strong style={{ color: 'var(--blue-dark)' }}>{modal.datos.titulo}</strong>. Esta acción no se puede deshacer.</p></div>
            <div className="modal-footer"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancelar</button><button className="modal-btn-del" onClick={confirmarEliminarCurso}>Eliminar</button></div>
          </div>
        </div>
      )}

      {modal?.tipo === 'eliminar-usuario' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">¿Eliminar usuario?</div></div>
            <div className="modal-body"><p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>Vas a eliminar a <strong style={{ color: 'var(--blue-dark)' }}>{modal.datos.nombre}</strong>. Esta acción no se puede deshacer.</p></div>
            <div className="modal-footer"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancelar</button><button className="modal-btn-del" onClick={confirmarEliminarUsuario}>Eliminar</button></div>
          </div>
        </div>
      )}
    </>
  );
}