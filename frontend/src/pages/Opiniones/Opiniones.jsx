import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Opiniones() {
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      // URL de tu backend en Railway
      const API_URL = "https://respectful-manifestation-production-5441.up.railway.app";
      const res = await fetch(`${API_URL}/api/resenas/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, texto }),
      });

      if (res.ok) {
        setEnviado(true);
        // Regresa a la landing tras 3 segundos para ver la reseña
        setTimeout(() => navigate("/"), 3000); 
      } else {
        alert("Hubo un problema al guardar tu opinión. Intenta de nuevo.");
      }
    } catch (err) {
      alert("Error de conexión con el servidor.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#0d2a4a", // Fondo azul oscuro de tu marca
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "3rem", 
        borderRadius: "12px", 
        width: "100%", 
        maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        position: "relative",
        animation: "fadeUp 0.5s ease both"
      }}>
        {/* Botón sutil para cerrar/volver */}
        <button 
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "none",
            border: "none",
            color: "#ccc",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "5px"
          }}
        >
          ✕
        </button>

        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "2.8rem", 
          color: "#0d2a4a",
          marginBottom: "10px",
          textAlign: "center",
          lineHeight: "1.1"
        }}>
          ¡Tu opinión cuenta!
        </h2>
        
        {enviado ? (
          <div style={{ 
            textAlign: "center", 
            padding: "2rem 0", 
            color: "#1a5fa8", 
            background: "#f0f6fc",
            borderRadius: "8px",
            marginTop: "2rem"
          }}>
            <div style={{fontSize: "3rem", marginBottom: "1rem"}}>🚀</div>
            <p style={{fontWeight: "600", marginBottom: "0.5rem"}}>¡Gracias por compartir!</p>
            <p style={{fontSize: "0.9rem", color: "#666"}}>Tu reseña se ha guardado y aparecerá en la página principal.</p>
            <p style={{fontSize: "0.8rem", color: "#999", marginTop: "1rem"}}>Redirigiendo...</p>
          </div>
        ) : (
          <>
            <p style={{ color: "#666", textAlign: "center", marginBottom: "2.5rem", fontSize: "1rem", lineHeight: "1.6" }}>
              Escribe qué te ha parecido <span style={{color: "#3b9ee8", fontWeight: "600"}}>Crece Online</span>. Tu comentario inspirará a otros estudiantes.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <style>{`
                input:focus, textarea:focus { border-color: #3b9ee8 !important; outline: none; box-shadow: 0 0 0 3px rgba(59,158,232,0.1); }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
              `}</style>
              
              <div style={{position: "relative"}}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#0d2a4a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  required 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{ width: "100%", padding: "14px", border: "2px solid #eee", borderRadius: "8px", fontSize: "1rem", transition: "0.2s" }}
                  placeholder="Ej. Regina Hernández"
                />
              </div>
              
              <div style={{position: "relative"}}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#0d2a4a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Tu Reseña (Sé breve y claro)
                </label>
                <textarea 
                  required 
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  maxLength="120" // Límite para que no se rompa el carrusel
                  style={{ width: "100%", padding: "14px", border: "2px solid #eee", borderRadius: "8px", fontSize: "1rem", minHeight: "120px", resize: "none", transition: "0.2s", lineHeight: "1.5" }}
                  placeholder="¿Qué aprendiste hoy? ¿Qué fue lo que más te gustó?"
                />
                <div style={{fontSize: "0.7rem", color: "#999", textAlign: "right", marginTop: "4px"}}>
                  {texto.length} / 120 caracteres
                </div>
              </div>

              <button 
                type="submit" 
                disabled={cargando}
                style={{ 
                  background: cargando ? "#ccc" : "#0d2a4a", 
                  color: "white", 
                  padding: "16px", 
                  border: "none", 
                  borderRadius: "8px", 
                  fontWeight: "700", 
                  fontSize: "1rem",
                  cursor: cargando ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: cargando ? "none" : "0 4px 12px rgba(13,42,74,0.2)"
                }}
              >
                {cargando ? "PUBLICANDO..." : "PUBLICAR RESEÑA →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}