import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarHallazgo.css";

export default function RegistrarHallazgo() {
  const [form, setForm] = useState({
    tipo: "Hallazgo",
    nombre_hallazgo: "",
    origen_hallazgo: "",
    descripcion: "",
    fecha_origen: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hallazgo"), {
        ...form,
      });
      alert("Hallazgo guardado");
      setForm({
        tipo: "Hallazgo",
        nombre_hallazgo: "",
        origen_hallazgo: "",
        descripcion: "",
        fecha_origen: "",
      });
    } catch (e) {
      console.error("Error al guardar hallazgo", e);
    }
  };

  return (
    <div className="hallazgo-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="hallazgo-form">
            <h2>Registrar Hallazgo</h2>

            <h5>Nombre</h5>
            <input
              type="text"
              name="nombre_hallazgo"
              placeholder="Nombre del hallazgo"
              value={form.nombre_hallazgo}
              onChange={handleChange}
            />

            <select
              name="origen_hallazgo"
              value={form.origen_hallazgo}
              onChange={handleChange}
            >
              <option value="">Origen/Fuente del Hallazgo</option>
              <option value="Auditorias Internas de Calidad">
                Auditorías Internas de Calidad
              </option>
              <option value="Auditorias Externas">Auditorias Externas</option>
              <option value="PQR">PQR</option>
              <option value="Encuestas de Satisfacción">
                Encuestas de Satisfacción
              </option>
              <option value="Resultado de Indicadores">
                Resultado de Indicadores
              </option>
              <option value="Gestión de Eventos Adversos">
                Gestión de Eventos Adversos
              </option>
              <option value="Rondas de Seguridad">Rondas de Seguridad</option>
              <option value="Inspecciones de Seguridad">
                Inspecciones de Seguridad
              </option>
            </select>

            <textarea
              name="descripcion"
              placeholder="Describa la falla de calidad detectada"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
            ></textarea>

            <h5>Fecha en la que se originó el hallazgo</h5>
            <input
              type="date"
              name="fecha_origen"
              value={form.fecha_origen}
              onChange={handleChange}
            />

            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
