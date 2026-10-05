import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Banknote, AlertTriangle } from "lucide-react"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  idReserva: number
  vueltoPendiente: number
  nombreCliente: string
  habitacion: string
  onClose: () => void
  onConfirmar: (datos: {
    decision_tipo: "ENTREGADO" | "NO_RECLAMADO" | "OTRO"
    id_metodo_pago?: number | null
    observaciones?: string | null
  }) => Promise<void>
}

export function ConfirmarVueltoModal({
  idReserva,
  vueltoPendiente,
  nombreCliente,
  habitacion,
  onClose,
  onConfirmar,
}: Props) {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [decision, setDecision] = useState<"ENTREGADO" | "NO_RECLAMADO" | "OTRO">("ENTREGADO")
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [observaciones, setObservaciones] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const mps = await metodoPagoService.listarActivos()
        setMetodosPago(mps)
        const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
        if (efectivo) setIdMetodoPago(efectivo.id_metodo)
        else if (mps.length > 0) setIdMetodoPago(mps[0].id_metodo)
      } catch {
        toast.error("Error al cargar métodos de pago")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const confirmar = async () => {
    if (decision === "ENTREGADO" && !idMetodoPago) {
      toast.error("Seleccioná un método para entregar el vuelto")
      return
    }
    if (decision === "OTRO" && !observaciones.trim()) {
      toast.error("Ingresá una observación")
      return
    }
    if (decision === "NO_RECLAMADO" && !observaciones.trim()) {
      // Opcional pero recomendado
    }

    setEnviando(true)
    try {
      await onConfirmar({
        decision_tipo: decision,
        id_metodo_pago: decision === "ENTREGADO" ? idMetodoPago : null,
        observaciones: observaciones.trim() || null,
      })
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-yellow-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Confirmar Vuelto Pendiente</h3>
              <p className="text-yellow-200 text-xs">{nombreCliente} · Hab. {habitacion}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-yellow-200 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-900 p-3 rounded">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">💵 Vuelto pendiente:</span>
              <span className="text-yellow-300 font-bold text-lg">
                S/ {vueltoPendiente.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-slate-300 text-sm font-medium mb-3">
              ¿Qué pasó con el vuelto?
            </p>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700">
                <input
                  type="radio"
                  checked={decision === "ENTREGADO"}
                  onChange={() => setDecision("ENTREGADO")}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium"><span>💵 Se lo entregué al cliente</span></p>
                  <p className="text-slate-400 text-xs mt-1">El vuelto sale de caja</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700">
                <input
                  type="radio"
                  checked={decision === "NO_RECLAMADO"}
                  onChange={() => setDecision("NO_RECLAMADO")}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">🚶 El cliente se fue sin reclamarlo</p>
                  <p className="text-slate-400 text-xs mt-1">El dinero queda en caja</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700">
                <input
                  type="radio"
                  checked={decision === "OTRO"}
                  onChange={() => setDecision("OTRO")}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">📝 Otra situación</p>
                  <p className="text-slate-400 text-xs mt-1">Se requiere observación</p>
                </div>
              </label>
            </div>
          </div>

          {decision === "ENTREGADO" && (
            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Método de devolución *
              </label>
              <select
                value={idMetodoPago ?? ""}
                onChange={e => setIdMetodoPago(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                disabled={cargando}
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

          <div>
            <label className="text-slate-300 text-sm block mb-1">
              Observaciones {decision === "OTRO" && <span className="text-red-400">*</span>}
            </label>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={2}
              placeholder={
                decision === "NO_RECLAMADO"
                  ? "Ej: Cliente se fue sin reclamar"
                  : "Ej: Detalles de la situación"
              }
              className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={confirmar}
              disabled={enviando || cargando}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Procesando..." : "Confirmar Check-out"}
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