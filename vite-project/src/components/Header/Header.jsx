import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
      <div className="usuario-info">
        <div className="correo">📧 {usuario?.email}</div>
        <button className="cerrar-sesion" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
