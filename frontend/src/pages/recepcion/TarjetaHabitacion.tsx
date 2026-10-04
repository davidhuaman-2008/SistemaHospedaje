import type { HabitacionMapa } from "@/types/reserva"

interface Props {
  habitacion: HabitacionMapa
  onClick: () => void
}

function formatearTiempo(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function TarjetaHabitacion({ habitacion, onClick }: Props) {
  const {
    numero, estado, color, cliente, tipo_nombre,
    minutos_transcurridos, minutos_totales, minutos_extra, horas_base,
  } = habitacion

  const esOcupada = estado === "Ocupada" || estado === "Por vencer" || estado === "Vencida"
  const esVencida = estado === "Vencida"
  const esPorVencer = estado === "Por vencer"

  const textoEncabezado = cliente
    ? `Ocupado: ${numero}`
    : estado

  const progreso = minutos_totales && minutos_transcurridos !== null
    ? Math.min(100, (minutos_transcurridos / minutos_totales) * 100)
    : 0

  return (
    <button
      onClick={onClick}
      className={`rounded-lg overflow-hidden text-left transition hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${
        esVencida ? "ring-2 ring-red-500" : ""
      }`}
      style={{ background: color }}
    >
      <div className="px-3 py-2 text-white text-xs font-semibold flex items-center justify-between">
        <span>{textoEncabezado}</span>
        {esVencida && minutos_extra !== null && minutos_extra > 0 && (
          <span className="bg-red-900/60 px-1.5 py-0.5 rounded text-[10px] font-bold">
            +{formatearTiempo(minutos_extra)}
          </span>
        )}
      </div>

      <div className="bg-black/20 px-3 py-2">
        {esOcupada && minutos_transcurridos !== null && minutos_totales !== null ? (
          <>
            <p className="text-white text-xs font-medium truncate" title={cliente ?? ""}>
              {cliente}
            </p>

            <p className="text-white/90 text-[11px] mt-1 flex items-center gap-1">
              <span>⏱️</span>
              <span className="font-semibold">
                {formatearTiempo(minutos_transcurridos)} / {horas_base}h
              </span>
            </p>

            <div className="w-full h-1 bg-black/30 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full ${esVencida ? "bg-red-300" : esPorVencer ? "bg-yellow-300" : "bg-white/60"}`}
                style={{ width: `${progreso}%` }}
              />
            </div>

            {esPorVencer && habitacion.minutos_restantes !== null && (
              <p className="text-yellow-100 text-[10px] mt-1 font-semibold">
                ⚠️ Quedan {formatearTiempo(habitacion.minutos_restantes)}
              </p>
            )}
            {esVencida && minutos_extra !== null && minutos_extra > 0 && (
              <p className="text-red-100 text-[10px] mt-1 font-semibold">
                🔴 Excedido {formatearTiempo(minutos_extra)}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-white text-lg font-bold flex items-center justify-center gap-1">
              🛏️ {numero}
            </p>
            <p className="text-white/70 text-[10px] mt-1 text-center uppercase tracking-wide">
              {tipo_nombre}
            </p>
          </>
        )}
      </div>
    </button>
  )
}