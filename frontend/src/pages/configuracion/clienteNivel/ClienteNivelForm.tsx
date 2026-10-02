import { useState } from 'react'
import type { ClienteNivel, ClienteNivelRequest } from '@/types/configuracion'

interface Props {
  inicial: ClienteNivel | null
  onGuardar: (datos: ClienteNivelRequest) => void
  onCancelar: () => void
}

export function ClienteNivelForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [visitasMin, setVisitasMin] = useState(inicial?.visitas_min || 0)
  const [visitasMax, setVisitasMax] = useState(inicial?.visitas_max ?? '')
  const [descuento, setDescuento] = useState(inicial?.descuento || 0)
  const [color, setColor] = useState(inicial?.color || '#cd7f32')
  const [icono, setIcono] = useState(inicial?.icono || 'award')
  const [beneficios, setBeneficios] = useState(inicial?.beneficios || '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onGuardar({
      nombre,
      visitas_min: visitasMin,
      visitas_max: visitasMax === '' ? null : Number(visitasMax),
      descuento,
      color,
      icono,
      beneficios: beneficios || null,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Visitas mínimas</label>
          <input type="number" value={visitasMin} onChange={e => setVisitasMin(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Visitas máximas (vacío = sin tope)</label>
          <input type="number" value={visitasMax} onChange={e => setVisitasMax(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Descuento (%)</label>
          <input type="number" value={descuento} onChange={e => setDescuento(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-slate-900 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Ícono (lucide)</label>
          <input value={icono} onChange={e => setIcono(e.target.value)} placeholder="award, crown..." className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-3">
          <label className="text-slate-300 text-sm">Beneficios</label>
          <textarea value={beneficios} onChange={e => setBeneficios(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" rows={2} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}