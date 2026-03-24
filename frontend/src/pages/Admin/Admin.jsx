import { useState, useEffect } from 'react';
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
  .anav-right { display: flex; align-items: center; gap: 1.5rem; }
  .anav-avatar { width: 32px; height: 32px; background: var(--blue-dark); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; }
  .anav-name { font-size: 0.85rem; color: var(--gray-500); text-transform: capitalize; }
  .anav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; transition: all 0.2s; }
  .anav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 57px); }
  .admin-sidebar { background: var(--blue-dark); padding: 1.5rem 0; }
  .admin-nav-section { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 0.8rem 1.5rem 0.3rem; margin-top: 0.5rem; }
  .admin-nav-item { display: flex; align-items: center; gap: 0.8rem; padding: 0.75rem 1.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.55); cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
  .admin-nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
  .admin-nav-item.active { background: rgba(59,158,232,0.12); color: white; border-left-color: var(--blue-light); }

  .admin-main { background: var(--gray-100); padding: 2.5rem; overflow-y: auto; }
  .admin-page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--blue-dark); margin-bottom: 2rem; }
  
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5px; background: var(--gray-300); margin-bottom: 2rem; }
  .stat-box { background: white; padding: 1.2rem 1.5rem; }
  .stat-box-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--blue-dark); }
  .stat-box-label { font-size: 0.72rem; color: var(--gray-500); text-transform: uppercase; }

  .table-wrap { background: white; border: 1px solid var(--gray-300); }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--gray-100); padding: 0.7rem 1.5rem; text-align: left; font-size: 0.72rem; color: var(--gray-500); border-bottom: 1px solid var(--gray-300); text-transform: uppercase; }
  td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--gray-300); font-size: 0.85rem; }

  .role-badge { display: inline-block; padding: 0.2rem 0.7rem; font-size: 0.68rem; font-weight: 600; text-transform: uppercase; border-radius: 4px; }
  .badge-admin { background: var(--blue-dark); color: white; }
  .badge-staff { background: var(--blue-mist); color: var(--blue-mid); border: 1px solid var(--blue-pale); }
  .badge-user { background: var(--gray-100); color: var(--gray-500); border: 1px solid var(--gray-300); }
  
  .btn-action { border: none; background: none; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: color 0.2s; }
  .btn-edit { color: var(--blue-mid); margin-right: 1rem; }
  .btn-delete { color: #ef4444; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(13, 42, 74, 0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal-content { background: white; width: 100%; max-width: 500px; padding: 2.5rem; position: relative; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--blue-dark); margin-bottom: 1.5rem; }
  .modal-group { margin-bottom: 1.2rem; }
  .modal-label { display: block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--gray-500); margin-bottom: 0.5rem; }
  .modal-input { width: 100%; padding: 0.8rem; border: 1px solid var(--gray-300); font-family: 'DM Sans', sans-serif; outline: none; }
  .modal-input:focus { border-color: var(--blue-light); }
  .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
  .btn-save { flex: 1; background: var(--blue-dark); color: white; border: none; padding: 1rem; cursor: pointer; font-weight: 600; }
  .btn-cancel { flex: 1; background: var(--gray-100); color: var(--gray-500); border: 1px solid var(--gray-300); padding: 1rem; cursor: pointer; font-weight: 600; }
