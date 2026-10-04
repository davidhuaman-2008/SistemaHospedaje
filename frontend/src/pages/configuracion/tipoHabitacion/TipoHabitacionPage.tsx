import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { tipoHabitacionService } from "@/services/tipoHabitacionService"
import { mensajeDeError } from "@/lib/errores"
import type { TipoHabitacion, TipoHabitacionRequest } from "@/types/configuracion"
import { TipoHabitacionForm } from "./TipoHabitacionForm"
import { TipoHabitacionTabla } from "./TipoHabitacionTabla"

export function TipoHabitacionPage() {
  const [items, setItems] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<TipoHabitacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await tipoHabitacionService.listar()
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

  const recargar = async () => {
    try {
      setItems(await tipoHabitacionService.listar())
    } catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoHabitacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoHabitacionRequest) => {
    try {
      if (editando) {
        await tipoHabitacionService.actualizar(editando.id_tipo, datos)
        toast.success("Actualizado")
      } else {
        await tipoHabitacionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: TipoHabitacion) => {
    try {
      if (item.activo) {
        await tipoHabitacionService.desactivar(item.id_tipo)
        toast.success("Desactivado")
      } else {
        await tipoHabitacionService.reactivar(item.id_tipo)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: TipoHabitacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await tipoHabitacionService.eliminar(item.id_tipo)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Tipos de Habitacion</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Tipo
        </button>
      </div>

      {mostrarForm && <TipoHabitacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <TipoHabitacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}