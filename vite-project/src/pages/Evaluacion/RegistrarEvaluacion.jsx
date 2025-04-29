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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.resultados) {
      setForm({ ...form, resultados: { ...form.resultados, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "evaluaciones_empleados"), form);
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
                <input
                  key={campo}
                  name={campo}
                  placeholder={campo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  value={form.resultados[campo]}
                  onChange={handleChange}
                />
              ))}
            </div>

            <button type="submit">Guardar Evaluación</button>
          </form>
        </div>
      </div>
    </div>
  );
}
