import type { Tarifa } from '@/types/tarifa'

interface Props {
  items: Tarifa[]
  onEditar: (item: Tarifa) => void
  onCambiarEstado: (item: Tarifa) => void
  onEliminar: (item: Tarifa) => void
}

export function TarifaTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <table className="w-full bg-slate-800 rounded">
      <thead className="bg-slate-700 text-slate-300">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Tipo</th>
          <th className="p-2 text-left">Horas</th>
          <th className="p-2 text-left">Monto</th>
          <th className="p-2 text-left">Hora Extra</th>
          <th className="p-2 text-left">Máx. Extra</th>
          <th className="p-2 text-left">Turno Adic.</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id_tarifa} className="border-t border-slate-700 text-slate-200">
            <td className="p-2">{item.id_tarifa}</td>
            <td className="p-2">{item.tipo?.nombre ?? `Tipo ${item.id_tipo}`}</td>
            <td className="p-2">{item.horas}h</td>
            <td className="p-2">S/ {Number(item.monto).toFixed(2)}</td>
            <td className="p-2">S/ {Number(item.precio_hora_extra).toFixed(2)}</td>
            <td className="p-2">{item.max_horas_extra}</td>
            <td className="p-2">S/ {Number(item.precio_turno_adicional).toFixed(2)}</td>
            <td className="p-2">
              <span className={item.activo ? 'text-green-400' : 'text-red-400'}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td className="p-2 flex gap-1">
              <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
              <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
                {item.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => onEliminar(item)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}