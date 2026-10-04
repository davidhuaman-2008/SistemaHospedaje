import type { Rol } from "@/types"

interface Props {
  roles: Rol[]
  onEditar: (rol: Rol) => void
  onCambiarEstado: (rol: Rol) => void
  onEliminar: (rol: Rol) => void
}

export default function RolTabla({ roles, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-900 rounded-xl overflow-hidden min-w-[600px]">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Descripcion</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => {
            const activo = (rol as { activo?: boolean }).activo ?? true
            return (
              <tr key={rol.id} className="border-t border-slate-800">
                <td className="p-3">{rol.id}</td>
                <td className="p-3">{rol.nombre}</td>
                <td className="p-3">{rol.descripcion ?? "—"}</td>
                <td className="p-3">
                  <span className={activo ? "text-green-400" : "text-red-400"}>
                    {activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onEditar(rol)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">Editar</button>
                    <button onClick={() => onCambiarEstado(rol)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                      {activo ? "Desactivar" : "Activar"}
                    </button>
                    <button onClick={() => onEliminar(rol)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Eliminar</button>
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