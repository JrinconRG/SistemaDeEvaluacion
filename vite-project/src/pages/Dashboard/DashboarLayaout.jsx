import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./Dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid">
      <Sidebar />
      <Header />
      <div className="main-content">
        <div className="main-buttons">
          <button className="boton-dashboard" onClick={() => navigate("/RegistrarHallazgo")}>
            Auditar procesos
          </button>
          <button className="boton-dashboard" onClick={() => navigate("/mejora_info")}>
            Consultar desempeño de empleados
          </button>
          <button className="boton-dashboard" onClick={() => navigate("/plandemejora")}>
            Registrar planes de mejora
          </button>
          <button className="boton-dashboard" onClick={() => navigate("/indicadores")}>
            Ver indicadores de desempeño
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;