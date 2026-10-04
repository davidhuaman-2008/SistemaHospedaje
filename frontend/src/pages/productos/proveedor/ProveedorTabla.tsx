import type { Proveedor } from "@/types/producto"

interface Props {
  items: Proveedor[]
  onEditar: (item: Proveedor) => void
  onCambiarEstado: (item: Proveedor) => void
  onEliminar: (item: Proveedor) => void
}

export function ProveedorTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[900px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Razón Social</th>
            <th className="p-2 text-left">RUC</th>
            <th className="p-2 text-left">Contacto</th>
            <th className="p-2 text-left">Teléfono</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_proveedor} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_proveedor}</td>
              <td className="p-2">{item.razon_social}</td>
              <td className="p-2">{item.ruc ?? "—"}</td>
              <td className="p-2">{item.contacto ?? "—"}</td>
              <td className="p-2">{item.telefono ?? "—"}</td>
              <td className="p-2">{item.tipo ?? "—"}</td>
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