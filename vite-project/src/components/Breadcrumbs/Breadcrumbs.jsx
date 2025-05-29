import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getPageName = (path) => {
    const pageNames = {
      'dasboard': 'Dashboard',
      'RegistrarHallazgo': 'Registrar Hallazgo',
      'plandemejora': 'Plan de Mejora',
      'mejora_info': 'Actualizar Plan',
      'listado': 'Listado de Planes',
      'reportes': 'Reportes',
      'indicadores': 'Indicadores'
    };
    return pageNames[path] || path;
  };

  return (
    <nav className="breadcrumbs">
      <Link to="/dasboard" className="breadcrumb-item">Inicio</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={to}>
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-item active">{getPageName(value)}</span>
            ) : (
              <Link to={to} className="breadcrumb-item">
                {getPageName(value)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs; 