import { useState } from 'react'
import { useStore } from '../store'
import { UserPlus } from 'lucide-react'

export default function StudentForm() {
  const { dispatch } = useStore()
  const [name, setName] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    dispatch({ type: 'ADD_STUDENT', payload: { name } })
    setName('')
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
      <button className="button" type="submit">
        <UserPlus size={18} className="icon" />
        Agregar crossfitero
      </button>
    </form>
  )
}


