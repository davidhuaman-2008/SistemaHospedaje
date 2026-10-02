import type { CategoriaMovimiento } from '@/types/configuracion'

interface Props {
  items: CategoriaMovimiento[]
  onEditar: (item: CategoriaMovimiento) => void
  onCambiarEstado: (item: CategoriaMovimiento) => void
  onEliminar: (item: CategoriaMovimiento) => void
}

export function CategoriaMovimientoTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <table className="w-full bg-slate-800 rounded">
      <thead className="bg-slate-700 text-slate-300">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Tipo</th>
          <th className="p-2 text-left">Orden</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id_categoria} className="border-t border-slate-700 text-slate-200">
            <td className="p-2">{item.id_categoria}</td>
            <td className="p-2">{item.nombre}</td>
            <td className="p-2">
              <span className={item.tipo === 'Ingreso' ? 'bg-green-900 text-green-300 px-2 py-1 rounded text-xs' : 'bg-red-900 text-red-300 px-2 py-1 rounded text-xs'}>
                {item.tipo}
              </span>
            </td>
            <td className="p-2">{item.orden}</td>
            <td className="p-2"><span className={item.activo ? 'text-green-400' : 'text-red-400'}>{item.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td className="p-2 flex gap-1">
              <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
              <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">{item.activo ? 'Desactivar' : 'Activar'}</button>
              <button onClick={() => onEliminar(item)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}