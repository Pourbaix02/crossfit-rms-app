import './App.css'
import { useState } from 'react'
import { StoreProvider } from './store'
import Header from './components/Header'
import StudentForm from './components/StudentForm'
import ExerciseForm from './components/ExerciseForm'
import StudentDetail from './components/StudentDetail'
import RMCalculator from './components/RMCalculator'

export default function App() {
  const [view, setView] = useState('registrar') // 'registrar' | 'registros' | 'calculadora'

  return (
    <StoreProvider>
      <div className="app">
        <Header currentView={view} onViewChange={setView} />
        
        <main className="main-content">
          {view === 'registrar' ? (
            <div className="view-layout">
              <section className="section">
                <h2 className="section-title">Registrar crossfitero</h2>
                <StudentForm />
              </section>
              
              <section className="section">
                <h2 className="section-title">Registrar ejercicio y RM</h2>
                <ExerciseForm />
              </section>
            </div>
          ) : view === 'registros' ? (
            <div className="view-layout">
              <section className="section">
                <h2 className="section-title">Ver ejercicios</h2>
                <StudentDetail />
              </section>
            </div>
          ) : (
            <div className="view-layout">
              <section className="section">
                <h2 className="section-title">Calculadora de RM</h2>
                <RMCalculator />
              </section>
            </div>
          )}
        </main>
        
        <footer className="footer">Hecho con ❤️ en Odin Fitness</footer>
      </div>
    </StoreProvider>
  )
}


