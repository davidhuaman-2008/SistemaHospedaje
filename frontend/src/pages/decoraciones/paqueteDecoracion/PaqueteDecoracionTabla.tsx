import type { PaqueteDecoracion } from "@/types/paqueteDecoracion"

interface Props {
  items: PaqueteDecoracion[]
  onEditar: (item: PaqueteDecoracion) => void
  onCambiarEstado: (item: PaqueteDecoracion) => void
  onEliminar: (item: PaqueteDecoracion) => void
}

function money(v: number): string {
  return `S/ ${Number(v).toFixed(2)}`
}

export function PaqueteDecoracionTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[1100px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Tipo Habitación</th>
            <th className="p-2 text-left">Precio</th>
            <th className="p-2 text-left">Local</th>
            <th className="p-2 text-left">Proveedor</th>
            <th className="p-2 text-left">Horas</th>
            <th className="p-2 text-left">Incluye</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_paquete} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_paquete}</td>
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">
                {item.tipo_habitacion ? (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-200">
                    {item.tipo_habitacion.nombre}
                  </span>
                ) : "—"}
              </td>
              <td className="p-2 font-semibold text-cyan-300">{money(item.precio_total)}</td>
              <td className="p-2 text-green-300">{money(item.ganancia_local)}</td>
              <td className="p-2 text-yellow-300">{money(item.ganancia_proveedor)}</td>
              <td className="p-2 text-center">{item.horas_incluidas}h</td>
              <td className="p-2">
                <div className="flex flex-wrap gap-1">
                  {item.incluye_jacuzzi && <span title="Jacuzzi" className="text-xs">🛁</span>}
                  {item.incluye_vino && <span title="Vino" className="text-xs">🍷</span>}
                  {item.incluye_decoracion && <span title="Decoración" className="text-xs">🎨</span>}
                  {item.incluye_sexshop && <span title="Sex shop" className="text-xs">💝</span>}
                  {item.incluye_netflix && <span title="Netflix" className="text-xs">📺</span>}
                </div>
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