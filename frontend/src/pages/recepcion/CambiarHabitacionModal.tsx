import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, ArrowRight, AlertCircle } from "lucide-react"
import { habitacionMapaService, reservaService } from "@/services/reservaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { tarifaService } from "@/services/tarifaService"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionMapa, Reserva } from "@/types/reserva"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  habitacion: HabitacionMapa
  onClose: () => void
  onSuccess: () => void
}

export function CambiarHabitacionModal({ habitacion, onClose, onSuccess }: Props) {
  const [disponibles, setDisponibles] = useState<HabitacionMapa[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [idNueva, setIdNueva] = useState<number | null>(null)
  const [precioNuevo, setPrecioNuevo] = useState<number | null>(null)
  const [nuevasHoras, setNuevasHoras] = useState<number | null>(null)
  const [horasAjustadas, setHorasAjustadas] = useState(false)
  const [modoDiferencia, setModoDiferencia] = useState<"AHORA" | "AL_FINAL">("AL_FINAL")
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [reserva, setReserva] = useState<Reserva | null>(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [todas, mps] = await Promise.all([
          habitacionMapaService.listar(),
          metodoPagoService.listarActivos(),
        ])
        setDisponibles(todas.filter(h => h.estado === "Disponible"))
        setMetodosPago(mps)

        if (habitacion.id_reserva) {
          const r = await reservaService.obtener(habitacion.id_reserva)
          setReserva(r)
        }
      } catch {
        toast.error("Error al cargar datos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [habitacion.id_reserva])

  // Cuando se elige una nueva habitación → buscar tarifa
  useEffect(() => {
    const cargarTarifa = async () => {
      if (!idNueva || !reserva) {
        setPrecioNuevo(null)
        setHorasAjustadas(false)
        return
      }
      const hab = disponibles.find(h => h.id_habitacion === idNueva)
      if (!hab) return

      try {
        const tarifas = await tarifaService.listarPorTipo(hab.id_tipo)
        const tarifasActivas = tarifas.filter(t => t.activo)

        // 1. Buscar tarifa con las mismas horas
        let tarifa = tarifasActivas.find(t => t.horas === reserva.horas_base)

        // 2. Si no existe, usar la más chica disponible
        if (!tarifa && tarifasActivas.length > 0) {
          tarifa = tarifasActivas.sort((a, b) => a.horas - b.horas)[0]
          setHorasAjustadas(true)
          toast.info(`Ese tipo no tiene tarifa de ${reserva.horas_base}h. Se usará ${tarifa.horas}h.`)
        } else {
          setHorasAjustadas(false)
        }

        if (tarifa) {
          setPrecioNuevo(Number(tarifa.monto))
          setNuevasHoras(tarifa.horas)
        } else {
          setPrecioNuevo(null)
          toast.error("Esa habitación no tiene tarifas activas")
        }
      } catch {
        setPrecioNuevo(null)
        setHorasAjustadas(false)
      }
    }
    cargarTarifa()
  }, [idNueva, reserva, disponibles])

  const habSeleccionada = disponibles.find(h => h.id_habitacion === idNueva)
  const precioActual = reserva ? Number(reserva.monto_habitacion) : 0
  const diferencia = precioNuevo !== null ? precioNuevo - precioActual : 0

  const cambiar = async () => {
    if (!idNueva || !habitacion.id_reserva) return
    if (enviando) return

    if (modoDiferencia === "AHORA" && !idMetodoPago && Math.abs(diferencia) > 0) {
      toast.error("Seleccione un método de pago")
      return
    }

    setEnviando(true)
    try {
      await reservaService.cambiarHabitacion(habitacion.id_reserva, {
        id_nueva_habitacion: idNueva,
        modo_diferencia: modoDiferencia,
        id_metodo_pago: idMetodoPago,
      })
      toast.success("Habitación cambiada")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-slate-300">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">🔄 Cambiar Habitación</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1">
              Nueva habitación ({disponibles.length} disponibles)
            </label>
            <select
              value={idNueva ?? ""}
              onChange={e => setIdNueva(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-slate-900 text-white p-2 rounded"
            >
              <option value="">— Seleccionar —</option>
              {disponibles.map(h => (
                <option key={h.id_habitacion} value={h.id_habitacion}>
                  Habitación {h.numero} · {h.tipo_nombre} ({h.piso_nombre})
                </option>
              ))}
            </select>
            {disponibles.length === 0 && (
              <p className="text-yellow-400 text-xs mt-1">
                ⚠️ No hay habitaciones disponibles
              </p>
            )}
          </div>

          {habSeleccionada && reserva && (
            <div className="bg-slate-900 p-4 rounded space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Actual</p>
                  <p className="text-white font-semibold">
                    {reserva.habitacion?.numero} · {reserva.habitacion?.tipo?.nombre}
                  </p>
                  <p className="text-cyan-400 text-xs mt-1">
                    S/ {precioActual.toFixed(2)} ({reserva.horas_base}h)
                  </p>
                </div>

                <ArrowRight className="text-slate-500" size={20} />

                <div className="text-right">
                  <p className="text-slate-400 text-xs">Nueva</p>
                  <p className="text-white font-semibold">
                    {habSeleccionada.numero} · {habSeleccionada.tipo_nombre}
                  </p>
                  <p className="text-cyan-400 text-xs mt-1">
                    {precioNuevo !== null && nuevasHoras !== null
                      ? `S/ ${precioNuevo.toFixed(2)} (${nuevasHoras}h)`
                      : "—"}
                  </p>
                </div>
              </div>

              {horasAjustadas && nuevasHoras !== null && (
                <div className="p-2 rounded bg-yellow-900/30 border border-yellow-700 flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow-300" />
                  <p className="text-yellow-300 text-xs">
                    Ese tipo no tiene tarifa de {reserva.horas_base}h. Se ajusta a {nuevasHoras}h.
                  </p>
                </div>
              )}

              {precioNuevo !== null && diferencia !== 0 && (
                <div className={`p-2 rounded flex items-center gap-2 ${
                  diferencia > 0
                    ? "bg-red-900/30 border border-red-700"
                    : "bg-green-900/30 border border-green-700"
                }`}>
                  <AlertCircle size={16} className={diferencia > 0 ? "text-red-300" : "text-green-300"} />
                  <p className={diferencia > 0 ? "text-red-300 text-sm" : "text-green-300 text-sm"}>
                    {diferencia > 0
                      ? `Diferencia a pagar: S/ ${diferencia.toFixed(2)}`
                      : `A favor del cliente: S/ ${Math.abs(diferencia).toFixed(2)}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {habSeleccionada && precioNuevo !== null && diferencia !== 0 && (
            <div className="bg-slate-900 p-4 rounded space-y-3">
              <p className="text-slate-300 text-sm font-medium">¿Cómo manejar la diferencia?</p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={modoDiferencia === "AHORA"}
                  onChange={() => setModoDiferencia("AHORA")}
                  className="w-4 h-4"
                />
                <span className="text-slate-200 text-sm">
                  {diferencia > 0
                    ? `Cobrar ahora: S/ ${diferencia.toFixed(2)}`
                    : `Devolver ahora: S/ ${Math.abs(diferencia).toFixed(2)}`
                  }
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={modoDiferencia === "AL_FINAL"}
                  onChange={() => setModoDiferencia("AL_FINAL")}
                  className="w-4 h-4"
                />
                <span className="text-slate-200 text-sm">
                  {diferencia > 0
                    ? `Sumar al saldo final: S/ ${diferencia.toFixed(2)}`
                    : `Queda como saldo a favor: S/ ${Math.abs(diferencia).toFixed(2)}`
                  }
                </span>
              </label>

              {modoDiferencia === "AHORA" && (
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Método de pago</label>
                  <select
                    value={idMetodoPago ?? ""}
                    onChange={e => setIdMetodoPago(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-slate-800 text-white p-2 rounded"
                  >
                    <option value="">— Seleccionar —</option>
                    {metodosPago.map(mp => (
                      <option key={mp.id_metodo} value={mp.id_metodo}>
                        {mp.nombre} {mp.es_de_caja ? "(Caja)" : "(Dueña)"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cambiar}
              disabled={!idNueva || enviando || (precioNuevo === null && idNueva !== null)}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Cambiando..." : "Confirmar Cambio"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}