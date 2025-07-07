import { useState, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaHeart,
  FaBed,
  FaMobileAlt,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const camposHumanos = {
  Mental_Health_Score: "Salud mental",
  Addicted_Score: "Adicción a redes",
  Affects_Academic_Performance: "Impacto académico",
  Avg_Daily_Usage_Hours: "Tus horas en redes",
  Sleep_Hours_Per_Night: "Calidad de sueño",
  Relationship_Status: "Estado sentimental",
  Conflicts_Over_Social_Media: "Conflictos por redes",
};

const interpretacionPorCampo = {
  Mental_Health_Score: "positivo",
  Addicted_Score: "negativo",
  Affects_Academic_Performance: "negativo",
  Avg_Daily_Usage_Hours: "negativo",
  Sleep_Hours_Per_Night: "positivo",
  Relationship_Status: "estado",
  Conflicts_Over_Social_Media: "comparativo",
};

const promedios = {
  Conflicts_Over_Social_Media: 4.2,
};

const colores = [
  "#2a9d8f",
  "#e76f51",
  "#264653",
  "#f4a261",
  "#1d3557",
  "#ffb703",
];

const generarAnalisis = (key, porcentaje) => {
  const label = camposHumanos[key] || key;
  const valorTexto = `${porcentaje}%`;

  if (key === "Mental_Health_Score") {
    if (porcentaje >= 85)
      return {
        icon: <FaCheckCircle color="#2a9d8f" />,
        texto: `Tu salud mental está en muy buen estado, reflejando un ${valorTexto} de estabilidad emocional. Se nota que sabes escucharte y cuidarte.`,
      };
    if (porcentaje >= 60)
      return {
        icon: <FaCheckCircle color="#4caf50" />,
        texto: `Tienes una salud mental bastante estable, con un nivel de ${valorTexto}. No es perfecto, pero vas bien y es importante seguirte acompañando con paciencia.`,
      };
    if (porcentaje >= 30)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `Tu estado emocional muestra señales de desgaste, con un ${valorTexto}. Tal vez estás pasando por momentos pesados. Hablar con alguien o darte un respiro puede ayudarte más de lo que crees.`,
      };
    return {
      icon: <FaTimesCircle color="#e76f51" />,
      texto: `Se percibe un estado emocional delicado, con apenas un ${valorTexto} en tu salud mental. No ignores lo que sientes. Hablar, pedir ayuda y hacer pausas son pasos valientes y necesarios.`,
    };
  }

  if (key === "Addicted_Score") {
    if (porcentaje >= 85)
      return {
        icon: <FaTimesCircle color="#e76f51" />,
        texto: `Tu nivel de uso de redes sociales es muy alto, alcanzando un ${valorTexto}. Esto puede estar robándote tiempo, atención y hasta energía mental. Reflexiona si necesitas una pausa digital.`,
      };
    if (porcentaje >= 60)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `Tu nivel de conexión con redes es elevado (${valorTexto}), y aunque no es extremo, podrías empezar a notar cómo influye en tu rutina o ánimo.`,
      };
    if (porcentaje >= 30)
      return {
        icon: <FaCheckCircle color="#4caf50" />,
        texto: `Tu nivel de uso de redes es moderado, con un ${valorTexto}. Parece que estás encontrando cierto equilibrio. Aún así, vale la pena revisar si usas redes por hábito o por elección.`,
      };
    return {
      icon: <FaCheckCircle color="#2a9d8f" />,
      texto: `Tienes un uso bastante saludable de redes sociales, con solo un ${valorTexto}. Mantener este balance no es fácil, pero lo estás logrando.`,
    };
  }

  if (key === "Affects_Academic_Performance") {
    if (porcentaje >= 85)
      return {
        icon: <FaTimesCircle color="#e76f51" />,
        texto: `Tu rendimiento académico está siendo fuertemente afectado, con un impacto estimado del ${valorTexto}. Es momento de replantear prioridades y buscar un mejor equilibrio.`,
      };
    if (porcentaje >= 60)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `Tu rutina parece estar afectando tu rendimiento académico en un ${valorTexto}. No es dramático, pero sí vale la pena hacer ajustes antes de que se complique más.`,
      };
    if (porcentaje >= 30)
      return {
        icon: <FaCheckCircle color="#4caf50" />,
        texto: `Tus estudios muestran un impacto moderado del ${valorTexto}. Puedes manejarlo, pero es bueno estar consciente y prevenir que crezca.`,
      };
    return {
      icon: <FaCheckCircle color="#2a9d8f" />,
      texto: `Tus hábitos no parecen estar interfiriendo con tu rendimiento escolar. Con un nivel de afectación del ${valorTexto}, estás manejando bien tu tiempo.`,
    };
  }

  return {
    icon: <FaInfoCircle />,
    texto: `Resultado de "${label}": ${valorTexto}.`,
  };
};


