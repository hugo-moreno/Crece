import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams(); // Extrae el código secreto de la URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de seguridad (Misma que en el registro)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
    if (password.length < 13 || password.length > 15) {
        return setMensaje({ texto: "La contraseña debe tener entre 13 y 15 caracteres.", tipo: "error" });
    }
    if (!regex.test(password)) {
        return setMensaje({ texto: "Debe incluir mayúsculas, minúsculas y un carácter especial.", tipo: "error" });
    }
    if (password !== confirmPassword) {
      return setMensaje({ texto: "Las contraseñas no coinciden.", tipo: "error" });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setMensaje({ texto: "¡Contraseña actualizada! Redirigiendo al login...", tipo: "success" });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMensaje({ texto: data.message || "El enlace es inválido o expiró.", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error al conectar con el servidor.", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src="/logo2.png" alt="Logo" style={{ height: '50px', marginBottom: '20px' }} />
        <h2 style={titleStyle}>Nueva Contraseña</h2>
        <p style={subtitleStyle}>Crea una contraseña segura para volver a entrar a tu cuenta.</p>
        
        {mensaje.texto && (
          <div style={{ ...alertStyle, backgroundColor: mensaje.tipo === "success" ? "#d4edda" : "#f8d7da", color: mensaje.tipo === "success" ? "#155724" : "#721c24" }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>NUEVA CONTRASEÑA</label>
            <input 
              type="password" 
              placeholder="Mínimo 13 caracteres" 
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>CONFIRMAR CONTRASEÑA</label>
            <input 
              type="password" 
              placeholder="Repite tu contraseña" 
              style={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contraseña →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos (Mantenemos la misma estética que ForgotPassword)
const containerStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0d2a4a', fontFamily: 'DM Sans, sans-serif' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const titleStyle = { color: '#0d2a4a', fontSize: '24px', marginBottom: '10px' };
const subtitleStyle = { fontSize: '14px', color: '#666', marginBottom: '25px', lineHeight: '1.5' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#888', marginBottom: '8px', display: 'block' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' };
const btnStyle = { padding: '12px', background: '#0d2a4a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const alertStyle = { padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' };