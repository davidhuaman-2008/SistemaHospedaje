import { AlertTriangle, ShieldX, AlertOctagon } from "lucide-react"
import type { ClienteObservacion } from "@/types/cliente"

interface Props {
  observaciones: ClienteObservacion[]
  onContinuar?: () => void
  onCancelar?: () => void
  mostrarBotones?: boolean
}

export function AlertaClienteObservaciones({
  observaciones,
  onContinuar,
  onCancelar,
  mostrarBotones = false,
}: Props) {
  if (observaciones.length === 0) return null

  const tieneBloqueo = observaciones.some(
    o => o.tipo?.slug === "bloqueo" || o.gravedad?.slug === "critica"
  )
  const esNoGrato = observaciones.length >= 2
  const tieneGrave = observaciones.some(o => o.gravedad?.slug === "alta")
  const totalDeuda = observaciones.reduce(
    (acc, o) => acc + (o.monto_deuda ? Number(o.monto_deuda) : 0),
    0
  )

  let bg = "bg-yellow-900/60 border-yellow-700"
  let titulo = "⚠️ Cliente con observación pendiente"
  let Icono = AlertTriangle
  let colorIcono = "text-yellow-300"
  let colorTitulo = "text-yellow-200"

  if (tieneBloqueo) {
    bg = "bg-red-950 border-red-700"
    titulo = "⛔ CLIENTE VETADO — BLOQUEO PERMANENTE"
    Icono = ShieldX
    colorIcono = "text-red-400"
    colorTitulo = "text-red-200"
  } else if (esNoGrato) {
    bg = "bg-red-900/60 border-red-700"
    titulo = "🚨 CLIENTE NO GRATO — 2 OBSERVACIONES PENDIENTES"
    Icono = AlertOctagon
    colorIcono = "text-red-300"
    colorTitulo = "text-red-200"
  } else if (tieneGrave) {
    bg = "bg-orange-900/60 border-orange-700"
    titulo = "⚠️ Cliente con observación GRAVE"
    colorIcono = "text-orange-300"
    colorTitulo = "text-orange-200"
  }

  return (
    <div className={`border ${bg} rounded-lg p-4 space-y-3`}>
      <div className="flex items-start gap-3">
        <Icono size={24} className={`${colorIcono} shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-bold text-sm ${colorTitulo}`}>{titulo}</h3>
          {tieneBloqueo && (
            <p className="text-red-300 text-xs mt-1">
              NO DAR SERVICIO. Contactar a la dueña para autorizar.
            </p>
          )}
          {esNoGrato && !tieneBloqueo && (
            <p className="text-red-300 text-xs mt-1">
              Se recomienda NO darle servicio hasta que regularice.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 pl-9">
        {observaciones.map(o => (
          <div key={o.id_observacion} className="text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                style={{ background: o.gravedad?.color || "#64748b" }}
              >
                {o.gravedad?.nombre || "—"}
              </span>
              <span className="text-white font-medium">
                {o.tipo?.nombre || "—"}
              </span>
            </div>
            <p className="text-slate-300 mt-0.5">"{o.motivo}"</p>
            {o.monto_deuda && Number(o.monto_deuda) > 0 && (
              <p className="text-yellow-400 font-semibold">
                Deuda: S/ {Number(o.monto_deuda).toFixed(2)}
              </p>
            )}
          </div>
        ))}
      </div>

      {totalDeuda > 0 && (
        <div className="pl-9 pt-2 border-t border-slate-700">
          <p className="text-yellow-300 font-bold text-sm">
            TOTAL ADEUDADO: S/ {totalDeuda.toFixed(2)}
          </p>
        </div>
      )}

      {mostrarBotones && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={onContinuar}
            className={`flex-1 py-2 rounded font-medium text-sm ${
              tieneBloqueo
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            {tieneBloqueo ? "Continuar (requiere autorización)" : "Continuar de todas formas"}
          </button>
          <button
            onClick={onCancelar}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}