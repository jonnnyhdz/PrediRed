import { useState } from "react";
import { enviarFormulario } from "../services/api";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaSnapchat,
  FaLine,
  FaVk,
  FaWeixin,
  FaComments
} from "react-icons/fa";
import Swal from "sweetalert2";



const opciones = {
  Gender: { masculino: "male", femenino: "female" },
  Academic_Level: {
    secundaria: "high school",
    preparatoria: "high school",
    licenciatura: "undergraduate",
    posgrado: "graduate",
  },
Most_Used_Platform: {
  facebook: "facebook",
  instagram: "instagram",
  tiktok: "tiktok",
  twitter: "twitter",
  whatsapp: "whatsapp",
  youtube: "youtube",
  linkedin: "linkedin",
  snapchat: "snapchat",
  kakaotalk: "kakaotalk",
  line: "line",
  vkontakte: "vkontakte",
  wechat: "wechat",
},

  Relationship_Status: {
    soltero: "single",
    "en una relación": "in relationship",
    "es complicado": "complicated",
  },
};

const paises = [
  "Afghanistan",
  "Albania",
  "Andorra",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Bolivia",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Estonia",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Guatemala",
  "Honduras",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Mexico",
  "Moldova",
  "Monaco",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Thailand",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
];

const campos = [
  { name: "Age", label: "¿Cúal es tú edad?", type: "number" },
  { name: "Country", label: "¿De qué país eres?", type: "autocomplete", options: paises },
  {
    name: "Avg_Daily_Usage_Hours",
    label: "¿Cuantas horas pasas al día en redes sociales?",
    type: "slider",
  },
  {
    name: "Conflicts_Over_Social_Media",
    label: "¿Cúantos conflictos tienes al mes por las redes?",
    type: "conflict_slider",
  },
  {
    name: "Sleep_Hours_Per_Night",
    label: "¿Cúantas horas duermes al día?",
    type: "sleep_slider",
  },
  {
    name: "Gender",
    label: "¿Cúal es tú genero?",
    type: "select",
    options: ["masculino", "femenino"],
  },
  {
    name: "Academic_Level",
    label: "¿Cúal es tu nivel de estudios?",
    type: "select",
    options: ["secundaria", "preparatoria", "licenciatura", "posgrado"],
  },
  {
    name: "Most_Used_Platform",
    label: "¿Cúal es la Red social qué más usas?",
    type: "select",
    options: Object.keys(opciones.Most_Used_Platform),
  },
  {
    name: "Relationship_Status",
    label: "¿Cúal es tú situación sentimental actúal?",
    type: "select",
    options: ["soltero", "en una relación", "es complicado"],
  },
];


