import { useState } from 'react'
import Login from "./pages/RegistroInicio/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./pages/RegistroInicio/Registro";
import RegistrarHallazgo from "./pages/RegistrarHallazgo/RegistrarHallazgo";
import PlanMejoraInfo from "./pages/Plan_mejora_info/PlanMejoraInfo";
import DashboardLayout from "./pages/Dashboard/DashboarLayaout";
import PlanDeMejora from "./pages/Evaluacion/RegistrarPlandeMejora";
import ListadoPlanesdeAccion from "./pages/ListadoPlanesdeAccion/ListadoPlanesdeAccion";
import GenerarReportes from "./pages/GenerarReportes/GenerarReportes"; // Importamos el nuevo componente
import IndicadoresDesempeno from "./components/Indicadores/IndicadoresDesempeno"; // Asegúrate de importar este también si lo tienes

// Nuevos imports para el sistema de empleados
import RegistroEmpleado from "./pages/RegistroEmpleado/RegistroEmpleado";
import ListaEmpleados from "./pages/RegistroEmpleado/ListaEmpleados";
import EvaluacionEmpleado from "./pages/Evaluacion/EvaluacionEmpleado";
import PlanMejoraEmpleado from "./pages/Evaluacion/PlanMejoraEmpleado";

import './App.css'

function App() {

  return (
    <Router>
            <main className="content">

                <Routes> 
                  <Route path="/" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/RegistrarHallazgo" element={<RegistrarHallazgo />} />
                  <Route path="/mejora_info" element={<PlanMejoraInfo/>} />
                  <Route path="/dasboard" element={<DashboardLayout/>} />
                  <Route path="/plandemejora" element={<PlanDeMejora />} /> 
                  <Route path="/listado" element={<ListadoPlanesdeAccion/>} />
                  <Route path="/reportes" element={<GenerarReportes />} /> {/* Nueva ruta */}
                  <Route path="/indicadores" element={<IndicadoresDesempeno />} /> {/* Para asegurarse de que existe */}

                  {/* Nuevas rutas para el sistema de empleados */}
                  <Route path="/registro-empleado" element={<RegistroEmpleado />} />
                  <Route path="/lista-empleados" element={<ListaEmpleados />} />
                  <Route path="/evaluacion-empleado/:empleadoId" element={<EvaluacionEmpleado />} />
                  <Route path="/plan-mejora-empleado/:empleadoId" element={<PlanMejoraEmpleado />} />
                </Routes>
            </main>

      
    </Router>
  )
}

export default App