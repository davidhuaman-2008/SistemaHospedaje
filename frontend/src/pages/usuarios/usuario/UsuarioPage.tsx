import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import Sidebar from "@/components/layout/Sidebar"
import ConfirmDialog from "@/components/ConfirmDialog"
import { usuarioService } from "@/services/usuarioService"
import { rolService } from "@/services/rolService"
import { turnoService } from "@/services/turnoService"
import type { Usuario, Rol, Turno } from "@/types"
import UsuarioTabla from "./UsuarioTabla"
import UsuarioForm from "./UsuarioForm"

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      const [u, r, t] = await Promise.all([
        usuarioService.listar(),
        rolService.listar(),
        turnoService.listar(),
      ])
      setUsuarios(u)
      setRoles(r)
      setTurnos(t)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const [u, r, t] = await Promise.all([
          usuarioService.listar(),
          rolService.listar(),
          turnoService.listar(),
        ])
        if (!cancelado) {
          setUsuarios(u)
          setRoles(r)
          setTurnos(t)
        }
      } catch (error) {
        console.error(error)
      }
    }
    void cargar()
    return () => { cancelado = true }
  }, [])

  const abrirCrear = () => {
    setUsuarioEditando(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setUsuarioEditando(null)
  }

  const cambiarEstado = async (usuario: Usuario) => {
    try {
      await usuarioService.actualizar(usuario.id, { activo: !usuario.activo })
      toast.success(usuario.activo ? "Usuario desactivado" : "Usuario activado")
      await cargarDatos()
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar estado")
    }
  }

  const confirmarEliminar = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario)
  }

  const ejecutarEliminar = async () => {
    if (!usuarioAEliminar) return
    try {
      await usuarioService.eliminar(usuarioAEliminar.id)
      toast.success("Usuario eliminado correctamente")
      setUsuarioAEliminar(null)
      await cargarDatos()
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el usuario")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Usuarios</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Nuevo Usuario
          </button>
        </div>

        {mostrarFormulario && (
          <UsuarioForm
            usuario={usuarioEditando}
            roles={roles}
            turnos={turnos}
            onGuardado={async () => { cerrarFormulario(); await cargarDatos() }}
            onCancelar={cerrarFormulario}
          />
        )}

        <UsuarioTabla
          usuarios={usuarios}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={confirmarEliminar}
        />

        <ConfirmDialog
          abierto={usuarioAEliminar !== null}
          titulo="Eliminar usuario"
          descripcion={
            usuarioAEliminar
              ? `Ã‚Â¿EstÃƒÂ¡s seguro de eliminar a "${usuarioAEliminar.nombre} ${usuarioAEliminar.apellido}"? Esta acciÃƒÂ³n no se puede deshacer.`
              : ""
          }
          onConfirmar={ejecutarEliminar}
          onCancelar={() => setUsuarioAEliminar(null)}
        />
      </main>
    </div>
  )
}