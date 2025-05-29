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
        <p>Último reporte generado: XX/XX/XXXX</p>
        <p>Último acceso: XX/XX/XXXX</p>
      </div>

      
    </aside>
  );
};

export default Sidebar;
