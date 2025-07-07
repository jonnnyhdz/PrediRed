import Plot from "react-plotly.js";

const LinealRegressionChart = ({
  predictions,
  userData,
  variables_por_modelo,
}) => {
  const target = "Mental_Health_Score";
  const usadas = variables_por_modelo?.[target] || [];
  const yPredValue = predictions?.[target];
  const porcentaje = (yPredValue || 0) * 10;

  // === Normalización ===
  const normalizeValue = (val) => {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "string") return val.length;
    if (typeof val === "boolean") return val ? 1 : 0;
    return val;
  };

  // === Preparar puntos ===
  const puntos = usadas
    .map((nombre) => ({
      x: normalizeValue(userData?.[nombre]),
      y: yPredValue || 0,
    }))
    .filter((p) => p.x !== null && p.x !== undefined);

  const xs = puntos.map((p) => p.x);
  const ys = puntos.map((p) => p.y);

  // === Calcular regresión lineal ===
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  const covXY = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0);
  const varX = xs.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);
  const slope = covXY / varX;
  const intercept = meanY - slope * meanX;

  const xsSorted = [...xs].sort((a, b) => a - b);
  const ysLine = xsSorted.map((x) => slope * x + intercept);

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
        🔹 <strong>Puntos azules</strong>: tus valores representados de forma
        individual.
        <br />
        🔴 <strong>Línea roja</strong>: tendencia general que estima cómo tus variables afectan tu nivel.
        <br />
        En este caso, el modelo estima que tu nivel de Salud Mental es de{" "}
        <strong>{porcentaje.toFixed(1)}%</strong>.
      </p>

      <Plot
        data={[
          {
            x: xs,
            y: ys,
            mode: "markers",
            type: "scatter",
            name: "Tus datos",
            marker: { color: "#3b82f6", size: 8 },
          },
          {
            x: xsSorted,
            y: ysLine,
            mode: "lines",
            type: "scatter",
            name: "Regresión lineal",
            line: { color: "#ef4444", width: 2 },
          },
        ]}
        layout={{
          title: "",
          xaxis: { title: "Valores normalizados de tus variables" },
          yaxis: { title: "Predicción de salud mental" },
          height: 450,
          margin: { t: 20, l: 50, r: 40, b: 60 },
          legend: {
            orientation: "h",
            x: 0.5,
            xanchor: "center",
            y: -0.3,
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LinealRegressionChart;
