import { UserPlus, List, Calculator } from 'lucide-react'
import odinLogo from '../assets/logo-odin.png'

export default function Header({ currentView, onViewChange }) {
  return (
    <header className="header">
      <div className="brand-header">
        <div className="brand-icon">
          <img 
            src={odinLogo} 
            alt="Odin Fitness Logo" 
            className="logo"
          />
        </div>
        <div className="brand-text">
          <h1 className="title">Odin Fitness 6AM</h1>
          <p className="subtitle">Registro de crossfiteros y RMs</p>
        </div>
      </div>
      <nav className="tabs">
        <button
          className={`tab ${currentView === 'registrar' ? 'active' : ''}`}
          onClick={() => onViewChange('registrar')}
        >
          <UserPlus size={18} />
          <span>Registrar</span>
        </button>
        <button
          className={`tab ${currentView === 'registros' ? 'active' : ''}`}
          onClick={() => onViewChange('registros')}
        >
          <List size={18} />
          <span>Registros</span>
        </button>
        <button
          className={`tab ${currentView === 'calculadora' ? 'active' : ''}`}
          onClick={() => onViewChange('calculadora')}
        >
          <Calculator size={18} />
          <span>Calculadora</span>
        </button>
      </nav>
    </header>
  )
}


