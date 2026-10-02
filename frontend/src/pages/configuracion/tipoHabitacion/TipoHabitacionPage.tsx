import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { tipoHabitacionService } from '@/services/tipoHabitacionService'
import type { TipoHabitacion, TipoHabitacionRequest } from '@/types/configuracion'
import { TipoHabitacionForm } from './TipoHabitacionForm'
import { TipoHabitacionTabla } from './TipoHabitacionTabla'

export function TipoHabitacionPage() {
  const [items, setItems] = useState<TipoHabitacion[]>([])
  const [editando, setEditando] = useState<TipoHabitacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      setItems(await tipoHabitacionService.listar())
    } catch { toast.error('Error al cargar') }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoHabitacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoHabitacionRequest) => {
    try {
      if (editando) {
        await tipoHabitacionService.actualizar(editando.id_tipo, datos)
        toast.success('Tipo actualizado')
      } else {
        await tipoHabitacionService.crear(datos)
        toast.success('Tipo creado')
      }
      cerrar(); cargar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al guardar')
    }
  }

  const cambiarEstado = async (item: TipoHabitacion) => {
    try {
      if (item.activo) {
        await tipoHabitacionService.desactivar(item.id_tipo)
        toast.success('Desactivado')
      } else {
        await tipoHabitacionService.reactivar(item.id_tipo)
        toast.success('Reactivado')
      }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: TipoHabitacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await tipoHabitacionService.eliminar(item.id_tipo)
      toast.success('Eliminado'); cargar()
    } catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tipos de Habitación</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nuevo Tipo
          </button>
        </div>
        {mostrarForm && <TipoHabitacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <TipoHabitacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}