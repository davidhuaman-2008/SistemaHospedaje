import { useState } from 'react'
import type { MetodoPago, MetodoPagoRequest } from '@/types/configuracion'

interface Props {
  inicial: MetodoPago | null
  onGuardar: (datos: MetodoPagoRequest) => void
  onCancelar: () => void
}

export function MetodoPagoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || '')
  const [esDeCaja, setEsDeCaja] = useState(inicial?.es_de_caja ?? true)
  const [icono, setIcono] = useState(inicial?.icono || '')
  const [color, setColor] = useState(inicial?.color || '#16a34a')
  const [orden, setOrden] = useState(inicial?.orden || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onGuardar({
      nombre,
      descripcion: descripcion || null,
      es_de_caja: esDeCaja,
      icono: icono || null,
      color: color || null,
      orden,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Ícono (lucide)</label>
          <input value={icono} onChange={e => setIcono(e.target.value)} placeholder="banknote, smartphone..." className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-slate-900 rounded" />
        </div>
        <div className="col-span-3">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={esDeCaja} onChange={e => setEsDeCaja(e.target.checked)} className="w-4 h-4" />
          <label className="text-slate-300 text-sm">
            Entra a caja (si NO está marcado, va a la cuenta de la dueña)
          </label>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}