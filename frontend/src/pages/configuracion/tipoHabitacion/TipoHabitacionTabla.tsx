import type { TipoHabitacion } from '@/types/configuracion'

interface Props {
  items: TipoHabitacion[]
  onEditar: (item: TipoHabitacion) => void
  onCambiarEstado: (item: TipoHabitacion) => void
  onEliminar: (item: TipoHabitacion) => void
}

export function TipoHabitacionTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <table className="w-full bg-slate-800 rounded">
      <thead className="bg-slate-700 text-slate-300">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Cap.</th>
          <th className="p-2 text-left">Camas</th>
          <th className="p-2 text-left">Jacuzzi</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id_tipo} className="border-t border-slate-700 text-slate-200">
            <td className="p-2">{item.id_tipo}</td>
            <td className="p-2">{item.nombre}</td>
            <td className="p-2">{item.capacidad}</td>
            <td className="p-2">{item.camas}</td>
            <td className="p-2">{item.tiene_jacuzzi ? 'Sí' : 'No'}</td>
            <td className="p-2">
              <span className={item.activo ? 'text-green-400' : 'text-red-400'}>{item.activo ? 'Activo' : 'Inactivo'}</span>
            </td>
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