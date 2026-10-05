import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import type { HabitacionMapa } from "@/types/reserva"
import { CambiarHabitacionModal } from "./CambiarHabitacionModal"
import { AnularReservaModal } from "./AnularReservaModal"

interface Props {
  habitacion: HabitacionMapa
  onClose: () => void
  onRefresh: () => void
}

function formatearTiempo(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function ModalHabitacionOcupada({ habitacion, onClose, onRefresh }: Props) {
  const navigate = useNavigate()
  const [mostrarCambiar, setMostrarCambiar] = useState(false)
  const [mostrarAnular, setMostrarAnular] = useState(false)

  const {
    numero, cliente, id_reserva,
    minutos_transcurridos, minutos_restantes, minutos_extra, horas_base,
  } = habitacion

  const esVencida = habitacion.estado === "Vencida"

  // Estado de pago
  const pagado = Number(habitacion.pagado) || 0
  const total = Number(habitacion.total) || 0
  const diferencia = pagado - total

  const irAPreCuenta = () => {
    if (id_reserva) {
      navigate(`/recepcion/checkout/${id_reserva}`)
    }
  }

  if (mostrarCambiar) {
    return (
      <CambiarHabitacionModal
        habitacion={habitacion}
        onClose={() => setMostrarCambiar(false)}
        onSuccess={() => { setMostrarCambiar(false); onRefresh() }}
      />
    )
  }

  if (mostrarAnular) {
    return (
      <AnularReservaModal
        habitacion={habitacion}
        onClose={() => setMostrarAnular(false)}
        onSuccess={() => { setMostrarAnular(false); onRefresh() }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">🛏️ Habitación {numero}</h3>
            <p className="text-slate-400 text-sm">{cliente}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Info de tiempo */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-slate-400 text-xs">Transcurrido</p>
              <p className="text-white font-bold text-sm">
                {minutos_transcurridos !== null ? formatearTiempo(minutos_transcurridos) : "—"}
              </p>
            </div>
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-slate-400 text-xs">Contratado</p>
              <p className="text-white font-bold text-sm">{horas_base}h</p>
            </div>
            <div className={`p-2 rounded ${esVencida ? "bg-red-900/50" : "bg-slate-900"}`}>
              <p className={esVencida ? "text-red-300 text-xs" : "text-slate-400 text-xs"}>
                {esVencida ? "Excedido" : "Restante"}
              </p>
              <p className={esVencida ? "text-red-300 font-bold text-sm" : "text-white font-bold text-sm"}>
                {esVencida && minutos_extra !== null
                  ? formatearTiempo(minutos_extra)
                  : minutos_restantes !== null
                  ? formatearTiempo(minutos_restantes)
                  : "—"}
              </p>
            </div>
          </div>

          {/* Estado de pago */}
          {total > 0 && (
            <>
              {Math.abs(diferencia) < 0.01 ? (
                <div className="bg-green-900/40 border border-green-700 p-3 rounded flex justify-between items-center">
                  <span className="text-green-300 text-sm font-semibold">✅ Todo pagado</span>
                  <span className="text-green-300 text-xs">S/ {total.toFixed(2)}</span>
                </div>
              ) : diferencia > 0 ? (
                <div className="bg-yellow-900/40 border border-yellow-700 p-3 rounded flex justify-between items-center">
                  <span className="text-yellow-300 text-sm font-semibold">💵 VUELTO A FAVOR</span>
                  <span className="text-yellow-300 font-bold text-lg">S/ {diferencia.toFixed(2)}</span>
                </div>
              ) : (
                <div className="bg-red-900/40 border border-red-700 p-3 rounded flex justify-between items-center">
                  <span className="text-red-300 text-sm font-semibold">🔴 CLIENTE DEBE</span>
                  <span className="text-red-300 font-bold text-lg">S/ {Math.abs(diferencia).toFixed(2)}</span>
                </div>
              )}
            </>
          )}

          {/* Botones */}
          <div className="space-y-2 pt-2">
            <button
              onClick={irAPreCuenta}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
            >
              📋 Ir a Pre-Cuenta
            </button>

            <button
              onClick={() => setMostrarCambiar(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium"
            >
              🔄 Cambiar Habitación
            </button>

            <button
              onClick={() => setMostrarAnular(true)}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded font-medium"
            >
              ❌ Anular Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}