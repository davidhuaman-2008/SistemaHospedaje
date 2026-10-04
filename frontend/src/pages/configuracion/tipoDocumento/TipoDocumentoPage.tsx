import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { tipoDocumentoService } from "@/services/tipoDocumentoService"
import { mensajeDeError } from "@/lib/errores"
import type { TipoDocumento, TipoDocumentoRequest } from "@/types/configuracion"
import { TipoDocumentoForm } from "./TipoDocumentoForm"
import { TipoDocumentoTabla } from "./TipoDocumentoTabla"

export function TipoDocumentoPage() {
  const [items, setItems] = useState<TipoDocumento[]>([])
  const [editando, setEditando] = useState<TipoDocumento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await tipoDocumentoService.listar()
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
    try { setItems(await tipoDocumentoService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoDocumento) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoDocumentoRequest) => {
    try {
      if (editando) {
        await tipoDocumentoService.actualizar(editando.id_documento, datos)
        toast.success("Actualizado")
      } else {
        await tipoDocumentoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: TipoDocumento) => {
    try {
      if (item.activo) {
        await tipoDocumentoService.desactivar(item.id_documento)
        toast.success("Desactivado")
      } else {
        await tipoDocumentoService.reactivar(item.id_documento)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: TipoDocumento) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await tipoDocumentoService.eliminar(item.id_documento)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Tipos de Documento</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo
        </button>
      </div>

      {mostrarForm && <TipoDocumentoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <TipoDocumentoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}