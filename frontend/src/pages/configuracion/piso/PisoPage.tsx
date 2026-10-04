import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { pisoService } from "@/services/pisoService"
import { mensajeDeError } from "@/lib/errores"
import type { Piso, PisoRequest } from "@/types/configuracion"
import { PisoForm } from "./PisoForm"
import { PisoTabla } from "./PisoTabla"

export function PisoPage() {
  const [items, setItems] = useState<Piso[]>([])
  const [editando, setEditando] = useState<Piso | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await pisoService.listar()
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
    try {
      const datos = await pisoService.listar()
      setItems(datos)
    } catch {
      toast.error("Error al recargar")
    }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Piso) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: PisoRequest) => {
    try {
      if (editando) {
        await pisoService.actualizar(editando.id_piso, datos)
        toast.success("Actualizado")
      } else {
        await pisoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Piso) => {
    try {
      if (item.activo) {
        await pisoService.desactivar(item.id_piso)
        toast.success("Desactivado")
      } else {
        await pisoService.reactivar(item.id_piso)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Piso) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await pisoService.eliminar(item.id_piso)
      toast.success("Eliminado")
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Pisos</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Piso
        </button>
      </div>

      {mostrarForm && <PisoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <PisoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}