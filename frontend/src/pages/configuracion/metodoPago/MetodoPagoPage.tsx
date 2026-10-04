import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { MetodoPago, MetodoPagoRequest } from "@/types/configuracion"
import { MetodoPagoForm } from "./MetodoPagoForm"
import { MetodoPagoTabla } from "./MetodoPagoTabla"

export function MetodoPagoPage() {
  const [items, setItems] = useState<MetodoPago[]>([])
  const [editando, setEditando] = useState<MetodoPago | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await metodoPagoService.listar()
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
    try { setItems(await metodoPagoService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: MetodoPago) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: MetodoPagoRequest) => {
    try {
      if (editando) {
        await metodoPagoService.actualizar(editando.id_metodo, datos)
        toast.success("Actualizado")
      } else {
        await metodoPagoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: MetodoPago) => {
    try {
      if (item.activo) {
        await metodoPagoService.desactivar(item.id_metodo)
        toast.success("Desactivado")
      } else {
        await metodoPagoService.reactivar(item.id_metodo)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: MetodoPago) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await metodoPagoService.eliminar(item.id_metodo)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Metodos de Pago</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo
        </button>
      </div>

      {mostrarForm && <MetodoPagoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <MetodoPagoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}