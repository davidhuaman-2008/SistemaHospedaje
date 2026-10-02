import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { tipoDocumentoService } from '@/services/tipoDocumentoService'
import type { TipoDocumento, TipoDocumentoRequest } from '@/types/configuracion'
import { TipoDocumentoForm } from './TipoDocumentoForm'
import { TipoDocumentoTabla } from './TipoDocumentoTabla'

export function TipoDocumentoPage() {
  const [items, setItems] = useState<TipoDocumento[]>([])
  const [editando, setEditando] = useState<TipoDocumento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await tipoDocumentoService.listar()) }
    catch { toast.error('Error al cargar') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: TipoDocumento) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: TipoDocumentoRequest) => {
    try {
      if (editando) { await tipoDocumentoService.actualizar(editando.id_documento, datos); toast.success('Actualizado') }
      else { await tipoDocumentoService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: TipoDocumento) => {
    try {
      if (item.activo) { await tipoDocumentoService.desactivar(item.id_documento); toast.success('Desactivado') }
      else { await tipoDocumentoService.reactivar(item.id_documento); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: TipoDocumento) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await tipoDocumentoService.eliminar(item.id_documento); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tipos de Documento</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo</button>
        </div>
        {mostrarForm && <TipoDocumentoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <TipoDocumentoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}