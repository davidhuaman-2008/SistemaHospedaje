import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { tipoObservacionService } from "@/services/tipoObservacionService"
import { mensajeDeError } from "@/lib/errores"
import type { TipoObservacion, TipoObservacionRequest } from "@/types/tipoObservacion"
import { TipoObservacionForm } from "./TipoObservacionForm"
import { TipoObservacionTabla } from "./TipoObservacionTabla"

export function TipoObservacionPage() {
  const [items, setItems] = useState<TipoObservacion[]>([])
  const [editando, setEditando] = useState<TipoObservacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await tipoObservacionService.listar()
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
    try { setItems(await tipoObservacionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoObservacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoObservacionRequest) => {
    try {
      if (editando) {
        await tipoObservacionService.actualizar(editando.id_tipo_observacion, datos)
        toast.success("Actualizado")
      } else {
        await tipoObservacionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: TipoObservacion) => {
    try {
      if (item.activo) {
        await tipoObservacionService.desactivar(item.id_tipo_observacion)
        toast.success("Desactivado")
      } else {
        await tipoObservacionService.reactivar(item.id_tipo_observacion)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: TipoObservacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await tipoObservacionService.eliminar(item.id_tipo_observacion)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Tipos de Observacion</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo
        </button>
      </div>

      {mostrarForm && <TipoObservacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <TipoObservacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}