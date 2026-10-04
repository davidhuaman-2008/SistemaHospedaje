import type { PromocionCliente } from "@/types/promocion"

interface Props {
  items: PromocionCliente[]
  onMarcarUsado: (item: PromocionCliente) => void
  onEliminar: (item: PromocionCliente) => void
}

export function PromocionClienteTabla({ items, onMarcarUsado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[800px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Promoción</th>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Vencimiento</th>
            <th className="p-2 text-left">Usado</th>
            <th className="p-2 text-left">Fecha uso</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_promo_cliente} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_promo_cliente}</td>
              <td className="p-2">{item.promocion?.nombre ?? "—"}</td>
              <td className="p-2 font-mono text-xs">{item.codigo_personalizado ?? "—"}</td>
              <td className="p-2 text-xs">{item.fecha_vencimiento ?? "—"}</td>
              <td className="p-2">
                <span className={item.usado ? "text-red-400" : "text-green-400"}>
                  {item.usado ? "Usado" : "Disponible"}
                </span>
              </td>
              <td className="p-2 text-xs">{item.fecha_uso ?? "—"}</td>
              <td className="p-2">
                <div className="flex flex-wrap gap-1">
                  {!item.usado && (
                    <button onClick={() => onMarcarUsado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">Marcar usado</button>
                  )}
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