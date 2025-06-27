import { useState } from "react";
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
  Avg_Daily_Usage_Hours: "Horas en redes",
  Sleep_Hours_Per_Night: "Horas de sueño",
  Relationship_Status: "Estado sentimental",
  Conflicts_Over_Social_Media: "Conflictos por redes",
};

const interpretacionPorCampo = {
  Mental_Health_Score: "positivo",
  Addicted_Score: "negativo",
  Affects_Academic_Performance: "negativo",
  Avg_Daily_Usage_Hours: "negativo",
  Sleep_Hours_Per_Night: "positivo",
  Relationship_Status: "neutro",
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
      return `✅ Tu nivel de conflictos es bajo (${porcentaje}%) y menor al promedio (${promedio}%). Bien ahí.`;
    if (porcentaje <= promedio + 10)
      return `🟠 Tu nivel de conflictos es similar al promedio (${porcentaje}% vs ${promedio}%). Mantente alerta.`;
    return `🔴 Tu nivel de conflictos es alto (${porcentaje}%), por encima del promedio (${promedio}%). Considera mejorar.`;
  }

  if (tipo === "positivo") {
    if (porcentaje >= 85)
      return `✅ "${label}" es excelente (${porcentaje}%). Sigue así.`;
    if (porcentaje >= 60)
      return `🟢 "${label}" está bien (${porcentaje}%). Vas por buen camino.`;
    if (porcentaje >= 30)
      return `🟠 Necesitas mejorar en "${label}" (${porcentaje}%).`;
    return `🔴 Nivel muy bajo en "${label}" (${porcentaje}%). Atiéndelo.`;
  }

  if (tipo === "negativo") {
    if (porcentaje >= 85)
      return `🔴 Alto nivel de "${label}" (${porcentaje}%). Podría afectarte.`;
    if (porcentaje >= 60)
      return `🟠 "${label}" es elevado (${porcentaje}%). Cuidado.`;
    if (porcentaje >= 30)
      return `🟢 "${label}" es moderado (${porcentaje}%). Aceptable.`;
    return `✅ Bajo nivel de "${label}" (${porcentaje}%). Todo bajo control.`;
  }

  return `ℹ️ "${label}": ${porcentaje}%.`;
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

const generarTextos = (predictions, claves, contextKey = "default") => {
  return claves
    .filter(
      (key) => typeof predictions[key] === "number" && key !== "Student_ID"
    )
    .map((key, index) => {
      const porcentaje = parseFloat((predictions[key] * 10).toFixed(1));
      const texto = generarAnalisis(key, porcentaje);
      return {
        id: `${contextKey}-${key}-${porcentaje}-${index}`,
        texto,
      };
    });
};

export default function Predicciones({ predictions }) {
  const [verExtras, setVerExtras] = useState(false);

  if (!predictions) return null;

  const clavesIniciales = [
    "Mental_Health_Score",
    "Addicted_Score",
    "Affects_Academic_Performance",
  ];
  const clavesExtras = Object.keys(predictions).filter(
    (k) => !clavesIniciales.includes(k) && k !== "Student_ID"
  );

  const data = generarData(predictions, clavesIniciales);
  const analisis = generarTextos(predictions, clavesIniciales, "principal");

  const dataExtras = generarData(predictions, clavesExtras);
  const analisisExtras = generarTextos(predictions, clavesExtras, "extra");

  return (
    <section className="predicciones">
      <h3>📊 Análisis visual de tus predicciones</h3>

      <div className="grafica-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
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

      <div className="textos-analisis" style={{ marginTop: "1.5rem" }}>
        {analisis.map(({ id, texto }) => (
          <p key={id}>{texto}</p>
        ))}
      </div>

      {clavesExtras.length > 0 && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={() => setVerExtras(!verExtras)}>
            {verExtras
              ? "Ocultar predicciones adicionales"
              : "Ver más predicciones"}
          </button>
        </div>
      )}

      {verExtras && (
        <>
          <div className="grafica-card" style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <Bar
              data={dataExtras}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: "Predicciones adicionales (escala 1-10)",
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

          <div className="textos-analisis" style={{ marginTop: "1.5rem" }}>
            {analisisExtras.map(({ id, texto }) => (
              <p key={id}>{texto}</p>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
