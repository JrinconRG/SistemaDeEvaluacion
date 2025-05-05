import { useState } from 'react'
import Login from "./pages/RegistroInicio/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./pages/RegistroInicio/Registro";
import RegistrarHallazgo from "./pages/RegistrarHallazgo/RegistrarHallazgo";
import PlanMejoraInfo from "./pages/Plan_mejora_info/PlanMejoraInfo";
import DashboardLayout from "./pages/Dashboard/DashboarLayaout";
import PlanDeMejora from "./pages/Evaluacion/RegistrarPlandeMejora";
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


                  
                </Routes>
            </main>

      
    </Router>
  )
}

export default App
