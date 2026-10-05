import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { estadoCuentaPagarService } from "@/services/estadoCuentaPagarService"
import { mensajeDeError } from "@/lib/errores"
import type { EstadoCuentaPagar, EstadoCuentaPagarRequest } from "@/types/cuentaPagar"
import { EstadoCuentaPagarForm } from "./EstadoCuentaPagarForm"
import { EstadoCuentaPagarTabla } from "./EstadoCuentaPagarTabla"

export function EstadoCuentaPagarPage() {
  const [items, setItems] = useState<EstadoCuentaPagar[]>([])
  const [editando, setEditando] = useState<EstadoCuentaPagar | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      setItems(await estadoCuentaPagarService.listar())
    } catch {
      toast.error("Error al cargar")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const guardar = async (datos: EstadoCuentaPagarRequest) => {
    try {
      if (editando) {
        await estadoCuentaPagarService.actualizar(editando.id_estado_cuenta, datos)
        toast.success("Actualizado")
      } else {
        await estadoCuentaPagarService.crear(datos)
        toast.success("Creado")
      }
      setMostrarForm(false); setEditando(null); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: EstadoCuentaPagar) => {
    try {
      if (item.activo) await estadoCuentaPagarService.desactivar(item.id_estado_cuenta)
      else await estadoCuentaPagarService.reactivar(item.id_estado_cuenta)
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: EstadoCuentaPagar) => {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return
    try {
      await estadoCuentaPagarService.eliminar(item.id_estado_cuenta)
      toast.success("Eliminado"); cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Estados de Cuenta por Pagar</h1>
        <button
          onClick={() => { setEditando(null); setMostrarForm(true) }}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
        >
          + Nuevo Estado
        </button>
      </div>

      {mostrarForm && (
        <EstadoCuentaPagarForm
          inicial={editando}
          onGuardar={guardar}
          onCancelar={() => { setMostrarForm(false); setEditando(null) }}
        />
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <EstadoCuentaPagarTabla
          items={items}
          onEditar={item => { setEditando(item); setMostrarForm(true) }}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
        />
      )}
    </AppLayout>
  )
}