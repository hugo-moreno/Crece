import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
    --error: #c0392b; --success: #1a8a4a;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--gray-800); }

  .reg-wrapper { min-height: 100vh; display: grid; grid-template-columns: 480px 1fr; }

  /* ── Izquierda: formulario ── */
  .reg-left {
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 3rem 3.5rem; background: var(--white);
    border-right: 1px solid var(--gray-300); overflow-y: auto;
  }

  .reg-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .reg-brand span { color: var(--blue-light); }

  .reg-form-area { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 2rem 0; animation: fadeUp 0.45s ease both; }

  .reg-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.7rem; }
  .reg-heading { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; line-height: 1; margin-bottom: 0.5rem; }
  .reg-sub { font-size: 0.85rem; color: var(--gray-500); margin-bottom: 2rem; line-height: 1.6; }

  .alert-error { border-left: 3px solid var(--error); background: #fdf0ef; color: var(--error); padding: 0.75rem 1rem; font-size: 0.82rem; margin-bottom: 1.5rem; }
  .alert-success { border-left: 3px solid var(--success); background: #edfaf3; color: var(--success); padding: 0.75rem 1rem; font-size: 0.82rem; margin-bottom: 1.5rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { margin-bottom: 1.1rem; }
  .form-label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-500); margin-bottom: 0.45rem; }
  .input-wrap { position: relative; }
  .form-input { width: 100%; padding: 0.8rem 1rem; border: 1.5px solid var(--gray-300); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--gray-800); background: var(--white); outline: none; transition: border-color 0.2s; border-radius: 0; }
  .form-input:focus { border-color: var(--blue-light); }
  .form-input.input-error { border-color: var(--error); }
  .form-input::placeholder { color: var(--gray-300); font-weight: 300; }
  .error-msg { font-size: 0.73rem; color: var(--error); margin-top: 0.3rem; }

  .toggle-pass { position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'DM Sans', sans-serif; color: var(--gray-500); padding: 0; }
  .toggle-pass:hover { color: var(--blue-mid); }

  .strength-bar { height: 3px; background: var(--gray-300); margin-top: 0.4rem; margin-bottom: 0.25rem; }
  .strength-fill { height: 100%; transition: width 0.3s, background 0.3s; }
  .strength-text { font-size: 0.72rem; }

  .terms-row { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 1.5rem; margin-top: 0.4rem; }
  .terms-row input { accent-color: var(--blue-mid); margin-top: 3px; flex-shrink: 0; }
  .terms-text { font-size: 0.8rem; color: var(--gray-500); line-height: 1.5; }
  .terms-text a { color: var(--blue-mid); text-decoration: none; font-weight: 500; }

  .btn-register { width: 100%; background: var(--blue-dark); color: var(--white); border: none; padding: 0.95rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s; letter-spacing: 0.03em; margin-bottom: 1.2rem; }
  .btn-register:hover:not(:disabled) { background: var(--blue-mid); }
  .btn-register:disabled { opacity: 0.45; cursor: not-allowed; }

  .login-cta { text-align: center; font-size: 0.82rem; color: var(--gray-500); padding-top: 1.5rem; border-top: 1px solid var(--gray-300); }
  .login-link { color: var(--blue-mid); font-weight: 600; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; padding: 0; }
  .login-link:hover { text-decoration: underline; }

  .back-link { display: block; text-align: center; margin-top: 1rem; font-size: 0.75rem; color: var(--gray-500); cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; padding: 0; }
  .back-link:hover { color: var(--blue-dark); }

  .reg-footer { font-size: 0.72rem; color: var(--gray-300); display: flex; justify-content: space-between; align-items: center; }

  /* ── Derecha: imagen ── */
  .reg-right { position: relative; overflow: hidden; background: var(--blue-dark); }
  .reg-right-img { position: absolute; inset: 0; background-image: url('/login-bg.jpg'); background-size: cover; background-position: center; opacity: 0.6; }
  .reg-right-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(13,42,74,0.7) 0%, rgba(26,95,168,0.4) 100%); }
  .reg-right-content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 3rem; }
  .right-quote { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 300; color: white; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 1rem; }
  .right-quote em { font-style: italic; color: var(--blue-pale); }
  .right-stats { display: flex; gap: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.15); }
  .right-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: white; line-height: 1; }
  .right-stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.15rem; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 800px) {
    .reg-wrapper { grid-template-columns: 1fr; }
    .reg-right { display: none; }
    .reg-left { padding: 2.5rem 2rem; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

const getStrength = (pass) => {
  if (!pass) return { width: "0%", color: "var(--gray-300)", label: "" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1) return { width: "25%", color: "#c0392b", label: "Muy débil" };
  if (score === 2) return { width: "50%", color: "#e67e22", label: "Débil" };
  if (score === 3) return { width: "75%", color: "#f1c40f", label: "Buena" };
  return { width: "100%", color: "#1a8a4a", label: "Fuerte" };
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [terms, setTerms] = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido.";
    if (!form.apellido.trim()) e.apellido = "Requerido.";
    if (!form.email.trim()) e.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo no válido.";
    if (!form.password) e.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (!form.confirmPassword) e.confirmPassword = "Confirma tu contraseña.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "No coinciden.";
    if (!terms) e.terms = "Debes aceptar los términos.";
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
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: `${form.nombre} ${form.apellido}`,
          email: form.email,
          password: form.password,
          rol: "alumno",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrarse.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
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
      <div className="reg-wrapper">

        {/* ── Formulario ── */}
        <div className="reg-left">
          <div className="reg-brand" onClick={() => navigate("/")}>
            Crece<span>Online</span>
          </div>

          <div className="reg-form-area">
            <div className="reg-eyebrow">Plataforma de aprendizaje</div>
            <div className="reg-heading">Crear cuenta</div>
            <div className="reg-sub">Únete y accede a todos los cursos de forma gratuita.</div>

            {globalError && <div className="alert-error">{globalError}</div>}
            {success && <div className="alert-success">¡Cuenta creada! Redirigiendo al login...</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className={`form-input${errors.nombre ? " input-error" : ""}`} type="text" name="nombre"
                  placeholder="Juan" value={form.nombre} onChange={handleChange} onKeyDown={handleKeyDown} />
                {errors.nombre && <div className="error-msg">{errors.nombre}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input className={`form-input${errors.apellido ? " input-error" : ""}`} type="text" name="apellido"
                  placeholder="Pérez" value={form.apellido} onChange={handleChange} onKeyDown={handleKeyDown} />
                {errors.apellido && <div className="error-msg">{errors.apellido}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className={`form-input${errors.email ? " input-error" : ""}`} type="email" name="email"
                placeholder="tucorreo@ejemplo.com" value={form.email} onChange={handleChange} onKeyDown={handleKeyDown} />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-wrap">
                <input className={`form-input${errors.password ? " input-error" : ""}`}
                  type={showPass ? "text" : "password"} name="password"
                  placeholder="Mínimo 6 caracteres" value={form.password}
                  onChange={handleChange} onKeyDown={handleKeyDown} style={{ paddingRight: "4.5rem" }} />
                <button className="toggle-pass" type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                  <div className="strength-text" style={{ color: strength.color }}>{strength.label}</div>
                </>
              )}
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <div className="input-wrap">
                <input className={`form-input${errors.confirmPassword ? " input-error" : ""}`}
                  type={showConfirm ? "text" : "password"} name="confirmPassword"
                  placeholder="Repite tu contraseña" value={form.confirmPassword}
                  onChange={handleChange} onKeyDown={handleKeyDown} style={{ paddingRight: "4.5rem" }} />
                <button className="toggle-pass" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
            </div>

            <div className="terms-row">
              <input type="checkbox" id="terms" checked={terms}
                onChange={(e) => { setTerms(e.target.checked); setErrors({ ...errors, terms: "" }); }} />
              <label className="terms-text" htmlFor="terms">
                Acepto los <a href="#">Términos de uso</a> y la <a href="#">Política de privacidad</a>.
              </label>
            </div>
            {errors.terms && <div className="error-msg" style={{ marginTop: "-0.8rem", marginBottom: "1rem" }}>{errors.terms}</div>}

            <button className="btn-register" onClick={handleSubmit} disabled={loading || success}>
              {loading ? "Creando cuenta..." : "Crear cuenta →"}
            </button>

            <div className="login-cta">
              ¿Ya tienes cuenta?{" "}
              <button className="login-link" onClick={() => navigate("/login")}>Inicia sesión</button>
            </div>

            <button className="back-link" onClick={() => navigate("/")}>← Volver al inicio</button>
          </div>

          <div className="reg-footer">
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <img src="/utsc-logo.png" alt="UTSC" style={{ height: "28px", width: "auto", opacity: 0.5 }} />
              <span>© 2026 Crece Online</span>
            </div>
          </div>
        </div>

        {/* ── Imagen ── */}
        <div className="reg-right">
          <div className="reg-right-img"></div>
          <div className="reg-right-overlay"></div>
          <div className="reg-right-content">
            <div className="right-quote">
              Tu futuro<br />empieza <em>hoy.</em>
            </div>
            <div className="right-stats">
              <div><div className="right-stat-num">6</div><div className="right-stat-label">Cursos activos</div></div>
              <div><div className="right-stat-num">98%</div><div className="right-stat-label">Satisfacción</div></div>
              <div><div className="right-stat-num">2.4K</div><div className="right-stat-label">Estudiantes</div></div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}