import axios from 'axios'

// Carga la URL base desde .env
const baseUrl = import.meta.env.VITE_API_URL

export const enviarFormulario = async (formData) => {
  const res = await axios.post(`${baseUrl}/predict`, formData)
  return res.data
}

export async function hacerPregunta(datosUsuario, pregunta) {
  const studentId = datosUsuario.Student_ID || localStorage.getItem('student_id');

  const payload = {
    student_id: Number(studentId),
    question: pregunta
  };

  try {
    const res = await axios.post(`${baseUrl}/ask`, payload);
    console.log("📥 Respuesta de /ask:", res.data); // 👈 ya loguea la respuesta del backend
    return res.data;
  } catch (error) {
    console.error("❌ Error al hacer la pregunta:", error);
    return { error: "Hubo un problema al comunicarse con el servidor." };
  }
}