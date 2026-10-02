import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { tipoObservacionService } from '@/services/tipoObservacionService'
import type { TipoObservacion, TipoObservacionRequest } from '@/types/tipoObservacion'
import { TipoObservacionForm } from './TipoObservacionForm'
import { TipoObservacionTabla } from './TipoObservacionTabla'

export function TipoObservacionPage() {
  const [items, setItems] = useState<TipoObservacion[]>([])
  const [editando, setEditando] = useState<TipoObservacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await tipoObservacionService.listar()) }
    catch { toast.error('Error al cargar') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoObservacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoObservacionRequest) => {
    try {
      if (editando) { await tipoObservacionService.actualizar(editando.id_tipo_observacion, datos); toast.success('Actualizado') }
      else { await tipoObservacionService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: TipoObservacion) => {
    try {
      if (item.activo) { await tipoObservacionService.desactivar(item.id_tipo_observacion); toast.success('Desactivado') }
      else { await tipoObservacionService.reactivar(item.id_tipo_observacion); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: TipoObservacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await tipoObservacionService.eliminar(item.id_tipo_observacion); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tipos de Observación</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo</button>
        </div>
        {mostrarForm && <TipoObservacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <TipoObservacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}