import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/firebaseConfig";
import {useAuth} from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";


const auth = getAuth(app);

const Register = () => {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState(null);
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();



    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth,email,password)
            console.log("Usuario registrado");
            console.log("Usuario autenticado:", usuario?.email);
            
            
        } catch (error) {
            setError(error.message);
            
        }



    };

    return(
        <div className="formu-login">
            <div className="contenedor-formulario">
            <img src="/src/assets/elcomitee.png" alt="Logo" className="logo-login" />
            <h2 className="subtitulo-login">Registrarse</h2>
            
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
                        <button className="boton-enviar" type="submit">Registrate</button>
                        <div className="contenedor-sin-cuenta"> 
                        <p className="subtitulo-login">¿Ya tienes una cuenta?</p> 

                        <button
                        className="boton-link"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/");
                        }}
                        >
                        Iniciar Sesion
                        </button>

                        </div>
                        


                    </form>
                    </div>
          
        </div>
        
    );


        
        
        


};
export default Register;
