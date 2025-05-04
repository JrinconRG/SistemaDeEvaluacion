import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistrarEmpleado.css"; // Importamos los estilos

export default function RegistrarEmpleado() {
  const [form, setForm] = useState({
    nombre: "",
    ocupacion: "",
    edad: "",
    genero: "Masculino",
    foto_url: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "empleados"), form);
      alert("Empleado guardado correctamente");
      setForm({ nombre: "", ocupacion: "", edad: "", genero: "Masculino", foto_url: "" });
    } catch (e) {
      console.error("Error al guardar el empleado", e);
      alert("Hubo un error al guardar el empleado");
    }
  };

  return (
    <div className="empleado-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="empleado-form">
            <h2>Registrar Empleado</h2>
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="ocupacion"
              placeholder="Ocupación"
              value={form.ocupacion}
              onChange={handleChange}
            />
            <input
              type="number"
              name="edad"
              placeholder="Edad"
              value={form.edad}
              onChange={handleChange}
            />
            <select name="genero" value={form.genero} onChange={handleChange}>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              name="foto_url"
              placeholder="URL Foto"
              value={form.foto_url}
              onChange={handleChange}
            />
            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
