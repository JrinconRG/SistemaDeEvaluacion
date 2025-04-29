import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado");
      navigate("/dasboard"); // Redirige a la ruta deseada
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="formu-login">
      <div className="contenedor-formulario">
        <img src="/src/assets/elcomitee.png" alt="Logo" className="logo-login" />
        <h2 className="subtitulo-login">Iniciar Sesión</h2> 
    
          <form className="formu" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Ingresar Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Ingresar Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-danger">{error}</p>}
            <button className="boton-enviar" type="submit">
              Iniciar Sesion
            </button>
            <div className="contenedor-sin-cuenta"> 
            <p className="subtitulo-login">¿Aún no estás registrado?</p> 

             <button
              className="boton-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/registro");
              }}
            >
              Crear cuenta nueva
            </button>

              </div>
                
              

          </form>
          </div>


    
    </div>
  );
};

export default Login;
