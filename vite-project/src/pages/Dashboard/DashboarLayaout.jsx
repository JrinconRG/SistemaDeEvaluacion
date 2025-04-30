import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./Dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar className="sidebar" />

      <div className="main">
        <Header className="header" />

        <div className="main-buttons">
          <button className="boton-dasboard" onClick={() => navigate("/RegistrarHallazgo")}>
            Auditar procesos
          </button>
          <button className="boton-dasboard" onClick={() => navigate("/empleados")}>
            Consultar desempeño de empleados
          </button>
          <button className="boton-dasboard" onClick={() => navigate("/acciones")}>
            Registrar oportunidades de mejora
          </button>
          <button className="boton-dasboard" onClick={() => navigate("/reportes")}>
            Reportes de gestión
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
