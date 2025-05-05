import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function PlanesMejoraList() {
  const [planes, setPlanes] = useState([]);

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
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  return (
    <div className="planes-lista">
      <h3>Planes de Mejora Registrados</h3>
      {planes.length === 0 ? (
        <p>No hay planes de mejora registrados.</p>
      ) : (
        <ul>
          {planes.map((plan) => (
            <li key={plan.id} style={{ marginBottom: "1rem" }}>
              <strong>Fallas Calidad:</strong> {plan.fallas_calidad}<br />
              <strong>Tipo Acción:</strong> {plan.tipo_accion}<br />
              <strong>Atributo Calidad:</strong> {plan.atributo_calidad}<br />
              <strong>Fecha Inicio:</strong> {plan.fecha_inicio}<br />
              <strong>Fecha Final:</strong> {plan.fecha_final}<br />
              <strong>Proceso Responsable:</strong> {plan.proceso_responsable}<br />
              <strong>Persona Responsable:</strong> {plan.persona_responsable}<br />
              <strong>Razones:</strong> {plan.razones}<br />
              <strong>Meta Acción:</strong> {plan.meta_accion}<br />
              <strong>Actividades Mejora:</strong> {plan.actividades_mejora}<br />
              <strong>Hallazgo ID:</strong> {plan.hallazgo_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
