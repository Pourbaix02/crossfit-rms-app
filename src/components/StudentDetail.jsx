import { useState } from 'react'
import { useStore } from '../store'
import ExerciseIcon from './ExerciseIcon'
import Modal from './Modal'
import pencilIcon from '../assets/pencil.png'

export default function StudentDetail() {
  const { state, selectedStudent, dispatch } = useStore()
  const [editingExercise, setEditingExercise] = useState(null)
  const [editRm, setEditRm] = useState('')
  const [editUnit, setEditUnit] = useState('kg')
  const [editDate, setEditDate] = useState('')

  function handleSelect(e) {
    const studentId = e.target.value
    if (studentId) {
      dispatch({ type: 'SELECT_STUDENT', payload: { id: studentId } })
    }
  }

  function openEditModal(exercise) {
    setEditingExercise(exercise)
    setEditRm(exercise.rm)
    setEditUnit(exercise.unit)
    setEditDate(exercise.date)
  }

  function closeEditModal() {
    setEditingExercise(null)
    setEditRm('')
    setEditUnit('kg')
    setEditDate('')
  }

  function handleUpdate(e) {
    e.preventDefault()
    if (!editingExercise || !editRm) return
    
    dispatch({
      type: 'UPDATE_EXERCISE',
      payload: {
        studentId: selectedStudent.id,
        exerciseId: editingExercise.id,
        rm: editRm,
        unit: editUnit,
        date: editDate,
      },
    })
    closeEditModal()
  }

  if (state.students.length === 0) {
    return <p className="muted">No hay crossfiteros registrados.</p>
  }

  const sorted = selectedStudent 
    ? [...selectedStudent.exercises].sort((a, b) => (a.date < b.date ? 1 : -1))
    : []

  return (
    <>
      <select 
        className="input" 
        value={state.selectedStudentId || ''} 
        onChange={handleSelect}
      >
        <option value="">Selecciona un crossfitero</option>
        {state.students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.exercises.length} ejercicios)
          </option>
        ))}
      </select>

      {selectedStudent && (
        <>
          <p className="student-info">
            <strong>{selectedStudent.name}</strong>
          </p>
          <div className="list">
            {sorted.length === 0 && <p className="muted">Sin ejercicios registrados aún.</p>}
            {sorted.map((ex) => (
              <div key={ex.id} className="card-item exercise-card">
                <div className="exercise-info">
                  <div className="item-title">
                    <ExerciseIcon exerciseName={ex.name} size={18} className="icon" />
                    {ex.name}
                  </div>
                  <div className="item-meta">
                    {ex.rm} {ex.unit} • {ex.date}
                  </div>
                </div>
                <button 
                  className="edit-button" 
                  onClick={() => openEditModal(ex)}
                  aria-label="Editar"
                >
                  <img src={pencilIcon} alt="Editar" className="edit-icon" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal 
        isOpen={!!editingExercise} 
        onClose={closeEditModal}
        title={`Editar ${editingExercise?.name || ''}`}
      >
        <form onSubmit={handleUpdate} className="form">
          <div className="row">
            <input
              className="input"
              type="number"
              step="0.5"
              placeholder="RM"
              value={editRm}
              onChange={(e) => setEditRm(e.target.value)}
              required
            />
            <select 
              className="input" 
              value={editUnit} 
              onChange={(e) => setEditUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            <input
              className="input"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
          </div>
          <button className="button" type="submit">
            Guardar cambios
          </button>
        </form>
      </Modal>
    </>
  )
}


