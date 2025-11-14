import { Dumbbell, Activity, Target, Zap, TrendingUp, Footprints } from 'lucide-react'

export default function ExerciseIcon({ exerciseName, size = 18, className = '' }) {
  const name = exerciseName.toLowerCase()
  
  // Sentadillas - Footprints
  if (name.includes('squat')) {
    return <Footprints size={size} className={className} />
  }
  
  // Levantamientos olímpicos - Zap
  if (name.includes('clean') || name.includes('jerk') || name.includes('snatch')) {
    return <Zap size={size} className={className} />
  }
  
  // Peso muerto - TrendingUp
  if (name.includes('deadlift')) {
    return <TrendingUp size={size} className={className} />
  }
  
  // Press - Dumbbell
  if (name.includes('press')) {
    return <Dumbbell size={size} className={className} />
  }
  
  // Gimnasia - Target
  if (name.includes('pull') || name.includes('bar') || name.includes('toes')) {
    return <Target size={size} className={className} />
  }
  
  // Default
  return <Activity size={size} className={className} />
}

