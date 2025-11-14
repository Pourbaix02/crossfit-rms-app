import { UserPlus, List, X } from 'lucide-react'

export default function Menu({ open, onClose, onNavigate, currentView }) {
  if (!open) return null
  return (
    <>
      <div className="drawer-backdrop open" onClick={onClose} />
      <nav className="drawer open" role="dialog" aria-modal="true">
        <div className="drawer-header">
          <div className="drawer-title">Menú</div>
          <button className="drawer-close" aria-label="Cerrar menú" onClick={onClose}>
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        <button
          className={`drawer-item ${currentView === 'registrar' ? 'active' : ''}`}
          onClick={() => onNavigate('registrar')}
        >
          <UserPlus size={18} className="icon" />
          Registrar
        </button>
        <button
          className={`drawer-item ${currentView === 'registros' ? 'active' : ''}`}
          onClick={() => onNavigate('registros')}
        >
          <List size={18} className="icon" />
          Ver registros
        </button>
      </nav>
    </>
  )
}


