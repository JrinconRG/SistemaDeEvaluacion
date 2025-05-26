import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import "./Dashboard.css";
import IndicadoresDesempeno from "../../components/Indicadores/IndicadoresDesempeno.jsx";
const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid">
      <Sidebar />
      <Header />
      <div className="main-content">
        <IndicadoresDesempeno />
        
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;