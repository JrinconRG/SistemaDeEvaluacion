import { useNavigate } from 'react-router-dom';
import './NavigationButtons.css';

const NavigationButtons = () => {
  const navigate = useNavigate();

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <div className="navigation-buttons">
      <button onClick={goBack} className="nav-button back">
        <span className="button-icon">←</span>
        Atrás
      </button>
      <button onClick={goForward} className="nav-button forward">
        Adelante
        <span className="button-icon">→</span>
      </button>
    </div>
  );
};

export default NavigationButtons; 