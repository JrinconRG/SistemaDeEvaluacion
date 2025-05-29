import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs , doc,getDoc,setDoc} from "firebase/firestore";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/sidebar/sidebar";
import "./PlanMejoraInfo.css"; // Crea el CSS si deseas estilos personalizados

export default function PlanMejoraInfo() {
  const [planes, setPlanes] = useState([]);
  const [planId, setPlanId] = useState("");
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({
    estado_accion: "",
    porcentaje_cumplimiento: "",
    soporte_evidencia: "",
    eficaz: "",
    fecha_actualizacion: "",
    justificacion_efectividad: "", // Nuevo campo para la justificación
  });

  // Cargar planes de mejora para el select
  useEffect(() => {
    const fetchPlanes = async () => {
      const snapshot = await getDocs(collection(db, "planes_mejora"));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().fallas_calidad || "Sin nombre",

      }));


      setPlanes(lista);
    };

    fetchPlanes();
  }, []);


  // Cargar info si se selecciona un plan
  useEffect(() => {
    const fetchInfo = async () => {
      if (!planId) return;
      const docRef = doc(db, "planes_mejora_info", planId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInfo(data);
        setForm(data);
      } else {
        setInfo(null);
        setForm({
          estado_accion: "",
          porcentaje_cumplimiento: "",
          soporte_evidencia: "",
          eficaz: "",
          fecha_actualizacion: "",
          justificacion_efectividad: "",
        });
      }
      console.log(docSnap.exists(), docSnap.data())
    };

    fetchInfo();
  }, [planId]);

  const estaCerrado = info?.estado_accion?.toLowerCase() === "cerrada";


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlanChange = (e) => {
    setPlanId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planId) return alert("Seleccione un plan primero");

    try {
      await setDoc(doc(db, "planes_mejora_info", planId), {
        ...form,
        id_plan_mejora: planId,
      });
      alert("Información guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };





  return (
    <div className="evaluacion-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="form-wrapper">
          <h2 >Seguimiento a Plan de Mejora</h2>

          <select value={planId} onChange={handlePlanChange}  >
            <option value="">-- Seleccione un plan de Mejora --</option>
          
            {planes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          {planId && (
            <div  className="container-info">
              {info && (
                <div className="info-card">
                  <h2>Información Actual</h2>
                  <p><strong>Estado:</strong> {info.estado_accion}</p>
                  <p><strong>% Cumplimiento:</strong> {info.porcentaje_cumplimiento}</p>
                  <p><strong>Soporte:</strong> {info.soporte_evidencia}</p>
                  <p><strong>¿Eficaz?:</strong> {info.eficaz}</p>
                  <p><strong>Justificación:</strong> {info.justificacion_efectividad}</p>
                  <p><strong>Fecha de ultima Actualización:</strong> {info.fecha_actualizacion}</p>
                </div>
              )}


              <div className="form-container">
          <form onSubmit={handleSubmit} className="evaluacion-form" >
            <h2 style={{ textAlign: "left" }}>Información Post Implementación del Plan de Mejora</h2>

            

            <label>Estado de la Acción de Mejoramiento</label>
            <select name="estado_accion" value={form.estado_accion} onChange={handleChange} disabled={estaCerrado}>
              <option value="">Seleccione estado</option>
              <option value="Abierta">Abierta</option>
              <option value="En ejecucion">En ejecucion</option>
              <option value="Cerrada">Cerrada</option>

            </select>


            <label>Porcentaje de Cumplimiento</label>
            <input
              type="number"
              name="porcentaje_cumplimiento"
              min="0"
              max="100"
              value={form.porcentaje_cumplimiento}
              onChange={handleChange}
              placeholder="Ej: 80"
              disabled={estaCerrado}
            />

            <label>Soporte y/o Evidencia</label>
            <textarea
              name="soporte_evidencia"
              value={form.soporte_evidencia}
              onChange={handleChange}
              rows={4}
              placeholder="Describa o adjunte la evidencia"
              disabled={estaCerrado}
            />

            <label>¿Fue Eficaz?</label>
            <select 
              name="eficaz" 
              value={form.eficaz} 
              onChange={handleChange} 
              disabled={!estaCerrado}
            >
              <option value="">Seleccione una opción</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
              <option value="No aplica">Aún no evaluado</option>
            </select>

            {estaCerrado && (
              <>
                <label>Justificación de la Efectividad</label>
                <textarea
                  name="justificacion_efectividad"
                  value={form.justificacion_efectividad}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Justifique por qué la acción fue efectiva o no efectiva"
                  required={estaCerrado && form.eficaz !== ""}
                />
              </>
            )}

            <label>Fecha de Actualización</label>
            <input
              type="date"
              name="fecha_actualizacion"
              value={form.fecha_actualizacion} 
              onChange={handleChange}
              disabled={estaCerrado}

              />


            <button type="submit" disabled={estaCerrado && !form.eficaz}>
              {estaCerrado ? "Evaluar Efectividad" : "Guardar Información"}
            </button>

            {estaCerrado && <p style={{ color: "gray", marginTop: "10px" }}><i>Este plan está cerrado. Por favor, evalúe su efectividad.</i></p>}
            </form>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}