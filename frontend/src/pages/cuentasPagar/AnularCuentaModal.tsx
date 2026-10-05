import { useState } from "react"
import { toast } from "sonner"
import { X, AlertOctagon } from "lucide-react"
import { cuentaPagarService } from "@/services/cuentaPagarService"
import { mensajeDeError } from "@/lib/errores"
import type { CuentaPagar } from "@/types/cuentaPagar"

interface Props {
  cuenta: CuentaPagar
  onClose: () => void
  onSuccess: () => void
}

export function AnularCuentaModal({ cuenta, onClose, onSuccess }: Props) {
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)

  const anular = async () => {
    if (!motivo.trim()) return toast.error("Ingresá el motivo")
    setEnviando(true)
    try {
      await cuentaPagarService.anular(cuenta.id_cuenta, motivo.trim())
      toast.success("Cuenta anulada")
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
        <div className="bg-red-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Anular Cuenta</h3>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded">
            <p className="text-red-200 text-sm">
              ¿Anular la cuenta <strong>#{cuenta.id_cuenta}</strong> por S/ {Number(cuenta.monto || 0).toFixed(2)}?
            </p>
            <p className="text-red-300 text-xs mt-1">
              {cuenta.concepto}
            </p>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded">
            <p className="text-yellow-200 text-xs">
              ⚠️ Solo se puede anular si NO tiene pagos activos.
            </p>
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Motivo *</label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ej: Proveedor no cumplió con el servicio"
              className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={anular}
              disabled={enviando}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Anulando..." : "Confirmar Anulación"}
            </button>
            <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}