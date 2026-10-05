import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Plus, AlertTriangle } from "lucide-react"
import { limpiezaService } from "@/services/limpiezaService"
import { habitacionMapaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionMapa } from "@/types/reserva"

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export function NuevaLimpiezaModal({ onClose, onSuccess }: Props) {
  const [habitaciones, setHabitaciones] = useState<HabitacionMapa[]>([])
  const [idHabitacion, setIdHabitacion] = useState<number | null>(null)
  const [tipo, setTipo] = useState<"NORMAL" | "PROFUNDA">("PROFUNDA")
  const [observaciones, setObservaciones] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const todas = await habitacionMapaService.listar()

        // ⚠️ Solo habitaciones DISPONIBLES (no ocupadas, no limpieza, no reservadas, no inactivas)
        const disponibles = todas
          .filter(h => h.estado === "Disponible")
          .sort((a, b) => a.numero.localeCompare(b.numero))

        setHabitaciones(disponibles)
        if (disponibles.length > 0) setIdHabitacion(disponibles[0].id_habitacion)
      } catch {
        toast.error("Error al cargar habitaciones")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const guardar = async () => {
    if (!idHabitacion) return toast.error("Seleccioná una habitación")

    setEnviando(true)
    try {
      await limpiezaService.crear({
        id_habitacion: idHabitacion,
        tipo,
        observaciones: observaciones.trim() || null,
      })
      toast.success("Limpieza creada")
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
      <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="bg-purple-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Nueva Limpieza Manual</h3>
              <p className="text-purple-200 text-xs">Solo para habitaciones DISPONIBLES</p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : habitaciones.length === 0 ? (
          <div className="p-6 space-y-3">
            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-300 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-semibold text-sm">
                    No hay habitaciones disponibles
                  </p>
                  <p className="text-yellow-100 text-xs mt-1">
                    Solo se puede crear limpieza manual en habitaciones <strong>Disponibles</strong>.
                  </p>
                </div>
              </div>
              <p className="text-yellow-100 text-xs">
                Si necesitás limpiar una habitación ocupada, primero hacé el <strong>check-out</strong> del cliente.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
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

            <div>
              <label className="text-slate-300 text-sm block mb-1">Tipo *</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as "NORMAL" | "PROFUNDA")}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="NORMAL">Normal</option>
                <option value="PROFUNDA">Profunda</option>
              </select>
              <p className="text-slate-500 text-xs mt-1">
                💡 Profunda: limpieza a fondo (muebles, cortinas, etc.)
              </p>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                rows={2}
                placeholder="Ej: Limpieza a fondo después de evento"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div className="bg-cyan-900/20 border border-cyan-800 p-2 rounded">
              <p className="text-cyan-200 text-xs">
                ℹ️ {habitaciones.length} habitación{habitaciones.length !== 1 ? "es" : ""} disponible{habitaciones.length !== 1 ? "s" : ""} para limpieza manual
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={guardar}
                disabled={enviando || !idHabitacion}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
              >
                {enviando ? "Creando..." : "Crear Limpieza"}
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