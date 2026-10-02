import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { metodoPagoService } from '@/services/metodoPagoService'
import type { MetodoPago, MetodoPagoRequest } from '@/types/configuracion'
import { MetodoPagoForm } from './MetodoPagoForm'
import { MetodoPagoTabla } from './MetodoPagoTabla'

export function MetodoPagoPage() {
  const [items, setItems] = useState<MetodoPago[]>([])
  const [editando, setEditando] = useState<MetodoPago | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await metodoPagoService.listar()) }
    catch { toast.error('Error') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: MetodoPago) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: MetodoPagoRequest) => {
    try {
      if (editando) { await metodoPagoService.actualizar(editando.id_metodo, datos); toast.success('Actualizado') }
      else { await metodoPagoService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: MetodoPago) => {
    try {
      if (item.activo) { await metodoPagoService.desactivar(item.id_metodo); toast.success('Desactivado') }
      else { await metodoPagoService.reactivar(item.id_metodo); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: MetodoPago) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await metodoPagoService.eliminar(item.id_metodo); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Métodos de Pago</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo</button>
        </div>
        {mostrarForm && <MetodoPagoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <MetodoPagoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}