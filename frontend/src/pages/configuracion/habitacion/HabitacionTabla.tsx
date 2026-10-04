import type { Habitacion } from "@/types/habitacion"

interface Props {
  items: Habitacion[]
  onEditar: (item: Habitacion) => void
  onCambiarEstado: (item: Habitacion) => void
  onEliminar: (item: Habitacion) => void
}

export function HabitacionTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[900px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Número</th>
            <th className="p-2 text-left">Piso</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Capacidad</th>
            <th className="p-2 text-left">Camas</th>
            <th className="p-2 text-left">Jacuzzi</th>
            <th className="p-2 text-left">Orden</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_habitacion} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_habitacion}</td>
              <td className="p-2 font-mono font-semibold">{item.numero}</td>
              <td className="p-2">{item.piso?.nombre ?? "—"}</td>
              <td className="p-2">
                {item.tipo ? (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-200">
                    {item.tipo.nombre}
                  </span>
                ) : "—"}
              </td>
              <td className="p-2 text-center">{item.tipo?.capacidad ?? "—"}</td>
              <td className="p-2 text-center">{item.tipo?.camas ?? "—"}</td>
              <td className="p-2 text-center">
                {item.tipo?.tiene_jacuzzi ? "✅" : "—"}
              </td>
              <td className="p-2 text-center">{item.orden}</td>
              <td className="p-2">
                <span className={item.activo ? "text-green-400" : "text-red-400"}>
                  {item.activo ? "Activa" : "Inactiva"}
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