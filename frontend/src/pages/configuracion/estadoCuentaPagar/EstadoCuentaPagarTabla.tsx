import type { EstadoCuentaPagar } from "@/types/cuentaPagar"
import { IconoDinamico } from "@/components/IconoDinamico"

interface Props {
  items: EstadoCuentaPagar[]
  onEditar: (item: EstadoCuentaPagar) => void
  onCambiarEstado: (item: EstadoCuentaPagar) => void
  onEliminar: (item: EstadoCuentaPagar) => void
}

export function EstadoCuentaPagarTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-175">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2 text-left">Ícono</th>
            <th className="p-2 text-left">Final</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_estado_cuenta} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_estado_cuenta}</td>
              <td className="p-2 font-medium">{item.nombre}</td>
              <td className="p-2 text-slate-400 text-xs">{item.slug}</td>
              <td className="p-2">
                {item.color && (
                  <span className="inline-block w-6 h-6 rounded" style={{ background: item.color }} />
                )}
              </td>
              <td className="p-2">
                {item.icono && <IconoDinamico nombre={item.icono} size={20} style={{ color: item.color || "#fff" }} />}
              </td>
              <td className="p-2">
                {item.es_estado_final ? (
                  <span className="text-yellow-400 text-xs">SÍ</span>
                ) : (
                  <span className="text-slate-500 text-xs">No</span>
                )}
              </td>
              <td className="p-2">
                <span className={item.activo ? "text-green-400" : "text-red-400"}>
                  {item.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
                  <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
                    {item.activo ? "Desactivar" : "Reactivar"}
                  </button>
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