import { useState } from 'react'
import type { Tarifa, TarifaRequest } from '@/types/tarifa'
import type { TipoHabitacion } from '@/types/configuracion'

interface Props {
  inicial: Tarifa | null
  tipos: TipoHabitacion[]
  onGuardar: (datos: TarifaRequest) => void
  onCancelar: () => void
}

export function TarifaForm({ inicial, tipos, onGuardar, onCancelar }: Props) {
  const [idTipo, setIdTipo] = useState(inicial?.id_tipo || (tipos[0]?.id_tipo ?? 0))
  const [horas, setHoras] = useState(inicial?.horas || 4)
  const [monto, setMonto] = useState(inicial?.monto || 0)
  const [precioHoraExtra, setPrecioHoraExtra] = useState(inicial?.precio_hora_extra || 0)
  const [maxHorasExtra, setMaxHorasExtra] = useState(inicial?.max_horas_extra || 3)
  const [precioTurnoAdicional, setPrecioTurnoAdicional] = useState(inicial?.precio_turno_adicional || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!idTipo || horas <= 0 || monto <= 0) return
    onGuardar({
      id_tipo: idTipo,
      horas,
      monto,
      precio_hora_extra: precioHoraExtra,
      max_horas_extra: maxHorasExtra,
      precio_turno_adicional: precioTurnoAdicional,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Tipo de habitación *</label>
          <select
            value={idTipo}
            onChange={e => setIdTipo(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          >
            {tipos.map(t => (
              <option key={t.id_tipo} value={t.id_tipo}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Horas *</label>
          <input
            type="number"
            value={horas}
            onChange={e => setHoras(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            min={1}
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Monto (S/) *</label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={e => setMonto(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            min={0}
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio hora extra (S/) *</label>
          <input
            type="number"
            step="0.01"
            value={precioHoraExtra}
            onChange={e => setPrecioHoraExtra(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            min={0}
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Máx. horas extra</label>
          <input
            type="number"
            value={maxHorasExtra}
            onChange={e => setMaxHorasExtra(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            min={1}
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio turno adicional (S/) *</label>
          <input
            type="number"
            step="0.01"
            value={precioTurnoAdicional}
            onChange={e => setPrecioTurnoAdicional(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            min={0}
            required
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
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