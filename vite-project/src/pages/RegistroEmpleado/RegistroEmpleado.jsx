import { useState } from "react";
import { db } from "../../firebase/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./RegistroEmpleado.css";

export default function RegistroEmpleado() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    cargo: "",
    departamento: "",
    email: "",
    telefono: "",
    fecha_ingreso: "",
    estado: "Activo",
    jefe_inmediato: "",
    nivel_cargo: "",
    sede: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await addDoc(collection(db, "empleados"), {
        ...form,
        fecha_registro: new Date(),
        evaluaciones: [],
        planes_mejora: []
      });
      
      alert("Empleado registrado exitosamente");
      
      // Reset form
      setForm({
        nombre: "",
        apellido: "",
        cedula: "",
        cargo: "",
        departamento: "",
        email: "",
        telefono: "",
        fecha_ingreso: "",
        estado: "Activo",
        jefe_inmediato: "",
        nivel_cargo: "",
        sede: ""
      });
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      alert("Error al registrar empleado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registro-empleado-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="registro-empleado-form">
            <h2>Registro de Empleado</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido *</label>
                <input 
                  type="text" 
                  name="apellido" 
                  value={form.apellido} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cédula *</label>
                <input 
                  type="text" 
                  name="cedula" 
                  value={form.cedula} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cargo *</label>
                <input 
                  type="text" 
                  name="cargo" 
                  value={form.cargo} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Departamento *</label>
                <select name="departamento" value={form.departamento} onChange={handleChange} required>
                  <option value="">Seleccione departamento</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Administración">Administración</option>
                  <option value="Calidad">Calidad</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  name="telefono" 
                  value={form.telefono} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Fecha de Ingreso *</label>
                <input 
                  type="date" 
                  name="fecha_ingreso" 
                  value={form.fecha_ingreso} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Licencia">En Licencia</option>
                  <option value="Vacaciones">En Vacaciones</option>
                </select>
              </div>

              <div className="form-group">
                <label>Jefe Inmediato</label>
                <input 
                  type="text" 
                  name="jefe_inmediato" 
                  value={form.jefe_inmediato} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nivel del Cargo</label>
                <select name="nivel_cargo" value={form.nivel_cargo} onChange={handleChange}>
                  <option value="">Seleccione nivel</option>
                  <option value="Operativo">Operativo</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Jefe">Jefe</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Director">Director</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sede</label>
                <select name="sede" value={form.sede} onChange={handleChange}>
                  <option value="">Seleccione sede</option>
                  <option value="Principal">Principal</option>
                  <option value="Sucursal Norte">Sucursal Norte</option>
                  <option value="Sucursal Sur">Sucursal Sur</option>
                  <option value="Sucursal Centro">Sucursal Centro</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? "Registrando..." : "Registrar Empleado"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 