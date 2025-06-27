import { useState, useRef } from "react";
import Formulario from "./components/Formulario";
import Predicciones from "./components/Predicciones";
import PreguntaForm from "./components/PreguntaForm";
import PrediccionesExtras from "./components/PrediccionesExtras";
import "./index.css";

export default function App() {
  const [prediccionesIniciales, setPrediccionesIniciales] = useState(null);
  const [prediccionesExtras, setPrediccionesExtras] = useState([]);

  const prediccionesRef = useRef(null); // 📍 referencia a predicciones iniciales
  const prediccionRef = useRef(null);   // 📍 referencia a predicciones extras

  const handleNuevaPrediccion = (nueva) => {
    setPrediccionesExtras((prev) => [...prev, nueva]);

    setTimeout(() => {
      prediccionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handlePrediccionesIniciales = (preds) => {
    setPrediccionesIniciales(preds);

    // Deslizar hacia la sección de predicciones iniciales
    setTimeout(() => {
      prediccionesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300); // ⏱ pequeño delay para asegurar renderizado
  };

  return (
    <>
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            <span className="highlight">Predi</span>Red
          </h1>
          <p>
            Analiza tu salud mental, adicción y rendimiento académico
            <br />
            con ayuda de inteligencia artificial.
          </p>
          <a
            href="#formulario"
            className="cta-button"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#formulario")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Comenzar cuestionario
          </a>
        </div>
      </header>

      <section className="intro-section">
        <div className="intro-texto-superior">
          <h2>¿Cómo funciona PrediRed?</h2>
          <p>
            Analizamos tu uso de redes sociales con IA entrenada en datos reales.
            Recibe predicciones instantáneas, privadas y personalizadas.
          </p>
        </div>

        <div className="intro-card-container">
          <div className="intro-feature-card">
            <span className="emoji emoji-ray">⚡</span>
            <h4>Predicción inmediata</h4>
            <p>
              Resultados al instante sin necesidad de registros ni cuentas.<br />
              En menos de 10 segundos sabrás tu nivel de adicción, salud mental
              y más, solo respondiendo unas cuantas preguntas.
            </p>
          </div>

          <div className="intro-feature-card">
            <span className="emoji emoji-brain">🧠</span>
            <h4>IA real entrenada</h4>
            <p>
              Modelos basados en patrones auténticos de estudiantes.<br />
              Nuestra IA ha aprendido de miles de datos para predecir tu estado
              emocional y social de forma confiable.
            </p>
          </div>

          <div className="intro-feature-card">
            <span className="emoji emoji-lock">🔐</span>
            <h4>Privacidad garantizada</h4>
            <p>
              Tu información no se guarda, todo se procesa en tiempo real.<br />
              Nadie verá tus respuestas, no usamos cookies ni rastreadores.
            </p>
          </div>
        </div>
      </section>

      <Formulario onPredicciones={handlePrediccionesIniciales} />

      {prediccionesIniciales && (
        <>
          <Predicciones predictions={prediccionesIniciales} ref={prediccionesRef} />

          {prediccionesExtras.length > 0 && (
            <PrediccionesExtras
              predicciones={prediccionesExtras}
              ref={prediccionRef}
            />
          )}

          <PreguntaForm
            datosUsuario={{
              Student_ID:
                prediccionesIniciales.Student_ID ||
                localStorage.getItem("student_id"),
            }}
            onNuevaPrediccion={handleNuevaPrediccion}
            prediccionRef={prediccionRef}
          />
        </>
      )}

      <footer className="footer">
        © 2025 PrediRed - Desarrollado por Equipo Umisumi
      </footer>
    </>
  );
}
