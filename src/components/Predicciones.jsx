import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
)

const camposHumanos = {
  Mental_Health_Score: 'Salud mental',
  Addicted_Score: 'Adicción a redes',
  Conflicts_Over_Social_Media: 'Conflictos sociales'
}

// Campos y su dirección interpretativa
const interpretacionPorCampo = {
  Mental_Health_Score: 'positivo',
  Addicted_Score: 'negativo',
  Conflicts_Over_Social_Media: 'negativo'
}


const colores = ['#2a9d8f', '#e76f51', '#264653']

const generarAnalisis = (key, porcentaje) => {
  const tipo = interpretacionPorCampo[key] || 'positivo'
  const label = camposHumanos[key]

  if (tipo === 'positivo') {
    if (porcentaje >= 85) return `✅ Tu nivel de "${label}" es excelente (${porcentaje}%). Sigue cuidándote.`
    if (porcentaje >= 60) return `🟢 "${label}" está en buen estado (${porcentaje}%). Vas bien.`
    if (porcentaje >= 30) return `🟠 Podrías mejorar tu "${label}" (${porcentaje}%). Reflexiona al respecto.`
    return `🔴 Tu nivel de "${label}" es bajo (${porcentaje}%). Podría ser preocupante.`
  } else {
    if (porcentaje >= 85) return `🔴 Alto nivel de "${label}" (${porcentaje}%). Considera tomar acción.`
    if (porcentaje >= 60) return `🟠 "${label}" está elevado (${porcentaje}%). Mantente alerta.`
    if (porcentaje >= 30) return `🟢 "${label}" es moderado (${porcentaje}%). Dentro de lo aceptable.`
    return `✅ "${label}" está muy bajo (${porcentaje}%). Todo bajo control.`
  }
}


const generarData = (predictions) => {
  const labels = []
  const data = []
  const backgroundColor = []

  Object.entries(predictions).forEach(([key, value], i) => {
    if (key in camposHumanos && typeof value === 'number') {
      labels.push(camposHumanos[key])
      data.push(parseFloat((value * 10).toFixed(1)))
      backgroundColor.push(colores[i % colores.length])
    }
  })

  return {
    labels,
    datasets: [
      {
        label: 'Porcentaje (%)',
        data,
        backgroundColor
      }
    ]
  }
}

const generarTextos = (predictions) => {
  return Object.entries(predictions)
    .filter(([key]) => key in camposHumanos)
    .map(([key, valor]) => {
      const porcentaje = parseFloat((valor * 10).toFixed(1))
      return `${generarAnalisis(key, porcentaje)} (${porcentaje}%)`
    })
}

export default function Predicciones({ predictions }) {
  if (!predictions) return null

  const data = generarData(predictions)
  const analisis = generarTextos(predictions)

  return (
    <section className="predicciones">
      <h3>📊 Análisis visual de tus predicciones</h3>
      <div className="grafica-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Bar
          data={data}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Predicciones estimadas (escala del 1 al 10)'
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.parsed.x}%`
                }
              }
            },
            scales: {
              x: {
                min: 0,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`
                }
              }
            }
          }}
        />
      </div>

      <div className="textos-analisis" style={{ marginTop: '1.5rem' }}>
        {analisis.map((linea, i) => (
          <p key={i}>{linea}</p>
        ))}
      </div>
    </section>
  )
}