export default function Formulario({ onPredicciones }) {
  const [form, setForm] = useState({
    Student_ID: Math.floor(Math.random() * 1000000),
    Conflicts_Over_Social_Media: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const traducirCampos = (data) => {
  const traducido = { ...data };

  // Traducciones de texto
  traducido.Gender = opciones.Gender[data.Gender];
  traducido.Academic_Level = opciones.Academic_Level[data.Academic_Level];
  traducido.Most_Used_Platform = opciones.Most_Used_Platform[data.Most_Used_Platform];
  traducido.Relationship_Status = opciones.Relationship_Status[data.Relationship_Status];

  // Conversión de strings a números
  traducido.Age = parseInt(data.Age);
  traducido.Avg_Daily_Usage_Hours = parseFloat(data.Avg_Daily_Usage_Hours);
  traducido.Sleep_Hours_Per_Night = parseFloat(data.Sleep_Hours_Per_Night);
  traducido.Conflicts_Over_Social_Media = parseInt(data.Conflicts_Over_Social_Media);

  return traducido;
};

const validarPaso = () => {
  const campoActual = campos[currentStep];

  if (campoActual.name === "Age") {
    const edad = parseInt(form.Age);
    if (isNaN(edad) || edad < 1 || edad > 99) {
      Swal.fire({
        icon: "warning",
        title: "Edad no válida",
        text: "Por favor ingresa una edad entre 1 y 99.",
      });
      return false;
    }
  }

  if (campoActual.name === "Country") {
    const paisIngresado = form.Country?.toLowerCase().trim();
    const paisValido = paises.some(
      (pais) => pais.toLowerCase() === paisIngresado
    );
    if (!paisValido) {
      Swal.fire({
        icon: "error",
        title: "País no válido",
        text: "Selecciona un país de la lista sugerida.",
      });
      return false;
    }
  }

  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Mostrar primera alerta de carga con el GIF
  Swal.fire({
    title: "Enviando respuestas...",
    html: `
      <p style="margin-bottom: 1rem;">Estamos generando tu predicción. Por favor espera.</p>
      <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="cargando" style="width: 320px;" />
    `,
    allowOutsideClick: false,
    showConfirmButton: false,
  });

  // Cambios progresivos de mensaje según el tiempo
  const mensajesTiempo = [
    {
      tiempo: 5000,
      html: `
        <p style="margin-bottom: 1rem;">Ya casi están tus resultados, falta poco...</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="esperando" style="width: 320px;" />
      `,
    },
    {
      tiempo: 10000,
      html: `
        <p style="margin-bottom: 1rem;">Estamos por terminar... solo un momento más.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="casi" style="width: 320px;" />
      `,
    },
    {
      tiempo: 15000,
      html: `
        <p style="margin-bottom: 0.5rem;">Dato curioso mientras esperas:</p>
        <p style="font-size: 0.9rem;">📱 El 53% de los jóvenes consulta su celular antes de levantarse de la cama.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="dato" style="width: 320px; margin-top: 0.5rem;" />
      `,
    },
        {
      tiempo: 15000,
      html: `
        <p style="margin-bottom: 0.5rem;">Dato curioso mientras esperas:</p>
        <p style="font-size: 0.9rem;">📵 El 42% de los jóvenes ha intentado reducir su tiempo en redes… y ha fallado en la primera semana.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="dato" style="width: 320px; margin-top: 0.5rem;" />
      `,
    },
        {
      tiempo: 15000,
      html: `
        <p style="margin-bottom: 0.5rem;">Dato curioso mientras esperas:</p>
        <p style="font-size: 0.9rem;">😴 Dormir con el celular cerca puede reducir un 20% la calidad del sueño, incluso si no lo usas.</p>
        <img src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif" alt="dato" style="width: 320px; margin-top: 0.5rem;" />
      `,
    },
  ];

  const temporizadores = mensajesTiempo.map(({ tiempo, html }) =>
    setTimeout(() => {
      Swal.update({ html });
    }, tiempo)
  );

  try {
    const traducido = traducirCampos(form);
    const data = await enviarFormulario(traducido);

    Swal.close(); // Cierra el modal de carga

    // Limpia los temporizadores para evitar que sigan corriendo
    temporizadores.forEach(clearTimeout);

    // Lanzar predicciones al componente padre
    onPredicciones({ ...data.predictions, Student_ID: form.Student_ID });

    // Deslizar hacia predicciones
    setTimeout(() => {
      document
        .querySelector("#predicciones-iniciales")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  } catch (err) {
    console.error(err);
    Swal.close(); // También cerramos si falla

    Swal.fire({
      icon: "error",
      title: "❌ Error",
      text: "Ocurrió un error al obtener predicciones.",
    });
  }
};



  const getSliderColor = (value) => {
    if (value >= 17) return "#e63946";
    if (value >= 9) return "#f4a261";
    if (value >= 5) return "#fcbf49";
    return "#2a9d8f";
  };

  const getConflictMessage = (value) => {
    if (value <= 2) return "✨ Sin conflictos";
    if (value <= 4) return "👍 Pocos conflictos";
    if (value <= 7) return "⚠️ Algunos problemas";
    return "🚨 Nivel alto de conflictos";
  };

  const renderField = (campo) => {
const value = form[campo.name] !== undefined ? parseInt(form[campo.name]) : 0;

    if (campo.type === "autocomplete") {
      return (
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            name={campo.name}
            placeholder="Comienza a escribir tu país"
            value={form[campo.name] || ""}
            onChange={(e) => {
              handleChange(e);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            autoComplete="off"
            className="w-full p-2 rounded border"
          />
          {showSuggestions && form[campo.name] && (
            <ul className="autocomplete-list">
              {paises
                .filter((p) =>
                  p.toLowerCase().includes(form[campo.name].toLowerCase())
                )
                .slice(0, 6)
                .map((pais, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => {
                      setForm({ ...form, [campo.name]: pais });
                      setShowSuggestions(false);
                    }}
                  >
                    {pais}
                  </li>
                ))}
            </ul>
          )}
        </div>
      );
    }

if (campo.name === "Most_Used_Platform") {
  const allPlatforms = [
    { value: "instagram", label: "Instagram", icon: <FaInstagram style={{ color: "#E1306C" }} /> },
    { value: "facebook", label: "Facebook", icon: <FaFacebook style={{ color: "#1877F2" }} /> },
    { value: "tiktok", label: "TikTok", icon: <FaTiktok style={{ color: "#000000" }} /> },
    { value: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp style={{ color: "#25D366" }} /> },
    { value: "youtube", label: "YouTube", icon: <FaYoutube style={{ color: "#FF0000" }} /> },
    { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin style={{ color: "#0A66C2" }} /> },
    { value: "twitter", label: "Twitter", icon: <FaTwitter style={{ color: "#1DA1F2" }} /> },
    { value: "snapchat", label: "Snapchat", icon: <FaSnapchat style={{ color: "#FFFC00" }} /> },
    { value: "kakaotalk", label: "KakaoTalk", icon: <FaComments style={{ color: "#FAE100" }} /> },
    { value: "line", label: "LINE", icon: <FaLine style={{ color: "#00C300" }} /> },
    { value: "vkontakte", label: "VKontakte", icon: <FaVk style={{ color: "#4C75A3" }} /> },
    { value: "wechat", label: "WeChat", icon: <FaWeixin style={{ color: "#09B83E" }} /> },
  ];

  const seleccionada = allPlatforms.find(p => p.value === form[campo.name]);

  if (seleccionada) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="platform-card selected">
          <div className="platform-icon">{seleccionada.icon}</div>
          <div className="platform-label">{seleccionada.label}</div>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, [campo.name]: "" })}
          className="change-btn"
        >
          Cambiar red social
        </button>
      </div>
    );
  }

  return (
    <div className="platform-grid">
      {allPlatforms.map((plataforma) => (
        <div
          key={plataforma.value}
          className="platform-card"
          onClick={() =>
            setForm({ ...form, [campo.name]: plataforma.value })
          }
        >
          <div className="platform-icon">{plataforma.icon}</div>
          <div className="platform-label">{plataforma.label}</div>
        </div>
      ))}
    </div>
  );
}



    if (campo.type === "select") {
      return (
        <select
          name={campo.name}
          value={form[campo.name] || ""}
          onChange={handleChange}
          className="w-full p-2 rounded border"
        >
          <option value="">Selecciona</option>
          {campo.options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (campo.type === "slider") {
      const color = getSliderColor(value);
      return (
        <div>
          <p className="text-sm mb-1">
            Desliza para seleccionar tus horas (0 a 24):
          </p>
          <div className="mt-2 text-center font-medium" style={{ color }}>
            {value} {value === 1 ? "hora" : "horas"} al día
          </div>
          <input
            type="range"
            name={campo.name}
            min="0"
            max="24"
            value={value}
            onChange={handleChange}
            className="w-full"
            style={{ background: color }}
          />
        </div>
      );
    }

    if (campo.type === "conflict_slider") {
      const message = getConflictMessage(value);
      const color = getSliderColor(value * 2.4);
      return (
        <div>
          <div className="flex items-center gap-4">
          <p className="text-sm mb-1">Desliza según los conflictos que hayas tenido (0 a 10)</p>
          <div className="mt-2 text-center font-medium" style={{ color }}>
           {value} | {message}
          </div>
            <input
              type="range"
              name={campo.name}
              min="0"
              max="10"
              value={value}
              onChange={handleChange}
              className="w-full"
              style={{ background: color }}
            />
          </div>
        </div>
      );
    }

    if (campo.type === "sleep_slider") {
      const color = getSliderColor(value);
      return (
        <div>
          <p className="text-sm mb-1">
            Selecciona cuántas horas duermes por noche (0 a 24):
          </p>
          <div className="mt-2 text-center font-medium" style={{ color }}>
            {value} {value === 1 ? "hora" : "horas"} por noche
          </div>
          <input
            type="range"
            name={campo.name}
            min="0"
            max="24"
            value={value}
            onChange={handleChange}
            className="w-full"
            style={{ background: color }}
          />
        </div>
      );
    }


    return (
      <input
        type={campo.type}
        name={campo.name}
        value={form[campo.name] || ""}
        onChange={handleChange}
        placeholder={campo.label}
        className="w-full p-2 rounded border"
      />
    );
  };

  return (
    <form
      id="formulario"
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto px-4"
    >
      <h2 className="mb-4 text-lg font-bold">
        🧠 Este cuestionario consta de 9 preguntas relacionadas a tu edad, redes
        sociales y estado emocional. ¡Comencemos!
      </h2>
      {started &&
        campos.slice(0, currentStep + 1).map((campo, index) => (
          <div key={index} className="form-group mb-4 animate-fade-in">
            <label className="block mb-1 font-medium">{campo.label}</label>
            {renderField(campo)}
          </div>
        ))}
      {!started ? (
        <button type="button" onClick={() => setStarted(true)} className="btn">
          Comenzar
        </button>
      ) : (
        <>
          {currentStep < campos.length - 1 && (
<button
  type="button"
  onClick={() => {
    if (validarPaso()) setCurrentStep(currentStep + 1);
  }}
  className="btn"
>
  Siguiente
</button>

          )}
          {currentStep === campos.length - 1 && (
            <button type="submit" className="btn">
              Enviar
            </button>
          )}
        </>
      )}
    </form>
  );
}
