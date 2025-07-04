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
  const tipo = interpretacionPorCampo[key] || "neutro";
  const label = camposHumanos[key] || key;

  if (key === "Conflicts_Over_Social_Media") {
    const promedio = promedios[key] * 10;
    if (porcentaje < promedio - 10)
      return {
        icon: <FaCheckCircle color="#2a9d8f" />,
        texto: `Tu nivel de conflictos es bajo (${porcentaje}%) y menor al promedio (${promedio}%). Bien ahí.`,
      };
    if (porcentaje <= promedio + 10)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `Tu nivel de conflictos es similar al promedio (${porcentaje}% vs ${promedio}%). Mantente alerta.`,
      };
    return {
      icon: <FaTimesCircle color="#e76f51" />,
      texto: `Tu nivel de conflictos es alto (${porcentaje}%), por encima del promedio (${promedio}%). Considera mejorar.`,
    };
  }

  if (tipo === "estado") {
    return {
      icon: <FaHeart color="#d62828" />,
      texto: `Tu estado sentimental actual tiene un valor de ${porcentaje}%.`,
    };
  }

  if (tipo === "positivo") {
    if (porcentaje >= 85)
      return {
        icon: <FaCheckCircle color="#2a9d8f" />,
        texto: `"${label}" es excelente (${porcentaje}%). Sigue así.`,
      };
    if (porcentaje >= 60)
      return {
        icon: <FaCheckCircle color="#4caf50" />,
        texto: `"${label}" está bien (${porcentaje}%). Vas por buen camino.`,
      };
    if (porcentaje >= 30)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `Necesitas mejorar en "${label}" (${porcentaje}%).`,
      };
    return {
      icon: <FaTimesCircle color="#e76f51" />,
      texto: `Nivel muy bajo en "${label}" (${porcentaje}%). Atiéndelo.`,
    };
  }

  if (tipo === "negativo") {
    if (porcentaje >= 85)
      return {
        icon: <FaTimesCircle color="#e76f51" />,
        texto: `Alto nivel de "${label}" (${porcentaje}%). Podría afectarte.`,
      };
    if (porcentaje >= 60)
      return {
        icon: <FaExclamationTriangle color="#f4a261" />,
        texto: `"${label}" es elevado (${porcentaje}%). Cuidado.`,
      };
    if (porcentaje >= 30)
      return {
        icon: <FaCheckCircle color="#4caf50" />,
        texto: `"${label}" es moderado (${porcentaje}%). Aceptable.`,
      };
    return {
      icon: <FaCheckCircle color="#2a9d8f" />,
      texto: `Bajo nivel de "${label}" (${porcentaje}%). Todo bajo control.`,
    };
  }

  return { icon: <FaInfoCircle />, texto: `"${label}": ${porcentaje}%.` };
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
    const [extraSeleccionada, setExtraSeleccionada] = useState(null);

    const botonesExtras = [
      {
        key: "Avg_Daily_Usage_Hours",
        label: "Análisis de horas en redes",
        icon: <FaMobileAlt style={{ color: "#ffffff", fontSize: "1.2rem" }} />,
        gradient:
          "linear-gradient(to right,rgb(241, 107, 17),rgb(253, 220, 90))", // rojo → amarillo
      },
      {
        key: "Sleep_Hours_Per_Night",
        label: "Calidad de sueño",
        icon: <FaBed style={{ color: "#ffffff", fontSize: "1.2rem" }} />,
        gradient: "linear-gradient(to right, #2193b0, #6dd5ed)", // azul claro
      },
      {
        key: "Relationship_Status",
        label: "Estado sentimental",
        icon: <FaHeart style={{ color: "#ffffff", fontSize: "1.2rem" }} />,
        gradient: "linear-gradient(to right, #ff416c, #ff4b2b)", // rosa → rojo intenso
      },
    ];

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
    const analisisExtraSeleccionada = extraSeleccionada
      ? generarTextos(
          predictions,
          [extraSeleccionada],
          "extra",
          variables_por_modelo
        )
      : [];

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

        {clavesExtras.length > 0 && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <p style={{ marginBottom: "1rem", color: "#333" }}>
              Para ver más predicciones, selecciona la de tu preferencia:
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div className="extra-buttons-container">
                {botonesExtras.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setExtraSeleccionada(btn.key)}
                    className="btn-extra"
                    style={{ background: btn.gradient }}
                  >
                    <span className="icon">{btn.icon}</span>
                    <span className="text">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {extraSeleccionada && (
          <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            {analisisExtraSeleccionada.map(({ id, icon, texto, usadas }) => {
              const raw = predictions[extraSeleccionada];
              const porcentaje = parseFloat((raw * 10).toFixed(1));

              // Definimos el rango ideal por campo
              const ideal =
                {
                  Avg_Daily_Usage_Hours: 30, // hasta 3 hrs (3 * 10)
                  Sleep_Hours_Per_Night: 70, // ideal 7 hrs (7 * 10)
                  Relationship_Status: 50, // valor neutro
                }[extraSeleccionada] || 50;

              // Determinar color del progreso
              const tipo =
                interpretacionPorCampo[extraSeleccionada] || "neutro";
              let colorBarra = "#2a9d8f"; // verde

              if (tipo === "positivo") {
                if (porcentaje < ideal - 20) colorBarra = "#e76f51"; // rojo
                else if (porcentaje < ideal - 10) colorBarra = "#f4a261"; // naranja
              } else if (tipo === "negativo") {
                if (porcentaje > ideal + 20) colorBarra = "#e76f51";
                else if (porcentaje > ideal + 10) colorBarra = "#f4a261";
              }

              return (
                <div
                  key={id}
                  style={{
                    background: "#fdfdfd",
                    border: "2px solid #ccc",
                    borderRadius: "12px",
                    padding: "1rem 1.5rem",
                    marginBottom: "2rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {icon} <strong style={{ color: "#444" }}>{texto}</strong>
                  </div>

                  <div style={{ marginTop: "0.7rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "0.2rem",
                        color: "#666",
                      }}
                    >
                      <span>0%</span>
                      <span>Ideal: {ideal}%</span>
                      <span>100%</span>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        height: "14px",
                        background: "#e0e0e0",
                        borderRadius: "7px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${porcentaje}%`,
                          background: colorBarra,
                          height: "100%",
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: `${ideal}%`,
                          top: 0,
                          bottom: 0,
                          width: "2px",
                          background: "#333",
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                  {usadas.length > 0 && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.7rem",
                        color: "#777",
                        fontStyle: "italic",
                        paddingLeft: "1rem",
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
        )}
      </section>
    );
  }
);

export default Predicciones;
