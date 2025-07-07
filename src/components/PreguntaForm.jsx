import { useState } from "react";
import Swal from "sweetalert2";
import { hacerPregunta } from "../services/api";

function normalizarPregunta(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡]/g, "")
    .trim()
    .toLowerCase();
}

const preguntasPredefinidas = [
  { texto: "¿Cómo está mi salud mental?", clave: "Mental_Health_Score" },
  { texto: "¿Tengo conflictos por redes sociales?", clave: "Conflicts_Over_Social_Media" },
  { texto: "¿Soy adicto a las redes sociales?", clave: "Addicted_Score" },
  { texto: "¿Estoy durmiendo lo suficiente?", clave: "Sleep_Hours_Per_Night" },
  { texto: "¿Afectan las redes a mi rendimiento escolar?", clave: "Affects_Academic_Performance" },
  { texto: "¿Estoy emocionalmente equilibrado?", clave: "Mental_Health_Score" },
];

const mostrarCargaProgresiva = () => {
  const mensajesTiempo = [
    {
      tiempo: 5000,
      html: `<p>Ya casi están tus resultados, falta poco...</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px;" />`,
    },
    {
      tiempo: 10000,
      html: `<p>Estamos por terminar... solo un momento más.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px;" />`,
    },
    {
      tiempo: 15000,
      html: `<p>📱 El 53% de los jóvenes consulta su celular antes de levantarse de la cama.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px; margin-top:0.5rem;" />`,
    },
    {
      tiempo: 20000,
      html: `<p>📵 El 42% de los jóvenes intenta reducir redes... y falla en la primera semana.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px;" />`,
    },
    {
      tiempo: 25000,
      html: `<p>😴 Dormir con el celular cerca puede reducir un 20% la calidad del sueño.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px;" />`,
    },
  ];

  Swal.fire({
    title: "Consultando a la IA...",
    html: `<p>Estamos generando tu predicción, por favor espera.</p>
           <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" style="width:320px;" />`,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      mensajesTiempo.forEach(({ tiempo, html }) => {
        setTimeout(() => {
          Swal.update({ html });
        }, tiempo);
      });
    },
  });
};

export default function PreguntaForm({ datosUsuario, onNuevaPrediccion, prediccionRef }) {
  const [preguntaLibre, setPreguntaLibre] = useState("");
  const [cargando, setCargando] = useState(false);

  const hacerScroll = () => {
    setTimeout(() => {
      prediccionRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const manejarPeticion = async (preguntaTexto) => {
    setCargando(true);
    mostrarCargaProgresiva();

    try {
      const res = await hacerPregunta(datosUsuario, preguntaTexto);

      Swal.close();
      if (res.error) {
        alert("⚠️ No se pudo obtener una predicción para esta pregunta.");
      } else {
        onNuevaPrediccion(res);
        hacerScroll();
      }
    } catch (err) {
      Swal.close();
      alert("❌ Error al hacer predicción.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handlePreguntaClick = (texto) => {
    manejarPeticion(texto);
  };

  const handleLibre = () => {
    if (!preguntaLibre.trim()) return;
    const preguntaNormalizada = normalizarPregunta(preguntaLibre);
    manejarPeticion(preguntaNormalizada);
    setPreguntaLibre("");
  };

  return (
    <section className="preguntas-extra">
      <h3>🧠 ¿Quieres saber más?</h3>
      <p className="subtext">
        Nuestra IA puede darte más respuestas según tu comportamiento en redes.
        Selecciona una pregunta o escribe la tuya.
      </p>

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
          Preguntar IA
        </button>
      </div>
    </section>
  );
}
