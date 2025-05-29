// src/components/ListadoDescripcion.jsx
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import { doc, getDoc , getDocs, query, where, collection} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./ListadoDescripcion.css";

export default function ListadoDescripcion({ plan, onClose }) {
  const [hallazgo, setHallazgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan_info, setPlan_info] = useState(null);

  useEffect(() => {
    const fetchHallazgo = async () => {
      if (!plan?.hallazgo_id  ) return;
      try {
        const ref = doc(db, "hallazgo", plan.hallazgo_id);
        const snap = await getDoc(ref);
        if (snap.exists()) setHallazgo(snap.data());
      } catch (e) {
        console.error("Error obteniendo hallazgo:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHallazgo();
  }, [plan]);

  useEffect(() => {
    const fetchPlan_info = async () => {
        if (!plan?.id) return;
        try {

            const q = query(collection(db, "planes_mejora_info"), where("id_plan_mejora", "==", plan.id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              // Si solo esperas un resultado
              setPlan_info(querySnapshot.docs[0].data());
      
            } else {
              console.log("No hay info adicional del plan");
            }
          } catch (e) {
            console.error("Error al obtener plan_info:", e);
          }
        };
      
        fetchPlan_info();
      }, [plan]);


     
      
        

  return (
    

    <Modal show={!!plan} onClose={onClose} titulo="Detalle del Plan de Mejora">
      {loading ? (
        <p className="loading-text">Cargando detalles...</p>
      ) : (
        <div className="plan-detalle-container">
          <section className="plan-card hallazgo">
            <h3>Hallazgo Relacionado</h3>
            {hallazgo ? (
              <div className="plan-content">
                <p><span>Nombre:</span> {hallazgo.nombre_hallazgo}</p>
                <p><span>Descripción:</span> {hallazgo.descripcion}</p>
                <p><span>Origen:</span> {hallazgo.origen_hallazgo}</p>
                <p><span>Tipo:</span> {hallazgo.tipo}</p>
              </div>
            ) : (
              <p className="plan-content">No se encontró el hallazgo.</p>
            )}
          </section>
    
          <section className="plan-card mejora">
            <h3>Plan de Mejora</h3>
            <div className="plan-content">
              <p><span>Fallas Calidad:</span> {plan.fallas_calidad}</p>
              <p><span>Tipo Acción:</span> {plan.tipo_accion}</p>
              <p><span>Atributo Calidad:</span> {plan.atributo_calidad}</p>
              <p><span>Fechas:</span> {plan.fecha_inicio} → {plan.fecha_final}</p>
              <p><span>Proceso Responsable:</span> {plan.proceso_responsable}</p>
              <p><span>Persona Responsable:</span> {plan.persona_responsable}</p>
              <p><span>Razones:</span> {plan.razones}</p>
              <p><span>Meta Acción:</span> {plan.meta_accion}</p>
              <p><span>Actividades:</span> {plan.actividades_mejora}</p>
            </div>
          </section>
    
          <section className="plan-card actualizacion">
            <h3>Actualización del Plan</h3>
            {plan_info ? (
              <div className="plan-content">
                <p><span>Estado:</span> {plan_info.estado_accion}</p>
                <p> <span>% Cumplimiento:</span>{plan_info.porcentaje_cumplimiento}%</p>
                <p><span>Soporte:</span> {plan_info.soporte_evidencia}</p>
                <p><span>¿Eficaz?:</span> {plan_info.eficaz}</p>
                <p><span>Última Actualización:</span> {plan_info.fecha_actualizacion}</p>
              </div>
            ) : (
              <p className="plan-content">No se encontró actualización del plan.</p>
            )}
          </section>
        </div>
      )}
    </Modal>
    
    
  );
}
