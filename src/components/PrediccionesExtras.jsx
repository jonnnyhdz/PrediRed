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

function evaluar(valor, promedio) {
  if (valor > promedio + 1) return 'por encima de lo esperado';
  if (valor < promedio - 1) return 'por debajo de lo esperado';
  return 'dentro de un rango saludable';
}

function generarFrase(target, valor, promedio) {
  const concepto = frasesHumanas[target] || 'tu resultado';
  const evaluacion = evaluar(valor, promedio);
  return `Tus ${concepto} es de ${valor}, mientras que el promedio general es de ${promedio}. Estás ${evaluacion}.`;
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

  const ultima = predicciones[predicciones.length - 1];
  const { target, valor_usuario, promedio_general } = ultima;

  if (
    !target ||
    typeof valor_usuario !== 'number' ||
    typeof promedio_general !== 'number'
  ) {
    console.warn('❌ Predicción inválida descartada:', ultima);
    return null;
  }

  const frase = generarFrase(target, valor_usuario, promedio_general);
  const data = generarDatos(valor_usuario, promedio_general);

  return (
    <section className="predicciones" ref={ref}>
      <h3>💡 Predicción reciente</h3>
      <div className="predicciones-grid">
        <div className="grafica-card">
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
      </div>
    </section>
  );
});

export default PrediccionesExtras;
