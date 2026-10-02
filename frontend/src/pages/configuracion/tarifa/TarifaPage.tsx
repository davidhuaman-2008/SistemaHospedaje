import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { tarifaService } from '@/services/tarifaService'
import { tipoHabitacionService } from '@/services/tipoHabitacionService'
import type { Tarifa, TarifaRequest } from '@/types/tarifa'
import type { TipoHabitacion } from '@/types/configuracion'
import { TarifaForm } from './TarifaForm'
import { TarifaTabla } from './TarifaTabla'

export function TarifaPage() {
  const [items, setItems] = useState<Tarifa[]>([])
  const [tipos, setTipos] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<Tarifa | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      const [tarifas, tiposHab] = await Promise.all([
        tarifaService.listar(),
        tipoHabitacionService.listarActivos(),
      ])
      setItems(tarifas)
      setTipos(tiposHab)
    } catch {
      toast.error('Error al cargar tarifas')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Tarifa) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TarifaRequest) => {
    try {
      if (editando) {
        await tarifaService.actualizar(editando.id_tarifa, datos)
        toast.success('Tarifa actualizada')
      } else {
        await tarifaService.crear(datos)
        toast.success('Tarifa creada')
      }
      cerrar()
      cargar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al guardar')
    }
  }

  const cambiarEstado = async (item: Tarifa) => {
    try {
      if (item.activo) {
        await tarifaService.desactivar(item.id_tarifa)
        toast.success('Tarifa desactivada')
      } else {
        await tarifaService.reactivar(item.id_tarifa)
        toast.success('Tarifa reactivada')
      }
      cargar()
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  const eliminar = async (item: Tarifa) => {
    if (!confirm(`Eliminar tarifa de ${item.tipo?.nombre ?? 'tipo'} por ${item.horas}h?`)) return
    try {
      await tarifaService.eliminar(item.id_tarifa)
      toast.success('Tarifa eliminada')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tarifas</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nueva Tarifa
          </button>
        </div>

        {mostrarForm && (
          <TarifaForm
            inicial={editando}
            tipos={tipos}
            onGuardar={guardar}
            onCancelar={cerrar}
          />
        )}

        {cargando ? (
          <p className="text-slate-400">Cargando...</p>
        ) : (
          <TarifaTabla
            items={items}
            onEditar={abrirEditar}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminar}
          />
        )}
      </main>
    </div>
  )
}