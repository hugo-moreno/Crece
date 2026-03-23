import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import CoursePlayer from './pages/CoursePlayer/CoursePlayer'
import Quiz from './pages/Quiz/Quiz'
import Resultado from './pages/Resultado/Resultado'
import Certificado from './pages/Certificado/Certificado'
import Admin from './pages/Admin/Admin'
import Opiniones from './pages/Opiniones/Opiniones' // <-- Importante: Importar la nueva página

// --- Protección de Rutas para Usuarios ---
function PrivateRoute({ children }) {
  // Verificamos si existe el token en el storage
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Si no hay token, lo mandamos al login y limpiamos por si acaso
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// --- Protección de Rutas para Admin ---
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  
  if (!token) return <Navigate to="/login" replace />;
  
  // Validamos que sea admin (ignorando mayúsculas/minúsculas)
  if (role.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Nueva Ruta para que tus compas escriban reseñas */}
        <Route path="/opinar" element={<Opiniones />} />
        
        {/* Rutas Protegidas (Requieren Login) */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Ruta dinámica para los cursos (ID) */}
        <Route path="/curso/:id" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
        
        <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/resultado/:id" element={<PrivateRoute><Resultado /></PrivateRoute>} />
        <Route path="/certificado/:id" element={<PrivateRoute><Certificado /></PrivateRoute>} />
        
        {/* Rutas Especiales */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;