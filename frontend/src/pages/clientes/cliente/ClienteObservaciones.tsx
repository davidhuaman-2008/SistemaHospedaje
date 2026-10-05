import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Check, Trash2, Plus } from "lucide-react"
import { clienteObservacionService } from "@/services/clienteObservacionService"
import { mensajeDeError } from "@/lib/errores"
import type { ClienteObservacion } from "@/types/cliente"
import { AgregarObservacionModal } from "./AgregarObservacionModal"

interface Props {
  idCliente: number
  nombreCliente?: string
  onCambio?: () => void
}

function formatearFecha(valor: string | null | undefined): string {
  if (!valor) return "—"
  const d = new Date(valor)
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ClienteObservaciones({ idCliente, nombreCliente, onCambio }: Props) {
  const [observaciones, setObservaciones] = useState<ClienteObservacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)

  const cargar = async () => {
    try {
      setCargando(true)
      const datos = await clienteObservacionService.porCliente(idCliente)
      setObservaciones(datos)
    } catch {
      toast.error("Error al cargar observaciones")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCliente])

  const resolver = async (id: number) => {
    try {
      await clienteObservacionService.resolver(id)
      toast.success("Observación resuelta")
      cargar()
      onCambio?.()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta observación?")) return
    try {
      await clienteObservacionService.eliminar(id)
      toast.success("Observación eliminada")
      cargar()
      onCambio?.()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const pendientes = observaciones.filter(o => !o.resuelto)

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-white font-semibold">Observaciones</h3>
          <p className="text-slate-400 text-xs">
            {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""} ·{" "}
            {observaciones.length} en total
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      {cargando ? (
        <p className="text-slate-400 text-sm">Cargando...</p>
      ) : observaciones.length === 0 ? (
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Sin observaciones registradas ✅</p>
        </div>
      ) : (
        <div className="space-y-2">
          {observaciones.map(o => {
            const color = o.gravedad?.color || "#64748b"
            return (
              <div
                key={o.id_observacion}
                className={`bg-slate-800 p-3 rounded border-l-4 ${
                  o.resuelto ? "opacity-60" : ""
                }`}
                style={{ borderLeftColor: color }}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ background: color }}
                      >
                        {o.gravedad?.nombre || "—"}
                      </span>
                      <span className="text-white font-medium text-sm">
                        {o.tipo?.nombre || "—"}
                      </span>
                      {o.resuelto && (
                        <span className="bg-green-800 text-green-200 text-xs px-2 py-0.5 rounded">
                          RESUELTA
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{o.motivo}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                      {o.monto_deuda && Number(o.monto_deuda) > 0 && (
                        <span className="text-yellow-400 font-semibold">
                          Deuda: S/ {Number(o.monto_deuda).toFixed(2)}
                        </span>
                      )}
                      <span>{formatearFecha(o.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!o.resuelto && (
                      <button
                        onClick={() => resolver(o.id_observacion)}
                        className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded"
                        title="Marcar como resuelta"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => eliminar(o.id_observacion)}
                      className="bg-red-700 hover:bg-red-800 text-white p-1.5 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {mostrarModal && (
        <AgregarObservacionModal
          idCliente={idCliente}
          nombreCliente={nombreCliente}
          onClose={() => setMostrarModal(false)}
          onSuccess={() => {
            cargar()
            onCambio?.()
          }}
        />
      )}
    </div>
  )
}