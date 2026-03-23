import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f8f9fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-100); color: var(--gray-800); }

  .qnav { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 3rem; background: white; border-bottom: 1px solid var(--gray-300); position: sticky; top: 0; z-index: 50; }
  .qnav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .qnav-brand span { color: var(--blue-light); }
  .qnav-right { display: flex; align-items: center; gap: 1.5rem; }
  .qnav-avatar { width: 32px; height: 32px; background: var(--blue-mist); border: 1.5px solid var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; color: var(--blue-mid); }
  .qnav-name { font-size: 0.85rem; color: var(--gray-500); }
  .qnav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .qnav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }

  .quiz-page { min-height: calc(100vh - 57px); display: flex; align-items: flex-start; justify-content: center; padding: 3rem 1rem; }
  .quiz-card { background: white; width: 100%; max-width: 680px; animation: fadeUp 0.4s ease both; }

  .quiz-top { background: var(--blue-dark); padding: 2rem 2.5rem; }
  .quiz-top-course { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue-pale); margin-bottom: 0.4rem; }
  .quiz-top-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: white; margin-bottom: 1.5rem; }
  .quiz-track { display: flex; gap: 4px; }
  .quiz-dot { flex: 1; height: 3px; background: rgba(255,255,255,0.15); transition: background 0.3s; }
  .quiz-dot-done { background: var(--blue-light); }
  .quiz-dot-current { background: white; }

  .quiz-body { padding: 2rem 2.5rem; }
  .quiz-q-num { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue-light); margin-bottom: 0.8rem; }
  .quiz-question { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--blue-dark); line-height: 1.4; margin-bottom: 1.8rem; }

  .quiz-options { display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 2rem; }
  .quiz-option { border: 1.5px solid var(--gray-300); padding: 0.9rem 1.2rem; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.15s; font-size: 0.9rem; color: var(--gray-800); }
  .quiz-option:hover { border-color: var(--blue-mid); background: var(--blue-mist); color: var(--blue-dark); }
  .quiz-option-selected { border-color: var(--blue-mid) !important; background: var(--blue-mist) !important; color: var(--blue-dark) !important; }
  .opt-radio { width: 16px; height: 16px; border: 1.5px solid var(--gray-300); border-radius: 50%; flex-shrink: 0; transition: all 0.15s; }
  .opt-radio-filled { background: var(--blue-mid); border-color: var(--blue-mid); }

  .quiz-btn { background: var(--blue-dark); color: white; border: none; padding: 0.9rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s; letter-spacing: 0.02em; }
  .quiz-btn:hover:not(:disabled) { background: var(--blue-mid); }
  .quiz-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 600px) { .quiz-top { padding: 1.5rem; } .quiz-body { padding: 1.5rem; } .qnav { padding: 0.9rem 1.5rem; } }
