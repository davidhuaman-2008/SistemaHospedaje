import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import Sidebar from "@/components/layout/Sidebar"
import ConfirmDialog from "@/components/ConfirmDialog"
import { turnoService } from "@/services/turnoService"
import type { Turno } from "@/types"
import TurnoTabla from "./TurnoTabla"
import TurnoForm from "./TurnoForm"

export default function TurnoPage() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [turnoEditando, setTurnoEditando] = useState<Turno | null>(null)
  const [turnoAEliminar, setTurnoAEliminar] = useState<Turno | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      const data = await turnoService.listar()
      setTurnos(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const data = await turnoService.listar()
        if (!cancelado) setTurnos(data)
      } catch (error) {
        console.error(error)
      }
    }
    void cargar()
    return () => { cancelado = true }
  }, [])

  const abrirCrear = () => {
    setTurnoEditando(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (turno: Turno) => {
    setTurnoEditando(turno)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setTurnoEditando(null)
  }

  const cambiarEstado = async (turno: Turno) => {
    try {
      await turnoService.actualizar(turno.id, { activo: !turno.activo })
      toast.success(turno.activo ? "Turno desactivado" : "Turno activado")
      await cargarDatos()
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar estado")
    }
  }

  const confirmarEliminar = (turno: Turno) => {
    setTurnoAEliminar(turno)
  }

  const ejecutarEliminar = async () => {
    if (!turnoAEliminar) return
    try {
      await turnoService.eliminar(turnoAEliminar.id)
      toast.success("Turno eliminado correctamente")
      setTurnoAEliminar(null)
      await cargarDatos()
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el turno")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Turnos</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Nuevo Turno
          </button>
        </div>

        {mostrarFormulario && (
          <TurnoForm
            turno={turnoEditando}
            onGuardado={async () => { cerrarFormulario(); await cargarDatos() }}
            onCancelar={cerrarFormulario}
          />
        )}

        <TurnoTabla
          turnos={turnos}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={confirmarEliminar}
        />

        <ConfirmDialog
          abierto={turnoAEliminar !== null}
          titulo="Eliminar turno"
          descripcion={
            turnoAEliminar
              ? `Ã‚Â¿EstÃƒÂ¡s seguro de eliminar el turno "${turnoAEliminar.nombre}"? Esta acciÃƒÂ³n no se puede deshacer.`
              : ""
          }
          onConfirmar={ejecutarEliminar}
          onCancelar={() => setTurnoAEliminar(null)}
        />
      </main>
    </div>
  )
}