import { useStore } from '../store'
import { User } from 'lucide-react'

export default function StudentList() {
  const { state, dispatch } = useStore()

  function select(id) {
    dispatch({ type: 'SELECT_STUDENT', payload: { id } })
  }

  return (
    <div className="list">
      {state.students.length === 0 && <p className="muted">No hay crossfiteros registrados.</p>}
      {state.students.map((s) => {
        const selected = state.selectedStudentId === s.id
        return (
          <button
            key={s.id}
            className={`list-item ${selected ? 'selected' : ''}`}
            onClick={() => select(s.id)}
          >
            <div className="item-title">
              <User size={18} className="icon" />
              {s.name}
            </div>
            <div className="item-meta">{s.exercises.length} ejercicios</div>
          </button>
        )
      })}
    </div>
  )
}


