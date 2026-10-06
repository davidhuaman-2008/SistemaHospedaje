import { useState } from "react"
import { toast } from "sonner"
import { X, AlertTriangle } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"

interface Props {
  idReserva: number
  codigoReserva: string
  nombreCliente: string
  onClose: () => void
  onSuccess: () => void
}

const MOTIVOS_RAPIDOS = [
  "Cliente no llegó",
  "Cliente canceló por teléfono",
  "Cliente canceló por WhatsApp",
  "Error de recepción",
  "Otro motivo",
]

export function ModalAnularReservaCheckIn({
  idReserva,
  codigoReserva,
  nombreCliente,
  onClose,
  onSuccess,
}: Props) {
  const [motivo, setMotivo] = useState("")
  const [procesando, setProcesando] = useState(false)

  const confirmar = async () => {
    if (!motivo.trim()) return toast.error("Ingresá un motivo")
    try {
      setProcesando(true)
      await reservaService.anular(idReserva, motivo)
      toast.success("Reserva anulada correctamente")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-200" />
            <h3 className="text-lg font-bold text-white">Anular Reserva</h3>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-red-950/40 border border-red-800 p-3 rounded text-red-200 text-sm">
            ⚠️ Se va a <strong>ANULAR</strong> la reserva <strong>{codigoReserva}</strong> del cliente <strong>{nombreCliente}</strong>.
            <br />
            <br />
            La habitación quedará <strong>libre</strong> inmediatamente.
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-2">Motivo rápido</label>
            <div className="flex flex-wrap gap-1.5">
              {MOTIVOS_RAPIDOS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMotivo(m)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition border ${
                    motivo === m
                      ? "bg-red-700 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:border-red-500"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Motivo *</label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              placeholder="Ej: Cliente no llegó"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={confirmar}
              disabled={procesando || !motivo.trim()}
              className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded font-medium"
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