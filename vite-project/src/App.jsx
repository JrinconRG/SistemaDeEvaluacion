import { useState } from 'react'
import Login from "./pages/RegistroInicio/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./pages/RegistroInicio/Registro";
import RegistrarHallazgo from "./pages/RegistrarHallazgo/RegistrarHallazgo";
import RegistrarAcciones from "./pages/Acciones/RegistrarAcciones";
import RegistrarEmpleado from "./pages/Empleado/RegistrarEmpleado";
import DashboardLayout from "./pages/Dashboard/DashboarLayaout";
import RegistrarEvaluacion from "./pages/Evaluacion/RegistrarEvaluacion";
import ReportesAcciones from "./pages/Reportes/ReportesAcciones"; // Asegúrate de que esta ruta sea correcta
import './App.css'


function App() {
  return (
    <Router>
            <main className="content">
                <Routes> 
                  <Route path="/" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/RegistrarHallazgo" element={<RegistrarHallazgo />} />
                  <Route path="/acciones" element={<RegistrarAcciones />} />
                  <Route path="/empleados" element={<RegistrarEmpleado/>} />
                  <Route path="/dasboard" element={<DashboardLayout/>} />
                  <Route path="/evaluacion" element={<RegistrarEvaluacion />} /> 
                  <Route path="/reportes" element={<ReportesAcciones />} /> 
                </Routes>
            </main>
    </Router>
  )
}

export default App