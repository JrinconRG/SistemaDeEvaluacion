import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import NavigationButtons from "../NavigationButtons/NavigationButtons";
import "./Header.css";

const Header = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Breadcrumbs />
      </div>
      <div className="header-right">
        <NavigationButtons />
        <div className="usuario-info">
          <div className="correo">{usuario?.email}</div>
          <button className="cerrar-sesion" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
