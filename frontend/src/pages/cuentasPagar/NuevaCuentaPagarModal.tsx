import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Plus } from "lucide-react"
import { cuentaPagarService } from "@/services/cuentaPagarService"
import { proveedorService } from "@/services/proveedorService"
import { mensajeDeError } from "@/lib/errores"

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export function NuevaCuentaPagarModal({ onClose, onSuccess }: Props) {
  const [proveedores, setProveedores] = useState<Array<{ id_proveedor: number; razon_social: string; nombre_comercial: string | null }>>([])
  const [idProveedor, setIdProveedor] = useState<number | null>(null)
  const [concepto, setConcepto] = useState("")
  const [monto, setMonto] = useState("")
  const [fechaVencimiento, setFechaVencimiento] = useState("")
  const [notas, setNotas] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const ps = await proveedorService.listarActivos()
        setProveedores(ps)
        if (ps.length > 0) setIdProveedor(ps[0].id_proveedor)
      } catch {
        toast.error("Error al cargar proveedores")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const guardar = async () => {
    if (!idProveedor) return toast.error("Seleccioná un proveedor")
    if (!concepto.trim()) return toast.error("Ingresá el concepto")
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) return toast.error("El monto debe ser mayor a 0")

    setEnviando(true)
    try {
      await cuentaPagarService.crear({
        id_proveedor: idProveedor,
        concepto: concepto.trim(),
        monto: montoNum,
        fecha_vencimiento: fechaVencimiento || undefined,
        notas: notas.trim() || null,
      })
      toast.success("Cuenta creada")
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
        <div className="bg-amber-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Nueva Cuenta por Pagar</h3>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-slate-300 text-sm block mb-1">Proveedor *</label>
              <select
                value={idProveedor ?? ""}
                onChange={e => setIdProveedor(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="">— Seleccionar —</option>
                {proveedores.map(p => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>
                    {p.razon_social}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Concepto *</label>
              <input
                type="text"
                value={concepto}
                onChange={e => setConcepto(e.target.value)}
                placeholder="Ej: Compra de bebidas"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Monto *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700 text-lg"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Fecha de vencimiento (opcional)</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={e => setFechaVencimiento(e.target.value)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
              <p className="text-slate-500 text-xs mt-1">Si no se especifica, se asume +30 días</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Notas (opcional)</label>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
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
                {enviando ? "Creando..." : "Crear Cuenta"}
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