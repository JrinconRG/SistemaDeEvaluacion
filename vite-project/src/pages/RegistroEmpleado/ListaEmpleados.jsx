import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./ListaEmpleados.css";

export default function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    filterEmpleados();
  }, [empleados, searchTerm, filterDepartamento, filterEstado]);

  const fetchEmpleados = async () => {
    try {
      const snapshot = await getDocs(collection(db, "empleados"));
      const empleadosList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpleados(empleadosList);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setLoading(false);
    }
  };

  const filterEmpleados = () => {
    let filtered = empleados;

    if (searchTerm) {
      filtered = filtered.filter(empleado => 
        empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.cedula.includes(searchTerm) ||
        empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartamento) {
      filtered = filtered.filter(empleado => empleado.departamento === filterDepartamento);
    }

    if (filterEstado) {
      filtered = filtered.filter(empleado => empleado.estado === filterEstado);
    }

    setFilteredEmpleados(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await deleteDoc(doc(db, "empleados", id));
        fetchEmpleados();
        alert("Empleado eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
        alert("Error al eliminar empleado");
      }
    }
  };

  const handleEdit = (empleado) => {
    navigate(`/editar-empleado/${empleado.id}`, { state: { empleado } });
  };

  const handleEvaluacion = (empleado) => {
    navigate(`/evaluacion-empleado/${empleado.id}`, { state: { empleado } });
  };

  const handlePlanMejora = (empleado) => {
    navigate(`/plan-mejora-empleado/${empleado.id}`, { state: { empleado } });
  };

  if (loading) {
    return (
      <div className="lista-empleados-page">
        <Sidebar />
        <Header />
        <div className="main-content">
          <div className="loading">Cargando empleados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-empleados-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="header-section">
            <h2>Lista de Empleados</h2>
            <button 
              className="btn-primary"
              onClick={() => navigate('/registro-empleado')}
            >
              Nuevo Empleado
            </button>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, cédula o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters">
              <select 
                value={filterDepartamento} 
                onChange={(e) => setFilterDepartamento(e.target.value)}
              >
                <option value="">Todos los departamentos</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Administración">Administración</option>
                <option value="Calidad">Calidad</option>
              </select>

              <select 
                value={filterEstado} 
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Licencia">En Licencia</option>
                <option value="Vacaciones">En Vacaciones</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="empleados-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Cédula</th>
                  <th>Cargo</th>
                  <th>Departamento</th>
                  <th>Estado</th>
                  <th>Fecha Ingreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpleados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No se encontraron empleados
                    </td>
                  </tr>
                ) : (
                  filteredEmpleados.map((empleado) => (
                    <tr key={empleado.id}>
                      <td>{`${empleado.nombre} ${empleado.apellido}`}</td>
                      <td>{empleado.cedula}</td>
                      <td>{empleado.cargo}</td>
                      <td>{empleado.departamento}</td>
                      <td>
                        <span className={`status-badge ${empleado.estado.toLowerCase()}`}>
                          {empleado.estado}
                        </span>
                      </td>
                      <td>{empleado.fecha_ingreso}</td>
                      <td className="actions-cell">
                        <button 
                          className="btn-action btn-view"
                          onClick={() => handleEvaluacion(empleado)}
                          title="Ver/Crear Evaluaciones"
                        >
                          📊
                        </button>
                        <button 
                          className="btn-action btn-plan"
                          onClick={() => handlePlanMejora(empleado)}
                          title="Planes de Mejora"
                        >
                          📋
                        </button>
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(empleado)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(empleado.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="summary-section">
            <div className="summary-card">
              <h4>Total de Empleados</h4>
              <span className="summary-number">{filteredEmpleados.length}</span>
            </div>
            <div className="summary-card">
              <h4>Empleados Activos</h4>
              <span className="summary-number">
                {filteredEmpleados.filter(e => e.estado === 'Activo').length}
              </span>
            </div>
            <div className="summary-card">
              <h4>Departamentos</h4>
              <span className="summary-number">
                {new Set(filteredEmpleados.map(e => e.departamento)).size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 