import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { tipoMantenimientoService } from "@/services/tipoMantenimientoService"
import { mensajeDeError } from "@/lib/errores"
import type { TipoMantenimiento, TipoMantenimientoRequest } from "@/types/mantenimiento"
import { TipoMantenimientoForm } from "./TipoMantenimientoForm"
import { TipoMantenimientoTabla } from "./TipoMantenimientoTabla"

export function TipoMantenimientoPage() {
  const [items, setItems] = useState<TipoMantenimiento[]>([])
  const [editando, setEditando] = useState<TipoMantenimiento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      setItems(await tipoMantenimientoService.listar())
    } catch {
      toast.error("Error al cargar")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const guardar = async (datos: TipoMantenimientoRequest) => {
    try {
      if (editando) {
        await tipoMantenimientoService.actualizar(editando.id_tipo_mantenimiento, datos)
        toast.success("Actualizado")
      } else {
        await tipoMantenimientoService.crear(datos)
        toast.success("Creado")
      }
      setMostrarForm(false); setEditando(null); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: TipoMantenimiento) => {
    try {
      if (item.activo) await tipoMantenimientoService.desactivar(item.id_tipo_mantenimiento)
      else await tipoMantenimientoService.reactivar(item.id_tipo_mantenimiento)
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: TipoMantenimiento) => {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return
    try {
      await tipoMantenimientoService.eliminar(item.id_tipo_mantenimiento)
      toast.success("Eliminado"); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Tipos de Mantenimiento</h1>
        <button
          onClick={() => { setEditando(null); setMostrarForm(true) }}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
        >
          + Nuevo Tipo
        </button>
      </div>

      {mostrarForm && (
        <TipoMantenimientoForm
          inicial={editando}
          onGuardar={guardar}
          onCancelar={() => { setMostrarForm(false); setEditando(null) }}
        />
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <TipoMantenimientoTabla
          items={items}
          onEditar={item => { setEditando(item); setMostrarForm(true) }}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
        />
      )}
    </AppLayout>
  )
}