import type { Cliente } from '@/types/cliente'

interface Props {
  items: Cliente[]
  onEditar: (item: Cliente) => void
  onCambiarEstado: (item: Cliente) => void
  onEliminar: (item: Cliente) => void
  onVerHistorial: (item: Cliente) => void
  onRegistrarVisita: (item: Cliente) => void
  onAgregarObservacion: (item: Cliente) => void
}

function formatearFecha(valor: string | null | undefined): string {
  if (!valor) return '—'
  const soloFecha = valor.substring(0, 10)
  const [y, m, d] = soloFecha.split('-')
  if (!y || !m || !d) return '—'
  return `${d}/${m}/${y}`
}

export function ClienteTabla({
  items,
  onEditar,
  onCambiarEstado,
  onEliminar,
  onVerHistorial,
  onRegistrarVisita,
  onAgregarObservacion,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-800 rounded min-w-[1000px]">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Documento</th>
            <th className="p-2 text-left">Celular</th>
            <th className="p-2 text-left">F. Nac.</th>
            <th className="p-2 text-left">Visitas</th>
            <th className="p-2 text-left">Nivel</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Obs.</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const obsCount = item.observaciones_pendientes_count ?? 0
            const tieneObs = obsCount > 0
            return (
              <tr
                key={item.id_cliente}
                className={`border-t border-slate-700 text-slate-200 ${
                  tieneObs ? 'bg-red-950/30' : ''
                }`}
              >
                <td className="p-2">{item.id_cliente}</td>
                <td className="p-2">
                  {tieneObs && <span className="text-red-400 mr-1">⚠️</span>}
                  {item.nombre} {item.apellido ?? ''}
                </td>
                <td className="p-2">{item.numero_documento ?? '—'}</td>
                <td className="p-2">{item.celular ?? '—'}</td>
                <td className="p-2">{formatearFecha(item.fecha_nacimiento)}</td>
                <td className="p-2 font-semibold text-cyan-300">{item.visitas}</td>
                <td className="p-2">
                  {item.nivel ? (
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: item.nivel.color ?? '#333', color: '#fff' }}>
                      {item.nivel.nombre}
                    </span>
                  ) : '—'}
                </td>
                <td className="p-2">
                  <span className={item.activo ? 'text-green-400' : 'text-red-400'}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-2">
                  {tieneObs ? (
                    <span className="bg-red-800 text-red-200 text-xs px-2 py-0.5 rounded font-bold">
                      {obsCount}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => onEditar(item)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">Editar</button>
                    <button onClick={() => onRegistrarVisita(item)} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs" title="Registrar visita manual">+ Visita</button>
                    <button onClick={() => onVerHistorial(item)} className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs">Historial</button>
                    <button
                      onClick={() => onAgregarObservacion(item)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                      title="Agregar observación"
                    >
                      ⚠️ Obs
                    </button>
                    <button onClick={() => onCambiarEstado(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">{item.activo ? 'Desactivar' : 'Activar'}</button>
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