import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";

import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./Dashboard.css";
const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="main-content">

          <div className="main-buttons">
            <button onClick={() => navigate("/RegistrarHallazgo")}>
              Auditar procesos
            </button>
            <button onClick={() => navigate("/empleados")}>
              Consultar desempeño de empleados
            </button>
            <button onClick={() => navigate("/acciones")}>
              Registrar oportunidades de mejora
            </button>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
