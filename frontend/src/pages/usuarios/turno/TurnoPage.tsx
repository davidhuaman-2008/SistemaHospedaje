import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { turnoService } from "@/services/turnoService"
import { mensajeDeError } from "@/lib/errores"
import type { Turno } from "@/types"
import TurnoForm from "./TurnoForm"
import TurnoTabla from "./TurnoTabla"

export default function TurnoPage() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState<Turno | null>(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const datos = await turnoService.listar()
        if (!cancelado) setTurnos(datos)
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const recargar = async () => {
    try { setTurnos(await turnoService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarFormulario(true) }
  const abrirEditar = (turno: Turno) => { setEditando(turno); setMostrarFormulario(true) }
  const cerrarFormulario = () => { setMostrarFormulario(false); setEditando(null) }

  const onGuardado = () => { cerrarFormulario(); recargar() }

  const onCambiarEstado = async (turno: Turno) => {
    try {
      const activo = turno.activo ?? true
      if (activo) {
        await turnoService.desactivar(turno.id)
        toast.success("Desactivado")
      } else {
        await turnoService.reactivar(turno.id)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const onEliminar = async (turno: Turno) => {
    if (!confirm(`Eliminar "${turno.nombre}"?`)) return
    try {
      await turnoService.eliminar(turno.id)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Turnos</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Turno
        </button>
      </div>

      {mostrarFormulario && (
        <TurnoForm
          turno={editando}
          onGuardado={onGuardado}
          onCancelar={cerrarFormulario}
        />
      )}

      <TurnoTabla
        turnos={turnos}
        onEditar={abrirEditar}
        onCambiarEstado={onCambiarEstado}
        onEliminar={onEliminar}
      />
    </AppLayout>
  )
}