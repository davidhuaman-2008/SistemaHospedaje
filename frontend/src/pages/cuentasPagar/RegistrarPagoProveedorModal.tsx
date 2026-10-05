import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, DollarSign } from "lucide-react"
import { cuentaPagarService } from "@/services/cuentaPagarService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { CuentaPagar } from "@/types/cuentaPagar"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  cuenta: CuentaPagar
  onClose: () => void
  onSuccess: () => void
}

export function RegistrarPagoProveedorModal({ cuenta, onClose, onSuccess }: Props) {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [monto, setMonto] = useState<string>(Number(cuenta.saldo || 0).toFixed(2))
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [referencia, setReferencia] = useState("")
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

  const guardar = async () => {
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) return toast.error("El monto debe ser mayor a 0")
    if (montoNum > Number(cuenta.saldo) + 0.01) {
      return toast.error(`El monto excede el saldo (S/ ${Number(cuenta.saldo || 0).toFixed(2)})`)
    }
    if (!idMetodoPago) return toast.error("Seleccioná un método de pago")

    setEnviando(true)
    try {
      await cuentaPagarService.registrarPago(cuenta.id_cuenta, {
        monto: montoNum,
        id_metodo_pago: idMetodoPago,
        referencia: referencia.trim() || null,
        observaciones: observaciones.trim() || null,
      })
      toast.success("Pago registrado")
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
        <div className="bg-green-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Registrar Pago</h3>
              <p className="text-green-200 text-xs">
                {cuenta.proveedor?.razon_social || cuenta.proveedor?.nombre_comercial}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-green-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="bg-slate-900 p-3 rounded grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Monto</p>
                <p className="text-white font-bold">S/ {Number(cuenta.monto || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400">Pagado</p>
                <p className="text-green-400 font-bold">S/ {Number(cuenta.monto_pagado || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400">Saldo</p>
                <p className="text-yellow-400 font-bold">S/ {Number(cuenta.saldo || 0).toFixed(2)}</p>
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Monto a pagar *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={cuenta.saldo}
                value={monto}
                onChange={e => setMonto(e.target.value)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700 text-lg"
              />
              <p className="text-slate-500 text-xs mt-1">Podés pagar menos del total (pago parcial)</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Método de pago *</label>
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

            <div>
              <label className="text-slate-300 text-sm block mb-1">Referencia (opcional)</label>
              <input
                type="text"
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                placeholder="Nro de operación Yape/Transferencia"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Observaciones (opcional)</label>
              <textarea
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={guardar}
                disabled={enviando}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
              >
                {enviando ? "Registrando..." : "Registrar Pago"}
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