import { useState } from 'react'
import { useStore } from '../store'
import { Dumbbell } from 'lucide-react'

const EXERCISES = [
  // Sentadillas
  'Back Squat',
  'Front Squat',
  'Overhead Squat',
  // Levantamientos olímpicos
  'Power Clean',
  'Squat Clean',
  'Clean and Jerk',
  'Power Snatch',
  'Squat Snatch',
  // Peso muerto
  'Deadlift',
  'Romanian Deadlift',
  // Press
  'Push Press',
  'Push Jerk',
  // Gimnasia
  'Pull Ups',
  'Chest to Bar',
  'Toes to Bar',
]

export default function ExerciseForm() {
  const { state, dispatch } = useStore()
  const [selectedId, setSelectedId] = useState('')
  const [name, setName] = useState('')
  const [rm, setRm] = useState('')
  const [unit, setUnit] = useState('kg')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  function onSubmit(e) {
    e.preventDefault()
    if (!selectedId || !name.trim() || !rm) return
    dispatch({
      type: 'ADD_EXERCISE',
      payload: {
        studentId: selectedId,
        name,
        rm: Number(rm),
        unit,
        date,
      },
    })
    setName('')
    setRm('')
    setUnit('kg')
    setDate(new Date().toISOString().slice(0, 10))
  }

  if (state.students.length === 0) {
    return <p className="muted">Registra un crossfitero primero.</p>
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <select 
        className="input" 
        value={selectedId} 
        onChange={(e) => setSelectedId(e.target.value)}
        required
      >
        <option value="">Selecciona un crossfitero</option>
        {state.students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      
      <select
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      >
        <option value="">Selecciona un ejercicio</option>
        {EXERCISES.map((exercise) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
      <div className="row">
        <input
          className="input"
          type="number"
          step="0.5"
          placeholder="RM"
          value={rm}
          onChange={(e) => setRm(e.target.value)}
          required
        />
        <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button className="button" type="submit">
        <Dumbbell size={18} className="icon" />
        Agregar ejercicio
      </button>
    </form>
  )
}


