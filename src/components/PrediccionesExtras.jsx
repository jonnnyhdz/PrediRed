import { forwardRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

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
    valor > promedio + 1 ? 'por encima de lo esperado' :
    valor < promedio - 1 ? 'por debajo de lo esperado' :
    'dentro de un rango saludable';
  return `Tu nivel de ${concepto} es de ${valor}, mientras que el promedio general es de ${promedio}. Estás ${evaluacion}.`;
}

function getChartByTarget(target, valor, promedio, porcentaje) {
  const color = '#8b5cf6';

  if (["Mental_Health_Score", "Addicted_Score", "Affects_Academic_Performance"].includes(target)) {
    // Doughnut para porcentajes
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '280px', margin: '0 auto' }}>
        <Doughnut
          data={{
            labels: ['Tu resultado', 'Restante'],
            datasets: [{
              data: [porcentaje, 100 - porcentaje],
              backgroundColor: [color, '#ede9fe'],
              borderWidth: 1
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }}
          style={{ height: '250px', width: '250px' }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#4c1d95'
        }}>
          {porcentaje}%
        </div>
      </div>
    );
  }

  if (["Avg_Daily_Usage_Hours", "Sleep_Hours_Per_Night"].includes(target)) {
    // Barras para horas
    return (
      <Bar
        data={{
          labels: ['Tú', 'Promedio'],
          datasets: [{
            label: frasesHumanas[target],
            data: [valor, promedio],
            backgroundColor: [color, '#ddd6fe']
          }]
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, suggestedMax: 10 }
          }
        }}
      />
    );
  }

  if (["Conflicts_Over_Social_Media", "Relationship_Status"].includes(target)) {
    // Radar para variables emocionales/sociales
    return (
      <Radar
        data={{
          labels: ['Tú', 'Promedio'],
          datasets: [{
            label: frasesHumanas[target],
            data: [valor, promedio],
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            borderColor: color,
            borderWidth: 2
          }]
        }}
        options={{
          responsive: true,
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: { stepSize: 2 }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }}
      />
    );
  }

  return null;
}

const PrediccionesExtras = forwardRef(({ predicciones }, ref) => {
  if (!predicciones || predicciones.length === 0) return null;

  const ultimaPregunta = predicciones[predicciones.length - 1];
  if (!ultimaPregunta || !ultimaPregunta.resultados || ultimaPregunta.resultados.length === 0) return null;

  const { pregunta_original, respuesta_final, resultados } = ultimaPregunta;
  const { target, valor_usuario, promedio_general } = resultados[0];
  const frase = generarFrase(target, valor_usuario, promedio_general);
  const porcentaje = Math.round((valor_usuario / 10) * 100);

  const grafica = getChartByTarget(target, valor_usuario, promedio_general, porcentaje);

  return (
    <section className="predicciones" ref={ref}>
      <div style={{
        backgroundColor: '#f3e8ff',
        borderLeft: '5px solid #8b5cf6',
        padding: '12px 16px',
        marginBottom: '24px',
        borderRadius: '6px',
        color: '#4c1d95',
        fontSize: '0.95rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
      }}>
        🧪 <strong>Visualización de tu resultado:</strong> Esta gráfica muestra tu situación actual comparada con promedios de estudiantes similares.
      </div>

      <h3 style={{ marginBottom: '10px' }}>🔍 Respuesta a: <em>"{pregunta_original}"</em></h3>

      {respuesta_final && (
        <div className="respuesta-final" style={{ marginBottom: '24px' }}>
          <div style={{
            background: '#ede9fe',
            padding: '16px',
            borderRadius: '8px',
            color: '#4c1d95',
            fontSize: '0.95rem',
            lineHeight: '1.5em',
            whiteSpace: 'pre-line',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ marginBottom: '8px' }}>🧠 <strong>Conclusión personalizada</strong></h4>
            {respuesta_final.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="grafica-card" style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        maxWidth: '450px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {grafica}
        <p style={{
          marginTop: '16px',
          fontSize: '0.95rem',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          color: '#333'
        }}>{frase}</p>
      </div>
    </section>
  );
});

export default PrediccionesExtras;
