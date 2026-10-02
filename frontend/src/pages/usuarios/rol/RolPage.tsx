import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import Sidebar from "@/components/layout/Sidebar"
import ConfirmDialog from "@/components/ConfirmDialog"
import { rolService } from "@/services/rolService"
import type { Rol } from "@/types"
import RolTabla from "./RolTabla"
import RolForm from "./RolForm"

export default function RolPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [rolEditando, setRolEditando] = useState<Rol | null>(null)
  const [rolAEliminar, setRolAEliminar] = useState<Rol | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      const data = await rolService.listar()
      setRoles(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const data = await rolService.listar()
        if (!cancelado) setRoles(data)
      } catch (error) {
        console.error(error)
      }
    }
    void cargar()
    return () => { cancelado = true }
  }, [])

  const abrirCrear = () => {
    setRolEditando(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (rol: Rol) => {
    setRolEditando(rol)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setRolEditando(null)
  }

  const confirmarEliminar = (rol: Rol) => {
    setRolAEliminar(rol)
  }

  const ejecutarEliminar = async () => {
    if (!rolAEliminar) return
    try {
      await rolService.eliminar(rolAEliminar.id)
      toast.success("Rol eliminado correctamente")
      setRolAEliminar(null)
      await cargarDatos()
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el rol")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Roles</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Nuevo Rol
          </button>
        </div>

        {mostrarFormulario && (
          <RolForm
            rol={rolEditando}
            onGuardado={async () => { cerrarFormulario(); await cargarDatos() }}
            onCancelar={cerrarFormulario}
          />
        )}

        <RolTabla
          roles={roles}
          onEditar={abrirEditar}
          onEliminar={confirmarEliminar}
        />

        <ConfirmDialog
          abierto={rolAEliminar !== null}
          titulo="Eliminar rol"
          descripcion={
            rolAEliminar
              ? `¿Estás seguro de eliminar el rol "${rolAEliminar.nombre}"? Esta acción no se puede deshacer.`
              : ""
          }
          onConfirmar={ejecutarEliminar}
          onCancelar={() => setRolAEliminar(null)}
        />
      </main>
    </div>
  )
}