import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { clienteNivelService } from "@/services/clienteNivelService"
import { mensajeDeError } from "@/lib/errores"
import type { ClienteNivel, ClienteNivelRequest } from "@/types/configuracion"
import { ClienteNivelForm } from "./ClienteNivelForm"
import { ClienteNivelTabla } from "./ClienteNivelTabla"

export function ClienteNivelPage() {
  const [items, setItems] = useState<ClienteNivel[]>([])
  const [editando, setEditando] = useState<ClienteNivel | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await clienteNivelService.listar()
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
    try { setItems(await clienteNivelService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: ClienteNivel) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ClienteNivelRequest) => {
    try {
      if (editando) {
        await clienteNivelService.actualizar(editando.id_nivel, datos)
        toast.success("Actualizado")
      } else {
        await clienteNivelService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: ClienteNivel) => {
    try {
      if (item.activo) {
        await clienteNivelService.desactivar(item.id_nivel)
        toast.success("Desactivado")
      } else {
        await clienteNivelService.reactivar(item.id_nivel)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: ClienteNivel) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await clienteNivelService.eliminar(item.id_nivel)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Niveles de Cliente</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo
        </button>
      </div>

      {mostrarForm && <ClienteNivelForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <ClienteNivelTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}