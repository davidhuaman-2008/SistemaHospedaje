import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { pisoService } from '@/services/pisoService'
import type { Piso, PisoRequest } from '@/types/configuracion'
import { PisoForm } from './PisoForm'
import { PisoTabla } from './PisoTabla'

export function PisoPage() {
  const [items, setItems] = useState<Piso[]>([])
  const [editando, setEditando] = useState<Piso | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    try {
      setCargando(true)
      setItems(await pisoService.listar())
    } catch {
      toast.error('Error al cargar pisos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Piso) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: PisoRequest) => {
    try {
      if (editando) {
        await pisoService.actualizar(editando.id_piso, datos)
        toast.success('Piso actualizado')
      } else {
        await pisoService.crear(datos)
        toast.success('Piso creado')
      }
      cerrar()
      cargar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al guardar')
    }
  }

  const cambiarEstado = async (item: Piso) => {
    try {
      if (item.activo) {
        await pisoService.desactivar(item.id_piso)
        toast.success('Piso desactivado')
      } else {
        await pisoService.reactivar(item.id_piso)
        toast.success('Piso reactivado')
      }
      cargar()
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  const eliminar = async (item: Piso) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await pisoService.eliminar(item.id_piso)
      toast.success('Piso eliminado')
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
          <h1 className="text-2xl font-bold text-white">Pisos</h1>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nuevo Piso
          </button>
        </div>

        {mostrarForm && (
          <PisoForm
            inicial={editando}
            onGuardar={guardar}
            onCancelar={cerrar}
          />
        )}

        {cargando ? (
          <p className="text-slate-400">Cargando...</p>
        ) : (
          <PisoTabla
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