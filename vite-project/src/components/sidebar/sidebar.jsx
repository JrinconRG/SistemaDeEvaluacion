import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      
      <div className="logo-container">
        <img src="/src/assets/comite1.png" alt="El comite" className="logo"  onClick={() => navigate("/dasboard")}/>
        </div>

      
      

      <button className="nav-button">
        <img src="/src/assets/campana.png" alt="Inicio" className="campana" style={{ width: "1.5rem", height: "1.5rem" ,padding:"2px"}}  />
         Notificaciones</button>
     
      <div className="sidebar-botton">
    
      <div className="sidebar-info">
        <p>Último reporte generado: XX/XX/XXXX</p>
        <p>Último acceso: XX/XX/XXXX</p>
      </div>

      <nav className="nav-links">
        <button onClick={() => navigate("/RegistrarHallazgo")}>Registrar Hallazgo</button>
        <button onClick={() => navigate("/mejora_info")}>Actualizar plan de mejora </button>
        <button onClick={() => navigate("/plandemejora")}>Registrar Evaluacion</button>
      </nav>
        </div>
    </aside>
  );
};

export default Sidebar;
