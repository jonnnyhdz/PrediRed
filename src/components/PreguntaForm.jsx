import { useState } from "react";
import { hacerPregunta } from "../services/api";

// Normaliza preguntas con tildes y signos como ¿ ¡
function normalizarPregunta(texto) {
  return texto
    .normalize("NFD") // separa letras de acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[¿¡]/g, "") // elimina signos de apertura
    .trim()
    .toLowerCase();
}

// ✅ Preguntas predefinidas que sí se responden correctamente según los targets reales
const preguntasPredefinidas = [
  { texto: "¿Cómo está mi salud mental?", clave: "Mental_Health_Score" },
  { texto: "¿Tengo conflictos por redes sociales?", clave: "Conflicts_Over_Social_Media" },
  { texto: "¿Soy adicto a las redes sociales?", clave: "Addicted_Score" },
  { texto: "¿Es demasiado mi tiempo en redes?", clave: "Avg_Daily_Usage_Hours" },
  { texto: "¿Estoy durmiendo lo suficiente?", clave: "Sleep_Hours_Per_Night" },
  { texto: "¿Afectan las redes a mi rendimiento escolar?", clave: "Affects_Academic_Performance" },
  { texto: "¿Cómo será mi próxima relación?", clave: "Relationship_Status" },
  { texto: "¿Estoy emocionalmente equilibrado?", clave: "Mental_Health_Score" },
  { texto: "¿Mi relación me está afectando?", clave: "Affects_Academic_Performance" },
];


export default function PreguntaForm({ datosUsuario, onNuevaPrediccion }) {
  const [preguntaLibre, setPreguntaLibre] = useState("");
  const [cargando, setCargando] = useState(false);

const handlePreguntaClick = async (preguntaTexto) => {
  setCargando(true);
  try {
    const res = await hacerPregunta(datosUsuario, preguntaTexto);
    if (res.error) {
      alert("⚠️ No se pudo obtener una predicción para esta pregunta.");
    } else {
onNuevaPrediccion(res);
    }
  } catch (err) {
    alert("❌ Error al hacer predicción.");
    console.error(err);
  } finally {
    setCargando(false);
  }
};


  const handleLibre = async () => {
    if (!preguntaLibre.trim()) return;
    setCargando(true);
    try {
      const preguntaNormalizada = normalizarPregunta(preguntaLibre);
      const res = await hacerPregunta(datosUsuario, preguntaNormalizada);

      if (res.error) {
        alert("⚠️ No se pudo entender tu pregunta. Intenta reformularla.");
      } else {
onNuevaPrediccion(res);
        setPreguntaLibre("");
      }
    } catch (err) {
      alert("❌ Error al hacer predicción personalizada.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="preguntas-extra">
      <h3>🧠 ¿Quieres saber más?</h3>
      <p>Selecciona una pregunta o escribe la tuya.</p>

      <div className="predefinidas">
        {preguntasPredefinidas.map(({ texto, clave }) => (
<button key={clave} onClick={() => handlePreguntaClick(texto)} disabled={cargando}>
  {texto}
</button>

        ))}
      </div>

      <div className="pregunta-libre">
        <input
          type="text"
          placeholder="Escribe tu propia pregunta..."
          value={preguntaLibre}
          onChange={(e) => setPreguntaLibre(e.target.value)}
        />
        <button onClick={handleLibre} disabled={cargando}>
          Enviar pregunta
        </button>
      </div>
    </section>
  );
}
