import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'odin_fitness_state_v2'

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const initialMockState = {
  students: [
    {
      id: generateId('stu'),
      name: 'Juan Pérez',
      exercises: [
        { id: generateId('ex'), name: 'Back Squat', rm: 150, unit: 'kg', date: '2025-11-10' },
        { id: generateId('ex'), name: 'Deadlift', rm: 180, unit: 'kg', date: '2025-11-08' },
      ],
    },
    {
      id: generateId('stu'),
      name: 'María López',
      exercises: [
        { id: generateId('ex'), name: 'Back Squat', rm: 95, unit: 'kg', date: '2025-11-12' },
        { id: generateId('ex'), name: 'Front Squat', rm: 75, unit: 'kg', date: '2025-11-11' },
        { id: generateId('ex'), name: 'Overhead Squat', rm: 55, unit: 'kg', date: '2025-11-10' },
        { id: generateId('ex'), name: 'Power Clean', rm: 70, unit: 'kg', date: '2025-11-09' },
        { id: generateId('ex'), name: 'Squat Clean', rm: 65, unit: 'kg', date: '2025-11-08' },
        { id: generateId('ex'), name: 'Clean and Jerk', rm: 60, unit: 'kg', date: '2025-11-07' },
        { id: generateId('ex'), name: 'Power Snatch', rm: 50, unit: 'kg', date: '2025-11-06' },
        { id: generateId('ex'), name: 'Squat Snatch', rm: 45, unit: 'kg', date: '2025-11-05' },
        { id: generateId('ex'), name: 'Deadlift', rm: 130, unit: 'kg', date: '2025-11-04' },
        { id: generateId('ex'), name: 'Romanian Deadlift', rm: 100, unit: 'kg', date: '2025-11-03' },
        { id: generateId('ex'), name: 'Push Press', rm: 55, unit: 'kg', date: '2025-11-02' },
        { id: generateId('ex'), name: 'Push Jerk', rm: 52, unit: 'kg', date: '2025-11-01' },
        { id: generateId('ex'), name: 'Pull Ups', rm: 25, unit: 'kg', date: '2025-10-31' },
        { id: generateId('ex'), name: 'Chest to Bar', rm: 20, unit: 'kg', date: '2025-10-30' },
        { id: generateId('ex'), name: 'Toes to Bar', rm: 15, unit: 'kg', date: '2025-10-29' },
      ],
    },
  ],
  selectedStudentId: null,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialMockState
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return initialMockState
    return parsed
  } catch {
    return initialMockState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const StoreContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_STUDENT': {
      const newStudent = {
        id: generateId('stu'),
        name: action.payload.name.trim(),
        exercises: [],
      }
      return { ...state, students: [newStudent, ...state.students] }
    }
    case 'SELECT_STUDENT': {
      return { ...state, selectedStudentId: action.payload.id }
    }
    case 'ADD_EXERCISE': {
      const { studentId, name, rm, unit, date } = action.payload
      const updated = state.students.map((s) => {
        if (s.id !== studentId) return s
        const entry = {
          id: generateId('ex'),
          name: name.trim(),
          rm: Number(rm),
          unit: unit || 'kg',
          date: date || new Date().toISOString().slice(0, 10),
        }
        return { ...s, exercises: [entry, ...s.exercises] }
      })
      return { ...state, students: updated }
    }
    case 'UPDATE_EXERCISE': {
      const { studentId, exerciseId, rm, unit, date } = action.payload
      const updated = state.students.map((s) => {
        if (s.id !== studentId) return s
        const updatedExercises = s.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex
          return {
            ...ex,
            rm: Number(rm),
            unit: unit || ex.unit,
            date: date || ex.date,
          }
        })
        return { ...s, exercises: updatedExercises }
      })
      return { ...state, students: updated }
    }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => {
    const selectedStudent = state.students.find((s) => s.id === state.selectedStudentId) || null
    return { state, dispatch, selectedStudent }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}


