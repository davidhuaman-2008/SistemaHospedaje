import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Wrench, AlertTriangle } from "lucide-react"
import { mantenimientoService } from "@/services/mantenimientoService"
import { tipoMantenimientoService } from "@/services/tipoMantenimientoService"
import { prioridadMantenimientoService } from "@/services/prioridadMantenimientoService"
import { habitacionMapaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import { IconoDinamico } from "@/components/IconoDinamico"
import type { HabitacionMapa } from "@/types/reserva"
import type { TipoMantenimiento, PrioridadMantenimiento } from "@/types/mantenimiento"

interface Props {
  habitacionPreseleccionada?: HabitacionMapa | null
  onClose: () => void
  onSuccess: () => void
}

export function ReportarMantenimientoModal({ habitacionPreseleccionada, onClose, onSuccess }: Props) {
  const [habitaciones, setHabitaciones] = useState<HabitacionMapa[]>([])
  const [tipos, setTipos] = useState<TipoMantenimiento[]>([])
  const [prioridades, setPrioridades] = useState<PrioridadMantenimiento[]>([])

  const [idHabitacion, setIdHabitacion] = useState<number | null>(habitacionPreseleccionada?.id_habitacion ?? null)
  const [idTipo, setIdTipo] = useState<number | null>(null)
  const [idPrioridad, setIdPrioridad] = useState<number | null>(null)
  const [descripcion, setDescripcion] = useState("")
  const [observaciones, setObservaciones] = useState("")

  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [hab, ts, ps] = await Promise.all([
          habitacionMapaService.listar(),
          tipoMantenimientoService.listarActivos(),
          prioridadMantenimientoService.listarActivos(),
        ])

        // Solo habitaciones que NO estén ocupadas ni en limpieza ni en mantenimiento
        const disponibles = hab
          .filter(h => h.estado === "Disponible")
          .sort((a, b) => a.numero.localeCompare(b.numero))

        setHabitaciones(disponibles)
        setTipos(ts)
        setPrioridades(ps)

        if (!idHabitacion && disponibles.length > 0) {
          setIdHabitacion(disponibles[0].id_habitacion)
        }
        if (ts.length > 0) setIdTipo(ts[0].id_tipo_mantenimiento)
        if (ps.length > 0) {
          const media = ps.find(p => p.slug === "media")
          setIdPrioridad(media?.id_prioridad ?? ps[0].id_prioridad)
        }
      } catch {
        toast.error("Error al cargar datos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const guardar = async () => {
    if (!idHabitacion) return toast.error("Seleccioná una habitación")
    if (!idTipo) return toast.error("Seleccioná un tipo")
    if (!idPrioridad) return toast.error("Seleccioná una prioridad")
    if (!descripcion.trim()) return toast.error("Ingresá la descripción")

    setEnviando(true)
    try {
      await mantenimientoService.crear({
        id_habitacion: idHabitacion,
        id_tipo_mantenimiento: idTipo,
        id_prioridad: idPrioridad,
        descripcion: descripcion.trim(),
        observaciones: observaciones.trim() || null,
      })
      toast.success("Mantenimiento reportado")
      onSuccess()
      onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-orange-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Reportar Mantenimiento</h3>
              <p className="text-orange-200 text-xs">La habitación se bloqueará hasta que se resuelva</p>
            </div>
          </div>
          <button onClick={onClose} className="text-orange-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : habitaciones.length === 0 ? (
          <div className="p-6 space-y-3">
            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-300 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-semibold text-sm">No hay habitaciones disponibles</p>
                  <p className="text-yellow-100 text-xs mt-1">
                    Solo se puede reportar mantenimiento en habitaciones <strong>Disponibles</strong>.
                  </p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 rounded">
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Habitación */}
            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Habitación * <span className="text-slate-500 text-xs">(solo disponibles)</span>
              </label>
              <select
                value={idHabitacion ?? ""}
                onChange={e => setIdHabitacion(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="">— Seleccionar —</option>
                {habitaciones.map(h => (
                  <option key={h.id_habitacion} value={h.id_habitacion}>
                    Hab. {h.numero} · {h.tipo_nombre} · {h.piso_nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="text-slate-300 text-sm block mb-1">Tipo de problema *</label>
              <div className="grid grid-cols-2 gap-2">
                {tipos.map(t => (
                  <button
                    key={t.id_tipo_mantenimiento}
                    type="button"
                    onClick={() => setIdTipo(t.id_tipo_mantenimiento)}
                    className={`p-2 rounded text-left border transition ${
                      idTipo === t.id_tipo_mantenimiento
                        ? "bg-orange-900/50 border-orange-600 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.icono && (
                        <IconoDinamico
                          nombre={t.icono}
                          size={16}
                          style={{ color: t.color || "#fff" }}
                        />
                      )}
                      <span className="text-xs">{t.nombre}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="text-slate-300 text-sm block mb-1">Prioridad *</label>
              <div className="flex flex-wrap gap-2">
                {prioridades.map(p => (
                  <button
                    key={p.id_prioridad}
                    type="button"
                    onClick={() => setIdPrioridad(p.id_prioridad)}
                    className={`px-3 py-2 rounded text-xs font-medium border transition ${
                      idPrioridad === p.id_prioridad
                        ? "text-white border-white"
                        : "text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                    style={{
                      background: idPrioridad === p.id_prioridad ? p.color || "#64748b" : "transparent",
                    }}
                  >
                    {p.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-slate-300 text-sm block mb-1">Descripción *</label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Ej: El jacuzzi no calienta el agua, hace ruido"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="text-slate-300 text-sm block mb-1">Observaciones (opcional)</label>
              <textarea
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                rows={2}
                placeholder="Notas adicionales"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div className="bg-orange-900/30 border border-orange-700 p-3 rounded">
              <p className="text-orange-200 text-xs">
                ⚠️ La habitación quedará <strong>bloqueada</strong> hasta que se resuelva el mantenimiento.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={guardar}
                disabled={enviando}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
              >
                {enviando ? "Reportando..." : "🔧 Reportar Mantenimiento"}
              </button>
              <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}