import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Banknote } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  idReserva: number
  vueltoPendiente: number
  onClose: () => void
  onSuccess: () => void
}

export function EntregarVueltoModal({
  idReserva,
  vueltoPendiente,
  onClose,
  onSuccess,
}: Props) {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [monto, setMonto] = useState<string>(vueltoPendiente.toFixed(2))
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

  const entregar = async () => {
    if (!idMetodoPago) return toast.error("Seleccioná un método de pago")
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) return toast.error("El monto debe ser mayor a 0")
    if (montoNum > vueltoPendiente + 0.01) {
      return toast.error(`El monto excede el vuelto pendiente (S/ ${vueltoPendiente.toFixed(2)})`)
    }

    setEnviando(true)
    try {
      await reservaService.entregarVuelto(idReserva, {
        monto: montoNum,
        id_metodo_pago: idMetodoPago,
      })
      toast.success(`Vuelto de S/ ${montoNum.toFixed(2)} entregado`)
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
        <div className="bg-yellow-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Entregar Vuelto</h3>
          </div>
          <button onClick={onClose} className="text-yellow-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-400 text-xs">Vuelto pendiente</p>
              <p className="text-yellow-300 font-bold text-2xl">
                S/ {vueltoPendiente.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Monto a entregar *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={vueltoPendiente}
                value={monto}
                onChange={e => setMonto(e.target.value)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700 text-lg"
              />
              <p className="text-slate-500 text-xs mt-1">
                Podés entregar menos del total (entrega parcial)
              </p>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Método de devolución *</label>
              <select
                value={idMetodoPago ?? ""}
                onChange={e => setIdMetodoPago(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="">— Seleccionar —</option>
                {metodosPago.map(mp => (
                  <option key={mp.id_metodo} value={mp.id_metodo}>
                    {mp.nombre} {mp.es_de_caja ? "(Caja)" : "(Dueña)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-3 rounded text-xs text-slate-400">
              💡 Se registrará como egreso en el método seleccionado.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={entregar}
                disabled={enviando}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
              >
                {enviando ? "Entregando..." : "Entregar Vuelto"}
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