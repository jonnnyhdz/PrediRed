import { forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const frasesHumanas = {
  Mental_Health_Score: 'salud mental',
  Addicted_Score: 'adicción a redes',
  Conflicts_Over_Social_Media: 'conflictos en redes sociales',
  Avg_Daily_Usage_Hours: 'uso diario de redes',
  Sleep_Hours_Per_Night: 'horas de sueño',
  Affects_Academic_Performance: 'rendimiento académico',
  Relationship_Status: 'estado de relación'
};

function generarFrase(target, valor, promedio) {
  if (typeof valor !== 'number' || typeof promedio !== 'number') return 'Resultado no disponible.';
  const concepto = frasesHumanas[target] || 'tu resultado';
  const evaluacion =
    valor > promedio + 1
      ? 'por encima de lo esperado'
      : valor < promedio - 1
      ? 'por debajo de lo esperado'
      : 'dentro de un rango saludable';
  return `Tu ${concepto} es de ${valor}, mientras que el promedio general es de ${promedio}. Estás ${evaluacion}.`;
}

function generarDatos(valor, promedio) {
  return {
    labels: ['Tú', 'Promedio'],
    datasets: [
      {
        label: 'Comparación',
        data: [valor, promedio],
        backgroundColor: ['#1d3557', '#e63946'],
        borderRadius: 6
      }
    ]
  };
}

const PrediccionesExtras = forwardRef(({ predicciones }, ref) => {
  if (!predicciones || predicciones.length === 0) return null;

  const ultimaPregunta = predicciones[predicciones.length - 1];

  if (!ultimaPregunta || !ultimaPregunta.resultados) return null;

  return (
    <section className="predicciones" ref={ref}>
      {/* ✅ Banner informativo con ícono ℹ️ */}
      <div style={{
        backgroundColor: '#f1f5f9',
        borderLeft: '4px solid #1d3557',
        padding: '12px 16px',
        marginBottom: '20px',
        borderRadius: '6px',
        color: '#1d3557',
        fontSize: '0.95rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        ℹ️ <strong>Comparación con el promedio general:</strong> Tus resultados se comparan con el promedio de respuestas recolectadas de otros estudiantes para ayudarte a saber si estás por encima, por debajo o en un rango saludable.
      </div>

      <h3>🔍 Respuesta a: "{ultimaPregunta.pregunta_original}"</h3>

      {ultimaPregunta.respuesta_final && (
        <div className="respuesta-final">
          <h4 style={{ margin: '12px 0 20px', fontSize: '1.05rem', color: '#1d3557' }}>
            🧠 Conclusión: {ultimaPregunta.respuesta_final}
          </h4>
        </div>
      )}

      <div className="predicciones-grid">
        {ultimaPregunta.resultados.map((res, index) => {
          const { target, valor_usuario, promedio_general } = res;
          if (
            !target ||
            typeof valor_usuario !== 'number' ||
            typeof promedio_general !== 'number'
          ) {
            return null;
          }

          const frase = generarFrase(target, valor_usuario, promedio_general);
          const data = generarDatos(valor_usuario, promedio_general);

          return (
            <div className="grafica-card" key={index}>
              <div style={{ height: '240px' }}>
                <Bar
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: frasesHumanas[target] || 'Resultado',
                        font: { size: 16 }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        suggestedMax: Math.max(valor_usuario, promedio_general) + 2
                      }
                    }
                  }}
                />
              </div>
              <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>{frase}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default PrediccionesExtras;
