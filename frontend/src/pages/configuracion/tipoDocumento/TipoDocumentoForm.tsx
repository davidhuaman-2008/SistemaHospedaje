import { useState } from 'react'
import type { TipoDocumento, TipoDocumentoRequest } from '@/types/configuracion'

interface Props {
  inicial: TipoDocumento | null
  onGuardar: (datos: TipoDocumentoRequest) => void
  onCancelar: () => void
}

export function TipoDocumentoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [abreviatura, setAbreviatura] = useState(inicial?.abreviatura || '')
  const [longitud, setLongitud] = useState(inicial?.longitud || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !abreviatura.trim()) return
    onGuardar({ nombre, abreviatura, longitud: longitud || null, activo: true })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Abreviatura *</label>
          <input value={abreviatura} onChange={e => setAbreviatura(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Longitud</label>
          <input type="number" value={longitud} onChange={e => setLongitud(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}