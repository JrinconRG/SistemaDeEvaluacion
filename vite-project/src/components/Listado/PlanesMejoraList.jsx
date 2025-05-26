import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./PlanesMejoraList.css";

export default function PlanesMejoraList() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true); // 🟡 Nuevo estado

  const fetchPlanes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "planes_mejora"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlanes(lista);
    } catch (error) {
      console.error("Error al obtener planes de mejora:", error);
    } finally {
      setLoading(false); // ✅ Finaliza la carga
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
            <div key={plan.id} className="property-card">
              <li>

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

                <div>
                <strong>Hallazgo ID:</strong>
                <span>{plan.hallazgo_id}</span>
                </div>
              </li>
            </div>
          ))}
        </div>
      
    </div>
  );
}
