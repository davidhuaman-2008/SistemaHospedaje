import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, AlertOctagon } from "lucide-react"
import { metodoPagoService } from "@/services/metodoPagoService"
import { gravedadObservacionService } from "@/services/gravedadObservacionService"
import { mensajeDeError } from "@/lib/errores"
import type { MetodoPago } from "@/types/configuracion"
import type { GravedadObservacion } from "@/types/gravedadObservacion"

interface Props {
  idReserva: number
  deudaPendiente: number
  nombreCliente: string
  habitacion: string
  onClose: () => void
  onConfirmar: (datos: {
    decision_tipo: "PAGO" | "NO_PAGO"
    monto_pago?: number
    id_metodo_pago?: number
    id_gravedad?: number
    motivo?: string
  }) => Promise<void>
}

export function ConfirmarDeudaModal({
  deudaPendiente,
  nombreCliente,
  habitacion,
  onClose,
  onConfirmar,
}: Props) {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [gravedades, setGravedades] = useState<GravedadObservacion[]>([])
  const [decision, setDecision] = useState<"PAGO" | "NO_PAGO">("PAGO")
  const [montoPago, setMontoPago] = useState<string>(deudaPendiente.toFixed(2))
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [idGravedad, setIdGravedad] = useState<number | null>(null)
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [mps, grads] = await Promise.all([
          metodoPagoService.listarActivos(),
          gravedadObservacionService.listarActivos(),
        ])
        setMetodosPago(mps)
        setGravedades(grads)

        const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
        if (efectivo) setIdMetodoPago(efectivo.id_metodo)
        else if (mps.length > 0) setIdMetodoPago(mps[0].id_metodo)

        const alta = grads.find(g => g.slug === "alta")
        if (alta) setIdGravedad(alta.id_gravedad)
        else if (grads.length > 0) setIdGravedad(grads[0].id_gravedad)
      } catch {
        toast.error("Error al cargar catálogos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const confirmar = async () => {
    if (decision === "PAGO") {
      const monto = Number(montoPago)
      if (!monto || monto <= 0) return toast.error("El monto debe ser mayor a 0")
      if (!idMetodoPago) return toast.error("Seleccioná un método de pago")

      setEnviando(true)
      try {
        await onConfirmar({
          decision_tipo: "PAGO",
          monto_pago: monto,
          id_metodo_pago: idMetodoPago,
        })
      } catch (e: unknown) {
        toast.error(mensajeDeError(e))
        setEnviando(false)
      }
    } else {
      if (!idGravedad) return toast.error("Seleccioná una gravedad")
      if (!motivo.trim()) return toast.error("Ingresá el motivo")

      setEnviando(true)
      try {
        await onConfirmar({
          decision_tipo: "NO_PAGO",
          id_gravedad: idGravedad,
          motivo: motivo.trim(),
        })
      } catch (e: unknown) {
        toast.error(mensajeDeError(e))
        setEnviando(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-red-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <AlertOctagon size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Cliente con Deuda Pendiente</h3>
              <p className="text-red-200 text-xs">{nombreCliente} · Hab. {habitacion}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-900 p-3 rounded">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">🔴 Deuda pendiente:</span>
              <span className="text-red-300 font-bold text-lg">
                S/ {deudaPendiente.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-slate-300 text-sm font-medium mb-3">
              ¿Qué pasó con la deuda?
            </p>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700">
                <input
                  type="radio"
                  checked={decision === "PAGO"}
                  onChange={() => setDecision("PAGO")}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">💵 Ya me pagó</p>
                  <p className="text-slate-400 text-xs mt-1">Se registra el pago ahora</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700">
                <input
                  type="radio"
                  checked={decision === "NO_PAGO"}
                  onChange={() => setDecision("NO_PAGO")}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">🚫 No me pagó (se fue debiendo)</p>
                  <p className="text-slate-400 text-xs mt-1">
                    ⚠️ Se creará una observación al cliente
                  </p>
                </div>
              </label>
            </div>
          </div>

          {decision === "PAGO" && (
            <>
              <div>
                <label className="text-slate-300 text-sm block mb-1">Monto a cobrar *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={montoPago}
                  onChange={e => setMontoPago(e.target.value)}
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700 text-lg"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1">Método de pago *</label>
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
            </>
          )}

          {decision === "NO_PAGO" && (
            <>
              <div className="bg-red-900/30 border border-red-700 p-3 rounded">
                <p className="text-red-200 text-xs">
                  ⚠️ Se creará una observación al cliente por deuda de S/ {deudaPendiente.toFixed(2)}.
                  El cliente verá una alerta roja la próxima vez que ingrese.
                </p>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1">Gravedad *</label>
                <select
                  value={idGravedad ?? ""}
                  onChange={e => setIdGravedad(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                  disabled={cargando}
                >
                  <option value="">— Seleccionar —</option>
                  {gravedades.map(g => (
                    <option key={g.id_gravedad} value={g.id_gravedad}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1">Motivo *</label>
                <textarea
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  rows={2}
                  placeholder="Ej: Se fue sin pagar S/ X después de consumos"
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                />
              </div>
            </>
          )}

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