import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarEvaluacion.css"; // Importamos los estilos

export default function PlanDeMejora() {
  const [hallazgos, setHallazgos] = useState([]);
  const [form, setForm] = useState({
    hallazgo_id: "",
    fallas_calidad: "",
    razones: "",
    actividades_mejora: "",
    meta_accion: "",
    tipo_accion: "",
    proceso_responsable: "",
    persona_responsable: "",
    fecha_inicio: "",
    fecha_final: "",
    atributo_calidad: ""
  });

  useEffect(() => {
    const fetchHallazgos = async () => {
      const snapshot = await getDocs(collection(db, "hallazgo")); // o "hallazgos", según corrijas
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre_hallazgo
      }));
      setHallazgos(lista);
    };
  
    fetchHallazgos();
  }, []);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "planes_mejora"), form);
      alert("Plan de mejora guardado exitosamente");
      // Reset form
      setForm({
        hallazgo_id: "",
        fallas_calidad: "",
        razones: "",
        actividades_mejora: "",
        meta_accion: "",
        tipo_accion: "",
        proceso_responsable: "",
        persona_responsable: "",
        fecha_inicio: "",
        fecha_final: "",
        atributo_calidad: ""
      });
    } catch (error) {
      console.error("Error al guardar el plan de mejora:", error);
    }
  };

  return (
    <div className="evaluacion-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="evaluacion-form">
            <h2>Registrar Plan de Mejora</h2>

            <label>Hallazgo relacionado</label>
            <select name="hallazgo_id" value={form.hallazgo_id} onChange={handleChange}>
              <option value="">Seleccione un hallazgo</option>
              {hallazgos.map(h => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
              ))}
            </select>

            <label> ¿Qué? </label>
            <textarea name="fallas_calidad" value={form.fallas_calidad} onChange={handleChange} />

            <label>¿Por Qué?</label>
            <textarea name="razones" value={form.razones} onChange={handleChange} />

            <label>¿Cómo?</label>
            <textarea name="actividades_mejora" value={form.actividades_mejora} onChange={handleChange} />

            <label>Meta de la Acción</label>
            <textarea name="meta_accion" value={form.meta_accion} onChange={handleChange} />

            <label>Tipo de acción</label>
            <select name="tipo_accion" value={form.tipo_accion} onChange={handleChange}>
              <option value="">Seleccione tipo de acción</option>
              <option value="Correctiva">Correctiva</option>
              <option value="Preventiva">Preventiva</option>
              <option value="Mejoramiento">Mejoramiento</option>
            </select>

            <label>¿Dónde?</label>
            <input type="text" name="proceso_responsable" value={form.proceso_responsable} onChange={handleChange} />

            <label>Persona responsable (cargo)</label>
            <input type="text" name="persona_responsable" value={form.persona_responsable} onChange={handleChange} />

            <label>Inicio (AAAA-MM-DD)</label>
            <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} />

            <label>Final (AAAA-MM-DD)</label>
            <input type="date" name="fecha_final" value={form.fecha_final} onChange={handleChange} />

            <label>Atributo de calidad</label>
            <select name="atributo_calidad" value={form.atributo_calidad} onChange={handleChange}>
              <option value="">Seleccione un atributo</option>
              <option value="Oportunidad">Oportunidad</option>
              <option value="Accesibilidad">Accesibilidad</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Pertinencia">Pertinencia</option>
              <option value="Continuidad">Continuidad</option>
              <option value="Efectividad">Efectividad</option>
            </select>

            <button type="submit">Guardar Plan de Mejora</button>
          </form>
        </div>
      </div>
    </div>
  );
}
