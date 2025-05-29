import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Modal from "../Modal/Modal";
import "./Notificaciones.css";

function Notificaciones({ show, onClose }) {
  const [vencidas, setVencidas] = useState([]);
  const [proximas, setProximas] = useState([]);
  const [sinActualizar, setSinActualizar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      obtenerNotificaciones();
    }
  }, [show]);

  const obtenerNotificaciones = async () => {
    setLoading(true);
    const hoy = new Date();
    const _proximas = [];
    const _vencidas = [];
    const _sinActualizar = [];

    // Obtener planes_mejora
    const planesSnapshot = await getDocs(collection(db, "planes_mejora"));
    // Obtener planes_mejora_info
    const infoSnapshot = await getDocs(collection(db, "planes_mejora_info"));

    // Mapear planes_mejora_info por id_plan_mejora para acceso rápido
    const infoMap = {};
    infoSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.id_plan_mejora) {
        infoMap[data.id_plan_mejora] = data;
      }
    });

    // Recorrer planes_mejora y analizar notificaciones
    planesSnapshot.forEach((doc) => {
      const data = doc.data();
      const idPlan = doc.id;
      const estado = data.estado?.toLowerCase();
      const descripcion = data["actividades_mejora"] || idPlan;
      const noCerrado = estado !== "cerrada";

      // Vencimiento
      if (data.fecha_final) {
        const fechaFinal = new Date(data.fecha_final.replace(/-/g, "/"));
        const diffDias = Math.ceil((fechaFinal - hoy) / (1000 * 60 * 60 * 24));

        if (diffDias < 0 && noCerrado) {
          _vencidas.push(descripcion);
        } else if (diffDias <= 3 && noCerrado) {
          _proximas.push({ descripcion, dias: diffDias });
        }
      }

      // Sin actualización reciente: buscar en planes_mejora_info
      const info = infoMap[idPlan];
      if (info?.fecha_actualizacion) {
        const ultimaActualizacion = new Date(info.fecha_actualizacion.replace(/-/g, "/"));
        const diffActualizacion = Math.ceil((hoy - ultimaActualizacion) / (1000 * 60 * 60 * 24));
        if (diffActualizacion > 30 && noCerrado) {
          _sinActualizar.push({ descripcion, dias: diffActualizacion });
        }
      } else {
        // Si no hay registro de actualización, podría considerarse como sin actualizar
        if (noCerrado) {
          _sinActualizar.push({ descripcion, dias: "N/A" });
        }
      }
    });

    setVencidas(_vencidas);
    setProximas(_proximas);
    setSinActualizar(_sinActualizar);
    setLoading(false);
  };

  return (
    <Modal show={show} onClose={onClose} titulo="Notificaciones">
      {loading ? (
        <p className="loading">Cargando notificaciones...</p>
      ) : vencidas.length || proximas.length || sinActualizar.length ? (
        <div>
          {vencidas.length > 0 && (
            <div className="notif-section vencidas">
              <h4 className="notif-title">⚠️ Acciones Vencidas</h4>
              <ul className="notif-list">
                {vencidas.map((n, i) => (
                  <li key={`vencida-${i}`}>{n}</li>
                ))}
              </ul>
            </div>
          )}

          {proximas.length > 0 && (
            <div className="notif-section proximas">
              <h4 className="notif-title">🔔 Próximas a Vencer</h4>
              <ul className="notif-list">
                {proximas.map((n, i) => (
                  <li key={`proxima-${i}`}>
                    {n.descripcion}{" "}
                    <span className="dias">
                      (en {n.dias} día{n.dias !== 1 ? "s" : ""})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sinActualizar.length > 0 && (
            <div className="notif-section sin-actualizar">
              <h4 className="notif-title">📌 Sin Actualizar</h4>
              <ul className="notif-list">
                {sinActualizar.map((n, i) => (
                  <li key={`sin-act-${i}`}>
                    {n.descripcion}{" "}
                    <span className="dias">
                      {n.dias === "N/A"
                        ? "(sin fecha de actualización)"
                        : `(última actualización hace ${n.dias} día${n.dias !== 1 ? "s" : ""})`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No hay notificaciones por ahora.</p>
      )}
    </Modal>
  );
}

export default Notificaciones;
