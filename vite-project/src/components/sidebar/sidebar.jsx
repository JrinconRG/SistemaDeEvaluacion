import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src="/src/assets/comite1.png" alt="El comite" className="logo" />

      </div>

      <button className="nav-button">🔔 Notificaciones</button>

      <div className="sidebar-info">
        <p>Último reporte generado: XX/XX/XXXX</p>
        <p>Último acceso: XX/XX/XXXX</p>
      </div>

      <nav className="nav-links">
        <button onClick={() => navigate("/RegistrarHallazgo")}>Registrar Hallazgo</button>
        <button onClick={() => navigate("/acciones")}>Registrar Acciones</button>
        <button onClick={() => navigate("/empleados")}>Registrar Empleados</button>
        <button onClick={() => navigate("/evaluacion")}>Registrar Evaluacion</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
