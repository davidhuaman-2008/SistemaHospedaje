import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"

interface Props {
  idReserva: number
  onClose: () => void
  onSuccess: () => void
}

export function ModalAnularReserva({ idReserva, onClose, onSuccess }: Props) {
  const [motivo, setMotivo] = useState("")
  const [procesando, setProcesando] = useState(false)

  const confirmar = async () => {
    if (!motivo.trim()) return toast.error("Ingresá un motivo")
    try {
      setProcesando(true)
      await reservaService.anular(idReserva, motivo)
      toast.success("Reserva anulada")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">⚠️ Anular Reserva</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-red-950/40 border border-red-800 p-3 rounded text-red-300 text-sm">
            ⚠️ Esta acción ANULA la reserva y sus pagos asociados. No cuenta para SUNAT.
          </div>

          <div>
            <label className="text-slate-300 text-sm">Motivo *</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 text-white p-2 rounded"
              placeholder="Ej: Error de recepción"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={confirmar}
              disabled={procesando}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded font-medium disabled:opacity-50"
            >
              {procesando ? "Anulando..." : "Confirmar Anulación"}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}