import Plot from "react-plotly.js";

const LinealRegressionChart = ({
  predictions,
  userData,
  variables_por_modelo,
}) => {
  const target = "Mental_Health_Score";
  const usadas = variables_por_modelo?.[target] || [];
  const yPredValue = predictions?.[target];

  // Convierte cualquier valor a un número comprensible para la gráfica
  const normalizeValue = (val) => {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "string") return val.length; // "Mexico" -> 6
    if (typeof val === "boolean") return val ? 1 : 0;
    return val;
  };

  // Filtrar solo variables con valor válido
  const valoresValidos = usadas
    .map((v) => ({
      nombre: v,
      valor: normalizeValue(userData?.[v]),
    }))
    .filter((item) => item.valor !== null);

  const x = valoresValidos.map((v) => v.nombre);
  const y = valoresValidos.map((v) => v.valor);
  const yPred = y.map(() => yPredValue || 0);

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "#f9fafb",
        borderRadius: "20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        marginBottom: "2.5rem",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        📈 <span>Regresión Lineal - Salud Mental</span>
      </h3>

      <p
        style={{
          fontSize: "15px",
          color: "#444",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
          backgroundColor: "#eef2f7",
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: "4px solid #3b82f6",
        }}
      >
        <strong>¿Qué estás viendo?</strong> Esta gráfica muestra cómo tus
        respuestas influyeron en tu resultado de salud mental.
        <br />
        🔹 <strong>Barras azules</strong>: tus valores de entrada para cada
        variable.
        <br />
        🔴 <strong>Línea roja</strong>: el valor estimado por el modelo para
        todas las variables.
        <br />
        <em>Las variables sin respuesta fueron omitidas automáticamente.</em>
      </p>

      <div style={{ overflowX: "auto" }}>
        <Plot
          data={[
            {
              x,
              y,
              type: "bar",
              name: "Valores de entrada",
              marker: { color: "#3b82f6" },
            },
            {
              x,
              y: yPred,
              mode: "lines+markers",
              name: "Predicción de salud mental",
              line: { color: "#ef4444", width: 3 },
              marker: { color: "#ef4444", size: 6 },
            },
          ]}
          layout={{
            title: "",
            xaxis: {
              title: "Variables usadas",
              tickangle: -30,
              automargin: true,
            },
            yaxis: { title: "Valor estimado" },
            height: 420,
            margin: { t: 20, l: 40, r: 40, b: 120 }, // Aumentamos bottom para dar espacio a la leyenda
            legend: {
              orientation: "h",
              x: 0.5,
              y: -0.3,
              xanchor: "center",
            },
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default LinealRegressionChart;