`;

const QUIZZES = {
  1: { curso: 'Word desde Cero', preguntas: [
    { pregunta: '¿Qué combinación de teclas se usa para guardar un documento en Word?', opciones: ['Ctrl + P', 'Ctrl + S', 'Ctrl + G', 'Alt + S'], correcta: 1 },
    { pregunta: '¿Cuál es la función del comando Ctrl + E en Microsoft Word?', opciones: ['Guardar el documento', 'Centrar el texto', 'Aplicar negrita', 'Abrir estilos'], correcta: 1 },
    { pregunta: '¿Cómo se llama el conjunto de formatos predefinidos de texto en Word?', opciones: ['Plantillas', 'Estilos', 'Diseños', 'Temas'], correcta: 1 },
    { pregunta: '¿Para qué sirve la herramienta "Revisar" en Word?', opciones: ['Cambiar el diseño', 'Revisar ortografía y gramática', 'Insertar imágenes', 'Configurar márgenes'], correcta: 1 },
    { pregunta: '¿Qué significa la extensión .docx?', opciones: ['Archivo de Excel', 'Documento Word moderno', 'Archivo de texto plano', 'Documento PDF'], correcta: 1 },
  ]},
  2: { curso: 'Excel y Análisis de Datos', preguntas: [
    { pregunta: '¿Qué función de Excel calcula la suma de un rango de celdas?', opciones: ['=SUMA()', '=TOTAL()', '=AGREGAR()', '=SUMAR()'], correcta: 0 },
    { pregunta: '¿Qué es una tabla dinámica en Excel?', opciones: ['Una tabla con colores', 'Un resumen interactivo de datos', 'Una tabla con fórmulas', 'Un gráfico especial'], correcta: 1 },
    { pregunta: '¿Cuál es la función para contar celdas con un criterio específico?', opciones: ['=CONTAR()', '=CONTARSI()', '=CONTAR.SI()', '=SI.CUENTA()'], correcta: 2 },
    { pregunta: '¿Qué hace la función =BUSCARV()?', opciones: ['Busca un valor vertical', 'Ordena datos', 'Filtra celdas', 'Suma valores'], correcta: 0 },
    { pregunta: '¿Para qué sirve el formato condicional?', opciones: ['Cambiar fuente', 'Resaltar celdas según condiciones', 'Crear fórmulas', 'Ordenar columnas'], correcta: 1 },
  ]},
  3: { curso: 'PowerPoint desde Cero', preguntas: [
    { pregunta: '¿Qué es una transición en PowerPoint?', opciones: ['Un efecto entre diapositivas', 'Un tipo de fuente', 'Un diseño de slide', 'Un color de fondo'], correcta: 0 },
    { pregunta: '¿Cómo se llama la vista que muestra todas las diapositivas en miniatura?', opciones: ['Vista Normal', 'Vista Clasificador', 'Vista Presentación', 'Vista Esquema'], correcta: 1 },
    { pregunta: '¿Qué tecla inicia una presentación desde el principio?', opciones: ['F1', 'F5', 'F10', 'F12'], correcta: 1 },
    { pregunta: '¿Para qué sirven las animaciones en PowerPoint?', opciones: ['Cambiar colores', 'Agregar movimiento a elementos', 'Imprimir slides', 'Guardar el archivo'], correcta: 1 },
    { pregunta: '¿Qué es un patrón de diapositivas?', opciones: ['Una diapositiva en blanco', 'Plantilla que define el diseño global', 'Una animación especial', 'Un tipo de transición'], correcta: 1 },
  ]},
  4: { curso: 'Administración y Finanzas', preguntas: [
    { pregunta: '¿Qué es un presupuesto empresarial?', opciones: ['Un registro de gastos pasados', 'Una estimación de ingresos y gastos futuros', 'Un estado de cuenta bancario', 'Un contrato financiero'], correcta: 1 },
    { pregunta: '¿Qué mide la liquidez de una empresa?', opciones: ['Sus ganancias anuales', 'Su capacidad de pagar deudas a corto plazo', 'Su valor en el mercado', 'Sus activos fijos'], correcta: 1 },
    { pregunta: '¿Cuál es la fórmula básica de la utilidad?', opciones: ['Ingresos + Gastos', 'Ingresos - Gastos', 'Gastos / Ingresos', 'Ingresos × Gastos'], correcta: 1 },
    { pregunta: '¿Qué es el flujo de caja?', opciones: ['El dinero en cuentas bancarias', 'El movimiento de entradas y salidas de dinero', 'Las deudas de la empresa', 'Los activos totales'], correcta: 1 },
    { pregunta: '¿Qué representa el ROI?', opciones: ['Retorno sobre la inversión', 'Riesgo operativo interno', 'Registro de obligaciones internas', 'Rendimiento operativo inicial'], correcta: 0 },
  ]},
  5: { curso: 'Introducción a Lengua de Señas', preguntas: [
    { pregunta: '¿Cuántas letras tiene el alfabeto de la Lengua de Señas Mexicana (LSM)?', opciones: ['24', '27', '26', '28'], correcta: 2 },
    { pregunta: '¿Qué mano se usa principalmente en la LSM para personas diestras?', opciones: ['La mano izquierda', 'La mano derecha', 'Ambas por igual', 'Depende de la seña'], correcta: 1 },
    { pregunta: '¿Qué elemento NO forma parte de la LSM?', opciones: ['Configuración de la mano', 'Movimiento', 'Tono de voz', 'Expresión facial'], correcta: 2 },
    { pregunta: '¿Para qué sirven las expresiones faciales en la LSM?', opciones: ['Son decorativas', 'Añaden significado gramatical', 'Solo expresan emociones', 'No tienen función'], correcta: 1 },
    { pregunta: '¿Qué organización promueve la lengua de señas en México?', opciones: ['INEGI', 'SEP', 'SENAME', 'CONADIS'], correcta: 3 },
  ]},
  6: { curso: 'Marketing Digital', preguntas: [
    { pregunta: '¿Qué significa SEO?', opciones: ['Social Engagement Online', 'Search Engine Optimization', 'Sales Engagement Operations', 'Social Experience Online'], correcta: 1 },
    { pregunta: '¿Qué métrica mide el porcentaje de usuarios que abandonan el sitio tras ver solo una página?', opciones: ['CTR', 'Bounce Rate', 'CPC', 'ROI'], correcta: 1 },
    { pregunta: '¿Qué es un CTA en marketing?', opciones: ['Costo Total Anual', 'Call To Action', 'Content Traffic Analysis', 'Customer Target Audience'], correcta: 1 },
    { pregunta: '¿Cuál es el objetivo principal del email marketing?', opciones: ['Aumentar seguidores', 'Generar conversiones y fidelizar clientes', 'Mejorar el SEO', 'Crear contenido viral'], correcta: 1 },
    { pregunta: '¿Qué es el marketing de contenidos?', opciones: ['Pagar por anuncios', 'Crear y distribuir contenido valioso para atraer audiencia', 'Enviar emails masivos', 'Comprar seguidores'], correcta: 1 },
  ]},
};

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZZES[Number(id)];
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Usuario"}');

  if (!quiz) return <div style={{ padding: '3rem', textAlign: 'center' }}>Quiz no encontrado.</div>;

  const pregunta = quiz.preguntas[preguntaActual];
  const total = quiz.preguntas.length;
  const esUltima = preguntaActual === total - 1;

  function handleSiguiente() {
    if (seleccionada === null) return;
    const nuevasRespuestas = [...respuestas, seleccionada];
    if (esUltima) {
      const correctas = nuevasRespuestas.filter((r, i) => r === quiz.preguntas[i].correcta).length;
      navigate(`/resultado/${id}`, { state: { correctas, total, curso: quiz.curso } });
    } else {
      setRespuestas(nuevasRespuestas);
      setPreguntaActual(preguntaActual + 1);
      setSeleccionada(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  }

  return (
    <>
      <style>{styles}</style>
      <nav className="qnav">
        <div className="qnav-brand" onClick={() => navigate('/dashboard')}>Crece<span>Online</span></div>
        <div className="qnav-right">
          <div className="qnav-avatar">{getInitials(usuario.nombre)}</div>
          <span className="qnav-name">{usuario.nombre}</span>
          <button className="qnav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="quiz-page">
        <div className="quiz-card">
          <div className="quiz-top">
            <div className="quiz-top-course">{quiz.curso} — Evaluación final</div>
            <div className="quiz-top-title">Demuestra lo que aprendiste</div>
            <div className="quiz-track">
              {quiz.preguntas.map((_, i) => (
                <div key={i} className={`quiz-dot ${i < preguntaActual ? 'quiz-dot-done' : ''} ${i === preguntaActual ? 'quiz-dot-current' : ''}`} />
              ))}
            </div>
          </div>
          <div className="quiz-body">
            <div className="quiz-q-num">Pregunta {preguntaActual + 1} de {total}</div>
            <div className="quiz-question">{pregunta.pregunta}</div>
            <div className="quiz-options">
              {pregunta.opciones.map((op, i) => (
                <div key={i} className={`quiz-option ${seleccionada === i ? 'quiz-option-selected' : ''}`} onClick={() => setSeleccionada(i)}>
                  <div className={`opt-radio ${seleccionada === i ? 'opt-radio-filled' : ''}`}></div>
                  {op}
                </div>
              ))}
            </div>
            <button className="quiz-btn" disabled={seleccionada === null} onClick={handleSiguiente}>
              {esUltima ? 'Ver resultado →' : 'Siguiente pregunta →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}