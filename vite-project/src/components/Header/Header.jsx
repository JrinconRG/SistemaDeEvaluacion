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
        <div className="boton-menu">
        <nav className="nav-links">
        <button onClick={() => navigate("/RegistrarHallazgo")}>Registrar Hallazgo</button>
        <button onClick={() => navigate("/mejora_info")}>Actualizar plan de mejora </button>
        <button onClick={() => navigate("/plandemejora")}>Registrar Evaluacion</button>
        <button onClick={() => navigate("/listado")}>Listado de planes de mejora</button>
        </nav>
          </div>

        <div className="usuario-info">

        <div className="correo"> {usuario?.email}</div>
        <button className="cerrar-sesion" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
