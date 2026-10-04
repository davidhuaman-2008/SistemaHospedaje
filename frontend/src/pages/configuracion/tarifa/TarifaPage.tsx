import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { tarifaService } from "@/services/tarifaService"
import { tipoHabitacionService } from "@/services/tipoHabitacionService"
import { mensajeDeError } from "@/lib/errores"
import type { Tarifa, TarifaRequest } from "@/types/tarifa"
import type { TipoHabitacion } from "@/types/configuracion"
import { TarifaForm } from "./TarifaForm"
import { TarifaTabla } from "./TarifaTabla"

export function TarifaPage() {
  const [items, setItems] = useState<Tarifa[]>([])
  const [tipos, setTipos] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<Tarifa | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const [tarifas, tiposHab] = await Promise.all([
          tarifaService.listar(),
          tipoHabitacionService.listarActivos(),
        ])
        if (!cancelado) {
          setItems(tarifas)
          setTipos(tiposHab)
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
    try {
      const [tarifas, tiposHab] = await Promise.all([
        tarifaService.listar(),
        tipoHabitacionService.listarActivos(),
      ])
      setItems(tarifas)
      setTipos(tiposHab)
    } catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Tarifa) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TarifaRequest) => {
    try {
      if (editando) {
        await tarifaService.actualizar(editando.id_tarifa, datos)
        toast.success("Actualizado")
      } else {
        await tarifaService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Tarifa) => {
    try {
      if (item.activo) {
        await tarifaService.desactivar(item.id_tarifa)
        toast.success("Desactivado")
      } else {
        await tarifaService.reactivar(item.id_tarifa)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Tarifa) => {
    if (!confirm(`Eliminar tarifa?`)) return
    try {
      await tarifaService.eliminar(item.id_tarifa)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Tarifas</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nueva
        </button>
      </div>

      {mostrarForm && <TarifaForm inicial={editando} tipos={tipos} onGuardar={guardar} onCancelar={cerrar} />}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <TarifaTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}