`;

function getInitials(name) {
  if (!name) return 'A';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
}

export default function Admin() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('dashboard');
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [stats, setStats] = useState({ totalCertificados: 0 });
  
  // Estados para el Modal (Crear y Editar)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formCurso, setFormCurso] = useState({
    titulo: '', instructor: '', nivel: 'Principiante', videos: 0, descripcion: ''
  });

  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
  const userRole = localStorage.getItem('role');
  const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";

  const fetchData = async () => {
    try {
      const resUsers = await fetch(`${API_URL}/api/auth/users`);
      const dataUsers = await resUsers.json();
      setUsuarios(dataUsers);

      const resCourses = await fetch(`${API_URL}/api/courses`);
      const dataCourses = await resCourses.json();
      setCursos(dataCourses.data || []);

      const totalCertificados = dataUsers.reduce((acc, u) => acc + (u.completados || 0), 0);
      setStats({ totalCertificados });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    if (userRole !== 'Admin' && userRole !== 'Staff') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [navigate, userRole]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // --- FUNCIONES DE CURSOS ---

  const openCreateModal = () => {
    setIsEditing(false);
    setFormCurso({ titulo: '', instructor: '', nivel: 'Principiante', videos: 0, descripcion: '' });
    setShowModal(true);
  };

  const openEditModal = (curso) => {
    setIsEditing(true);
    setCurrentId(curso.id);
    setFormCurso({
      titulo: curso.titulo,
      instructor: curso.instructor,
      nivel: curso.nivel,
      videos: curso.videos,
      descripcion: curso.descripcion || ''
    });
    setShowModal(true);
  };

  const handleSaveCurso = async () => {
    if(!formCurso.titulo || !formCurso.instructor) return alert("Llena los campos obligatorios");
    setLoading(true);
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/api/courses/${currentId}` : `${API_URL}/api/courses`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formCurso)
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      alert("Error en la operación");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCurso = async (id) => {
    if(!window.confirm("¿Seguro que quieres eliminar este curso? Esta acción no se puede deshacer.")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Error al eliminar. Revisa los permisos del backend.");
      }
    } catch (error) {
      console.error("Error eliminando curso:", error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="anav">
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
           <img src="/logo3.png" alt="Crece Online" style={{ height: '44px' }} />
        </div>
        <div className="anav-right">
          <div className="anav-avatar">{getInitials(usuarioLocal.nombre)}</div>
          <span className="anav-name">{usuarioLocal.nombre}</span>
          <button className="anav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <div className="admin-nav-section">General</div>
          <div className={`admin-nav-item ${seccion === 'dashboard' ? 'active' : ''}`} onClick={() => setSeccion('dashboard')}>Dashboard</div>
          <div className={`admin-nav-item ${seccion === 'cursos' ? 'active' : ''}`} onClick={() => setSeccion('cursos')}>Gestión de Cursos</div>
          
          {userRole === 'Admin' && (
            <>
              <div className="admin-nav-section">Usuarios</div>
              <div className={`admin-nav-item ${seccion === 'usuarios' ? 'active' : ''}`} onClick={() => setSeccion('usuarios')}>Todos los usuarios</div>
            </>
          )}
        </div>

        <div className="admin-main">
          <div className="admin-page-title">
            {seccion === 'dashboard' && `Panel de ${userRole}`}
            {seccion === 'cursos' && 'Gestión de Contenidos'}
            {seccion === 'usuarios' && 'Control de Usuarios'}
          </div>

          {seccion === 'dashboard' && (
            <div className="stats-row">
              <div className="stat-box"><div className="stat-box-num">{cursos.length}</div><div className="stat-box-label">Cursos</div></div>
              <div className="stat-box"><div className="stat-box-num">{usuarios.length}</div><div className="stat-box-label">Usuarios</div></div>
              <div className="stat-box"><div className="stat-box-num">{stats.totalCertificados}</div><div className="stat-box-label">Certificados</div></div>
              <div className="stat-box"><div className="stat-box-num">100%</div><div className="stat-box-label">Online</div></div>
            </div>
          )}

          {seccion === 'cursos' && (
            <div className="table-wrap">
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--gray-500)' }}>CATÁLOGO VIGENTE</span>
                <button 
                  style={{ background: 'var(--blue-dark)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: '600' }}
                  onClick={openCreateModal}
                >
                  + NUEVO CURSO
                </button>
              </div>
              <table>
                <thead>
                  <tr><th>Título</th><th>Instructor</th><th>Nivel</th><th>Videos</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {cursos.map(c => (
                    <tr key={c.id}>
                      <td style={{fontWeight: '600'}}>{c.titulo}</td>
                      <td>{c.instructor}</td>
                      <td><span className="role-badge badge-user">{c.nivel}</span></td>
                      <td>{c.videos} lecciones</td>
                      <td>
                        <button className="btn-action btn-edit" onClick={() => openEditModal(c)}>Editar</button>
                        <button className="btn-action btn-delete" onClick={() => handleDeleteCurso(c.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {seccion === 'usuarios' && userRole === 'Admin' && (
            <div className="table-wrap">
              <div style={{ padding: '1.5rem' }}><span style={{ fontWeight: '600' }}>LISTADO DE ALUMNOS</span></div>
              <table>
                <thead>
                  <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Certificados</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre_completo}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge badge-${u.role?.toLowerCase()}`}>{u.role}</span></td>
                      <td style={{textAlign: 'center'}}>{u.completados || 0}</td>
                      <td><button className="btn-action btn-delete">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Unificado */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{isEditing ? 'Editar Curso' : 'Nuevo Curso'}</h3>
            
            <div className="modal-group">
              <label className="modal-label">Título</label>
              <input className="modal-input" value={formCurso.titulo} onChange={e => setFormCurso({...formCurso, titulo: e.target.value})} />
            </div>

            <div className="modal-group">
              <label className="modal-label">Instructor</label>
              <input className="modal-input" value={formCurso.instructor} onChange={e => setFormCurso({...formCurso, instructor: e.target.value})} />
            </div>

            <div className="modal-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
              <div>
                <label className="modal-label">Nivel</label>
                <select className="modal-input" value={formCurso.nivel} onChange={e => setFormCurso({...formCurso, nivel: e.target.value})}>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="modal-label">Videos</label>
                <input type="number" className="modal-input" value={formCurso.videos} onChange={e => setFormCurso({...formCurso, videos: e.target.value})} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveCurso} disabled={loading}>
                {loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Crear Curso')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}