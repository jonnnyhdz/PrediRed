import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

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

const evaluarImpacto = (campo, valor) => {
  if (campo === "Sleep_Hours_Per_Night") {
    return valor < 6 ? "⚡ Poco sueño: Aumenta adicción" : "✅ Buen sueño: Reduce adicción";
  }
  if (campo === "Avg_Daily_Usage_Hours") {
    return valor > 4 ? "⚡ Mucho uso: Aumenta adicción" : "✅ Uso moderado: Reduce adicción";
  }
  if (campo === "Conflicts_Over_Social_Media") {
    return valor > 5 ? "⚡ Muchos conflictos" : "✅ Pocos conflictos";
  }
  return valor > 5 ? "⚡ Alto impacto" : "✅ Bajo impacto";
};

const DecisionTreeChart = ({ predictions, variables_por_modelo, userData }) => {
  const target = "Addicted_Score";
  const score = predictions?.[target] ?? "N/A";
  const variables = variables_por_modelo?.[target] || [];

  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        const { width } = ref.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 1000), height: 500 });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const treeData = {
    name: `Nivel de adicción estimado: ${score}/10`,
    children: variables.map((v) => {
      const valor = userData?.[v] ?? "N/A";
      return {
        name: `${camposHumanos[v] || v}: ${valor}`,
        children: [
          {
            name: evaluarImpacto(v, valor),
          },
        ],
      };
    }),
  };

  // Define el color de las ramas: azul para variables, verde para hojas
  const renderCustomLinkPath = (linkDatum) => {
    const isLeaf = !linkDatum.target.children || linkDatum.target.children.length === 0;
    const strokeColor = isLeaf ? "#10b981" : "#3b82f6"; // verde o azul
    return (
      <path
        d={`M${linkDatum.source.x},${linkDatum.source.y}V${(linkDatum.source.y + linkDatum.target.y) / 2}H${linkDatum.target.x}V${linkDatum.target.y}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
      />
    );
  };

  return (
    <div
      ref={ref}
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
      <h3 style={{ marginBottom: "0.5rem" }}>🌳 Árbol de Decisión - Nivel de Adicción</h3>
      <p
        style={{
          fontSize: "15px",
          color: "#374151",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
          backgroundColor: "#fff7ed",
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: "4px solid #f59e0b",
          maxWidth: "900px",
        }}
      >
        <strong>¿Qué estás viendo?</strong> Este árbol de decisión te muestra cómo cada una de tus respuestas influye en la estimación del nivel de adicción.
        <br />
        🔵 <strong>Ramas azules</strong>: variables evaluadas por el modelo.
        <br />
        🟢 <strong>Ramas verdes</strong>: explican si tu respuesta aumenta o reduce el nivel de adicción estimado.
      </p>

      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          minWidth: "720px",
        }}
      >
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: dimensions.width / 2, y: 80 }}
          pathFunc="step"
          collapsible={false}
          zoomable={false}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          styles={{
            nodes: {
              node: {
                circle: { fill: "#3b82f6", r: 10 }, // Azul
                name: {
                  fontSize: "13px",
                  fill: "#1e293b",
                  fontFamily: "sans-serif",
                },
              },
              leafNode: {
                circle: { fill: "#10b981", r: 10 }, // Verde
                name: {
                  fontSize: "12px",
                  fill: "#065f46",
                  fontFamily: "sans-serif",
                },
              },
            },
          }}
          renderCustomLinkPath={renderCustomLinkPath}
        />
      </div>
    </div>
  );
};

export default DecisionTreeChart;
