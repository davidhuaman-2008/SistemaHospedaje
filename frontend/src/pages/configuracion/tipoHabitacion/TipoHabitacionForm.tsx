import { useState } from 'react'
import type { TipoHabitacion, TipoHabitacionRequest } from '@/types/configuracion'

interface Props {
  inicial: TipoHabitacion | null
  onGuardar: (datos: TipoHabitacionRequest) => void
  onCancelar: () => void
}

export function TipoHabitacionForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [slug, setSlug] = useState(inicial?.slug || '')
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || '')
  const [capacidad, setCapacidad] = useState(inicial?.capacidad || 2)
  const [camas, setCamas] = useState(inicial?.camas || 1)
  const [tieneJacuzzi, setTieneJacuzzi] = useState(inicial?.tiene_jacuzzi || false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !slug.trim()) return
    onGuardar({
      nombre, slug,
      descripcion: descripcion || null,
      capacidad, camas,
      tiene_jacuzzi: tieneJacuzzi,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Slug *</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Capacidad</label>
          <input type="number" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Camas</label>
          <input type="number" value={camas} onChange={e => setCamas(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-2">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={tieneJacuzzi} onChange={e => setTieneJacuzzi(e.target.checked)} className="w-4 h-4" />
          <label className="text-slate-300 text-sm">Tiene jacuzzi</label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}