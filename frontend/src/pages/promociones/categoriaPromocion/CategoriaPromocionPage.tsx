import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { categoriaPromocionService } from "@/services/categoriaPromocionService"
import { mensajeDeError } from "@/lib/errores"
import type { CategoriaPromocion, CategoriaPromocionRequest } from "@/types/promocion"
import { CategoriaPromocionForm } from "./CategoriaPromocionForm"
import { CategoriaPromocionTabla } from "./CategoriaPromocionTabla"

export function CategoriaPromocionPage() {
  const [items, setItems] = useState<CategoriaPromocion[]>([])
  const [editando, setEditando] = useState<CategoriaPromocion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await categoriaPromocionService.listar()
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
    try { setItems(await categoriaPromocionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: CategoriaPromocion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: CategoriaPromocionRequest) => {
    try {
      if (editando) {
        await categoriaPromocionService.actualizar(editando.id_categoria_promocion, datos)
        toast.success("Actualizado")
      } else {
        await categoriaPromocionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: CategoriaPromocion) => {
    try {
      if (item.activo) {
        await categoriaPromocionService.desactivar(item.id_categoria_promocion)
        toast.success("Desactivado")
      } else {
        await categoriaPromocionService.reactivar(item.id_categoria_promocion)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: CategoriaPromocion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await categoriaPromocionService.eliminar(item.id_categoria_promocion)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Categorías de Promoción</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva
        </button>
      </div>
      {mostrarForm && <CategoriaPromocionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <CategoriaPromocionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}