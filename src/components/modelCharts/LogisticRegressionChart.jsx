import Plot from "react-plotly.js";

// Valores de referencia promedio por variable (ajusta estos según tu dataset real)
const VALORES_REFERENCIA = {
  Age: 20,
  Gender: 1, // male
  Academic_Level: 2,
  Country: 10,
  Most_Used_Platform: 1,
  Avg_Daily_Usage_Hours: 4.5,
  Conflicts_Over_Social_Media: 5,
  Sleep_Hours_Per_Night: 6.8,
};

const camposHumanos = {
  Age: "Edad",
  Gender: "Género",
  Academic_Level: "Nivel Académico",
  Country: "País",
  Most_Used_Platform: "Red más usada",
  Avg_Daily_Usage_Hours: "Horas en redes sociales",
  Conflicts_Over_Social_Media: "Conflictos por redes",
  Sleep_Hours_Per_Night: "Horas de sueño",
};

const LogisticRegressionChart = ({ predictions, userData, variables_por_modelo }) => {
  const target = "Addicted_Score";
  const usadas = variables_por_modelo?.[target] || [];
  const probabilidad = (predictions?.[target] || 0) / 10;

  const x = usadas.filter(
    (v) => userData?.[v] !== undefined && VALORES_REFERENCIA?.[v] !== undefined
  );

  const yUsuario = x.map((v) => userData[v]);
  const yPromedio = x.map((v) => VALORES_REFERENCIA[v]);

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: "2rem",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>🧪 Regresión Logística - Nivel de Adicción</h3>

<p
  style={{
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
    backgroundColor: "#ecfdf5", // Fondo suave tipo ámbar
    padding: "1rem",
    borderRadius: "12px",
    borderLeft: "4px solid #10b981", // Borde ámbar
    maxWidth: "800px",
  }}
>
  <strong>¿Qué estás viendo?</strong> Esta gráfica compara tus respuestas personales con valores promedio tomados de una base de datos de referencia.
  <br />
  🟩 <strong>Barras verdes</strong>: tus respuestas individuales.
  <br />
  🟧 <strong>Barras naranjas</strong>: valores promedio usados por el modelo, calculados con datos reales de estudiantes de diferentes perfiles.
  <br />
  Esto permite visualizar qué tanto difieren tus respuestas del comportamiento general.
  <br /><br />
  En este caso, el modelo estima que tu nivel de adicción tiene una probabilidad de <strong>{(probabilidad * 100).toFixed(1)}%</strong>.
</p>



      <Plot
        data={[
          {
            x: x.map((v) => camposHumanos[v] || v),
            y: yUsuario,
            type: "bar",
            name: "Tus valores",
            marker: { color: "#10b981" },
          },
          {
            x: x.map((v) => camposHumanos[v] || v),
            y: yPromedio,
            type: "bar",
            name: "Promedio de referencia",
            marker: { color: "#f59e0b" },
          },
        ]}
        layout={{
          xaxis: { title: "Variables", tickangle: -35 },
          yaxis: { title: "Valor", zeroline: false },
          barmode: "group",
          height: 430,
          margin: { t: 20, l: 40, r: 40, b: 100 },
          legend: {
            orientation: "h",
            x: 0.5,
            y: -0.25,
            xanchor: "center",
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LogisticRegressionChart;
