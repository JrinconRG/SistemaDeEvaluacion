import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./PlanesMejoraList.css";
import ListadoDescripcion from "../ListadoDescripcion/ListadoDescripcion";


export default function PlanesMejoraList() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true); // 🟡 Nuevo estado
  const [planSeleccionado, setPlanSeleccionado] = useState(null);



  const fetchPlanes = async () => {
    try {
      // 1. Obtener todos los planes
      const querySnapshot = await getDocs(collection(db, "planes_mejora"));
      const listaPlanes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 2. Obtener info de estado (todos los documentos de info)
      const infoSnapshot = await getDocs(collection(db, "planes_mejora_info"));
      const infoPorPlan = {};
      infoSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        infoPorPlan[data.id_plan_mejora] = data.estado_accion;
      });

      // 3. Mezclar estado en la lista de planes
      const listaConEstado = listaPlanes.map((plan) => ({
        ...plan,
        estado_accion: infoPorPlan[plan.id] || "desconocido",
      }));

      setPlanes(listaConEstado);
    } catch (error) {
      console.error("Error al obtener planes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);


  if (loading) {
    return null; // o <p>Cargando...</p>
  }

  if (!loading && planes.length === 0) {
    return <p>No hay planes de mejora registrados.</p>;
  }

  



  return (
    <div className="property-list">
      
        <div className="property-list">
          {planes.map((plan) => (
            <div key={plan.id} className={`property-card ${plan.estado_accion === "Cerrada" ? "cerrada" : ""}`}
            onClick={() => setPlanSeleccionado(plan)} style={{ cursor: "pointer" }} >
              <li>

              {plan.estado_accion === "Cerrada" && <h5 className="etiqueta-cerrado">Cerrado</h5>}



                <div><strong>Fallas Calidad:</strong>
                <span>{plan.fallas_calidad}</span>
                </div>

                <div>
                <strong>Tipo Acción:</strong>
                <span>{plan.tipo_accion}</span>

                </div>

                <div>
                <strong>Atributo Calidad:</strong>
                <span>{plan.atributo_calidad}</span>
                
                </div>

                <div>
                <strong>Fecha Inicio:</strong>
                <span>{plan.fecha_inicio}</span>
                
                </div>

                <div>
                <strong>Fecha Final:</strong>
                <span>{plan.fecha_final}</span>
                
                </div>

                <div>
                <strong>Proceso Responsable:</strong>
                <span>{plan.proceso_responsable}</span>
                </div>

                <div>
                <strong>Persona Responsable:</strong>
                <span>{plan.persona_responsable}</span>
                </div>

                <div>
                <strong>Razones:</strong>
                <span>{plan.razones}</span>
                </div>

                <div>
                <strong>Meta Acción:</strong>
                <span>{plan.meta_accion}</span>
                
                </div>

                <div>
                <strong>Actividades Mejora:</strong>
                <span>{plan.actividades_mejora}</span>
                </div>

               
              </li>
            </div>
          ))}
          {planSeleccionado && (
            <ListadoDescripcion
              plan={planSeleccionado}
              onClose={() => setPlanSeleccionado(null)}
            />
          )}

        </div>
      
    </div>
  );
}
