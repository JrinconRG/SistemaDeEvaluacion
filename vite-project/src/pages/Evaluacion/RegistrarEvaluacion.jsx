import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarEvaluacion.css";

export default function RegistrarEvaluacion() {
  const [form, setForm] = useState({
    empleado_id: "",
    fecha: "",
    evaluador: "",
    comentarios: "",
    resultados: {
      trabaja_potencial: "",
      calidad_trabajo: "",
      consistencia_trabajo: "",
      comunicacion: "",
      trabajo_independiente: "",
      toma_iniciativa: "",
      trabajo_en_grupo: "",
      productividad: "",
      creatividad: "",
      honestidad: "",
      integridad: "",
      relaciones_companeros: "",
      relaciones_clientes: "",
      habilidades_tecnicas: "",
      fiabilidad: "",
      puntualidad: "",
      asistencia: ""
    }
  });

  const [puntaje, setPuntaje] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.resultados) {
      setForm({ ...form, resultados: { ...form.resultados, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const calcularPromedioResultados = () => {
    const valores = {
      "Insatisfactorio": 1,
      "Satisfactorio": 2,
      "Bueno": 3,
      "Excelente": 4
    };

    const resultados = form.resultados;
    const puntuaciones = Object.values(resultados)
      .map(valor => valores[valor])
      .filter(v => v); // Evita valores vacíos o inválidos

    const total = puntuaciones.reduce((acc, num) => acc + num, 0);
    return puntuaciones.length ? total / puntuaciones.length : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const puntaje_promedio = calcularPromedioResultados();
    setPuntaje(puntaje_promedio);

    try {
      await addDoc(collection(db, "evaluaciones_empleados"), {
        ...form,
        puntaje_promedio
      });
      alert("Evaluación guardada");
    } catch (e) {
      console.error("Error al guardar evaluación", e);
    }
  };

  return (
    <div className="evaluacion-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="evaluacion-form">
            <h2>Registrar Evaluación</h2>

            <input
              name="empleado_id"
              placeholder="ID del Empleado"
              value={form.empleado_id}
              onChange={handleChange}
            />

            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
            />

            <input
              name="evaluador"
              placeholder="Evaluador"
              value={form.evaluador}
              onChange={handleChange}
            />

            <textarea
              name="comentarios"
              placeholder="Comentarios"
              rows={4}
              value={form.comentarios}
              onChange={handleChange}
            />

            <h3>Resultados</h3>
            <div className="resultados-grid">
              {Object.keys(form.resultados).map((campo) => (
                <div key={campo}>
                  <label style={{ fontWeight: "bold" }}>
                    {campo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <select
                    name={campo}
                    value={form.resultados[campo]}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Insatisfactorio">Insatisfactorio</option>
                    <option value="Satisfactorio">Satisfactorio</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Excelente">Excelente</option>
                  </select>
                </div>
              ))}
            </div>

            <button type="submit">Guardar Evaluación</button>
          </form>

          {puntaje !== null && (
            <div style={{ marginTop: "1rem", fontWeight: "bold", textAlign: "center", color: "#1e3a5f" }}>
              Puntaje promedio: {puntaje.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
