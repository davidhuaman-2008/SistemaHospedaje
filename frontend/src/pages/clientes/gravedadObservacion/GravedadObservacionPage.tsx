import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { gravedadObservacionService } from '@/services/gravedadObservacionService'
import type { GravedadObservacion, GravedadObservacionRequest } from '@/types/gravedadObservacion'
import { GravedadObservacionForm } from './GravedadObservacionForm'
import { GravedadObservacionTabla } from './GravedadObservacionTabla'

export function GravedadObservacionPage() {
  const [items, setItems] = useState<GravedadObservacion[]>([])
  const [editando, setEditando] = useState<GravedadObservacion | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await gravedadObservacionService.listar()) }
    catch { toast.error('Error al cargar') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: GravedadObservacion) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: GravedadObservacionRequest) => {
    try {
      if (editando) { await gravedadObservacionService.actualizar(editando.id_gravedad, datos); toast.success('Actualizado') }
      else { await gravedadObservacionService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: GravedadObservacion) => {
    try {
      if (item.activo) { await gravedadObservacionService.desactivar(item.id_gravedad); toast.success('Desactivado') }
      else { await gravedadObservacionService.reactivar(item.id_gravedad); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: GravedadObservacion) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await gravedadObservacionService.eliminar(item.id_gravedad); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Gravedades de Observación</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo</button>
        </div>
        {mostrarForm && <GravedadObservacionForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <GravedadObservacionTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}