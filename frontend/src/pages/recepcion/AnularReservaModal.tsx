import { useState } from "react"
import { toast } from "sonner"
import { X, AlertTriangle } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionMapa } from "@/types/reserva"

interface Props {
  habitacion: HabitacionMapa
  onClose: () => void
  onSuccess: () => void
}

export function AnularReservaModal({ habitacion, onClose, onSuccess }: Props) {
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)

  const anular = async () => {
    if (!motivo.trim()) {
      toast.error("Ingresá un motivo")
      return
    }
    if (!habitacion.id_reserva) return
    if (enviando) return
    setEnviando(true)
    try {
      await reservaService.anular(habitacion.id_reserva, motivo)
      toast.success("Reserva anulada")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="bg-red-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Anular Registro</h3>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded">
            <p className="text-red-200 text-sm">
              ⚠️ Esta acción anula el registro completamente. No contará para SUNAT ni para la caja.
            </p>
          </div>

          <div>
            <p className="text-slate-300 text-sm mb-1">
              Habitación <strong className="text-white">{habitacion.numero}</strong> · {habitacion.cliente}
            </p>
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Motivo de anulación *</label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ej: Cliente solicitó devolución del dinero"
              className="w-full bg-slate-900 text-white p-2 rounded"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={anular}
              disabled={!motivo.trim() || enviando}
              className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Anulando..." : "Confirmar Anulación"}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}