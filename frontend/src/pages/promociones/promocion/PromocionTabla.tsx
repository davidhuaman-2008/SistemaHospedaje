import type { Promocion } from "@/types/promocion"

interface Props {
  items: Promocion[]
  onEditar: (item: Promocion) => void
  onCambiarEstado: (item: Promocion) => void
  onEliminar: (item: Promocion) => void
}

function formatearTipo(tipo: string, valor: number): string {
  if (tipo === "PORCENTAJE") return `${valor}%`
  if (tipo === "MONTO_FIJO") return `S/ ${Number(valor).toFixed(2)}`
  if (tipo === "NOCHE_GRATIS") return "Noche gratis"
  return `S/ ${Number(valor).toFixed(2)}`
}

/**
 * Convierte "2026-10-03T05:00:00.000000Z" a "03/10/2026"
 */
function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—"
  const soloFecha = fecha.substring(0, 10) // "2026-10-03"
  const [anio, mes, dia] = soloFecha.split("-")
  return `${dia}/${mes}/${anio}`
}

export function PromocionTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[900px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">Valor</th>
            <th className="p-2 text-left">Vigencia</th>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Usos</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_promocion} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_promocion}</td>
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">
                {item.categoria ? (
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      background: item.categoria.color ? `${item.categoria.color}22` : "#334155",
                      color: item.categoria.color ?? "#e2e8f0",
                      border: `1px solid ${item.categoria.color ?? "#475569"}`,
                    }}
                  >
                    {item.categoria.nombre}
                  </span>
                ) : "—"}
              </td>
              <td className="p-2 font-semibold text-cyan-300">{formatearTipo(item.tipo, item.valor)}</td>
              <td className="p-2 text-xs">
                {item.fecha_inicio || item.fecha_fin
                  ? `${formatearFecha(item.fecha_inicio)} → ${formatearFecha(item.fecha_fin)}`
                  : "Sin fecha"}
              </td>
              <td className="p-2 font-mono text-xs">{item.codigo ?? "—"}</td>
              <td className="p-2 text-xs">
                {item.limite_uso ? `${item.usos_actuales}/${item.limite_uso}` : "Ilimitados"}
              </td>
              <td className="p-2">
                <span className={item.activo ? "text-green-400" : "text-red-400"}>
                  {item.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="p-2">
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
                  <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">{item.activo ? "Desactivar" : "Activar"}</button>
                  <button onClick={() => onEliminar(item)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}