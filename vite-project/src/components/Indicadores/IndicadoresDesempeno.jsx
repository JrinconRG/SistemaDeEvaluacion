import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Header from "../Header/Header";
import Sidebar from "../sidebar/sidebar";
import "./Indicadores.css"; // Crearemos este archivo después

export default function IndicadoresDesempeno() {
  // Estados para almacenar las métricas
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalHallazgos: 0,
    hallazgosPorOrigen: {},
    planesMejora: {
      total: 0,
      porTipo: {
        Correctiva: 0,
        Preventiva: 0,
        Mejoramiento: 0
      }
    },
    seguimientoPlanes: {
      abiertos: 0,
      enEjecucion: 0,
      cerrados: 0,
      porcentajePromedio: 0
    },
    atributosCalidad: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener hallazgos
        const hallazgosSnapshot = await getDocs(collection(db, "hallazgo"));
        const hallazgos = hallazgosSnapshot.docs.map(doc => doc.data());
        
        // Obtener planes de mejora
        const planesMejoraSnapshot = await getDocs(collection(db, "planes_mejora"));
        const planesMejora = planesMejoraSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Obtener seguimiento de planes
        const seguimientoSnapshot = await getDocs(collection(db, "planes_mejora_info"));
        const seguimientoPlanes = seguimientoSnapshot.docs.map(doc => doc.data());

        // Calcular métricas
        const hallazgosPorOrigen = {};
        hallazgos.forEach(h => {
          if (h.origen_hallazgo) {
            hallazgosPorOrigen[h.origen_hallazgo] = (hallazgosPorOrigen[h.origen_hallazgo] || 0) + 1;
          }
        });

        const planesPorTipo = {
          Correctiva: 0,
          Preventiva: 0,
          Mejoramiento: 0
        };
        planesMejora.forEach(p => {
          if (p.tipo_accion) {
            planesPorTipo[p.tipo_accion] = (planesPorTipo[p.tipo_accion] || 0) + 1;
          }
        });

        // Métricas de seguimiento
        let abiertos = 0, enEjecucion = 0, cerrados = 0;
        let sumaPorcentajes = 0;
        seguimientoPlanes.forEach(s => {
          if (s.estado_accion === "Abierta") abiertos++;
          else if (s.estado_accion === "En ejecucion") enEjecucion++;
          else if (s.estado_accion === "Cerrada") cerrados++;
          
          if (s.porcentaje_cumplimiento) {
            sumaPorcentajes += parseInt(s.porcentaje_cumplimiento);
          }
        });

        // Calcular porcentaje promedio
        const porcentajePromedio = seguimientoPlanes.length > 0 
          ? Math.round(sumaPorcentajes / seguimientoPlanes.length) 
          : 0;

        // Contar atributos de calidad
        const atributosCalidad = {};
        planesMejora.forEach(p => {
          if (p.atributo_calidad) {
            atributosCalidad[p.atributo_calidad] = (atributosCalidad[p.atributo_calidad] || 0) + 1;
          }
        });

        // Actualizar el estado con todas las métricas calculadas
        setMetricas({
          totalHallazgos: hallazgos.length,
          hallazgosPorOrigen,
          planesMejora: {
            total: planesMejora.length,
            porTipo: planesPorTipo
          },
          seguimientoPlanes: {
            abiertos,
            enEjecucion,
            cerrados,
            porcentajePromedio
          },
          atributosCalidad
        });

      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Podríamos implementar actualización periódica aquí
    // const interval = setInterval(fetchData, 60000); // Actualizar cada minuto
    // return () => clearInterval(interval);
  }, []);

  // Función para obtener el color según el porcentaje
  const getColorForPercentage = (percentage) => {
    if (percentage < 30) return "#ff6b6b"; // Rojo
    if (percentage < 70) return "#ffd166"; // Amarillo
    return "#06d6a0"; // Verde
  };

  if (loading) {
    return (
      <div>
      
      <h2>Cargando indicadores...</h2>
         </div>
    );
  }

  return (

      <div>
        <h1 className="indicadores-title">Indicadores de Desempeño</h1>
        <p className="indicadores-date">Actualizado: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        
        <div className="dashboard-container">
          {/* Resumen General */}
          <div className="dashboard-card summary-card">
            <h2>Resumen General</h2>
            <div className="metric-container">
              <div className="metric">
                <div className="metric-value">{metricas.totalHallazgos}</div>
                <div className="metric-label">Total Hallazgos</div>
              </div>
              <div className="metric">
                <div className="metric-value">{metricas.planesMejora.total}</div>
                <div className="metric-label">Planes de Mejora</div>
              </div>
              <div className="metric">
                <div className="metric-value">{metricas.seguimientoPlanes.abiertos + metricas.seguimientoPlanes.enEjecucion + metricas.seguimientoPlanes.cerrados}</div>
                <div className="metric-label">Seguimientos</div>
              </div>
            </div>
          </div>
          
          {/* Estado de las acciones */}
          <div className="dashboard-card">
            <h2>Estado de Acciones</h2>
            <div className="progress-container">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Abiertas</span>
                  <span>{metricas.seguimientoPlanes.abiertos}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${metricas.seguimientoPlanes.abiertos * 100 / (metricas.seguimientoPlanes.abiertos + metricas.seguimientoPlanes.enEjecucion + metricas.seguimientoPlanes.cerrados || 1)}%`,
                      backgroundColor: "#ff6b6b"
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>En Ejecución</span>
                  <span>{metricas.seguimientoPlanes.enEjecucion}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${metricas.seguimientoPlanes.enEjecucion * 100 / (metricas.seguimientoPlanes.abiertos + metricas.seguimientoPlanes.enEjecucion + metricas.seguimientoPlanes.cerrados || 1)}%`,
                      backgroundColor: "#ffd166"
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Cerradas</span>
                  <span>{metricas.seguimientoPlanes.cerrados}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${metricas.seguimientoPlanes.cerrados * 100 / (metricas.seguimientoPlanes.abiertos + metricas.seguimientoPlanes.enEjecucion + metricas.seguimientoPlanes.cerrados || 1)}%`,
                      backgroundColor: "#06d6a0"
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="cumplimiento-container">
              <h3>Porcentaje promedio de cumplimiento</h3>
              <div className="cumplimiento-circle" style={{ borderColor: getColorForPercentage(metricas.seguimientoPlanes.porcentajePromedio) }}>
                <span className="porcentaje">{metricas.seguimientoPlanes.porcentajePromedio}%</span>
              </div>
            </div>
          </div>
          
          {/* Distribución de tipos de acción */}
          <div className="dashboard-card">
            <h2>Tipos de Acción</h2>
            <div className="chart-container">
              {Object.entries(metricas.planesMejora.porTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="bar-chart-item">
                  <div className="bar-label">{tipo}</div>
                  <div className="bar-container">
                    <div 
                      className="bar" 
                      style={{ 
                        width: `${cantidad * 100 / (metricas.planesMejora.total || 1)}%`,
                        backgroundColor: tipo === "Correctiva" ? "#ff6b6b" : 
                                        tipo === "Preventiva" ? "#ffd166" : "#06d6a0"
                      }}
                    ></div>
                    <span className="bar-value">{cantidad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Origen de hallazgos */}
          <div className="dashboard-card">
            <h2>Origen de Hallazgos</h2>
            <div className="origen-container">
              {Object.entries(metricas.hallazgosPorOrigen).map(([origen, cantidad], index) => (
                <div key={origen} className="origen-item">
                  <div className="origen-dot" style={{ backgroundColor: `hsl(${index * 36}, 70%, 50%)` }}></div>
                  <div className="origen-label">{origen}</div>
                  <div className="origen-value">{cantidad}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Atributos de calidad */}
          <div className="dashboard-card">
            <h2>Atributos de Calidad</h2>
            <div className="atributos-container">
              {Object.entries(metricas.atributosCalidad).map(([atributo, cantidad], index) => (
                <div key={atributo} className="atributo-item">
                  <div className="atributo-name">{atributo}</div>
                  <div className="atributo-bar-container">
                    <div 
                      className="atributo-bar" 
                      style={{ 
                        width: `${Math.max(10, cantidad * 100 / (Object.values(metricas.atributosCalidad).reduce((a, b) => a + b, 0) || 1))}%`,
                        backgroundColor: `hsl(${index * 40}, 70%, 60%)`
                      }}
                    >
                      {cantidad}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}