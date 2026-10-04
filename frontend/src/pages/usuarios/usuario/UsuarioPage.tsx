import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { usuarioService } from "@/services/usuarioService"
import { rolService } from "@/services/rolService"
import { turnoService } from "@/services/turnoService"
import { mensajeDeError } from "@/lib/errores"
import type { Usuario, Rol, Turno } from "@/types"
import UsuarioForm from "./UsuarioForm"
import UsuarioTabla from "./UsuarioTabla"

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)

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
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const recargar = async () => {
    try {
      const [u, r, t] = await Promise.all([
        usuarioService.listar(),
        rolService.listar(),
        turnoService.listar(),
      ])
      setUsuarios(u); setRoles(r); setTurnos(t)
    } catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarFormulario(true) }
  const abrirEditar = (usuario: Usuario) => { setEditando(usuario); setMostrarFormulario(true) }
  const cerrarFormulario = () => { setMostrarFormulario(false); setEditando(null) }

  const onGuardado = () => { cerrarFormulario(); recargar() }

  const onCambiarEstado = async (usuario: Usuario) => {
    try {
      const activo = usuario.activo ?? true
      if (activo) {
        await usuarioService.desactivar(usuario.id)
        toast.success("Desactivado")
      } else {
        await usuarioService.reactivar(usuario.id)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const onEliminar = async (usuario: Usuario) => {
    if (!confirm(`Eliminar "${usuario.nombre}"?`)) return
    try {
      await usuarioService.eliminar(usuario.id)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Usuarios</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Usuario
        </button>
      </div>

      {mostrarFormulario && (
        <UsuarioForm
          usuario={editando}
          roles={roles}
          turnos={turnos}
          onGuardado={onGuardado}
          onCancelar={cerrarFormulario}
        />
      )}

      <UsuarioTabla
        usuarios={usuarios}
        onEditar={abrirEditar}
        onCambiarEstado={onCambiarEstado}
        onEliminar={onEliminar}
      />
    </AppLayout>
  )
}