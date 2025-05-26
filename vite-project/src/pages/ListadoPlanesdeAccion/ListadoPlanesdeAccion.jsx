import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/Header";
import "./ListadoPlanesdeAccion.css";
import PlanesMejoraList from "../../components/Listado/PlanesMejoraList";


export default function ListadoPlanesdeAccion() {

    return(
        <div className="Listado-page">
            <Sidebar />
            <Header />
        <div className="main-content">
            <div className="form-wrapper">
                <h2>Listado de planes de acción</h2>
                <PlanesMejoraList/>
                </div>


        </div>
        </div>
    )
}
