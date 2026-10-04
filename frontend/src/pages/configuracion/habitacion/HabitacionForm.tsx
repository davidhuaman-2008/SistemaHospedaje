import { useState } from "react"
import type { Habitacion, HabitacionRequest } from "@/types/habitacion"
import type { Piso, TipoHabitacion } from "@/types/configuracion"

interface Props {
  inicial: Habitacion | null
  pisos: Piso[]
  tipos: TipoHabitacion[]
  onGuardar: (datos: HabitacionRequest) => void
  onCancelar: () => void
}

export function HabitacionForm({ inicial, pisos, tipos, onGuardar, onCancelar }: Props) {
  const [numero, setNumero] = useState(inicial?.numero || "")
  const [idPiso, setIdPiso] = useState<number>(inicial?.id_piso ?? (pisos[0]?.id_piso ?? 0))
  const [idTipo, setIdTipo] = useState<number>(inicial?.id_tipo ?? (tipos[0]?.id_tipo ?? 0))
  const [orden, setOrden] = useState(inicial?.orden || 0)
  const [activo, setActivo] = useState(inicial?.activo ?? true)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!numero.trim() || !idPiso || !idTipo) return
    onGuardar({
      numero,
      id_piso: Number(idPiso),
      id_tipo: Number(idTipo),
      orden,
      activo,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Número *</label>
          <input
            value={numero}
            onChange={e => setNumero(e.target.value)}
            placeholder="101, 202, 308..."
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Piso *</label>
          <select
            value={idPiso}
            onChange={e => setIdPiso(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          >
            <option value={0}>— Seleccionar —</option>
            {pisos.map(p => (
              <option key={p.id_piso} value={p.id_piso}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo de Habitación *</label>
          <select
            value={idTipo}
            onChange={e => setIdTipo(Number(e.target.value))}
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          >
            <option value={0}>— Seleccionar —</option>
            {tipos.map(t => (
              <option key={t.id_tipo} value={t.id_tipo}>{t.nombre}</option>
            ))}
          </select>
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
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={activo}
            onChange={e => setActivo(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-slate-300 text-sm">Activa</label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {inicial ? "Actualizar" : "Crear"}
        </button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  )
}