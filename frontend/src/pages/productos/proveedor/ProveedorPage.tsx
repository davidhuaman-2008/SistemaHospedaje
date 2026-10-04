import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { proveedorService } from "@/services/proveedorService"
import { mensajeDeError } from "@/lib/errores"
import type { Proveedor, ProveedorRequest } from "@/types/producto"
import { ProveedorForm } from "./ProveedorForm"
import { ProveedorTabla } from "./ProveedorTabla"

export function ProveedorPage() {
  const [items, setItems] = useState<Proveedor[]>([])
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await proveedorService.listar()
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
    try { setItems(await proveedorService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Proveedor) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ProveedorRequest) => {
    try {
      if (editando) {
        await proveedorService.actualizar(editando.id_proveedor, datos)
        toast.success("Actualizado")
      } else {
        await proveedorService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Proveedor) => {
    try {
      if (item.activo) {
        await proveedorService.desactivar(item.id_proveedor)
        toast.success("Desactivado")
      } else {
        await proveedorService.reactivar(item.id_proveedor)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Proveedor) => {
    if (!confirm(`Eliminar "${item.razon_social}"?`)) return
    try {
      await proveedorService.eliminar(item.id_proveedor)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Proveedores</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Proveedor
        </button>
      </div>
      {mostrarForm && <ProveedorForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <ProveedorTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}