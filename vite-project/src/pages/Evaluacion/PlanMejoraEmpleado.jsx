import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig.js";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./PlanMejoraEmpleado.css";

export default function PlanMejoraEmpleado() {
  const { empleadoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const empleado = location.state?.empleado;

  const [planesMejora, setPlanesMejora] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [form, setForm] = useState({
    evaluacion_id: "",
    area_mejora: "",
    objetivo_mejora: "",
    actividades_especificas: "",
    recursos_necesarios: "",
    indicadores_exito: "",
    fecha_inicio: "",
    fecha_fin: "",
    responsable_seguimiento: "",
    estado: "En Progreso",
    observaciones: "",
    progreso: 0
  });

  useEffect(() => {
    if (empleadoId) {
      fetchPlanesMejora();
      fetchEvaluaciones();
    }
  }, [empleadoId]);

  const fetchPlanesMejora = async () => {
    try {
      const q = query(collection(db, "planes_mejora_empleados"), where("empleado_id", "==", empleadoId));
      const snapshot = await getDocs(q);
      const planesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlanesMejora(planesList);
    } catch (error) {
      console.error("Error al cargar planes de mejora:", error);
    }
  };

  const fetchEvaluaciones = async () => {
    try {
      const q = query(collection(db, "evaluaciones"), where("empleado_id", "==", empleadoId));
      const snapshot = await getDocs(q);
      const evaluacionesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvaluaciones(evaluacionesList);
    } catch (error) {
      console.error("Error al cargar evaluaciones:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPlan) {
        // Actualizar plan existente
        await updateDoc(doc(db, "planes_mejora_empleados", editingPlan.id), {
          ...form,
          fecha_actualizacion: new Date()
        });
        alert("Plan de mejora actualizado exitosamente");
      } else {
        // Crear nuevo plan
        await addDoc(collection(db, "planes_mejora_empleados"), {
          ...form,
          empleado_id: empleadoId,
          empleado_nombre: empleado ? `${empleado.nombre} ${empleado.apellido}` : '',
          fecha_creacion: new Date(),
          progreso: parseInt(form.progreso) || 0
        });
        alert("Plan de mejora registrado exitosamente");
      }

      setShowForm(false);
      setEditingPlan(null);
      fetchPlanesMejora();
      resetForm();
    } catch (error) {
      console.error("Error al guardar plan de mejora:", error);
      alert("Error al guardar plan de mejora");
    }
  };

  const resetForm = () => {
    setForm({
      evaluacion_id: "",
      area_mejora: "",
      objetivo_mejora: "",
      actividades_especificas: "",
      recursos_necesarios: "",
      indicadores_exito: "",
      fecha_inicio: "",
      fecha_fin: "",
      responsable_seguimiento: "",
      estado: "En Progreso",
      observaciones: "",
      progreso: 0
    });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setForm({ ...plan });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    resetForm();
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Completado': return 'completado';
      case 'En Progreso': return 'en-progreso';
      case 'Pendiente': return 'pendiente';
      case 'Pausado': return 'pausado';
      default: return 'pendiente';
    }
  };

  const getProgresoColor = (progreso) => {
    if (progreso >= 80) return '#27ae60';
    if (progreso >= 50) return '#f39c12';
    if (progreso >= 25) return '#e67e22';
    return '#e74c3c';
  };

  if (!empleado) {
    return (
      <div className="plan-mejora-empleado-page">
        <Sidebar />
        <Header />
        <div className="main-content">
          <div className="error-message">
            <h3>Error: No se encontró información del empleado</h3>
            <button onClick={() => navigate('/lista-empleados')}>
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-mejora-empleado-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header del empleado */}
          <div className="empleado-header">
            <div className="empleado-info">
              <h2>Planes de Mejora</h2>
              <div className="empleado-datos">
                <h3>{empleado.nombre} {empleado.apellido}</h3>
                <p><strong>Cargo:</strong> {empleado.cargo}</p>
                <p><strong>Departamento:</strong> {empleado.departamento}</p>
                <p><strong>Cédula:</strong> {empleado.cedula}</p>
              </div>
            </div>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancelar" : "Nuevo Plan de Mejora"}
            </button>
          </div>

          {/* Formulario de plan de mejora */}
          {showForm && (
            <div className="form-container">
              <form onSubmit={handleSubmit} className="plan-mejora-form">
                <h3>{editingPlan ? "Editar Plan de Mejora" : "Nuevo Plan de Mejora"}</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Evaluación Relacionada</label>
                    <select name="evaluacion_id" value={form.evaluacion_id} onChange={handleChange}>
                      <option value="">Seleccione una evaluación (opcional)</option>
                      {evaluaciones.map(evaluacion => (
                        <option key={evaluacion.id} value={evaluacion.id}>
                          {evaluacion.periodo} - {evaluacion.tipo_evaluacion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Área de Mejora *</label>
                    <select name="area_mejora" value={form.area_mejora} onChange={handleChange} required>
                      <option value="">Seleccione área</option>
                      <option value="Trabajo en Equipo">Trabajo en Equipo</option>
                      <option value="Comunicación">Comunicación</option>
                      <option value="Liderazgo">Liderazgo</option>
                      <option value="Conocimiento Técnico">Conocimiento Técnico</option>
                      <option value="Orientación a Resultados">Orientación a Resultados</option>
                      <option value="Adaptabilidad">Adaptabilidad</option>
                      <option value="Puntualidad">Puntualidad</option>
                      <option value="Iniciativa">Iniciativa</option>
                      <option value="Servicio al Cliente">Servicio al Cliente</option>
                      <option value="Gestión del Tiempo">Gestión del Tiempo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estado</label>
                    <select name="estado" value={form.estado} onChange={handleChange}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Pausado">Pausado</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Progreso (%)</label>
                    <input 
                      type="range"
                      name="progreso"
                      min="0"
                      max="100"
                      value={form.progreso}
                      onChange={handleChange}
                    />
                    <span className="progreso-value">{form.progreso}%</span>
                  </div>

                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input 
                      type="date" 
                      name="fecha_inicio" 
                      value={form.fecha_inicio}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Fecha Estimada de Finalización *</label>
                    <input 
                      type="date" 
                      name="fecha_fin" 
                      value={form.fecha_fin}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Responsable de Seguimiento *</label>
                    <input 
                      type="text" 
                      name="responsable_seguimiento" 
                      value={form.responsable_seguimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Objetivo de Mejora *</label>
                  <textarea 
                    name="objetivo_mejora" 
                    value={form.objetivo_mejora}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describa claramente el objetivo que se pretende alcanzar..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Actividades Específicas *</label>
                  <textarea 
                    name="actividades_especificas" 
                    value={form.actividades_especificas}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Detalle las actividades específicas que se realizarán..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Recursos Necesarios</label>
                  <textarea 
                    name="recursos_necesarios" 
                    value={form.recursos_necesarios}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Especifique los recursos necesarios (materiales, capacitaciones, etc.)..."
                  />
                </div>

                <div className="form-group">
                  <label>Indicadores de Éxito</label>
                  <textarea 
                    name="indicadores_exito" 
                    value={form.indicadores_exito}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Defina cómo se medirá el éxito de este plan..."
                  />
                </div>

                <div className="form-group">
                  <label>Observaciones</label>
                  <textarea 
                    name="observaciones" 
                    value={form.observaciones}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Observaciones adicionales..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingPlan ? "Actualizar Plan" : "Guardar Plan"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de planes de mejora */}
          <div className="planes-list">
            <h3>Planes de Mejora Actuales</h3>
            {planesMejora.length === 0 ? (
              <div className="no-planes">
                <p>No hay planes de mejora registrados para este empleado.</p>
              </div>
            ) : (
              <div className="planes-grid">
                {planesMejora.map((plan) => (
                  <div key={plan.id} className="plan-card">
                    <div className="plan-header">
                      <h4>{plan.area_mejora}</h4>
                      <span className={`estado-badge ${getEstadoClass(plan.estado)}`}>
                        {plan.estado}
                      </span>
                    </div>
                    
                    <div className="plan-progreso">
                      <div className="progreso-bar">
                        <div 
                          className="progreso-fill"
                          style={{ 
                            width: `${plan.progreso}%`,
                            backgroundColor: getProgresoColor(plan.progreso)
                          }}
                        ></div>
                      </div>
                      <span className="progreso-text">{plan.progreso}%</span>
                    </div>

                    <div className="plan-details">
                      <p><strong>Objetivo:</strong> {plan.objetivo_mejora}</p>
                      <p><strong>Responsable:</strong> {plan.responsable_seguimiento}</p>
                      <p><strong>Inicio:</strong> {plan.fecha_inicio}</p>
                      <p><strong>Fin estimado:</strong> {plan.fecha_fin}</p>
                    </div>

                    <div className="plan-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(plan)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/detalle-plan-mejora/${plan.id}`, {
                          state: { plan, empleado }
                        })}
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 