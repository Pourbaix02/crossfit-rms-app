import { useState, useMemo } from 'react'
import { useStore } from '../store'
import { Scale, Percent } from 'lucide-react'

// Discos disponibles (libras grandes, kilogramos pequeños)
const PLATES_LB = [45, 35, 25, 15, 10] // En libras
const PLATES_KG = [2.5, 2, 1.5, 1, 0.5] // En kilogramos

// Peso de barras en libras
const BAR_WEIGHTS_LB = {
  hombre: 45, // lb
  mujer: 35,  // lb
}

// Convertir a kg para cálculos
const BAR_WEIGHTS_KG = {
  hombre: 45 / 2.20462, // ~20.4 kg
  mujer: 35 / 2.20462,  // ~15.9 kg
}

export default function RMCalculator() {
  const { state } = useStore()
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [percentage, setPercentage] = useState(75)
  const [barType, setBarType] = useState('hombre')

  // Obtener el estudiante seleccionado
  const selectedStudent = useMemo(
    () => state.students.find((s) => s.id === selectedStudentId),
    [state.students, selectedStudentId]
  )

  // Obtener el ejercicio seleccionado
  const selectedExercise = useMemo(
    () => selectedStudent?.exercises.find((ex) => ex.id === selectedExerciseId),
    [selectedStudent, selectedExerciseId]
  )

  // Calcular peso objetivo en kg
  const targetWeight = useMemo(() => {
    if (!selectedExercise) return 0
    const rmInKg = selectedExercise.unit === 'lb' 
      ? selectedExercise.rm / 2.20462 
      : selectedExercise.rm
    return (rmInKg * percentage) / 100
  }, [selectedExercise, percentage])

  // Calcular peso sin barra (en kg)
  const weightWithoutBar = useMemo(() => {
    return Math.max(0, targetWeight - BAR_WEIGHTS_KG[barType])
  }, [targetWeight, barType])

  // Calcular distribución de discos (primero lb, luego kg para ajuste)
  const plateDistribution = useMemo(() => {
    if (weightWithoutBar <= 0) return { lb: [], kg: [], perSide: 0 }

    let remaining = weightWithoutBar / 2 // Por lado en kg
    const platesLb = []
    const platesKg = []

    // Primero usar discos de libras (convertir a kg para comparar)
    for (const plateLb of PLATES_LB) {
      const plateKg = plateLb / 2.20462
      while (remaining >= plateKg) {
        platesLb.push(plateLb)
        remaining -= plateKg
      }
    }

    // Luego ajustar con discos de kilogramos
    for (const plate of PLATES_KG) {
      while (remaining >= plate - 0.01) { // -0.01 para tolerancia de redondeo
        platesKg.push(plate)
        remaining -= plate
      }
    }

    return {
      lb: platesLb,
      kg: platesKg,
      perSide: weightWithoutBar / 2,
    }
  }, [weightWithoutBar])

  // Calcular peso real con los discos disponibles (en kg)
  const actualWeight = useMemo(() => {
    const platesWeightLb = plateDistribution.lb.reduce((sum, p) => sum + (p / 2.20462), 0) * 2
    const platesWeightKg = plateDistribution.kg.reduce((sum, p) => sum + p, 0) * 2
    return BAR_WEIGHTS_KG[barType] + platesWeightLb + platesWeightKg
  }, [plateDistribution, barType])

  function handleStudentChange(e) {
    setSelectedStudentId(e.target.value)
    setSelectedExerciseId('')
  }

  function handleExerciseChange(e) {
    setSelectedExerciseId(e.target.value)
  }

  if (state.students.length === 0) {
    return <p className="muted">Registra crossfiteros y ejercicios primero.</p>
  }

  return (
    <div className="calculator">
      <div className="form">
        <select 
          className="input" 
          value={selectedStudentId} 
          onChange={handleStudentChange}
          required
        >
          <option value="">Selecciona un crossfitero</option>
          {state.students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {selectedStudent && selectedStudent.exercises.length > 0 && (
          <select
            className="input"
            value={selectedExerciseId}
            onChange={handleExerciseChange}
            required
          >
            <option value="">Selecciona un ejercicio</option>
            {selectedStudent.exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} - {ex.rm} {ex.unit}
              </option>
            ))}
          </select>
        )}

        {selectedExercise && (
          <>
            <div className="calculator-controls">
              <div className="control-group">
                <label className="label">
                  <Percent size={16} />
                  Porcentaje: {percentage}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="slider"
                />
                <div className="percentage-buttons">
                  {[50, 60, 70, 75, 80, 85, 90, 95, 100].map((p) => (
                    <button
                      key={p}
                      className={`percent-btn ${percentage === p ? 'active' : ''}`}
                      onClick={() => setPercentage(p)}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label className="label">
                  <Scale size={16} />
                  Tipo de barra
                </label>
                <div className="bar-type-selector">
                  <button
                    className={`bar-btn ${barType === 'hombre' ? 'active' : ''}`}
                    onClick={() => setBarType('hombre')}
                  >
                    Hombre (45 lb)
                  </button>
                  <button
                    className={`bar-btn ${barType === 'mujer' ? 'active' : ''}`}
                    onClick={() => setBarType('mujer')}
                  >
                    Mujer (35 lb)
                  </button>
                </div>
              </div>
            </div>

            <div className="result-section-horizontal">
              <div className="result-card-compact">
                <div className="result-label-compact">RM Original</div>
                <div className="result-value-compact">
                  {selectedExercise.rm} {selectedExercise.unit}
                </div>
                <div className="result-sublabel-compact">
                  {selectedExercise.unit === 'kg' 
                    ? `${(selectedExercise.rm * 2.20462).toFixed(1)} lb`
                    : `${(selectedExercise.rm / 2.20462).toFixed(1)} kg`
                  }
                </div>
              </div>

              <div className="result-card-compact primary">
                <div className="result-label-compact">Objetivo ({percentage}%)</div>
                <div className="result-value-compact large">
                  {targetWeight.toFixed(1)} kg
                </div>
                <div className="result-sublabel-compact">
                  {(targetWeight * 2.20462).toFixed(1)} lb
                </div>
              </div>

              <div className="result-card-compact">
                <div className="result-label-compact">Peso Real</div>
                <div className="result-value-compact">
                  {actualWeight.toFixed(1)} kg
                </div>
                <div className="result-sublabel-compact">
                  {(actualWeight * 2.20462).toFixed(1)} lb • Δ {(actualWeight - targetWeight).toFixed(1)} kg
                </div>
              </div>
            </div>

            <div className="plate-distribution">
              <h3 className="distribution-title">Configuración de barra</h3>
              
              <div className="bar-visualization">
                <div className="bar-container-single">
                  <div className="bar-left">
                    <div className="bar-sleeve-left"></div>
                    <div className="bar-grip-single">
                      {BAR_WEIGHTS_LB[barType]} lb
                    </div>
                  </div>
                  
                  <div className="bar-plates">
                    {plateDistribution.lb.map((plate, i) => (
                      <div key={`lb-${i}`} className={`plate plate-lb plate-${plate}`}>
                        {plate}
                      </div>
                    ))}
                    {plateDistribution.kg.map((plate, i) => (
                      <div key={`kg-${i}`} className={`plate plate-kg plate-kg-${plate}`}>
                        {plate}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bar-sleeve-right"></div>
                </div>
              </div>

              <div className="plate-list">
                <h4>Por lado:</h4>
                <ul>
                  {plateDistribution.lb.length > 0 && (
                    <li>
                      Discos lb: {plateDistribution.lb.join(' lb, ')} lb
                    </li>
                  )}
                  {plateDistribution.kg.length > 0 && (
                    <li>
                      Discos kg: {plateDistribution.kg.join(' kg, ')} kg
                    </li>
                  )}
                  {plateDistribution.lb.length === 0 && plateDistribution.kg.length === 0 && (
                    <li>Solo barra</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

