import type { Usuario } from "@/types"

interface Props {
  usuarios: Usuario[]
  onEditar: (usuario: Usuario) => void
  onCambiarEstado: (usuario: Usuario) => void
  onEliminar: (usuario: Usuario) => void
}

export default function UsuarioTabla({ usuarios, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-slate-900 rounded-xl overflow-hidden min-w-[800px]">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Usuario</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-left">Turno</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const activo = (usuario as { activo?: boolean }).activo ?? true
            return (
              <tr key={usuario.id} className="border-t border-slate-800">
                <td className="p-3">{usuario.id}</td>
                <td className="p-3">{usuario.nombre} {usuario.apellido}</td>
                <td className="p-3">{usuario.nombre_usuario}</td>
                <td className="p-3">{usuario.rol?.nombre ?? "—"}</td>
                <td className="p-3">{usuario.turno?.nombre ?? "—"}</td>
                <td className="p-3">
                  <span className={activo ? "text-green-400" : "text-red-400"}>
                    {activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onEditar(usuario)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">Editar</button>
                    <button onClick={() => onCambiarEstado(usuario)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                      {activo ? "Desactivar" : "Activar"}
                    </button>
                    <button onClick={() => onEliminar(usuario)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Eliminar</button>
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