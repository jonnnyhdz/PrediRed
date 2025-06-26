import { useState } from 'react'
import { enviarFormulario } from '../services/api'

const opciones = {
  Gender: {
    'masculino': 'male',
    'femenino': 'female'
  },
  Academic_Level: {
    'secundaria': 'high school',
    'preparatoria': 'high school',
    'licenciatura': 'undergraduate',
    'posgrado': 'graduate'
  },
  Most_Used_Platform: {
    'facebook': 'facebook',
    'instagram': 'instagram',
    'kakaotalk': 'kakaotalk',
    'line': 'line',
    'linkedin': 'linkedin',
    'snapchat': 'snapchat',
    'tiktok': 'tiktok',
    'twitter': 'twitter',
    'vkontakte': 'vkontakte',
    'wechat': 'wechat',
    'whatsapp': 'whatsapp',
    'youtube': 'youtube'
  },
  Affects_Academic_Performance: {
    'sí': 'yes',
    'no': 'no'
  },
  Relationship_Status: {
    'soltero': 'single',
    'en una relación': 'in relationship',
    'es complicado': 'complicated'
  }
}

// Extraídos dinámicamente desde el Excel
const paises = [
  'Afghanistan', 'Albania', 'Andorra', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
  'Bolivia', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
  'Colombia', 'Costa Rica', 'Croatia', 'Cuba', 'Czech Republic',
  'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany',
  'Greece', 'Guatemala', 'Honduras', 'Hungary', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
  'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico', 'Moldova', 'Monaco',
  'Morocco', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria',
  'Norway', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia',
  'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Thailand', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam'
]

export default function Formulario({ onPredicciones }) {
  const [form, setForm] = useState({
    Student_ID: '',
    Age: '',
    Gender: '',
    Academic_Level: '',
    Country: '',
    Avg_Daily_Usage_Hours: '',
    Most_Used_Platform: '',
    Affects_Academic_Performance: '',
    Sleep_Hours_Per_Night: '',
    Relationship_Status: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const traducirCampos = (data) => {
    const traducido = { ...data }

    traducido.Gender = opciones.Gender[data.Gender.toLowerCase()] || data.Gender
    traducido.Academic_Level = opciones.Academic_Level[data.Academic_Level.toLowerCase()] || data.Academic_Level
    traducido.Most_Used_Platform = opciones.Most_Used_Platform[data.Most_Used_Platform.toLowerCase()] || data.Most_Used_Platform
    traducido.Affects_Academic_Performance = opciones.Affects_Academic_Performance[data.Affects_Academic_Performance.toLowerCase()] || data.Affects_Academic_Performance
    traducido.Relationship_Status = opciones.Relationship_Status[data.Relationship_Status.toLowerCase()] || data.Relationship_Status

    return traducido
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  const formData = { ...form }

  if (!formData.Student_ID) {
    formData.Student_ID = Math.floor(Math.random() * 1000000)
    setForm(prev => ({ ...prev, Student_ID: formData.Student_ID }))

    // ✅ Guardar en localStorage
    localStorage.setItem('student_id', formData.Student_ID)
  }

  try {
    const traducido = traducirCampos(formData)
const data = await enviarFormulario(traducido)
onPredicciones({
  ...data.predictions,
  Student_ID: traducido.Student_ID
})

  } catch (err) {
    console.error(err)
    alert('❌ Error al obtener predicciones')
  }
}


  return (
    <form id="formulario" onSubmit={handleSubmit}>
      <h2>Predicción personalizada</h2>
      <input type="hidden" name="Student_ID" value={form.Student_ID} />

      <div className="form-grid">
        <div className="form-group">
          <label>Edad</label>
          <input type="number" name="Age" placeholder="Edad" value={form.Age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>País</label>
          <select name="Country" value={form.Country} onChange={handleChange}>
            <option value="">Selecciona un país</option>
            {paises.map((pais, idx) => (
              <option key={idx} value={pais}>{pais}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Horas de uso diario</label>
          <input type="number" name="Avg_Daily_Usage_Hours" placeholder="Ej. 3.5" value={form.Avg_Daily_Usage_Hours} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Horas de sueño</label>
          <input type="number" name="Sleep_Hours_Per_Night" placeholder="Ej. 7" value={form.Sleep_Hours_Per_Night} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Género</label>
          <select name="Gender" value={form.Gender} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nivel académico</label>
          <select name="Academic_Level" value={form.Academic_Level} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="secundaria">Secundaria</option>
            <option value="preparatoria">Preparatoria</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="posgrado">Posgrado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Red social más usada</label>
          <select name="Most_Used_Platform" value={form.Most_Used_Platform} onChange={handleChange}>
            <option value="">Selecciona</option>
            {Object.keys(opciones.Most_Used_Platform).map((key) => (
              <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>¿Afecta tu rendimiento académico?</label>
          <select name="Affects_Academic_Performance" value={form.Affects_Academic_Performance} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="sí">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Estado sentimental</label>
          <select name="Relationship_Status" value={form.Relationship_Status} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="soltero">Soltero/a</option>
            <option value="en una relación">En una relación</option>
            <option value="es complicado">Es complicado</option>
          </select>
        </div>
      </div>

      <button type="submit">Enviar</button>
    </form>
  )
}
