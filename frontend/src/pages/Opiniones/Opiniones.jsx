import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Opiniones() {
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://respectful-manifestation-production-5441.up.railway.app";
      const res = await fetch(`${API_URL}/api/resenas/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, texto }),
      });

      if (res.ok) {
        setEnviado(true);
        setTimeout(() => navigate("/"), 3000); // Regresa a la landing tras 3 seg
      }
    } catch (err) {
      alert("Error al enviar la reseña. Intenta más tarde.");
    }
  };

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "500px", margin: "0 auto", fontFamily: "DM Sans" }}>
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: "2.5rem", color: "#0d2a4a" }}>
        ¡Tu opinión cuenta!
      </h2>
      <p style={{ color: "#8a9099", marginBottom: "2rem" }}>
        Escribe qué te ha parecido Crece Online para que aparezca en la página principal.
      </p>

      {enviado ? (
        <div style={{ padding: "2rem", background: "#f0f6fc", color: "#1a5fa8", textAlign: "center" }}>
          ¡Gracias! Tu reseña se ha guardado y aparecerá en la Landing pronto.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>TU NOMBRE</label>
            <input 
              type="text" 
              required 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", padding: "1rem", border: "1px solid #d4d8de" }}
              placeholder="Ej. Regina Hernández"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>TU RESEÑA</label>
            <textarea 
              required 
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              style={{ width: "100%", padding: "1rem", border: "1px solid #d4d8de", minHeight: "120px" }}
              placeholder="¿Qué aprendiste hoy?"
            />
          </div>
          <button 
            type="submit" 
            style={{ background: "#0d2a4a", color: "white", padding: "1rem", border: "none", cursor: "pointer", fontWeight: "600" }}
          >
            Publicar Reseña →
          </button>
        </form>
      )}
    </div>
  );
}