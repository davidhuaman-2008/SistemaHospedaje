import { Link } from "react-router-dom"
import type { Reserva } from "@/types/reserva"

interface Props {
  items: Reserva[]
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatearTiempo(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function EstadiasTabla({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded text-center text-slate-400">
        No hay estadías registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[900px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Cliente</th>
            <th className="p-2 text-left">Habitación</th>
            <th className="p-2 text-left">Entrada</th>
            <th className="p-2 text-left">Salida real</th>
            <th className="p-2 text-left">Horas</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => {
            const horasReales = r.registro_estadia?.horas_reales
            const minutosReales = horasReales != null ? horasReales * 60 : null

            return (
              <tr key={r.id_reserva} className="border-t border-slate-700 text-slate-200">
                <td className="p-2 font-mono text-xs">{r.codigo_reserva}</td>
                <td className="p-2">
                  {r.cliente?.nombre} {r.cliente?.apellido}
                </td>
                <td className="p-2">{r.habitacion?.numero ?? "—"}</td>
                <td className="p-2 text-sm">{formatearFecha(r.fecha_entrada)}</td>
                <td className="p-2 text-sm">
                  {r.fecha_salida_real ? formatearFecha(r.fecha_salida_real) : "—"}
                </td>
                <td className="p-2 text-sm">
                  {minutosReales != null ? formatearTiempo(minutosReales) : `${r.horas_totales}h`}
                </td>
                <td className="p-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: (r.estado?.color ?? "#64748b") + "30",
                      color: r.estado?.color ?? "#94a3b8",
                    }}
                  >
                    {r.estado?.nombre ?? "—"}
                  </span>
                </td>
                <td className="p-2">
                  <span className="text-white font-semibold">
                    S/ {Number(r.total).toFixed(2)}
                  </span>
                  <span className="text-green-400 text-xs ml-2">
                    (pag. S/ {Number(r.pagado).toFixed(2)})
                  </span>
                </td>
                <td className="p-2">
                  <Link
                    to={`/reservas/${r.id_reserva}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}