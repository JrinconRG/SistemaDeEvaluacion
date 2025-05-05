import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/sidebar/sidebar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./GenerarReportes.css";

export default function GenerarReportes() {
  // Estados para almacenar datos y filtros
  const [loading, setLoading] = useState(true);
  const [hallazgos, setHallazgos] = useState([]);
  const [planesMejora, setPlanesMejora] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [datosCombinados, setDatosCombinados] = useState([]);

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    area: "",
    estado: "",
    tipoAccion: "",
    origenHallazgo: ""
  });

  // Lista de áreas basadas en los datos de proceso_responsable
  const [areas, setAreas] = useState([]);
  const [origenes, setOrigenes] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Obtener hallazgos
      const hallazgosSnapshot = await getDocs(collection(db, "hallazgo"));
      const hallazgosData = hallazgosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHallazgos(hallazgosData);

      // Extraer orígenes únicos de hallazgos
      const uniqueOrigenes = [...new Set(hallazgosData.map(h => h.origen_hallazgo).filter(Boolean))];
      setOrigenes(uniqueOrigenes);
      
      // Obtener planes de mejora
      const planesMejoraSnapshot = await getDocs(collection(db, "planes_mejora"));
      const planesMejoraData = planesMejoraSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlanesMejora(planesMejoraData);

      // Extraer áreas únicas de proceso_responsable
      const uniqueAreas = [...new Set(planesMejoraData.map(p => p.proceso_responsable).filter(Boolean))];
      setAreas(uniqueAreas);
      
      // Obtener seguimiento de planes
      const seguimientoSnapshot = await getDocs(collection(db, "planes_mejora_info"));
      const seguimientoData = seguimientoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSeguimientos(seguimientoData);

      // Combinar datos para la tabla de reportes
      const datosCompletos = planesMejoraData.map(plan => {
        // Buscar el hallazgo relacionado
        const hallazgo = hallazgosData.find(h => h.id === plan.hallazgo_id) || {};
        
        // Buscar el seguimiento relacionado
        const seguimiento = seguimientoData.find(s => s.id_plan_mejora === plan.id) || {};
        
        return {
          id: plan.id,
          hallazgo: hallazgo.nombre_hallazgo || "Sin asignar",
          origen: hallazgo.origen_hallazgo || "No especificado",
          fechaHallazgo: hallazgo.fecha_origen || "",
          fallas: plan.fallas_calidad || "",
          tipoAccion: plan.tipo_accion || "No especificado",
          area: plan.proceso_responsable || "No especificado",
          responsable: plan.persona_responsable || "",
          fechaInicio: plan.fecha_inicio || "",
          fechaFinal: plan.fecha_final || "",
          estado: seguimiento.estado_accion || "Sin seguimiento",
          porcentaje: seguimiento.porcentaje_cumplimiento || "0",
          eficaz: seguimiento.eficaz || "No evaluado"
        };
      });
      
      setDatosCombinados(datosCompletos);
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  // Aplicar filtros a los datos
  const datosFiltrados = datosCombinados.filter(item => {
    // Filtro por fecha de inicio del plan
    if (filtros.fechaInicio && item.fechaInicio < filtros.fechaInicio) {
      return false;
    }
    
    // Filtro por fecha final del plan
    if (filtros.fechaFin && item.fechaFinal > filtros.fechaFin) {
      return false;
    }
    
    // Filtro por área
    if (filtros.area && item.area !== filtros.area) {
      return false;
    }
    
    // Filtro por estado
    if (filtros.estado && item.estado !== filtros.estado) {
      return false;
    }
    
    // Filtro por tipo de acción
    if (filtros.tipoAccion && item.tipoAccion !== filtros.tipoAccion) {
      return false;
    }
    
    // Filtro por origen del hallazgo
    if (filtros.origenHallazgo && item.origen !== filtros.origenHallazgo) {
      return false;
    }
    
    return true;
  });

  // Generar PDF con los datos filtrados
  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(16);
    doc.text("Reporte de Acciones de Mejora", 14, 15);
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 22);
    
    // Filtros aplicados
    doc.setFontSize(11);
    let filtersText = "Filtros aplicados: ";
    if (filtros.fechaInicio) filtersText += `Desde: ${filtros.fechaInicio}, `;
    if (filtros.fechaFin) filtersText += `Hasta: ${filtros.fechaFin}, `;
    if (filtros.area) filtersText += `Área: ${filtros.area}, `;
    if (filtros.estado) filtersText += `Estado: ${filtros.estado}, `;
    if (filtros.tipoAccion) filtersText += `Tipo: ${filtros.tipoAccion}, `;
    if (filtros.origenHallazgo) filtersText += `Origen: ${filtros.origenHallazgo}`;
    
    if (filtersText !== "Filtros aplicados: ") {
      doc.text(filtersText, 14, 28);
    }
    
    // Crear tabla
    const tableColumn = ["Hallazgo", "Área", "Tipo", "Estado", "% Cumplimiento", "Eficaz"];
    const tableRows = [];
    
    datosFiltrados.forEach(item => {
      const rowData = [
        item.hallazgo.substring(0, 25) + (item.hallazgo.length > 25 ? "..." : ""),
        item.area,
        item.tipoAccion,
        item.estado,
        item.porcentaje + "%",
        item.eficaz
      ];
      tableRows.push(rowData);
    });
    
    doc.autoTable({
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Añadir resumen estadístico
    const totalPlanes = datosFiltrados.length;
    const planesTotales = datosCombinados.length;
    const planesCompletos = datosFiltrados.filter(p => p.estado === "Cerrada").length;
    const porcentajeEfectividad = datosFiltrados.filter(p => p.eficaz === "Sí").length / 
                                  datosFiltrados.filter(p => p.eficaz === "Sí" || p.eficaz === "No").length * 100 || 0;
    
    const finalY = doc.lastAutoTable.finalY || 200;
    doc.setFontSize(12);
    doc.text("Resumen Estadístico", 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(`Total planes mostrados: ${totalPlanes} de ${planesTotales}`, 14, finalY + 20);
    doc.text(`Planes completados: ${planesCompletos} (${Math.round(planesCompletos/totalPlanes*100 || 0)}%)`, 14, finalY + 27);
    doc.text(`Efectividad de planes evaluados: ${Math.round(porcentajeEfectividad)}%`, 14, finalY + 34);
    
    // Guardar PDF
    doc.save("reporte_acciones_mejora.pdf");
  };

  // Exportar a Excel
  const exportarExcel = () => {
    // Preparar los datos para Excel
    const excelData = datosFiltrados.map(item => ({
      "Hallazgo": item.hallazgo,
      "Origen": item.origen,
      "Fecha Hallazgo": item.fechaHallazgo,
      "Fallas": item.fallas,
      "Tipo de Acción": item.tipoAccion,
      "Área": item.area,
      "Responsable": item.responsable,
      "Fecha Inicio": item.fechaInicio,
      "Fecha Final": item.fechaFinal,
      "Estado": item.estado,
      "Porcentaje": item.porcentaje + "%",
      "Eficaz": item.eficaz
    }));
    
    // Crear libro y hoja
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Acciones de Mejora");
    
    // Guardar archivo
    XLSX.writeFile(workbook, "reporte_acciones_mejora.xlsx");
  };

  if (loading) {
    return (
      <div className="reportes-page">
        <Sidebar />
        <Header />
        <div className="main-content">
          <div className="loading-container">
            <h2>Cargando datos para reportes...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-page">
      <Sidebar />
      <Header />
      <div className="main-content">
        <h1 className="reportes-title">Generación de Reportes</h1>
        
        <div className="filtros-container">
          <h2>Filtros</h2>
          <div className="filtros-grid">
            <div className="filtro-item">
              <label>Fecha Inicio (desde)</label>
              <input 
                type="date" 
                name="fechaInicio" 
                value={filtros.fechaInicio} 
                onChange={handleFiltroChange}
              />
            </div>
            
            <div className="filtro-item">
              <label>Fecha Final (hasta)</label>
              <input 
                type="date" 
                name="fechaFin" 
                value={filtros.fechaFin} 
                onChange={handleFiltroChange}
              />
            </div>
            
            <div className="filtro-item">
              <label>Área</label>
              <select name="area" value={filtros.area} onChange={handleFiltroChange}>
                <option value="">Todas las áreas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            
            <div className="filtro-item">
              <label>Estado</label>
              <select name="estado" value={filtros.estado} onChange={handleFiltroChange}>
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En ejecucion">En ejecución</option>
                <option value="Cerrada">Cerrada</option>
                <option value="Sin seguimiento">Sin seguimiento</option>
              </select>
            </div>
            
            <div className="filtro-item">
              <label>Tipo de Acción</label>
              <select name="tipoAccion" value={filtros.tipoAccion} onChange={handleFiltroChange}>
                <option value="">Todos los tipos</option>
                <option value="Correctiva">Correctiva</option>
                <option value="Preventiva">Preventiva</option>
                <option value="Mejoramiento">Mejoramiento</option>
              </select>
            </div>
            
            <div className="filtro-item">
              <label>Origen del Hallazgo</label>
              <select name="origenHallazgo" value={filtros.origenHallazgo} onChange={handleFiltroChange}>
                <option value="">Todos los orígenes</option>
                {origenes.map(origen => (
                  <option key={origen} value={origen}>{origen}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="exportar-buttons">
          <button className="exportar-btn pdf-btn" onClick={exportarPDF}>
            Exportar a PDF
          </button>
          <button className="exportar-btn excel-btn" onClick={exportarExcel}>
            Exportar a Excel
          </button>
        </div>
        
        <div className="resultados-container">
          <h2>Vista previa de datos ({datosFiltrados.length} registros)</h2>
          
          <div className="table-container">
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Hallazgo</th>
                  <th>Origen</th>
                  <th>Área</th>
                  <th>Tipo Acción</th>
                  <th>Estado</th>
                  <th>% Cumplimiento</th>
                  <th>Eficaz</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map((item, index) => (
                    <tr key={index}>
                      <td>{item.hallazgo}</td>
                      <td>{item.origen}</td>
                      <td>{item.area}</td>
                      <td>{item.tipoAccion}</td>
                      <td>
                        <span className={`estado-badge estado-${item.estado.toLowerCase().replace(' ', '-')}`}>
                          {item.estado}
                        </span>
                      </td>
                      <td>{item.porcentaje}%</td>
                      <td>{item.eficaz}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No se encontraron datos con los filtros seleccionados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {datosFiltrados.length > 0 && (
            <div className="estadisticas-container">
              <h3>Resumen de Datos</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{datosFiltrados.length}</div>
                  <div className="stat-label">Total de planes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {datosFiltrados.filter(p => p.estado === "Cerrada").length}
                  </div>
                  <div className="stat-label">Planes completados</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {Math.round(
                      datosFiltrados.reduce(
                        (sum, plan) => sum + parseInt(plan.porcentaje || 0), 0
                      ) / datosFiltrados.length
                    )}%
                  </div>
                  <div className="stat-label">Cumplimiento promedio</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {Math.round(
                      (datosFiltrados.filter(p => p.eficaz === "Sí").length / 
                       datosFiltrados.filter(p => p.eficaz === "Sí" || p.eficaz === "No").length) * 100 || 0
                    )}%
                  </div>
                  <div className="stat-label">Efectividad</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}