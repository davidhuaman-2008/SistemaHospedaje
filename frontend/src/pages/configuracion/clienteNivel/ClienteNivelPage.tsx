import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { clienteNivelService } from '@/services/clienteNivelService'
import type { ClienteNivel, ClienteNivelRequest } from '@/types/configuracion'
import { ClienteNivelForm } from './ClienteNivelForm'
import { ClienteNivelTabla } from './ClienteNivelTabla'

export function ClienteNivelPage() {
  const [items, setItems] = useState<ClienteNivel[]>([])
  const [editando, setEditando] = useState<ClienteNivel | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await clienteNivelService.listar()) }
    catch { toast.error('Error') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: ClienteNivel) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ClienteNivelRequest) => {
    try {
      if (editando) { await clienteNivelService.actualizar(editando.id_nivel, datos); toast.success('Actualizado') }
      else { await clienteNivelService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: ClienteNivel) => {
    try {
      if (item.activo) { await clienteNivelService.desactivar(item.id_nivel); toast.success('Desactivado') }
      else { await clienteNivelService.reactivar(item.id_nivel); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: ClienteNivel) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await clienteNivelService.eliminar(item.id_nivel); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Niveles de Cliente</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo</button>
        </div>
        {mostrarForm && <ClienteNivelForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <ClienteNivelTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}