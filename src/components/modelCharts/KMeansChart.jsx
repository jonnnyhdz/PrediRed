import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";

const KMeansChart = ({ predictions }) => {
  const { Addicted_Score, Mental_Health_Score, Affects_Academic_Performance } =
    predictions;

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Datos históricos simplificados
  const historicalData = [
    { x: 6, y: 5, cluster: 0 },
    { x: 8, y: 7, cluster: 1 },
    { x: 4, y: 4, cluster: 0 },
    { x: 9, y: 8, cluster: 1 },
    { x: 3, y: 3, cluster: 0 },
    { x: 2, y: 2, cluster: 0 },
    { x: 7, y: 8, cluster: 1 },
    { x: 5, y: 4, cluster: 0 },
    { x: 9, y: 9, cluster: 1 },
    { x: 7, y: 6, cluster: 1 },
  ];

  const clusterNames = [
    "Estado emocional equilibrado",
    "Posible sobrecarga emocional y académica",
  ];

  const grouped = [0, 1].map((cluster) => {
    const puntos = historicalData.filter((d) => d.cluster === cluster);
    const x = puntos.map((d) => d.x);
    const y = puntos.map((d) => d.y);
    const centroid = [
      x.reduce((a, b) => a + b, 0) / x.length,
      y.reduce((a, b) => a + b, 0) / y.length,
    ];
    return { cluster, x, y, centroid };
  });

  const userPoint = [Addicted_Score, Affects_Academic_Performance];
  const userClusterIndex = grouped.reduce((minIdx, g, i) => {
    const dist = Math.sqrt(
      Math.pow(userPoint[0] - g.centroid[0], 2) +
        Math.pow(userPoint[1] - g.centroid[1], 2)
    );
    const minDist = Math.sqrt(
      Math.pow(userPoint[0] - grouped[minIdx].centroid[0], 2) +
        Math.pow(userPoint[1] - grouped[minIdx].centroid[1], 2)
    );
    return dist < minDist ? i : minIdx;
  }, 0);

  const colors = ["#60a5fa", "#f87171"];

  const clusterData = grouped.map((g, i) => ({
    x: g.x,
    y: g.y,
    mode: "markers",
    type: "scatter",
    marker: { color: colors[i], size: 8 },
    showlegend: false,
  }));

  const centroids = grouped.map((g) => ({
    x: [g.centroid[0]],
    y: [g.centroid[1]],
    mode: "markers",
    type: "scatter",
    marker: { color: "#000", symbol: "x", size: 12 },
    showlegend: false,
  }));

  const userTrace = {
    x: [userPoint[0]],
    y: [userPoint[1]],
    mode: "markers",
    type: "scatter",
    marker: {
      color: colors[userClusterIndex],
      symbol: "star",
      size: 14,
      line: { width: 2, color: "#000" },
    },
    showlegend: false,
  };

  return (
    <div
      ref={chartContainerRef}
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
      <h3 style={{ marginBottom: "0.5rem" }}>
        📊 Clustering K-Means - Perfil Psicoacadémico
      </h3>

      <p
        style={{
          fontSize: "15px",
          color: "#4c1d95", // Texto morado oscuro
          lineHeight: "1.6",
          marginBottom: "1.5rem",
          backgroundColor: "#ede9fe", // Fondo lavanda claro
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: "4px solid #7c3aed", // Borde morado vibrante
          maxWidth: "900px",
        }}
      >
        <strong>¿Qué estás viendo?</strong> Esta gráfica agrupa perfiles según
        su nivel de <strong>adicción a redes</strong> y{" "}
        <strong>afectación académica</strong>. Estos dos factores permiten
        detectar patrones en el comportamiento digital de los estudiantes.
        <br />
        🔵 <strong>Puntos azules</strong>: perfiles con equilibrio emocional.
        <br />
        🔴 <strong>Puntos rojos</strong>: posibles señales de sobrecarga.
        <br />❌ <strong>X negras</strong>: centro de cada grupo.
        <br />⭐ <strong>Estrella</strong>: tú, posicionado según tus propias
        respuestas.
      </p>

      <Plot
        data={[...clusterData, ...centroids, userTrace]}
        layout={{
          title: "Agrupación según Adicción y Rendimiento",
          xaxis: { title: "Nivel de Adicción (0-10)" },
          yaxis: { title: "Afectación Académica (0-10)" },
          showlegend: false,
          width: chartWidth,
          height: 450,
          margin: { t: 40, r: 30, l: 50, b: 50 },
          autosize: true,
        }}
        config={{ responsive: true }}
      />

      <div
        style={{
          marginTop: "1.5rem",
          fontSize: "14px",
          maxWidth: "900px",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <p>
          <strong>Tu perfil fue clasificado como:</strong>{" "}
          <span style={{ color: colors[userClusterIndex], fontWeight: 600 }}>
            {clusterNames[userClusterIndex]}
          </span>
        </p>

        <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            🔵{" "}
            <strong style={{ color: "#60a5fa" }}>
              Estado emocional equilibrado:
            </strong>{" "}
            Indica que tu nivel de adicción y afectación académica están dentro
            de rangos saludables.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            🔴{" "}
            <strong style={{ color: "#f87171" }}>
              Posible sobrecarga emocional y académica:
            </strong>{" "}
            Tus respuestas sugieren que podrías estar experimentando altos
            niveles de uso digital y dificultades escolares.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KMeansChart;
