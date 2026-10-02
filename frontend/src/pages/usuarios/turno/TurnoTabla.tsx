import type { Turno } from "@/types"

interface Props {
  turnos: Turno[]
  onEditar: (turno: Turno) => void
  onCambiarEstado: (turno: Turno) => void
  onEliminar: (turno: Turno) => void
}

export default function TurnoTabla({ turnos, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <table className="w-full">
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
          {turnos.map((turno) => (
            <tr key={turno.id} className="border-t border-slate-800">
              <td className="p-3">{turno.id}</td>
              <td className="p-3">{turno.nombre}</td>
              <td className="p-3">{turno.hora_inicio}</td>
              <td className="p-3">{turno.hora_fin}</td>
              <td className="p-3">{turno.activo ? "Ã¢Å“â€¦ Activo" : "Ã¢ÂÅ’ Inactivo"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEditar(turno)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onCambiarEstado(turno)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  {turno.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => onEliminar(turno)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}