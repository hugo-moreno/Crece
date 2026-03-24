import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setMensaje({ texto: "¡Correo enviado! Revisa tu bandeja de entrada.", tipo: "success" });
      } else {
        setMensaje({ texto: data.message || "Error al enviar el correo.", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión con el servidor.", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src="/logo2.png" alt="Logo" style={{ height: '50px', marginBottom: '20px' }} />
        <h2 style={titleStyle}>Recuperar Contraseña</h2>
        <p style={subtitleStyle}>Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu cuenta.</p>
        
        {mensaje.texto && (
          <div style={{ ...alertStyle, backgroundColor: mensaje.tipo === "success" ? "#d4edda" : "#f8d7da", color: mensaje.tipo === "success" ? "#155724" : "#721c24" }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>CORREO ELECTRÓNICO</label>
            <input 
              type="email" 
              placeholder="tucorreo@ejemplo.com" 
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace →"}
          </button>
        </form>

        <button onClick={() => navigate("/login")} style={backBtnStyle}>
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}

// Estilos rápidos para mantener la estética
const containerStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0d2a4a', fontFamily: 'DM Sans, sans-serif' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const titleStyle = { color: '#0d2a4a', fontSize: '24px', marginBottom: '10px' };
const subtitleStyle = { fontSize: '14px', color: '#666', marginBottom: '25px', lineHeight: '1.5' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#888', marginBottom: '8px', display: 'block' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' };
const btnStyle = { padding: '12px', background: '#0d2a4a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const backBtnStyle = { marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' };
const alertStyle = { padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' };