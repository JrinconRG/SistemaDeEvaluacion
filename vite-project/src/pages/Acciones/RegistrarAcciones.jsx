
// src/pages/RegistrarAcciones.jsx
import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import AccionesList from "../../components/Listado/AccionesList.jsx";

import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarAcciones.css";

export default function RegistrarAcciones() {
  const [form, setForm] = useState({
    nombre: "",
    valor: "",
    fecha: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "acciones"), form);
      alert("Acción guardada");
      setForm({ nombre: "", valor: "", fecha: "" });
    } catch (e) {
      console.error("Error al guardar acción", e);
      alert("Hubo un error, inténtalo de nuevo");
    }
  };

  return (
    <div className="acciones-page">
      <Sidebar/>
      <Header />
      <div className="main-content">
        
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="acciones-form">
            <h2>Registrar Acción</h2>

            <input
              name="nombre"
              placeholder="Nombre de la acción"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              type="number"
              name="valor"
              placeholder="Valor"
              value={form.valor}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />

            <button type="submit">Guardar</button>
          </form>
        </div>
        <div className="acciones-lista-wrapper">
            <h2>Lista de Acciones</h2>
            <AccionesList />
            </div>
      </div>
    </div>
  );
}
