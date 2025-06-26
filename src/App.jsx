import { useState } from "react";
import Formulario from "./components/Formulario";
import Predicciones from "./components/Predicciones";
import PreguntaForm from "./components/PreguntaForm";
import PrediccionesExtras from "./components/PrediccionesExtras"; // ✅ componente nuevo
import "./index.css";

export default function App() {
  const [prediccionesIniciales, setPrediccionesIniciales] = useState(null);
  const [prediccionesExtras, setPrediccionesExtras] = useState([]); // ✅ array de predicciones adicionales

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <h1>PrediRed</h1>
          <p>
            Predice tu salud mental, adicción y más
            <br />
            según tu uso de redes sociales.
          </p>
          <a href="#formulario" className="cta-button">
            Empezar cuestionario
          </a>
        </div>
      </header>

      <section className="intro">
        <div className="intro-content">
          <div className="intro-text">
            <h2>¿Cómo funciona?</h2>
            <p>
              Nuestro sistema analiza tus respuestas usando modelos de
              inteligencia artificial entrenados con datos reales. Al instante,
              te brinda predicciones sobre salud mental, adicción, relaciones y
              mucho más.
            </p>
            <ul className="benefits">
              <li>🔍 Análisis personalizado al instante</li>
              <li>📊 Predicciones basadas en IA real</li>
              <li>🔐 Sin registros ni cuentas necesarias</li>
            </ul>
          </div>

          <div className="intro-image">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4341/4341139.png"
              alt="IA Predictiva"
            />
          </div>
        </div>
      </section>

      <Formulario onPredicciones={setPrediccionesIniciales} />

      {prediccionesIniciales && (
        <>
          <Predicciones predictions={prediccionesIniciales} />

          {prediccionesExtras.length > 0 && (
            <PrediccionesExtras predicciones={prediccionesExtras} />
          )}

          <PreguntaForm
            datosUsuario={{
              Student_ID:
                prediccionesIniciales.Student_ID ||
                localStorage.getItem("student_id"),
            }}
            onNuevaPrediccion={(nueva) =>
              setPrediccionesExtras((prev) => [...prev, nueva])
            }
          />
        </>
      )}

      <footer className="footer">
        © 2025 PrediRed - Desarrollado por Equipo Umisumi
      </footer>
    </>
  );
}
