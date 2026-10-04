import { useState } from 'react'
import type { CategoriaMovimiento, CategoriaMovimientoRequest, TipoMovimiento } from '@/types/configuracion'

interface Props {
  inicial: CategoriaMovimiento | null
  onGuardar: (datos: CategoriaMovimientoRequest) => void
  onCancelar: () => void
}

export function CategoriaMovimientoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [tipo, setTipo] = useState<TipoMovimiento>(inicial?.tipo || 'Ingreso')
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || '')
  const [orden, setOrden] = useState(inicial?.orden || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onGuardar({ nombre, tipo, descripcion: descripcion || null, orden, activo: true })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1">
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo *</label>
          <select value={tipo} onChange={e => setTipo(e.target.value as TipoMovimiento)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>
        <div className="col-span-1">
          <label className="text-slate-300 text-sm">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-4">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}