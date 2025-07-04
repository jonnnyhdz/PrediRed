import { useState } from "react";
import LinearRegressionChart from "./modelCharts/LinealRegressionChart";
import LogisticRegressionChart from "./modelCharts/LogisticRegressionChart";
import DecisionTreeChart from "./modelCharts/DecisionTreeChart";
import RandomForestChart from "./modelCharts/RandomForestChart";
import KMeansChart from "./modelCharts/KMeansChart";

const modelComponents = {
  linear: LinearRegressionChart,
  logistic: LogisticRegressionChart,
  decision: DecisionTreeChart,
  forest: RandomForestChart,
  kmeans: KMeansChart,
};

const modelOptions = [
  { key: "linear", label: "📈 Regresión Lineal", color: "linear-gradient(90deg, #60a5fa, #3b82f6)" },
  { key: "logistic", label: "📊 Regresión Logística", color: "linear-gradient(90deg, #4ade80, #22c55e)" },
  { key: "decision", label: "🌳 Árbol de Decisión", color: "linear-gradient(90deg, #fbbf24, #f59e0b)" },
  { key: "forest", label: "🌲 Random Forest", color: "linear-gradient(90deg, #fb923c, #f97316)" },
  { key: "kmeans", label: "🧩 Clustering (K-Means)", color: "linear-gradient(90deg, #a78bfa, #8b5cf6)" },
];

const ModelVisualizer = ({ predictions, userData, variables_por_modelo }) => {
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const SelectedComponent = modeloSeleccionado ? modelComponents[modeloSeleccionado] : null;

  return (
    <section style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🔬 Visualizador de Modelos</h2>
        <p style={{ fontSize: "15px", color: "#555" }}>
          Explora cómo diferentes modelos interpretan tus datos y generan predicciones. Selecciona un enfoque de análisis para visualizar los resultados.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        {modelOptions.map((model) => (
          <button
            key={model.key}
            onClick={() => setModeloSeleccionado(model.key)}
            style={{
              padding: "0.6rem 1.2rem",
              fontSize: "14px",
              border: "none",
              borderRadius: "999px",
              backgroundImage: model.color,
              color: "white",
              cursor: "pointer",
              fontWeight: modeloSeleccionado === model.key ? "bold" : "normal",
              boxShadow:
                modeloSeleccionado === model.key
                  ? "0 0 10px rgba(0,0,0,0.15)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {model.label}
          </button>
        ))}
      </div>

      {SelectedComponent ? (
        <SelectedComponent
          predictions={predictions}
          userData={userData}
          variables_por_modelo={variables_por_modelo}
        />
      ) : (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Selecciona un modelo para visualizar su análisis.
        </p>
      )}
    </section>
  );
};

export default ModelVisualizer;
