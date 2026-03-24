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
import Opiniones from './pages/Opiniones/Opiniones'

// --- NUEVAS IMPORTACIONES DE RECUPERACIÓN ---
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// --- Protección de Rutas para Alumnos (User) ---
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// --- Protección de Rutas para Gestión (Admin y Staff) ---
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase();
  
  if (!token) return <Navigate to="/login" replace />;
  
  const hasAccess = role === 'admin' || role === 'staff';
  
  if (!hasAccess) {
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
        
        {/* RUTAS DE RECUPERACIÓN (PÚBLICAS) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Ruta para reseñas */}
        <Route path="/opinar" element={<Opiniones />} />
        
        {/* Rutas Protegidas para Alumnos */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Ruta dinámica para los cursos (ID) */}
        <Route path="/curso/:id" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
        
        <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/resultado/:id" element={<PrivateRoute><Resultado /></PrivateRoute>} />
        <Route path="/certificado/:id" element={<PrivateRoute><Certificado /></PrivateRoute>} />
        
        {/* Rutas de Gestión: Hugo (Staff) y Virginia (Admin) */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;