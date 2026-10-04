import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { paqueteDecoracionService } from "@/services/paqueteDecoracionService"
import { proveedorService } from "@/services/proveedorService"
import { tipoHabitacionService } from "@/services/tipoHabitacionService"
import { mensajeDeError } from "@/lib/errores"
import type { PaqueteDecoracion, PaqueteDecoracionRequest } from "@/types/paqueteDecoracion"
import type { TipoHabitacion } from "@/types/configuracion"
import { PaqueteDecoracionForm } from "./PaqueteDecoracionForm"
import { PaqueteDecoracionTabla } from "./PaqueteDecoracionTabla"

export function PaqueteDecoracionPage() {
  const [items, setItems] = useState<PaqueteDecoracion[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<PaqueteDecoracion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await paqueteDecoracionService.listar()
        if (!cancelado) setItems(datos)
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const cargarDatosFormulario = async () => {
    try {
      const [provs, tipos] = await Promise.all([
        proveedorService.listarActivos(),
        tipoHabitacionService.listarActivos(),
      ])
      setProveedores(provs)
      setTiposHabitacion(tipos)
    } catch {
      toast.error("Error al cargar datos del formulario")
    }
  }

  const recargar = async () => {
    try { setItems(await paqueteDecoracionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = async () => {
    setEditando(null)
    await cargarDatosFormulario()
    setMostrarForm(true)
  }

  const abrirEditar = async (item: PaqueteDecoracion) => {
    setEditando(item)
    await cargarDatosFormulario()
    setMostrarForm(true)
  }

  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: PaqueteDecoracionRequest) => {
    try {
      if (editando) {
        await paqueteDecoracionService.actualizar(editando.id_paquete, datos)
        toast.success("Actualizado")
      } else {
        await paqueteDecoracionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: PaqueteDecoracion) => {
    try {
      if (item.activo) {
        await paqueteDecoracionService.desactivar(item.id_paquete)
        toast.success("Desactivado")
      } else {
        await paqueteDecoracionService.reactivar(item.id_paquete)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: PaqueteDecoracion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await paqueteDecoracionService.eliminar(item.id_paquete)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Paquetes de Decoración</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Paquete
        </button>
      </div>

      {mostrarForm && (
        <PaqueteDecoracionForm
          inicial={editando}
          proveedores={proveedores}
          tiposHabitacion={tiposHabitacion}
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <PaqueteDecoracionTabla
          items={items}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
        />
      )}
    </AppLayout>
  )
}