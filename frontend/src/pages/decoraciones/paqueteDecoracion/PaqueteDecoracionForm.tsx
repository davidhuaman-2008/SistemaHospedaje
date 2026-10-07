import { useState } from "react"
import type { PaqueteDecoracion, PaqueteDecoracionRequest } from "@/types/paqueteDecoracion"
import type { TipoHabitacion } from "@/types/configuracion"

interface Props {
  inicial: PaqueteDecoracion | null
  proveedores: any[]
  tiposHabitacion: TipoHabitacion[]
  onGuardar: (datos: PaqueteDecoracionRequest) => void
  onCancelar: () => void
}

export function PaqueteDecoracionForm({ inicial, proveedores, tiposHabitacion, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || "")
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || "")
   const [precioTotal, setPrecioTotal] = useState(inicial?.precio_total || 0)
  const [gananciaLocal, setGananciaLocal] = useState(inicial?.ganancia_local || 0)
  const [gananciaProveedor, setGananciaProveedor] = useState(inicial?.ganancia_proveedor || 0)
  const [precioHoraAdicional, setPrecioHoraAdicional] = useState(inicial?.precio_hora_adicional || 0)
  const [idProveedor, setIdProveedor] = useState<number | null>(inicial?.id_proveedor ?? null)
  const [idTipoHabitacion, setIdTipoHabitacion] = useState<number | null>(inicial?.id_tipo_habitacion ?? null)
  const [horasIncluidas, setHorasIncluidas] = useState(inicial?.horas_incluidas || 8)
  const [incluyeJacuzzi, setIncluyeJacuzzi] = useState(inicial?.incluye_jacuzzi || false)
  const [incluyeVino, setIncluyeVino] = useState(inicial?.incluye_vino || false)
  const [incluyeDecoracion, setIncluyeDecoracion] = useState(inicial?.incluye_decoracion ?? true)
  const [incluyeSexshop, setIncluyeSexshop] = useState(inicial?.incluye_sexshop || false)
  const [incluyeNetflix, setIncluyeNetflix] = useState(inicial?.incluye_netflix || false)

  const sumaGanancias = Number(gananciaLocal) + Number(gananciaProveedor)
  const formulaOk = Math.abs(Number(precioTotal) - sumaGanancias) < 0.01

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !formulaOk) return
    onGuardar({
      nombre,
      descripcion: descripcion || null,
      precio_total: Number(precioTotal),
      ganancia_local: Number(gananciaLocal),
      ganancia_proveedor: Number(gananciaProveedor),
      precio_hora_adicional: Number(precioHoraAdicional),
      id_proveedor: idProveedor,
      id_tipo_habitacion: idTipoHabitacion,
      horas_incluidas: Number(horasIncluidas),
      incluye_jacuzzi: incluyeJacuzzi,
      incluye_vino: incluyeVino,
      incluye_decoracion: incluyeDecoracion,
      incluye_sexshop: incluyeSexshop,
      incluye_netflix: incluyeNetflix,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo de Habitación</label>
          <select value={idTipoHabitacion ?? ""} onChange={e => setIdTipoHabitacion(e.target.value ? Number(e.target.value) : null)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="">— Sin tipo específico —</option>
            {tiposHabitacion.map(t => (
              <option key={t.id_tipo} value={t.id_tipo}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Proveedor</label>
          <select value={idProveedor ?? ""} onChange={e => setIdProveedor(e.target.value ? Number(e.target.value) : null)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="">— Sin proveedor —</option>
            {proveedores.map(p => (
              <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Horas incluidas</label>
          <input type="number" value={horasIncluidas} onChange={e => setHorasIncluidas(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio total (S/) *</label>
          <input type="number" step="0.01" value={precioTotal} onChange={e => setPrecioTotal(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Ganancia local (S/) *</label>
          <input type="number" step="0.01" value={gananciaLocal} onChange={e => setGananciaLocal(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Ganancia proveedor (S/) *</label>
          <input type="number" step="0.01" value={gananciaProveedor} onChange={e => setGananciaProveedor(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio hora adicional (S/)</label>
          <input type="number" step="0.01" value={precioHoraAdicional} onChange={e => setPrecioHoraAdicional(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
          <p className="text-slate-500 text-xs mt-1">Cuanto se cobra por cada hora extra</p>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>

        <div className={`col-span-1 md:col-span-2 lg:col-span-3 p-2 rounded ${formulaOk ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"}`}>
          <span className={formulaOk ? "text-green-300" : "text-red-300"}>
            {formulaOk
              ? `✅ Fórmula OK: S/ ${precioTotal} = S/ ${gananciaLocal} + S/ ${gananciaProveedor}`
              : `❌ Fórmula error: S/ ${precioTotal} ≠ S/ ${gananciaLocal} + S/ ${gananciaProveedor} = S/ ${sumaGanancias.toFixed(2)}`}
          </span>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm block mb-2">Incluye:</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={incluyeJacuzzi} onChange={e => setIncluyeJacuzzi(e.target.checked)} className="w-4 h-4" /><span className="text-slate-300 text-sm">Jacuzzi</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={incluyeVino} onChange={e => setIncluyeVino(e.target.checked)} className="w-4 h-4" /><span className="text-slate-300 text-sm">Vino</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={incluyeDecoracion} onChange={e => setIncluyeDecoracion(e.target.checked)} className="w-4 h-4" /><span className="text-slate-300 text-sm">Decoración</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={incluyeSexshop} onChange={e => setIncluyeSexshop(e.target.checked)} className="w-4 h-4" /><span className="text-slate-300 text-sm">Sex shop</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={incluyeNetflix} onChange={e => setIncluyeNetflix(e.target.checked)} className="w-4 h-4" /><span className="text-slate-300 text-sm">Netflix</span></label>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" disabled={!formulaOk} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded">{inicial ? "Actualizar" : "Crear"}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}