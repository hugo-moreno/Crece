import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── INSTRUCCIÓN ──────────────────────────────────────────────────────────────
// Pon la imagen que quieras en: frontend/public/login-bg.jpg
// Puede ser cualquier foto: estudiantes, escritorio, ciudad, lo que prefieras.
// Resolución recomendada: 1200x900px o más. Se ajusta automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
    --error: #c0392b;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--gray-800); }

  .login-wrapper {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 480px 1fr;
  }

  /* ── Izquierda: formulario ── */
  .login-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem 3.5rem;
    background: var(--white);
    border-right: 1px solid var(--gray-300);
    position: relative;
    z-index: 1;
  }

  .login-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--blue-dark);
    letter-spacing: -0.02em;
    cursor: pointer;
  }
  .login-brand span { color: var(--blue-light); }

  .login-form-area { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 2rem 0; }

  .login-eyebrow {
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--blue-light); margin-bottom: 0.7rem;
  }
  .login-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem; font-weight: 700;
    color: var(--blue-dark); letter-spacing: -0.02em;
    line-height: 1; margin-bottom: 0.5rem;
  }
  .login-sub {
    font-size: 0.85rem; color: var(--gray-500);
    margin-bottom: 2.5rem; line-height: 1.6;
  }

  .alert-error {
    border-left: 3px solid var(--error);
    background: #fdf0ef;
    color: var(--error);
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    margin-bottom: 1.5rem;
  }

  .form-group { margin-bottom: 1.2rem; }
  .form-label {
    display: block; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--gray-500); margin-bottom: 0.45rem;
  }
  .input-wrap { position: relative; }
  .form-input {
    width: 100%; padding: 0.8rem 1rem;
    border: 1.5px solid var(--gray-300);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; color: var(--gray-800);
    background: var(--white); outline: none;
    transition: border-color 0.2s; border-radius: 0;
  }
  .form-input:focus { border-color: var(--blue-light); }
  .form-input.input-error { border-color: var(--error); }
  .form-input::placeholder { color: var(--gray-300); font-weight: 300; }
  .error-msg { font-size: 0.73rem; color: var(--error); margin-top: 0.3rem; }

  .toggle-pass {
    position: absolute; right: 0.9rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 0.75rem; font-family: 'DM Sans', sans-serif;
    color: var(--gray-500); padding: 0; letter-spacing: 0.02em;
  }
  .toggle-pass:hover { color: var(--blue-mid); }

  .forgot-row {
    display: flex; justify-content: flex-end;
    margin-top: 0.3rem; margin-bottom: 2rem;
  }
  .forgot-link {
    font-size: 0.75rem; color: var(--gray-500);
    text-decoration: none; transition: color 0.2s;
  }
  .forgot-link:hover { color: var(--blue-mid); }

  .btn-login {
    width: 100%; background: var(--blue-dark); color: var(--white);
    border: none; padding: 0.95rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    cursor: pointer; transition: background 0.2s;
    letter-spacing: 0.03em; margin-bottom: 1.5rem;
  }
  .btn-login:hover:not(:disabled) { background: var(--blue-mid); }
  .btn-login:disabled { opacity: 0.45; cursor: not-allowed; }

  .divider { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; }
  .divider-line { flex: 1; height: 1px; background: var(--gray-300); }
  .divider-text { font-size: 0.72rem; color: var(--gray-500); white-space: nowrap; }

  .btn-register {
    width: 100%; background: none;
    border: 1.5px solid var(--blue-dark); color: var(--blue-dark);
    padding: 0.95rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em;
  }
  .btn-register:hover { background: var(--blue-mist); }

  .login-footer {
    font-size: 0.72rem; color: var(--gray-300);
    display: flex; justify-content: space-between; align-items: center;
  }
  .back-link {
    background: none; border: none; cursor: pointer;
    font-size: 0.75rem; color: var(--gray-500);
    font-family: 'DM Sans', sans-serif; padding: 0; transition: color 0.2s;
  }
  .back-link:hover { color: var(--blue-dark); }

  /* ── Derecha: imagen ── */
  .login-right {
    position: relative; overflow: hidden;
    background: var(--blue-dark);
  }
  .login-right-img {
    position: absolute; inset: 0;
    background-image: url('/login-bg.jpg');
    background-size: cover; background-position: center;
    opacity: 0.6;
  }
  .login-right-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(13,42,74,0.7) 0%, rgba(26,95,168,0.4) 100%);
  }
  .login-right-content {
    position: relative; z-index: 1;
    height: 100%; display: flex; flex-direction: column;
    justify-content: flex-end; padding: 3rem;
  }
  .right-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 300; color: white; line-height: 1.2;
    letter-spacing: -0.02em; margin-bottom: 1rem;
  }
  .right-quote em { font-style: italic; color: var(--blue-pale); }
  .right-stats {
    display: flex; gap: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .right-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 700; color: white; line-height: 1;
  }
  .right-stat-label {
    font-size: 0.68rem; color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.15rem;
  }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .login-form-area { animation: fadeUp 0.4s ease both; }

  @media (max-width: 800px) {
    .login-wrapper { grid-template-columns: 1fr; }
    .login-right { display: none; }
    .login-left { padding: 2.5rem 2rem; }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo no válido.";
    if (!form.password) e.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setGlobalError("");
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales incorrectas.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario || { nombre: form.email }));
      navigate("/dashboard");
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{styles}</style>
      <div className="login-wrapper">

        {/* ── Formulario ── */}
        <div className="login-left">
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo2.png" alt="Crece Online" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </div>

          <div className="login-form-area">
            <div className="login-eyebrow">Plataforma de aprendizaje</div>
            <div className="login-heading">Bienvenido</div>
            <div className="login-sub">Inicia sesión para continuar tu aprendizaje.</div>

            {globalError && <div className="alert-error">{globalError}</div>}

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                className={`form-input${errors.email ? " input-error" : ""}`}
                type="email" name="email" placeholder="tucorreo@ejemplo.com"
                value={form.email} onChange={handleChange} onKeyDown={handleKeyDown} autoComplete="email"
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-wrap">
                <input
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  type={showPass ? "text" : "password"} name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={handleChange} onKeyDown={handleKeyDown}
                  autoComplete="current-password" style={{ paddingRight: "4.5rem" }}
                />
                <button className="toggle-pass" type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            <div className="forgot-row">
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="btn-login" onClick={handleSubmit} disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">¿No tienes cuenta?</span>
              <div className="divider-line"></div>
            </div>

            <button className="btn-register" onClick={() => navigate("/register")}>
              Crear cuenta gratis
            </button>
          </div>

          <div className="login-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src="/utsc-logo.png" alt="UTSC" style={{ height: '28px', width: 'auto', opacity: 0.5 }} />
              <span>© 2026 Crece Online</span>
            </div>
            <button className="back-link" onClick={() => navigate("/")}>← Volver al inicio</button>
          </div>
        </div>

        {/* ── Imagen ── */}
        <div className="login-right">
          <div className="login-right-img"></div>
          <div className="login-right-overlay"></div>
          <div className="login-right-content">
            <div className="right-quote">
              Aprende hoy.<br /><em>Lidera mañana.</em>
            </div>
            <div className="right-stats">
              <div>
                <div className="right-stat-num">6</div>
                <div className="right-stat-label">Cursos activos</div>
              </div>
              <div>
                <div className="right-stat-num">98%</div>
                <div className="right-stat-label">Satisfacción</div>
              </div>
              <div>
                <div className="right-stat-num">2.4K</div>
                <div className="right-stat-label">Estudiantes</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}