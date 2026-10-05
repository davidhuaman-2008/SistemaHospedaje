import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { prioridadMantenimientoService } from "@/services/prioridadMantenimientoService"
import { mensajeDeError } from "@/lib/errores"
import type { PrioridadMantenimiento, PrioridadMantenimientoRequest } from "@/types/mantenimiento"
import { PrioridadMantenimientoForm } from "./PrioridadMantenimientoForm"
import { PrioridadMantenimientoTabla } from "./PrioridadMantenimientoTabla"

export function PrioridadMantenimientoPage() {
  const [items, setItems] = useState<PrioridadMantenimiento[]>([])
  const [editando, setEditando] = useState<PrioridadMantenimiento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      setItems(await prioridadMantenimientoService.listar())
    } catch {
      toast.error("Error al cargar")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const guardar = async (datos: PrioridadMantenimientoRequest) => {
    try {
      if (editando) {
        await prioridadMantenimientoService.actualizar(editando.id_prioridad, datos)
        toast.success("Actualizado")
      } else {
        await prioridadMantenimientoService.crear(datos)
        toast.success("Creado")
      }
      setMostrarForm(false); setEditando(null); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: PrioridadMantenimiento) => {
    try {
      if (item.activo) await prioridadMantenimientoService.desactivar(item.id_prioridad)
      else await prioridadMantenimientoService.reactivar(item.id_prioridad)
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: PrioridadMantenimiento) => {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return
    try {
      await prioridadMantenimientoService.eliminar(item.id_prioridad)
      toast.success("Eliminado"); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Prioridades de Mantenimiento</h1>
        <button
          onClick={() => { setEditando(null); setMostrarForm(true) }}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
        >
          + Nueva Prioridad
        </button>
      </div>

      {mostrarForm && (
        <PrioridadMantenimientoForm
          inicial={editando}
          onGuardar={guardar}
          onCancelar={() => { setMostrarForm(false); setEditando(null) }}
        />
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <PrioridadMantenimientoTabla
          items={items}
          onEditar={item => { setEditando(item); setMostrarForm(true) }}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
        />
      )}
    </AppLayout>
  )
}