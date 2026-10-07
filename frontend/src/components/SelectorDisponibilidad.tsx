import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, AlertCircle, Sparkles } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionLibre, HabitacionConConflicto } from "@/types/reserva"

interface Props {
  fecha: string
  horas: number
  conDecoracion: boolean
  idHabitacionSeleccionada: number | null
  onSeleccionar: (h: HabitacionLibre) => void
}

export function SelectorDisponibilidad({
  fecha,
  horas,
  conDecoracion,
  idHabitacionSeleccionada,
  onSeleccionar,
}: Props) {
  const [libres, setLibres] = useState<HabitacionLibre[]>([])
  const [conflicto, setConflicto] = useState<HabitacionConConflicto[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!fecha || !horas) {
      setLibres([])
      setConflicto([])
      return
    }

    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const data = await reservaService.listarDisponiblesEnRango(fecha, horas, conDecoracion)
        if (!cancelado) {
          setLibres(data.libres)
          setConflicto(data.con_conflicto)
        }
      } catch (e: unknown) {
        if (!cancelado) toast.error(mensajeDeError(e))
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargar()
    return () => { cancelado = true }
  }, [fecha, horas, conDecoracion])

  if (cargando) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm p-3">
        <Loader2 size={16} className="animate-spin" />
        Buscando disponibilidad{conDecoracion ? " (con decoración 5h antes)" : ""}...
      </div>
    )
  }

  if (!fecha || !horas) {
    return (
      <div className="bg-slate-900 p-3 rounded text-slate-400 text-sm">
        Elegí una fecha y horas para ver las habitaciones disponibles.
      </div>
    )
  }

  const getMotivoColor = (motivo: string): string => {
    if (motivo.toLowerCase().includes("inactiva")) return "border-slate-700 bg-slate-900/50"
    if (motivo.toLowerCase().includes("mantenimiento")) return "border-orange-800 bg-orange-950/30"
    if (motivo.toLowerCase().includes("limpieza")) return "border-cyan-800 bg-cyan-950/30"
    if (motivo.toLowerCase().includes("reservada")) return "border-purple-800 bg-purple-950/30"
    if (motivo.toLowerCase().includes("ocupada")) return "border-red-800 bg-red-950/30"
    return "border-slate-700 bg-slate-900/50"
  }

  const getMotivoColorTexto = (motivo: string): string => {
    if (motivo.toLowerCase().includes("inactiva")) return "text-slate-400"
    if (motivo.toLowerCase().includes("mantenimiento")) return "text-orange-300"
    if (motivo.toLowerCase().includes("limpieza")) return "text-cyan-300"
    if (motivo.toLowerCase().includes("reservada")) return "text-purple-300"
    if (motivo.toLowerCase().includes("ocupada")) return "text-red-300"
    return "text-slate-400"
  }

  return (
    <div className="space-y-3">
      {conDecoracion && (
        <div className="bg-purple-950/40 border border-purple-700 p-2 rounded flex items-center gap-2 text-purple-200 text-xs">
          <Sparkles size={14} />
          Filtrando con 24h extra de anticipación para el proveedor
        </div>
      )}

      {/* Disponibles */}
      <div>
        <p className="text-green-400 text-sm font-semibold mb-2">
          ✅ Disponibles ({libres.length})
        </p>
        {libres.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay habitaciones disponibles.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {libres.map((h) => (
              <button
                key={h.id_habitacion}
                type="button"
                onClick={() => onSeleccionar(h)}
                className={`p-2 rounded text-center transition border ${
                  idHabitacionSeleccionada === h.id_habitacion
                    ? "bg-green-700 border-green-500 text-white"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <p className="font-bold text-sm">{h.numero}</p>
                <p className="text-xs text-slate-400">{h.tipo?.nombre ?? ""}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Con conflicto */}
      {conflicto.length > 0 && (
        <div>
          <p className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-1">
            <AlertCircle size={14} />
            No disponibles ({conflicto.length})
          </p>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {conflicto.map((h) => (
              <div
                key={h.id_habitacion}
                className={`border p-2 rounded text-xs ${getMotivoColor(h.motivo)}`}
              >
                <p className={`font-semibold ${getMotivoColorTexto(h.motivo)}`}>
                  Hab. {h.numero} — {h.motivo}
                </p>
                {h.ocupacion?.cliente && (
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Cliente: {h.ocupacion.cliente}
                  </p>
                )}
                {h.ocupacion?.fecha_inicio && h.ocupacion?.fecha_fin && (
                  <p className="text-slate-500 text-[10px] mt-0.5">
                    {new Date(h.ocupacion.fecha_inicio).toLocaleString("es-PE", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                    })}
                    {" → "}
                    {new Date(h.ocupacion.fecha_fin).toLocaleString("es-PE", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}