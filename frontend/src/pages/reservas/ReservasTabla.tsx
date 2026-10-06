import { Link } from "react-router-dom"
import type { Reserva } from "@/types/reserva"

interface Props {
  items: Reserva[]
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—"
  const d = new Date(fecha)
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ReservasTabla({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded text-center text-slate-400">
        No hay reservas registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[800px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Cliente</th>
            <th className="p-2 text-left">Habitación</th>
            <th className="p-2 text-left">Entrada</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id_reserva} className="border-t border-slate-700 text-slate-200">
              <td className="p-2 font-mono text-xs">{r.codigo_reserva}</td>
              <td className="p-2">
                {r.cliente?.nombre} {r.cliente?.apellido}
              </td>
              <td className="p-2">
                {r.habitacion?.numero ?? "—"}
              </td>
              <td className="p-2 text-sm">{formatearFecha(r.fecha_entrada)}</td>
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
              <td className="p-2">S/ {Number(r.total).toFixed(2)}</td>
              <td className="p-2">
                <Link
                  to={`/reservas/${r.id_reserva}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}