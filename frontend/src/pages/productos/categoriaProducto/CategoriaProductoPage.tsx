import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { categoriaProductoService } from "@/services/categoriaProductoService"
import { mensajeDeError } from "@/lib/errores"
import type { CategoriaProducto, CategoriaProductoRequest } from "@/types/producto"
import { CategoriaProductoForm } from "./CategoriaProductoForm"
import { CategoriaProductoTabla } from "./CategoriaProductoTabla"

export function CategoriaProductoPage() {
  const [items, setItems] = useState<CategoriaProducto[]>([])
  const [editando, setEditando] = useState<CategoriaProducto | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await categoriaProductoService.listar()
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
    try { setItems(await categoriaProductoService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: CategoriaProducto) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: CategoriaProductoRequest) => {
    try {
      if (editando) {
        await categoriaProductoService.actualizar(editando.id_categoria_producto, datos)
        toast.success("Actualizado")
      } else {
        await categoriaProductoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: CategoriaProducto) => {
    try {
      if (item.activo) {
        await categoriaProductoService.desactivar(item.id_categoria_producto)
        toast.success("Desactivado")
      } else {
        await categoriaProductoService.reactivar(item.id_categoria_producto)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: CategoriaProducto) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await categoriaProductoService.eliminar(item.id_categoria_producto)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Categorías de Producto</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva
        </button>
      </div>
      {mostrarForm && <CategoriaProductoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <CategoriaProductoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}