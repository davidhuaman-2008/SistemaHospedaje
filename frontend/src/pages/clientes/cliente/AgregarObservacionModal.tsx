import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, AlertTriangle, DollarSign } from "lucide-react"
import { clienteObservacionService } from "@/services/clienteObservacionService"
import { tipoObservacionService } from "@/services/tipoObservacionService"
import { gravedadObservacionService } from "@/services/gravedadObservacionService"
import { mensajeDeError } from "@/lib/errores"
import type { TipoObservacion } from "@/types/tipoObservacion"
import type { GravedadObservacion } from "@/types/gravedadObservacion"

interface Props {
  idCliente: number
  nombreCliente?: string
  motivoInicial?: string
  onClose: () => void
  onSuccess?: () => void
}

export function AgregarObservacionModal({
  idCliente,
  nombreCliente,
  motivoInicial,
  onClose,
  onSuccess,
}: Props) {
  const [tipos, setTipos] = useState<TipoObservacion[]>([])
  const [gravedades, setGravedades] = useState<GravedadObservacion[]>([])
  const [idTipo, setIdTipo] = useState<number | null>(null)
  const [idGravedad, setIdGravedad] = useState<number | null>(null)
  const [motivo, setMotivo] = useState(motivoInicial || "")
  const [montoDeuda, setMontoDeuda] = useState<string>("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  const tipoSeleccionado = tipos.find(t => t.id_tipo_observacion === idTipo)
  const mostrarMontoDeuda =
    tipoSeleccionado?.slug === "deuda" ||
    tipoSeleccionado?.slug === "dano_habitacion"

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [ts, gs] = await Promise.all([
          tipoObservacionService.listarActivos(),
          gravedadObservacionService.listarActivos(),
        ])
        setTipos(ts)
        setGravedades(gs)
        if (ts.length > 0) setIdTipo(ts[0].id_tipo_observacion)
        if (gs.length > 0) setIdGravedad(gs[0].id_gravedad)
      } catch {
        toast.error("Error al cargar catálogos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const guardar = async () => {
    if (!idTipo) return toast.error("Seleccione un tipo de observación")
    if (!idGravedad) return toast.error("Seleccione una gravedad")
    if (!motivo.trim()) return toast.error("El motivo es obligatorio")

    setEnviando(true)
    try {
      await clienteObservacionService.crear(idCliente, {
        id_tipo_observacion: idTipo,
        id_gravedad: idGravedad,
        motivo: motivo.trim(),
        monto_deuda: montoDeuda ? Number(montoDeuda) : null,
      })
      toast.success("Observación registrada")
      onSuccess?.()
      onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-red-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Registrar Observación</h3>
              {nombreCliente && (
                <p className="text-red-200 text-xs">{nombreCliente}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Tipo de observación *
              </label>
              <select
                value={idTipo ?? ""}
                onChange={e => setIdTipo(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="">— Seleccionar —</option>
                {tipos.map(t => (
                  <option key={t.id_tipo_observacion} value={t.id_tipo_observacion}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Gravedad *
              </label>
              <select
                value={idGravedad ?? ""}
                onChange={e => setIdGravedad(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              >
                <option value="">— Seleccionar —</option>
                {gravedades.map(g => (
                  <option key={g.id_gravedad} value={g.id_gravedad}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            {mostrarMontoDeuda && (
              <div>
                <label className="text-slate-300 text-sm block mb-1 flex items-center gap-1">
                  <DollarSign size={14} />
                  Monto de deuda
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={montoDeuda}
                  onChange={e => setMontoDeuda(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                />
              </div>
            )}

            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Motivo *
              </label>
              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                rows={3}
                placeholder="Ej: Se fue sin pagar 2h extra"
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={guardar}
                disabled={enviando}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
              >
                {enviando ? "Guardando..." : "Guardar Observación"}
              </button>
              <button
                onClick={onClose}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}