import type { Producto } from "@/types/producto"

interface Props {
  items: Producto[]
  onEditar: (item: Producto) => void
  onCambiarEstado: (item: Producto) => void
  onEliminar: (item: Producto) => void
}

export function ProductoTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[1000px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">P. Compra</th>
            <th className="p-2 text-left">P. Venta</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Mín.</th>
            <th className="p-2 text-left">Unidad</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const stockBajo = item.stock_actual <= item.stock_minimo
            return (
              <tr key={item.id_producto} className="border-t border-slate-700 text-slate-200">
                <td className="p-2">{item.id_producto}</td>
                <td className="p-2">{item.nombre}</td>
                <td className="p-2">
                  {item.categoria ? (
                    <span className="px-2 py-1 rounded text-xs" style={{ background: item.categoria.color ?? "#333", color: "#fff" }}>
                      {item.categoria.nombre}
                    </span>
                  ) : "—"}
                </td>
                <td className="p-2">S/ {Number(item.precio_compra).toFixed(2)}</td>
                <td className="p-2">S/ {Number(item.precio_venta).toFixed(2)}</td>
                <td className={`p-2 font-semibold ${stockBajo ? "text-red-400" : "text-green-400"}`}>
                  {item.stock_actual}
                </td>
                <td className="p-2">{item.stock_minimo}</td>
                <td className="p-2">{item.unidad_medida ?? "—"}</td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}