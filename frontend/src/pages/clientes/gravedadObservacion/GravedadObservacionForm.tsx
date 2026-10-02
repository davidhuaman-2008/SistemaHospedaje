import { useState } from 'react'
import type { GravedadObservacion, GravedadObservacionRequest } from '@/types/gravedadObservacion'

interface Props {
  inicial: GravedadObservacion | null
  onGuardar: (datos: GravedadObservacionRequest) => void
  onCancelar: () => void
}

export function GravedadObservacionForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [slug, setSlug] = useState(inicial?.slug || '')
  const [color, setColor] = useState(inicial?.color || '#16a34a')
  const [prioridad, setPrioridad] = useState(inicial?.prioridad || 1)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !slug.trim()) return
    onGuardar({ nombre, slug, color, prioridad, activo: true })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Slug *</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-slate-900 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Prioridad *</label>
          <input type="number" value={prioridad} onChange={e => setPrioridad(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" min={1} required />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}