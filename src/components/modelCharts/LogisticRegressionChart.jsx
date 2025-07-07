const LogisticRegressionResult = ({ predictions }) => {
  const target = "Addicted_Score";
  const score = predictions?.[target] || 0;

  let esAdicto = false;
  let resultado = "";
  let nivel = "";
  let mensaje = "";
  let recomendaciones = [];

  if (score >= 7) {
    esAdicto = true;
    nivel = "ALTO";
    resultado = "Sí, se considera que tienes una adicción a las redes sociales.";
    mensaje = `Tu nivel de uso es muy elevado: obtuviste un ${score} de 10. Eso sugiere que las redes están ocupando demasiado espacio en tu rutina diaria, al punto de afectar tu descanso, concentración o bienestar emocional. Es importante atenderlo con calma, pero con firmeza.`;
    recomendaciones = [
      "Haz pausas diarias sin pantallas (al menos 1 hora).",
      "Desactiva notificaciones que te distraigan constantemente.",
      "Sustituye el tiempo en redes por una actividad que disfrutes offline.",
    ];
  } else if (score >= 4) {
    esAdicto = false;
    nivel = "INTERMEDIO";
    resultado = "No eres adicto, pero estás en un punto que merece atención.";
    mensaje = `Tu resultado fue de ${score} sobre 10, lo cual indica un uso algo elevado que podría escalar con facilidad si no se regula. Es posible que las redes ya estén interfiriendo con tus momentos de descanso o enfoque, aunque no de forma crítica todavía.`;
    recomendaciones = [
      "Controla cuánto tiempo pasas al día en redes.",
      "Detecta momentos de uso automático o por aburrimiento.",
    ];
  } else {
    esAdicto = false;
    nivel = "BAJO";
    resultado = "No, no se detecta una adicción a las redes sociales en tu caso.";
    mensaje = `Con un puntaje de ${score} sobre 10, tus hábitos parecen equilibrados. Usas las redes sociales sin que afecten negativamente tus rutinas o bienestar. Eso habla bien de tu autocontrol y prioridades.`;
    recomendaciones = [
      "Mantén ese buen equilibrio, sobre todo en épocas de estrés.",
    ];
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: "2rem",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#4c1d95" }}>
        📊 Diagnóstico de adicción a redes sociales
      </h3>

      <p style={{ fontSize: "0.95rem", color: "#333", marginBottom: "0.5rem" }}>
        <strong>Tu nivel es:</strong>{" "}
        <span style={{ color: "#8b5cf6" }}>{nivel}</span>
      </p>

      <p style={{ fontSize: "0.95rem", color: "#333", marginBottom: "0.5rem", lineHeight: "1.6" }}>
        <strong>Resultado:</strong>{" "}
        <span style={{ color: esAdicto ? "#dc2626" : "#16a34a" }}>
          {resultado}
        </span>
      </p>

      <p style={{ fontSize: "0.95rem", color: "#333", marginBottom: "1.5rem", lineHeight: "1.6" }}>
        {mensaje}
      </p>

      <div
        style={{
          backgroundColor: "#f3e8ff",
          borderLeft: "4px solid #8b5cf6",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Consejos personalizados:</strong>
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.2rem",
            color: "#4c1d95",
            fontSize: "0.9rem",
            lineHeight: "1.6",
          }}
        >
          {recomendaciones.map((rec, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LogisticRegressionResult;
