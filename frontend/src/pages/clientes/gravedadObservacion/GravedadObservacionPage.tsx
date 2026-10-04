import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { gravedadObservacionService } from "@/services/gravedadObservacionService"
import { mensajeDeError } from "@/lib/errores"
import type { GravedadObservacion, GravedadObservacionRequest } from "@/types/gravedadObservacion"
import { GravedadObservacionForm } from "./GravedadObservacionForm"
import { GravedadObservacionTabla } from "./GravedadObservacionTabla"

export function GravedadObservacionPage() {
  const [items, setItems] = useState<GravedadObservacion[]>([])
  const [editando, setEditando] = useState<GravedadObservacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await gravedadObservacionService.listar()
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
    try { setItems(await gravedadObservacionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: GravedadObservacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: GravedadObservacionRequest) => {
    try {
      if (editando) {
        await gravedadObservacionService.actualizar(editando.id_gravedad, datos)
        toast.success("Actualizado")
      } else {
        await gravedadObservacionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: GravedadObservacion) => {
    try {
      if (item.activo) {
        await gravedadObservacionService.desactivar(item.id_gravedad)
        toast.success("Desactivado")
      } else {
        await gravedadObservacionService.reactivar(item.id_gravedad)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: GravedadObservacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await gravedadObservacionService.eliminar(item.id_gravedad)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Gravedades de Observacion</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo
        </button>
      </div>

      {mostrarForm && <GravedadObservacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <GravedadObservacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}