const generarData = (predictions, claves) => {
  const labels = [];
  const data = [];
  const backgroundColor = [];

  claves.forEach((key, i) => {
    if (key === "Student_ID") return;
    const raw = predictions[key];
    if (typeof raw === "number") {
      const porcentaje = parseFloat((raw * 10).toFixed(1));
      labels.push(camposHumanos[key] || key);
      data.push(porcentaje);
      backgroundColor.push(colores[i % colores.length]);
    }
  });

  return {
    labels,
    datasets: [
      {
        label: "Porcentaje (%)",
        data,
        backgroundColor,
      },
    ],
  };
};

const generarTextos = (
  predictions,
  claves,
  contextKey = "default",
  variables_por_modelo = {}
) => {
  return claves
    .filter(
      (key) => typeof predictions[key] === "number" && key !== "Student_ID"
    )
    .map((key, index) => {
      const porcentaje = parseFloat((predictions[key] * 10).toFixed(1));
      const { icon, texto } = generarAnalisis(key, porcentaje);
      const usadas = variables_por_modelo[key] || [];

      return {
        id: `${contextKey}-${key}-${porcentaje}-${index}`,
        icon,
        texto,
        usadas,
      };
    });
};

const Predicciones = forwardRef(
  ({ predictions, variables_por_modelo = {} }, ref) => {
    console.log("🔍 Variables por modelo:", variables_por_modelo);

    if (!predictions) return null;

    const clavesIniciales = ["Mental_Health_Score", "Addicted_Score"];
    const claveAcademica = "Affects_Academic_Performance";

    const clavesExtras = Object.keys(predictions).filter(
      (k) =>
        !clavesIniciales.includes(k) &&
        k !== "Student_ID" &&
        k !== claveAcademica
    );

    const data = generarData(predictions, clavesIniciales);
    const analisis = generarTextos(
      predictions,
      clavesIniciales,
      "principal",
      variables_por_modelo
    );
    const analisisAcademico = generarTextos(
      predictions,
      [claveAcademica],
      "academico",
      variables_por_modelo
    );


    return (
      <section className="predicciones" ref={ref}>
        <h3 style={{ marginBottom: "1rem" }}>
          📊 Análisis visual de tus predicciones
        </h3>

        <div
          className="grafica-card"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Bar
            data={data}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "Resultados principales (escala 1-10)",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.x}%`,
                  },
                },
              },
              scales: {
                x: {
                  min: 0,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
              },
            }}
          />
        </div>

        <div className="banners-analisis" style={{ marginTop: "1.5rem" }}>
          {analisis.map(({ id, icon, texto, usadas }) => {
            let borderColor = "#cde4f2";
            if (icon?.type === FaCheckCircle) borderColor = "#2a9d8f";
            if (icon?.type === FaExclamationTriangle) borderColor = "#f4a261";
            if (icon?.type === FaTimesCircle) borderColor = "#e76f51";

            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#f9f9f9",
                  border: `2px solid ${borderColor}`,
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  maxWidth: "800px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {icon}
                  <span style={{ color: "#333" }}>{texto}</span>
                </div>

                {usadas.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.7rem",
                      color: "#777",
                      fontStyle: "italic",
                      paddingLeft: "2rem",
                    }}
                  >
                    Variables usadas:{" "}
                    {usadas.map((v) => camposHumanos[v] || v).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {analisisAcademico.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#eef6fb",
              border: "2px solid #cde4f2",
              borderRadius: "10px",
              padding: "1rem",
              marginTop: "2rem",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <FaInfoCircle color="#0077b6" size={28} />
              <div>
                <strong style={{ color: "#0077b6" }}>
                  Evaluación de tu rendimiento académico
                </strong>
                <p style={{ margin: "0.3rem 0", color: "#333" }}>
                  {analisisAcademico[0].texto}
                </p>
              </div>
            </div>

            {analisisAcademico[0].usadas?.length > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.7rem",
                  color: "#555",
                  fontStyle: "italic",
                  paddingLeft: "2rem",
                }}
              >
                Variables usadas:{" "}
                {analisisAcademico[0].usadas
                  .map((v) => camposHumanos[v] || v)
                  .join(", ")}
              </div>
            )}
          </div>
        )}
      </section>
    );
  }
);

export default Predicciones;
