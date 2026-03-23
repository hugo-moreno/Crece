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

// --- MEJORA AQUÍ ---
function PrivateRoute({ children }) {
  // Verificamos el token directamente del storage
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Si no hay token, lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  
  if (!token) return <Navigate to="/login" replace />;
  if (role.toLowerCase() !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/curso/:id" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/resultado/:id" element={<PrivateRoute><Resultado /></PrivateRoute>} />
        <Route path="/certificado/:id" element={<PrivateRoute><Certificado /></PrivateRoute>} />
        
        {/* Ruta Admin */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App