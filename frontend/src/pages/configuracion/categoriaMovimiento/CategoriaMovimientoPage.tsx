import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { categoriaMovimientoService } from '@/services/categoriaMovimientoService'
import type { CategoriaMovimiento, CategoriaMovimientoRequest } from '@/types/configuracion'
import { CategoriaMovimientoForm } from './CategoriaMovimientoForm'
import { CategoriaMovimientoTabla } from './CategoriaMovimientoTabla'

export function CategoriaMovimientoPage() {
  const [items, setItems] = useState<CategoriaMovimiento[]>([])
  const [editando, setEditando] = useState<CategoriaMovimiento | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try { setCargando(true); setItems(await categoriaMovimientoService.listar()) }
    catch { toast.error('Error') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: CategoriaMovimiento) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: CategoriaMovimientoRequest) => {
    try {
      if (editando) { await categoriaMovimientoService.actualizar(editando.id_categoria, datos); toast.success('Actualizado') }
      else { await categoriaMovimientoService.crear(datos); toast.success('Creado') }
      cerrar(); cargar()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error') }
  }

  const cambiarEstado = async (item: CategoriaMovimiento) => {
    try {
      if (item.activo) { await categoriaMovimientoService.desactivar(item.id_categoria); toast.success('Desactivado') }
      else { await categoriaMovimientoService.reactivar(item.id_categoria); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: CategoriaMovimiento) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try { await categoriaMovimientoService.eliminar(item.id_categoria); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Categorías de Movimiento</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nueva</button>
        </div>
        {mostrarForm && <CategoriaMovimientoForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}
        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <CategoriaMovimientoTabla items={items} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
        )}
      </main>
    </div>
  )
}