import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./EvaluacionEmpleado.css";

export default function EvaluacionEmpleado() {
  const { empleadoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const empleado = location.state?.empleado;

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    periodo: "",
    tipo_evaluacion: "",
    puntuacion_total: 0,
    competencias: {
      trabajo_equipo: 0,
      comunicacion: 0,
      liderazgo: 0,
      adaptabilidad: 0,
      orientacion_resultados: 0,
      conocimiento_tecnico: 0,
      puntualidad: 0,
      iniciativa: 0
    },
    objetivos_logrados: "",
    areas_mejora: "",
    comentarios_evaluador: "",
    metas_siguiente_periodo: "",
    capacitaciones_requeridas: "",
    evaluador: "",
    fecha_evaluacion: ""
  });

  useEffect(() => {
    if (empleadoId) {
      fetchEvaluaciones();
    }
  }, [empleadoId]);

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
    
    if (name.startsWith('competencias.')) {
      const competencia = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        competencias: {
          ...prev.competencias,
          [competencia]: parseInt(value) || 0
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    // Calcular puntuación total automáticamente
    const competenciasValues = Object.values(form.competencias);
    const total = competenciasValues.reduce((sum, val) => sum + val, 0);
    const promedio = competenciasValues.length > 0 ? (total / competenciasValues.length).toFixed(1) : 0;
    
    setForm(prev => ({ 
      ...prev, 
      puntuacion_total: parseFloat(promedio)
    }));
  }, [form.competencias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "evaluaciones"), {
        ...form,
        empleado_id: empleadoId,
        empleado_nombre: empleado ? `${empleado.nombre} ${empleado.apellido}` : '',
        fecha_creacion: new Date(),
        estado: "Completada"
      });

      alert("Evaluación registrada exitosamente");
      setShowForm(false);
      fetchEvaluaciones();
      
      // Reset form
      setForm({
        periodo: "",
        tipo_evaluacion: "",
        puntuacion_total: 0,
        competencias: {
          trabajo_equipo: 0,
          comunicacion: 0,
          liderazgo: 0,
          adaptabilidad: 0,
          orientacion_resultados: 0,
          conocimiento_tecnico: 0,
          puntualidad: 0,
          iniciativa: 0
        },
        objetivos_logrados: "",
        areas_mejora: "",
        comentarios_evaluador: "",
        metas_siguiente_periodo: "",
        capacitaciones_requeridas: "",
        evaluador: "",
        fecha_evaluacion: ""
      });
    } catch (error) {
      console.error("Error al registrar evaluación:", error);
      alert("Error al registrar evaluación");
    }
  };

  const getCalificacionTexto = (puntuacion) => {
    if (puntuacion >= 9) return { texto: "Excelente", clase: "excelente" };
    if (puntuacion >= 7) return { texto: "Bueno", clase: "bueno" };
    if (puntuacion >= 5) return { texto: "Regular", clase: "regular" };
    return { texto: "Necesita Mejora", clase: "necesita-mejora" };
  };

  if (!empleado) {
    return (
      <div className="evaluacion-empleado-page">
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
    <div className="evaluacion-empleado-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header del empleado */}
          <div className="empleado-header">
            <div className="empleado-info">
              <h2>Evaluaciones de Desempeño</h2>
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
              {showForm ? "Cancelar" : "Nueva Evaluación"}
            </button>
          </div>

          {/* Formulario de nueva evaluación */}
          {showForm && (
            <div className="form-container">
              <form onSubmit={handleSubmit} className="evaluacion-form">
                <h3>Nueva Evaluación de Desempeño</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Período de Evaluación *</label>
                    <input 
                      type="text" 
                      name="periodo" 
                      value={form.periodo}
                      onChange={handleChange}
                      placeholder="Ej: Enero - Junio 2024"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo de Evaluación *</label>
                    <select name="tipo_evaluacion" value={form.tipo_evaluacion} onChange={handleChange} required>
                      <option value="">Seleccione tipo</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Probatorio">Período Probatorio</option>
                      <option value="Promocion">Por Promoción</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Evaluador *</label>
                    <input 
                      type="text" 
                      name="evaluador" 
                      value={form.evaluador}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Fecha de Evaluación *</label>
                    <input 
                      type="date" 
                      name="fecha_evaluacion" 
                      value={form.fecha_evaluacion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Competencias */}
                <div className="competencias-section">
                  <h4>Evaluación de Competencias (Escala 1-10)</h4>
                  <div className="competencias-grid">
                    {Object.entries(form.competencias).map(([competencia, valor]) => (
                      <div key={competencia} className="competencia-item">
                        <label>{competencia.replace(/_/g, ' ').toUpperCase()}</label>
                        <div className="input-with-value">
                          <input 
                            type="range"
                            name={`competencias.${competencia}`}
                            min="1"
                            max="10"
                            value={valor}
                            onChange={handleChange}
                          />
                          <span className="competencia-valor">{valor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="puntuacion-total">
                    <strong>Puntuación Total: {form.puntuacion_total}/10</strong>
                    <span className={`calificacion ${getCalificacionTexto(form.puntuacion_total).clase}`}>
                      {getCalificacionTexto(form.puntuacion_total).texto}
                    </span>
                  </div>
                </div>

                {/* Campos de texto */}
                <div className="form-group">
                  <label>Objetivos Logrados</label>
                  <textarea 
                    name="objetivos_logrados" 
                    value={form.objetivos_logrados}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describa los principales objetivos alcanzados durante este período..."
                  />
                </div>

                <div className="form-group">
                  <label>Áreas de Mejora</label>
                  <textarea 
                    name="areas_mejora" 
                    value={form.areas_mejora}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Identifique las áreas que requieren mejora..."
                  />
                </div>

                <div className="form-group">
                  <label>Comentarios del Evaluador</label>
                  <textarea 
                    name="comentarios_evaluador" 
                    value={form.comentarios_evaluador}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Comentarios adicionales del evaluador..."
                  />
                </div>

                <div className="form-group">
                  <label>Metas para el Siguiente Período</label>
                  <textarea 
                    name="metas_siguiente_periodo" 
                    value={form.metas_siguiente_periodo}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Establezca las metas para el próximo período..."
                  />
                </div>

                <div className="form-group">
                  <label>Capacitaciones Requeridas</label>
                  <textarea 
                    name="capacitaciones_requeridas" 
                    value={form.capacitaciones_requeridas}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Identifique las capacitaciones necesarias..."
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Guardar Evaluación
                </button>
              </form>
            </div>
          )}

          {/* Lista de evaluaciones existentes */}
          <div className="evaluaciones-list">
            <h3>Historial de Evaluaciones</h3>
            {evaluaciones.length === 0 ? (
              <div className="no-evaluaciones">
                <p>No hay evaluaciones registradas para este empleado.</p>
              </div>
            ) : (
              <div className="evaluaciones-grid">
                {evaluaciones.map((evaluacion) => (
                  <div key={evaluacion.id} className="evaluacion-card">
                    <div className="evaluacion-header">
                      <h4>{evaluacion.periodo}</h4>
                      <span className={`badge ${getCalificacionTexto(evaluacion.puntuacion_total).clase}`}>
                        {evaluacion.puntuacion_total}/10
                      </span>
                    </div>
                    <div className="evaluacion-details">
                      <p><strong>Tipo:</strong> {evaluacion.tipo_evaluacion}</p>
                      <p><strong>Evaluador:</strong> {evaluacion.evaluador}</p>
                      <p><strong>Fecha:</strong> {evaluacion.fecha_evaluacion}</p>
                      <p><strong>Calificación:</strong> {getCalificacionTexto(evaluacion.puntuacion_total).texto}</p>
                    </div>
                    <div className="evaluacion-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/detalle-evaluacion/${evaluacion.id}`, { 
                          state: { evaluacion, empleado } 
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