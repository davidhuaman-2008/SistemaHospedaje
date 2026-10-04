import type { ClienteNivel } from '@/types/configuracion'
import { IconoDinamico } from '@/components/IconoDinamico'

interface Props {
  items: ClienteNivel[]
  onEditar: (item: ClienteNivel) => void
  onCambiarEstado: (item: ClienteNivel) => void
  onEliminar: (item: ClienteNivel) => void
}

export function ClienteNivelTabla({ items, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[800px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Visitas</th>
            <th className="p-2 text-left">Descuento</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2 text-left">Ícono</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id_nivel} className="border-t border-slate-700 text-slate-200">
              <td className="p-2">{item.id_nivel}</td>
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">{item.visitas_min} - {item.visitas_max ?? '∞'}</td>
              <td className="p-2">{item.descuento}%</td>
              <td className="p-2">
                {item.color && <span className="inline-block w-4 h-4 rounded" style={{ background: item.color }} />}
              </td>
              <td className="p-2">
                <IconoDinamico
                  nombre={item.icono}
                  size={20}
                  style={{ color: item.color ?? undefined }}
                />
              </td>
              <td className="p-2"><span className={item.activo ? 'text-green-400' : 'text-red-400'}>{item.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td className="p-2">
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
                  <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">{item.activo ? 'Desactivar' : 'Activar'}</button>
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