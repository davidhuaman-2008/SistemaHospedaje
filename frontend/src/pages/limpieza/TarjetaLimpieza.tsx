import { Play, Check, Clock, User, AlertTriangle } from "lucide-react"
import type { Limpieza } from "@/types/limpieza"

interface Props {
  limpieza: Limpieza
  onIniciar?: (id: number) => void
  onFinalizar?: (id: number) => void
  puedeOperar: boolean
}

function tiempoRelativo(fecha: string | null): string {
  if (!fecha) return "—"
  const ahora = new Date().getTime()
  const entonces = new Date(fecha).getTime()
  const diffMin = Math.floor((ahora - entonces) / (1000 * 60))

  if (diffMin < 1) return "hace menos de 1 min"
  if (diffMin < 60) return `hace ${diffMin} min`
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  if (m === 0) return `hace ${h}h`
  return `hace ${h}h ${m}m`
}

function minutosDesde(fecha: string | null): number {
  if (!fecha) return 0
  const ahora = new Date().getTime()
  const entonces = new Date(fecha).getTime()
  return Math.floor((ahora - entonces) / (1000 * 60))
}

export function TarjetaLimpieza({ limpieza, onIniciar, onFinalizar, puedeOperar }: Props) {
  const minDesdeSolicitud = minutosDesde(limpieza.fecha_solicitud)
  const esUrgente = limpieza.estado === "PENDIENTE" && minDesdeSolicitud > 30

  const colorBorde = limpieza.estado === "PENDIENTE"
    ? esUrgente ? "border-l-red-600" : "border-l-yellow-500"
    : limpieza.estado === "EN_PROCESO"
    ? "border-l-blue-500"
    : "border-l-green-600"

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border-l-4 ${colorBorde} space-y-3`}>
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            🛏️ Hab. {limpieza.habitacion?.numero || "—"}
          </h3>
          <p className="text-slate-400 text-xs">
            {limpieza.habitacion?.piso?.nombre} · {limpieza.habitacion?.tipo?.nombre}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
            limpieza.estado === "PENDIENTE"
              ? esUrgente ? "bg-red-900 text-red-200" : "bg-yellow-900 text-yellow-200"
              : limpieza.estado === "EN_PROCESO"
              ? "bg-blue-900 text-blue-200"
              : "bg-green-900 text-green-200"
          }`}>
            {limpieza.estado === "PENDIENTE" ? "PENDIENTE" :
             limpieza.estado === "EN_PROCESO" ? "EN PROCESO" :
             "COMPLETADA"}
          </span>
          {limpieza.tipo === "PROFUNDA" && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-semibold">
              PROFUNDA
            </span>
          )}
        </div>
      </div>

      {/* Tiempo */}
      <div className="bg-slate-900 p-2 rounded text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={12} />
          {limpieza.estado === "PENDIENTE" && (
            <span className={esUrgente ? "text-red-300 font-semibold" : "text-slate-300"}>
              Solicitada {tiempoRelativo(limpieza.fecha_solicitud)}
            </span>
          )}
          {limpieza.estado === "EN_PROCESO" && (
            <span className="text-blue-300">
              Iniciada {tiempoRelativo(limpieza.fecha_inicio)}
            </span>
          )}
          {limpieza.estado === "COMPLETADA" && (
            <span className="text-green-300">
              Completada {tiempoRelativo(limpieza.fecha_fin)}
            </span>
          )}
        </div>

        {limpieza.usuario_asignado && (
          <div className="flex items-center gap-1 text-slate-400 mt-1">
            <User size={12} />
            <span>
              {limpieza.usuario_asignado.nombre} {limpieza.usuario_asignado.apellido}
              {limpieza.usuario_asignado.rol && (
                <span className="text-slate-500 ml-1">
                  ({limpieza.usuario_asignado.rol.nombre})
                </span>
              )}
            </span>
          </div>
        )}

        {limpieza.observaciones && (
          <p className="text-slate-500 mt-1 italic">
            "{limpieza.observaciones}"
          </p>
        )}
      </div>

      {/* Alerta urgente */}
      {esUrgente && puedeOperar && (
        <div className="bg-red-900/40 border border-red-700 p-2 rounded flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-300" />
          <p className="text-red-200 text-xs">
            Lleva {minDesdeSolicitud} min sin atender
          </p>
        </div>
      )}

      {/* Botones */}
      {puedeOperar && (
        <>
          {limpieza.estado === "PENDIENTE" && onIniciar && (
            <button
              onClick={() => onIniciar(limpieza.id_limpieza)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2"
            >
              <Play size={16} /> Iniciar Limpieza
            </button>
          )}

          {limpieza.estado === "EN_PROCESO" && onFinalizar && (
            <button
              onClick={() => onFinalizar(limpieza.id_limpieza)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2"
            >
              <Check size={16} /> Finalizar Limpieza
            </button>
          )}
        </>
      )}

      {!puedeOperar && limpieza.estado !== "COMPLETADA" && (
        <div className="bg-slate-900/60 p-2 rounded text-center text-slate-500 text-xs">
          Solo admin, encargado o personal de limpieza pueden operar
        </div>
      )}
    </div>
  )
}