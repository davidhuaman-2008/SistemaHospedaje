import type { Rol } from "@/types"

interface Props {
  roles: Rol[]
  onEditar: (rol: Rol) => void
  onEliminar: (rol: Rol) => void
}

export default function RolTabla({ roles, onEditar, onEliminar }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">DescripciÃƒÂ³n</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id} className="border-t border-slate-800">
              <td className="p-3">{rol.id}</td>
              <td className="p-3">{rol.nombre}</td>
              <td className="p-3">{rol.descripcion}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEditar(rol)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(rol)}
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