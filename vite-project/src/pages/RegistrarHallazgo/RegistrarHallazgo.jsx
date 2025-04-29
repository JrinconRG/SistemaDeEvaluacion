import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarHallazgo.css";

export default function RegistrarHallazgo() {
  const [form, setForm] = useState({
    tipo: "Hallazgo",
    descripcion: "",
    estado: "Pendiente",
    fecha_registro: "",
    responsable_id: "",
    fecha_cierre: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hallazgos"), {
        ...form,
        fecha_cierre: form.fecha_cierre || null
      });
      alert("Hallazgo guardado");
      // Reset form opcional:
      setForm({
        tipo: "Hallazgo",
        descripcion: "",
        estado: "Pendiente",
        fecha_registro: "",
        responsable_id: "",
        fecha_cierre: ""
      });
    } catch (e) {
      console.error("Error al guardar hallazgo", e);
    }
  };

  return (
    <div className="hallazgo-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="hallazgo-form">
            <h2>Registrar Hallazgo</h2>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
            ></textarea>

            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>

            <input
              type="date"
              name="fecha_registro"
              value={form.fecha_registro}
              onChange={handleChange}
            />

            <input
              name="responsable_id"
              placeholder="ID Responsable"
              value={form.responsable_id}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha_cierre"
              value={form.fecha_cierre}
              onChange={handleChange}
            />

            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
