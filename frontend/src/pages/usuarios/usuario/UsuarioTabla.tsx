import type { Usuario } from "@/types"

interface Props {
  usuarios: Usuario[]
  onEditar: (usuario: Usuario) => void
  onCambiarEstado: (usuario: Usuario) => void
  onEliminar: (usuario: Usuario) => void
}

export default function UsuarioTabla({ usuarios, onEditar, onCambiarEstado, onEliminar }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <table className="w-full">
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
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t border-slate-800">
              <td className="p-3">{usuario.id}</td>
              <td className="p-3">{usuario.nombre} {usuario.apellido}</td>
              <td className="p-3">{usuario.nombre_usuario}</td>
              <td className="p-3">{usuario.rol?.nombre}</td>
              <td className="p-3">{usuario.turno?.nombre}</td>
              <td className="p-3">{usuario.activo ? "Ã¢Å“â€¦ Activo" : "Ã¢ÂÅ’ Inactivo"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEditar(usuario)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onCambiarEstado(usuario)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  {usuario.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => onEliminar(usuario)}
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