import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, AlertCircle } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionLibre, HabitacionConConflicto } from "@/types/reserva"

interface Props {
  fecha: string
  horas: number
  idHabitacionSeleccionada: number | null
  onSeleccionar: (h: HabitacionLibre) => void
}

/**
 * Selector de habitaciones disponibles para una fecha + horas dadas.
 * Muestra las libres + las ocupadas (con motivo).
 */
export function SelectorDisponibilidad({
  fecha,
  horas,
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
        const data = await reservaService.listarDisponiblesEnRango(fecha, horas)
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
  }, [fecha, horas])

  if (cargando) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm p-3">
        <Loader2 size={16} className="animate-spin" />
        Buscando disponibilidad...
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

  // Colores segun motivo
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
                {/* Solo mostrar cliente si hay ocupacion con cliente */}
                {h.ocupacion?.cliente && (
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Cliente: {h.ocupacion.cliente}
                  </p>
                )}
                {/* Mostrar fechas si hay ocupacion */}
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