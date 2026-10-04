import type { Turno } from "@/types"

interface Props {
  turnos: Turno[]
  onEditar: (turno: Turno) => void
  onCambiarEstado: (turno: Turno) => void
  onEliminar: (turno: Turno) => void
}

export default function TurnoTabla({ turnos, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-900 rounded-xl overflow-hidden min-w-[700px]">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Hora Inicio</th>
            <th className="p-3 text-left">Hora Fin</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => {
            const activo = (turno as { activo?: boolean }).activo ?? true
            return (
              <tr key={turno.id} className="border-t border-slate-800">
                <td className="p-3">{turno.id}</td>
                <td className="p-3">{turno.nombre}</td>
                <td className="p-3">{turno.hora_inicio}</td>
                <td className="p-3">{turno.hora_fin}</td>
                <td className="p-3">
                  <span className={activo ? "text-green-400" : "text-red-400"}>
                    {activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onEditar(turno)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">Editar</button>
                    <button onClick={() => onCambiarEstado(turno)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                      {activo ? "Desactivar" : "Activar"}
                    </button>
                    <button onClick={() => onEliminar(turno)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Eliminar</button>
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