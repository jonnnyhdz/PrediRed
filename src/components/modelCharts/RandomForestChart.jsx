import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";

const RandomForestChart = ({ predictions, variables_por_modelo, userData }) => {
  const target = "Addicted_Score";
  const score = predictions?.[target] ?? "N/A";
  const usedVariables = variables_por_modelo?.[target] || [];

  const featureImportances = {
    Avg_Daily_Usage_Hours: 0.369,
    Age: 0.148,
    Sleep_Hours_Per_Night: 0.145,
    Conflicts_Over_Social_Media: 0.089,
    Most_Used_Platform: 0.078,
    Country: 0.076,
    Academic_Level: 0.054,
    Gender: 0.041,
  };

  const camposHumanos = {
    Age: "Edad",
    Gender: "Género",
    Academic_Level: "Nivel académico",
    Country: "País",
    Most_Used_Platform: "Red social más usada",
    Avg_Daily_Usage_Hours: "Horas en redes",
    Sleep_Hours_Per_Night: "Horas de sueño",
    Conflicts_Over_Social_Media: "Conflictos en redes",
  };

  // Solo mostrar importancias de variables realmente usadas
  const datosGraficados = usedVariables
    .filter((key) => key in featureImportances)
    .map((key) => ({
      label: camposHumanos[key] || key,
      importancia: featureImportances[key],
      valorUsuario: userData?.[key] ?? "N/A",
    }));

  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        padding: "1.5rem",
        background: "#ffffffcc",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        marginBottom: "2rem",
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>🌲 Random Forest - Nivel de Adicción</h3>
      <p
        style={{
          fontSize: "15px",
          color: "#374151",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
          backgroundColor: "#fff7ed",
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: "4px solid #f97316",
          maxWidth: "900px",
        }}
      >
        <strong>¿Qué estás viendo?</strong> Este gráfico de barras muestra qué tanto peso tuvo cada una de tus respuestas en el resultado de adicción estimado por el modelo Random Forest.
        <br />
        🟧 <strong>Barras naranjas</strong>: representan el nivel de influencia de tus variables personales.
        <br />
        🧠 <strong>Predicción final</strong>: El modelo estimó que tu nivel de adicción es <strong>{score}/10</strong>.
        <br />
        <em>Mientras más larga es la barra, mayor fue el impacto de esa respuesta.</em>
      </p>

      <Plot
        data={[
          {
            type: "bar",
            x: datosGraficados.map((d) => d.importancia),
            y: datosGraficados.map((d) => d.label),
            orientation: "h",
            text: datosGraficados.map(
              (d) =>
                `${d.label}<br>Tu respuesta: ${d.valorUsuario}<br>Importancia: ${(d.importancia * 100).toFixed(1)}%`
            ),
            hoverinfo: "text",
            marker: {
              color: "rgba(251, 146, 60, 0.8)",
              line: {
                color: "#ea580c",
                width: 1.5,
              },
            },
          },
        ]}
        layout={{
          title: "Importancia de cada variable según Random Forest",
          xaxis: {
            title: "Nivel de influencia",
            range: [
              0,
              Math.max(...datosGraficados.map((d) => d.importancia)) + 0.05,
            ],
          },
          margin: { l: 160, r: 20, t: 40, b: 40 },
          width: chartWidth,
          height: 500,
        }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  );
};

export default RandomForestChart;
