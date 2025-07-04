import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";

const KMeansChart = ({ predictions }) => {
  const { Avg_Daily_Usage_Hours, Sleep_Hours_Per_Night } = predictions;

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

  const historicalData = [
    { x: 8.0, y: 6.0, cluster: 1 },
    { x: 6.0, y: 3.0, cluster: 0 },
    { x: 4.0, y: 6.0, cluster: 0 },
    { x: 1.0, y: 6.0, cluster: 0 },
    { x: 10.0, y: 6.0, cluster: 1 },
    { x: 6.0, y: 6.0, cluster: 0 },
    { x: 6.0, y: 8.0, cluster: 0 },
    { x: 4.0, y: 6.0, cluster: 0 },
    { x: 3.0, y: 5.0, cluster: 0 },
    { x: 8.0, y: 7.0, cluster: 1 },
  ];

  const clusterNames = [
    "Alta actividad y poco sueño",
    "Uso moderado y buen descanso",
    "Bajo uso y descanso irregular",
  ];

  const grouped = [0, 1, 2].map((cluster) => {
    const puntos = historicalData.filter((d) => d.cluster === cluster);
    const x = puntos.map((d) => d.x);
    const y = puntos.map((d) => d.y);
    const centroid = [
      x.reduce((a, b) => a + b, 0) / x.length,
      y.reduce((a, b) => a + b, 0) / y.length,
    ];
    return { cluster, x, y, centroid };
  });

  const userPoint = [Avg_Daily_Usage_Hours, Sleep_Hours_Per_Night];
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

  const colors = ["#f87171", "#60a5fa", "#34d399"];

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
    marker: { color: "#555", symbol: "x", size: 12 },
    showlegend: false,
  }));

  const userTrace = {
    x: [userPoint[0]],
    y: [userPoint[1]],
    mode: "markers",
    type: "scatter",
    marker: { color: "#000", symbol: "star", size: 14 },
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
        📊 Clustering K-Means - Hábitos de Uso
      </h3>

      <p
        style={{
          fontSize: "15px",
          color: "#374151",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
          backgroundColor: "#ddd6fe",
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: "4px solid #8b5cf6",
          maxWidth: "900px",
        }}
      >
        <strong>¿Qué estás viendo?</strong> Esta gráfica agrupa a personas según
        su <strong>uso diario de redes</strong> y{" "}
        <strong>horas de sueño</strong>.
        <br />
        🔴 <strong>Puntos de colores</strong>: representan perfiles similares ya
        registrados.
        <br />❌ <strong>X grises</strong>: centro promedio de cada grupo
        (centroide).
        <br />⭐ <strong>Estrella negra</strong>: tú. Así se comparan tus
        hábitos con los grupos.
      </p>

      <Plot
        data={[...clusterData, ...centroids, userTrace]}
        layout={{
          title: "Distribución de perfiles según hábitos",
          xaxis: { title: "Horas en redes" },
          yaxis: { title: "Horas de sueño" },
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
            🔴{" "}
            <strong style={{ color: "#f87171" }}>
              Alta actividad y poco sueño:
            </strong>{" "}
            Mucho tiempo en redes sociales y pocas horas de descanso.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            🔵{" "}
            <strong style={{ color: "#60a5fa" }}>
              Uso moderado y buen descanso:
            </strong>{" "}
            Horas balanceadas de redes y sueño saludable.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            🟢{" "}
            <strong style={{ color: "#34d399" }}>
              Bajo uso y descanso irregular:
            </strong>{" "}
            Poco tiempo en redes pero con sueño desordenado.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KMeansChart;
