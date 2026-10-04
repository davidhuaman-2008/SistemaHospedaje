import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { promocionService } from "@/services/promocionService"
import { categoriaPromocionService } from "@/services/categoriaPromocionService"
import { tipoHabitacionService } from "@/services/tipoHabitacionService"
import { mensajeDeError } from "@/lib/errores"
import type { Promocion, PromocionRequest, CategoriaPromocion } from "@/types/promocion"
import type { TipoHabitacion } from "@/types/configuracion"
import { PromocionForm } from "./PromocionForm"
import { PromocionTabla } from "./PromocionTabla"

export function PromocionPage() {
  const [items, setItems] = useState<Promocion[]>([])
  const [categorias, setCategorias] = useState<CategoriaPromocion[]>([])
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<Promocion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const promos = await promocionService.listar()
        if (!cancelado) setItems(promos)
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const cargarDatosFormulario = async () => {
    try {
      const [cats, tipos] = await Promise.all([
        categoriaPromocionService.listarActivos(),
        tipoHabitacionService.listarActivos(),
      ])
      setCategorias(cats)
      setTiposHabitacion(tipos)
    } catch {
      toast.error("Error al cargar datos del formulario")
    }
  }

  const recargar = async () => {
    try { setItems(await promocionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = async () => {
    setEditando(null)
    await cargarDatosFormulario()
    setMostrarForm(true)
  }

  const abrirEditar = async (item: Promocion) => {
    setEditando(item)
    await cargarDatosFormulario()
    setMostrarForm(true)
  }

  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: PromocionRequest) => {
    try {
      if (editando) {
        await promocionService.actualizar(editando.id_promocion, datos)
        toast.success("Actualizado")
      } else {
        await promocionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Promocion) => {
    try {
      if (item.activo) {
        await promocionService.desactivar(item.id_promocion)
        toast.success("Desactivado")
      } else {
        await promocionService.reactivar(item.id_promocion)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Promocion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await promocionService.eliminar(item.id_promocion)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Promociones</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva Promoción
        </button>
      </div>
      {mostrarForm && (
        <PromocionForm
          inicial={editando}
          categorias={categorias}
          tiposHabitacion={tiposHabitacion}
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      )}
      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <PromocionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}