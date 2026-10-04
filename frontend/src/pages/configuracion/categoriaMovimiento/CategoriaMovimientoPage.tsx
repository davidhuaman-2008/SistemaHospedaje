import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { categoriaMovimientoService } from "@/services/categoriaMovimientoService"
import { mensajeDeError } from "@/lib/errores"
import type { CategoriaMovimiento, CategoriaMovimientoRequest } from "@/types/configuracion"
import { CategoriaMovimientoForm } from "./CategoriaMovimientoForm"
import { CategoriaMovimientoTabla } from "./CategoriaMovimientoTabla"

export function CategoriaMovimientoPage() {
  const [items, setItems] = useState<CategoriaMovimiento[]>([])
  const [editando, setEditando] = useState<CategoriaMovimiento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await categoriaMovimientoService.listar()
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
    try { setItems(await categoriaMovimientoService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: CategoriaMovimiento) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: CategoriaMovimientoRequest) => {
    try {
      if (editando) {
        await categoriaMovimientoService.actualizar(editando.id_categoria, datos)
        toast.success("Actualizado")
      } else {
        await categoriaMovimientoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: CategoriaMovimiento) => {
    try {
      if (item.activo) {
        await categoriaMovimientoService.desactivar(item.id_categoria)
        toast.success("Desactivado")
      } else {
        await categoriaMovimientoService.reactivar(item.id_categoria)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: CategoriaMovimiento) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await categoriaMovimientoService.eliminar(item.id_categoria)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Categorias de Movimiento</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva
        </button>
      </div>

      {mostrarForm && <CategoriaMovimientoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <CategoriaMovimientoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}