import { useState } from 'react'
import { useStore } from '../store'
import { UserPlus } from 'lucide-react'

export default function StudentForm() {
  const { addStudent } = useStore()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!name.trim() || loading) return
    
    setLoading(true)
    try {
      await addStudent(name)
      setName('')
    } catch (error) {
      alert('Error al agregar crossfitero: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <input
        className="input"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="button" type="submit" disabled={loading}>
        <UserPlus size={18} className="icon" />
        {loading ? 'Agregando...' : 'Agregar crossfitero'}
      </button>
    </form>
  )
}


