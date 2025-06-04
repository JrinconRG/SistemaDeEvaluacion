import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Notificaciones from "../Notificaciones/Notificaciones"; // importa el componente
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <aside className="sidebar">
      
      <div className="logo-container">
        <img src="/src/assets/Logo.png" alt="El comite" className="logo"  onClick={() => navigate("/dasboard")}/>
      </div>
      <div className="boton-menu">
        <nav className="nav-links">
        <button onClick={() => navigate("/RegistrarHallazgo")}>Registrar Hallazgo</button>
        <button onClick={() => navigate("/plandemejora")}>Registrar Plan de Mejora</button>
        <button onClick={() => navigate("/mejora_info")}>Actualizar plan de mejora </button>
        <button onClick={() => navigate("/listado")}>Visualizar planes de mejora</button>
        
        {/* Sección de Empleados */}
        <div className="menu-section">
          <h4 className="section-title">Gestión de Empleados</h4>
          <button onClick={() => navigate("/registro-empleado")}>Registrar Empleado</button>
          <button onClick={() => navigate("/lista-empleados")}>Lista de Empleados</button>
        </div>
        
        <button onClick={() => navigate("/reportes")}>Generar reportes</button>
        </nav>
          </div>

      
      

      
     
    
      <div className="sidebar-info">
      <button
        className="nav-button"
        onClick={() => setMostrarModal(true)}
      >
        <img
          src="/src/assets/campana.png"
          alt="Inicio"
          className="campana"
          style={{ width: "1.5rem", height: "1.5rem", padding: "2px" }}
        />
        Notificaciones
      </button>

      <Notificaciones
        show={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
       
      </div>

      
    </aside>
  );
};

export default Sidebar;
