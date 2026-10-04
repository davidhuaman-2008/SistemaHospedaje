import { useState } from 'react'
import type { Piso, PisoRequest } from '@/types/configuracion'

interface Props {
  inicial: Piso | null
  onGuardar: (datos: PisoRequest) => void
  onCancelar: () => void
}

export function PisoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || '')
  const [orden, setOrden] = useState(inicial?.orden || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onGuardar({ nombre, descripcion: descripcion || null, orden, activo: true })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Orden</label>
          <input
            type="number"
            value={orden}
            onChange={e => setOrden(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full bg-slate-900 text-white p-2 rounded"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {inicial ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  )
}