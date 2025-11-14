import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { supabase } from './supabaseClient'

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const initialState = {
  students: [],
  selectedStudentId: null,
  loading: true,
}

const StoreContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STUDENTS': {
      return { ...state, students: action.payload, loading: false }
    }
    case 'SET_LOADING': {
      return { ...state, loading: action.payload }
    }
    case 'ADD_STUDENT': {
      const newStudent = action.payload
      return { ...state, students: [newStudent, ...state.students] }
    }
    case 'SELECT_STUDENT': {
      return { ...state, selectedStudentId: action.payload.id }
    }
    case 'ADD_EXERCISE': {
      const { studentId, exercise } = action.payload
      const updated = state.students.map((s) => {
        if (s.id !== studentId) return s
        return { ...s, exercises: [exercise, ...s.exercises] }
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
  const [state, dispatch] = useReducer(reducer, initialState)

  // Cargar datos iniciales desde Supabase
  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Cargar estudiantes
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (studentsError) throw studentsError

      // Cargar ejercicios para cada estudiante
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .order('date', { ascending: false })

      if (exercisesError) throw exercisesError

      // Combinar estudiantes con sus ejercicios
      const studentsWithExercises = (students || []).map(student => ({
        id: student.id,
        name: student.name,
        exercises: (exercises || [])
          .filter(ex => ex.student_id === student.id)
          .map(ex => ({
            id: ex.id,
            name: ex.name,
            rm: ex.rm,
            unit: ex.unit,
            date: ex.date,
          }))
      }))

      dispatch({ type: 'SET_STUDENTS', payload: studentsWithExercises })
    } catch (error) {
      console.error('Error loading data:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const value = useMemo(() => {
    const selectedStudent = state.students.find((s) => s.id === state.selectedStudentId) || null

    // Funciones con Supabase
    const addStudent = async (name) => {
      try {
        const { data, error } = await supabase
          .from('students')
          .insert([{ name: name.trim() }])
          .select()
          .single()

        if (error) throw error

        const newStudent = {
          id: data.id,
          name: data.name,
          exercises: [],
        }
        dispatch({ type: 'ADD_STUDENT', payload: newStudent })
        return newStudent
      } catch (error) {
        console.error('Error adding student:', error)
        throw error
      }
    }

    const addExercise = async (studentId, name, rm, unit, date) => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .insert([{
            student_id: studentId,
            name: name.trim(),
            rm: Number(rm),
            unit: unit || 'kg',
            date: date || new Date().toISOString().slice(0, 10),
          }])
          .select()
          .single()

        if (error) throw error

        const exercise = {
          id: data.id,
          name: data.name,
          rm: data.rm,
          unit: data.unit,
          date: data.date,
        }
        dispatch({ type: 'ADD_EXERCISE', payload: { studentId, exercise } })
        return exercise
      } catch (error) {
        console.error('Error adding exercise:', error)
        throw error
      }
    }

    const updateExercise = async (studentId, exerciseId, rm, unit, date) => {
      try {
        const { error } = await supabase
          .from('exercises')
          .update({
            rm: Number(rm),
            unit: unit,
            date: date,
          })
          .eq('id', exerciseId)

        if (error) throw error

        dispatch({ type: 'UPDATE_EXERCISE', payload: { studentId, exerciseId, rm, unit, date } })
      } catch (error) {
        console.error('Error updating exercise:', error)
        throw error
      }
    }

    return {
      state,
      dispatch,
      selectedStudent,
      addStudent,
      addExercise,
      updateExercise,
      loading: state.loading,
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
