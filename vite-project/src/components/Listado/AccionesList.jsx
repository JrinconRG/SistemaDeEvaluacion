// src/components/AccionesList.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function AccionesList() {
  const [acciones, setAcciones] = useState([]);

  const fetchAcciones = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "acciones"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAcciones(lista);
    } catch (error) {
      console.error("Error al obtener acciones:", error);
    }
  };

  useEffect(() => {
    fetchAcciones();
  }, []);

  return (
    <div className="acciones-lista">
      <h3>Acciones registradas</h3>
      {acciones.length === 0 ? (
        <p>No hay acciones registradas.</p>
      ) : (
        <ul>
          {acciones.map((accion) => (
            <li key={accion.id}>
              <strong>{accion.nombre}</strong> - Valor: {accion.valor} - Fecha: {accion.fecha}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
