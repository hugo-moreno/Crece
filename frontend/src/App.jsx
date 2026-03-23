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

// Protección para usuarios logueados
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Protección para el Administrador (Corregida para tu DB)
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  // Ajuste: Buscamos 'role' que es lo que guardamos en tu Login
  const role = localStorage.getItem('role') || ''; 
  
  if (!token) return <Navigate to="/login" replace />;
  
  // Verificamos si es Admin (ignorando mayúsculas/minúsculas)
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
        
        {/* Rutas Protegidas (Solo Alumnos) */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/curso/:id" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/resultado/:id" element={<PrivateRoute><Resultado /></PrivateRoute>} />
        <Route path="/certificado/:id" element={<PrivateRoute><Certificado /></PrivateRoute>} />
        
        {/* Ruta de Administración */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
        {/* Redirección por si escriben cualquier otra cosa */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App