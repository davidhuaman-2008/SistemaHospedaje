import { useState } from "react"
import type { Promocion, PromocionRequest, CategoriaPromocion, TipoPromocion } from "@/types/promocion"
import type { TipoHabitacion } from "@/types/configuracion"

interface Props {
  inicial: Promocion | null
  categorias: CategoriaPromocion[]
  tiposHabitacion: TipoHabitacion[]
  onGuardar: (datos: PromocionRequest) => void
  onCancelar: () => void
}

/**
 * Convierte fecha ISO a "YYYY-MM-DD" para <input type="date">
 */
function normalizarFecha(valor: string | null | undefined): string {
  if (!valor) return ""
  return valor.substring(0, 10)
}

export function PromocionForm({ inicial, categorias, tiposHabitacion, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || "")
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || "")
  const [idCategoria, setIdCategoria] = useState<number | null>(inicial?.id_categoria_promocion ?? null)
  const [tipo, setTipo] = useState<TipoPromocion>(inicial?.tipo || "PORCENTAJE")
  const [valor, setValor] = useState(inicial?.valor || 0)
  const [fechaInicio, setFechaInicio] = useState(normalizarFecha(inicial?.fecha_inicio))
  const [fechaFin, setFechaFin] = useState(normalizarFecha(inicial?.fecha_fin))
  const [idTipoHabitacion, setIdTipoHabitacion] = useState<number | null>(inicial?.id_tipo_habitacion ?? null)
  const [montoMinimo, setMontoMinimo] = useState(inicial?.monto_minimo || 0)
  const [requiereCodigo, setRequiereCodigo] = useState(inicial?.requiere_codigo || false)
  const [codigo, setCodigo] = useState(inicial?.codigo || "")
  const [limiteUso, setLimiteUso] = useState(inicial?.limite_uso || 0)
  const [limitePorCliente, setLimitePorCliente] = useState(inicial?.limite_por_cliente || 0)
  const [acumulable, setAcumulable] = useState(inicial?.acumulable || false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || valor <= 0) return
    onGuardar({
      nombre,
      descripcion: descripcion || null,
      id_categoria_promocion: idCategoria,
      tipo,
      valor,
      fecha_inicio: fechaInicio || null,
      fecha_fin: fechaFin || null,
      id_tipo_habitacion: idTipoHabitacion,
      monto_minimo: montoMinimo || null,
      requiere_codigo: requiereCodigo,
      codigo: codigo || null,
      limite_uso: limiteUso || null,
      limite_por_cliente: limitePorCliente || null,
      acumulable,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Categoría</label>
          <select value={idCategoria ?? ""} onChange={e => setIdCategoria(e.target.value ? Number(e.target.value) : null)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="">— Sin categoría —</option>
            {categorias.map(c => (
              <option key={c.id_categoria_promocion} value={c.id_categoria_promocion}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo *</label>
          <select value={tipo} onChange={e => setTipo(e.target.value as TipoPromocion)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="PORCENTAJE">Porcentaje (%)</option>
            <option value="MONTO_FIJO">Monto fijo (S/)</option>
            <option value="NOCHE_GRATIS">Noche gratis</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Valor *</label>
          <input type="number" step="0.01" value={valor} onChange={e => setValor(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Fecha inicio</label>
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Fecha fin</label>
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo de habitación</label>
          <select value={idTipoHabitacion ?? ""} onChange={e => setIdTipoHabitacion(e.target.value ? Number(e.target.value) : null)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="">— Todas —</option>
            {tiposHabitacion.map(t => (
              <option key={t.id_tipo} value={t.id_tipo}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Monto mínimo (S/)</label>
          <input type="number" step="0.01" value={montoMinimo} onChange={e => setMontoMinimo(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Límite uso global</label>
          <input type="number" value={limiteUso} onChange={e => setLimiteUso(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Límite por cliente</label>
          <input type="number" value={limitePorCliente} onChange={e => setLimitePorCliente(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={requiereCodigo} onChange={e => setRequiereCodigo(e.target.checked)} className="w-4 h-4" />
          <label className="text-slate-300 text-sm">Requiere código</label>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Código</label>
          <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="DESC10" className="w-full bg-slate-900 text-white p-2 rounded" disabled={!requiereCodigo} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={acumulable} onChange={e => setAcumulable(e.target.checked)} className="w-4 h-4" />
          <label className="text-slate-300 text-sm">Acumulable</label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? "Actualizar" : "Crear"}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}