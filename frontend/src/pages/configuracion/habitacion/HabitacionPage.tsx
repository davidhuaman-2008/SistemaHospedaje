import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { habitacionService } from "@/services/habitacionService"
import { pisoService } from "@/services/pisoService"
import { tipoHabitacionService } from "@/services/tipoHabitacionService"
import { mensajeDeError } from "@/lib/errores"
import type { Habitacion, HabitacionRequest } from "@/types/habitacion"
import type { Piso, TipoHabitacion } from "@/types/configuracion"
import { HabitacionForm } from "./HabitacionForm"
import { HabitacionTabla } from "./HabitacionTabla"

export function HabitacionPage() {
  const [items, setItems] = useState<Habitacion[]>([])
  const [pisos, setPisos] = useState<Piso[]>([])
  const [tipos, setTipos] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<Habitacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [filtroPiso, setFiltroPiso] = useState<number | "">("")

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const [habs, ps, ts] = await Promise.all([
          habitacionService.listar(),
          pisoService.listarActivos(),
          tipoHabitacionService.listarActivos(),
        ])
        if (!cancelado) {
          setItems(habs)
          setPisos(ps)
          setTipos(ts)
        }
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
    try { setItems(await habitacionService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Habitacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: HabitacionRequest) => {
    try {
      if (editando) {
        await habitacionService.actualizar(editando.id_habitacion, datos)
        toast.success("Actualizado")
      } else {
        await habitacionService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Habitacion) => {
    try {
      if (item.activo) {
        await habitacionService.desactivar(item.id_habitacion)
        toast.success("Desactivado")
      } else {
        await habitacionService.reactivar(item.id_habitacion)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Habitacion) => {
    if (!confirm(`Eliminar habitación "${item.numero}"?`)) return
    try {
      await habitacionService.eliminar(item.id_habitacion)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const itemsFiltrados = filtroPiso === "" 
    ? items 
    : items.filter(h => h.id_piso === filtroPiso)

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Habitaciones</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva Habitación
        </button>
      </div>

      {mostrarForm && (
        <HabitacionForm
          inicial={editando}
          pisos={pisos}
          tipos={tipos}
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      )}

      {/* Filtros */}
      <div className="bg-slate-800 p-3 rounded mb-4 flex flex-wrap gap-3 items-center">
        <label className="text-slate-300 text-sm">Filtrar por piso:</label>
        <select
          value={filtroPiso}
          onChange={e => setFiltroPiso(e.target.value ? Number(e.target.value) : "")}
          className="bg-slate-900 text-white px-3 py-1 rounded text-sm"
        >
          <option value="">Todos los pisos</option>
          {pisos.map(p => (
            <option key={p.id_piso} value={p.id_piso}>{p.nombre}</option>
          ))}
        </select>
        <span className="text-slate-400 text-xs">
          {itemsFiltrados.length} habitacion{itemsFiltrados.length !== 1 ? "es" : ""}
        </span>
      </div>

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <HabitacionTabla
          items={itemsFiltrados}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
        />
      )}
    </AppLayout>
  )
}