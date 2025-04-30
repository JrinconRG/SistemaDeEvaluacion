import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "./ReportesAcciones.css";

export default function ReportesAcciones() {
  const [acciones, setAcciones] = useState([]);
  const [filteredAcciones, setFilteredAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    area: "",
    estado: "",
  });

  // Lista de áreas y estados disponibles
  const areas = ["Producción", "Calidad", "Administración", "Ventas", "Logística", "Recursos Humanos"];
  const estados = ["Pendiente", "En progreso", "Completada", "Cancelada"];

  useEffect(() => {
    const fetchAcciones = async () => {
      try {
        console.log("Intentando obtener acciones de Firestore...");
        const accionesRef = collection(db, "acciones");
        const snapshot = await getDocs(accionesRef);
        const accionesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Acciones obtenidas:", accionesData);
        setAcciones(accionesData);
        setFilteredAcciones(accionesData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener acciones:", error);
        // En caso de error, proporcionar datos de ejemplo
        const datosEjemplo = [
          {
            id: "1",
            fecha: "2025-04-10",
            descripcion: "Implementar sistema de control de calidad",
            area: "Calidad",
            responsable: "Juan Pérez",
            estado: "En progreso",
            avance: 65,
            fechaCompromiso: "2025-05-15",
            comentarios: "Avanzando según lo planeado"
          },
          {
            id: "2",
            fecha: "2025-03-22",
            descripcion: "Actualizar procedimientos de auditoría",
            area: "Administración",
            responsable: "Ana López",
            estado: "Completada",
            avance: 100,
            fechaCompromiso: "2025-04-20",
            comentarios: "Finalizado antes de la fecha comprometida"
          },
          {
            id: "3",
            fecha: "2025-04-15",
            descripcion: "Mejora en proceso de empaque",
            area: "Producción",
            responsable: "Carlos Gómez",
            estado: "Pendiente",
            avance: 25,
            fechaCompromiso: "2025-06-01",
            comentarios: "Esperando aprobación de recursos"
          }
        ];
        setAcciones(datosEjemplo);
        setFilteredAcciones(datosEjemplo);
        setLoading(false);
      }
    };

    fetchAcciones();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  const aplicarFiltros = () => {
    let resultado = [...acciones];

    if (filtros.fechaInicio) {
      resultado = resultado.filter(accion => 
        accion.fecha && new Date(accion.fecha) >= new Date(filtros.fechaInicio)
      );
    }

    if (filtros.fechaFin) {
      resultado = resultado.filter(accion => 
        accion.fecha && new Date(accion.fecha) <= new Date(filtros.fechaFin)
      );
    }

    if (filtros.area) {
      resultado = resultado.filter(accion => 
        accion.area === filtros.area
      );
    }

    if (filtros.estado) {
      resultado = resultado.filter(accion => 
        accion.estado === filtros.estado
      );
    }

    setFilteredAcciones(resultado);
  };

  const resetFiltros = () => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
      area: "",
      estado: "",
    });
    setFilteredAcciones(acciones);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Título del reporte
    doc.setFontSize(18);
    doc.text("Reporte de Acciones de Mejora", 14, 22);
    
    // Información de filtros aplicados
    doc.setFontSize(10);
    let filtrosText = "Filtros aplicados: ";
    if (filtros.fechaInicio) filtrosText += `Desde: ${filtros.fechaInicio} `;
    if (filtros.fechaFin) filtrosText += `Hasta: ${filtros.fechaFin} `;
    if (filtros.area) filtrosText += `Área: ${filtros.area} `;
    if (filtros.estado) filtrosText += `Estado: ${filtros.estado} `;
    if (filtrosText === "Filtros aplicados: ") filtrosText += "Ninguno";
    
    doc.text(filtrosText, 14, 30);
    
    // Fecha de generación
    const hoy = new Date().toLocaleDateString();
    doc.text(`Fecha de generación: ${hoy}`, 14, 35);
    
    // Cabeceras de tabla
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    let yPos = 45;
    const col1Width = 25;
    const col2Width = 60;
    const col3Width = 30;
    const col4Width = 30;
    const col5Width = 25;
    const col6Width = 20;
    
    // Dibujar cabeceras
    doc.setFont("helvetica", "bold");
    doc.text("Fecha", 14, yPos);
    doc.text("Descripción", 14 + col1Width, yPos);
    doc.text("Área", 14 + col1Width + col2Width, yPos);
    doc.text("Responsable", 14 + col1Width + col2Width + col3Width, yPos);
    doc.text("Estado", 14 + col1Width + col2Width + col3Width + col4Width, yPos);
    doc.text("Avance", 14 + col1Width + col2Width + col3Width + col4Width + col5Width, yPos);
    
    yPos += 6;
    
    // Dibujar línea separadora
    doc.line(14, yPos - 2, 196, yPos - 2);
    
    // Contenido de la tabla
    doc.setFont("helvetica", "normal");
    
    filteredAcciones.forEach((accion, index) => {
      // Verificar si necesitamos una nueva página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Truncar descripción si es muy larga
      let descripcion = accion.descripcion || "";
      if (descripcion.length > 30) {
        descripcion = descripcion.substring(0, 27) + "...";
      }
      
      doc.text(accion.fecha || "", 14, yPos);
      doc.text(descripcion, 14 + col1Width, yPos);
      doc.text(accion.area || "", 14 + col1Width + col2Width, yPos);
      doc.text(accion.responsable || "", 14 + col1Width + col2Width + col3Width, yPos);
      doc.text(accion.estado || "", 14 + col1Width + col2Width + col3Width + col4Width, yPos);
      doc.text(`${accion.avance || 0}%`, 14 + col1Width + col2Width + col3Width + col4Width + col5Width, yPos);
      
      yPos += 7;
    });
    
    // Estadísticas de resumen
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Resumen", 14, yPos);
    yPos += 6;
    
    const totalAcciones = filteredAcciones.length;
    const accionesPendientes = filteredAcciones.filter(a => a.estado === "Pendiente").length;
    const accionesEnProgreso = filteredAcciones.filter(a => a.estado === "En progreso").length;
    const accionesCompletadas = filteredAcciones.filter(a => a.estado === "Completada").length;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Total de acciones: ${totalAcciones}`, 14, yPos);
    yPos += 6;
    doc.text(`Pendientes: ${accionesPendientes} (${Math.round(accionesPendientes / totalAcciones * 100) || 0}%)`, 14, yPos);
    yPos += 6;
    doc.text(`En progreso: ${accionesEnProgreso} (${Math.round(accionesEnProgreso / totalAcciones * 100) || 0}%)`, 14, yPos);
    yPos += 6;
    doc.text(`Completadas: ${accionesCompletadas} (${Math.round(accionesCompletadas / totalAcciones * 100) || 0}%)`, 14, yPos);
    
    // Guardar PDF
    doc.save(`Reporte_Acciones_${hoy.replace(/\//g, '-')}.pdf`);
  };

  const exportarExcel = () => {
    // Preparar datos para Excel
    const dataForExcel = filteredAcciones.map(accion => ({
      Fecha: accion.fecha || "",
      Descripcion: accion.descripcion || "",
      Area: accion.area || "",
      Responsable: accion.responsable || "",
      Estado: accion.estado || "",
      Avance: `${accion.avance || 0}%`,
      FechaCompromiso: accion.fechaCompromiso || "",
      Comentarios: accion.comentarios || ""
    }));
    
    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    
    // Añadir worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, "Acciones de Mejora");
    
    // Generar archivo Excel y descargarlo
    const hoy = new Date().toLocaleDateString().replace(/\//g, '-');
    XLSX.writeFile(wb, `Reporte_Acciones_${hoy}.xlsx`);
  };

  return (
    <div className="reportes-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="reportes-container">
          <h2>Reportes de Acciones de Mejora</h2>
          
          <div className="filtros-panel">
            <h3>Filtros</h3>
            <div className="filtros-grid">
              <div className="filtro-item">
                <label>Fecha Inicio:</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={filtros.fechaInicio}
                  onChange={handleFiltroChange}
                />
              </div>
              
              <div className="filtro-item">
                <label>Fecha Fin:</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={filtros.fechaFin}
                  onChange={handleFiltroChange}
                />
              </div>
              
              <div className="filtro-item">
                <label>Área:</label>
                <select
                  name="area"
                  value={filtros.area}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas las áreas</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filtro-item">
                <label>Estado:</label>
                <select
                  name="estado"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filtros-botones">
              <button onClick={aplicarFiltros} className="btn-aplicar">
                Aplicar Filtros
              </button>
              <button onClick={resetFiltros} className="btn-resetear">
                Resetear Filtros
              </button>
            </div>
          </div>
          
          <div className="reporte-acciones">
            <div className="acciones-header">
              <h3>Acciones de Mejora {filteredAcciones.length > 0 ? `(${filteredAcciones.length})` : ""}</h3>
              <div className="export-buttons">
                <button onClick={exportarPDF} className="btn-exportar pdf">
                  Exportar a PDF
                </button>
                <button onClick={exportarExcel} className="btn-exportar excel">
                  Exportar a Excel
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Cargando datos...</div>
            ) : filteredAcciones.length === 0 ? (
              <div className="no-data">No se encontraron acciones con los filtros seleccionados</div>
            ) : (
              <div className="tabla-container">
                <table className="tabla-acciones">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Área</th>
                      <th>Responsable</th>
                      <th>Estado</th>
                      <th>Avance</th>
                      <th>Fecha Compromiso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAcciones.map((accion) => (
                      <tr key={accion.id}>
                        <td>{accion.fecha}</td>
                        <td>{accion.descripcion}</td>
                        <td>{accion.area}</td>
                        <td>{accion.responsable}</td>
                        <td>
                          <span className={`estado-badge ${accion.estado?.toLowerCase().replace(" ", "-")}`}>
                            {accion.estado}
                          </span>
                        </td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${accion.avance || 0}%` }}
                            ></div>
                            <span>{accion.avance || 0}%</span>
                          </div>
                        </td>
                        <td>{accion.fechaCompromiso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredAcciones.length > 0 && (
              <div className="estadisticas-resumen">
                <h3>Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{filteredAcciones.length}</div>
                    <div className="stat-label">Total de acciones</div>
                  </div>
                  
                  <div className="stat-card pendientes">
                    <div className="stat-value">
                      {filteredAcciones.filter(a => a.estado === "Pendiente").length}
                    </div>
                    <div className="stat-label">Pendientes</div>
                  </div>
                  
                  <div className="stat-card en-progreso">
                    <div className="stat-value">
                      {filteredAcciones.filter(a => a.estado === "En progreso").length}
                    </div>
                    <div className="stat-label">En progreso</div>
                  </div>
                  
                  <div className="stat-card completadas">
                    <div className="stat-value">
                      {filteredAcciones.filter(a => a.estado === "Completada").length}
                    </div>
                    <div className="stat-label">Completadas</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}