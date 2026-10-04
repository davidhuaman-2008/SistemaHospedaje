import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { rolService } from "@/services/rolService"
import { mensajeDeError } from "@/lib/errores"
import type { Rol } from "@/types"
import RolForm from "./RolForm"
import RolTabla from "./RolTabla"

export default function RolPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState<Rol | null>(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const datos = await rolService.listar()
        if (!cancelado) setRoles(datos)
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const recargar = async () => {
    try { setRoles(await rolService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarFormulario(true) }
  const abrirEditar = (rol: Rol) => { setEditando(rol); setMostrarFormulario(true) }
  const cerrarFormulario = () => { setMostrarFormulario(false); setEditando(null) }

  const onGuardado = () => { cerrarFormulario(); recargar() }

  const onCambiarEstado = async (rol: Rol) => {
    try {
      if (rol.activo) {
        await rolService.desactivar(rol.id)
        toast.success("Desactivado")
      } else {
        await rolService.reactivar(rol.id)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const onEliminar = async (rol: Rol) => {
    if (!confirm(`Eliminar "${rol.nombre}"?`)) return
    try {
      await rolService.eliminar(rol.id)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Roles</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Rol
        </button>
      </div>

      {mostrarFormulario && (
        <RolForm
          rol={editando}
          onGuardado={onGuardado}
          onCancelar={cerrarFormulario}
        />
      )}

      <RolTabla
        roles={roles}
        onEditar={abrirEditar}
        onCambiarEstado={onCambiarEstado}
        onEliminar={onEliminar}
      />
    </AppLayout>
  )
}