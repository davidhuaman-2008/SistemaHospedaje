import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sidebar from '@/components/layout/Sidebar'
import { clienteService } from '@/services/clienteService'
import type { Cliente, ClienteRequest } from '@/types/cliente'
import { ClienteForm } from './ClienteForm'
import { ClienteTabla } from './ClienteTabla'
import { ClienteHistorial } from './ClienteHistorial'
import { ClienteVisitaDialog } from './ClienteVisitaDialog'

export function ClientePage() {
  const [items, setItems] = useState<Cliente[]>([])
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [historialCliente, setHistorialCliente] = useState<Cliente | null>(null)
  const [visitaCliente, setVisitaCliente] = useState<Cliente | null>(null)

  const cargar = async () => {
    try { setCargando(true); setItems(await clienteService.listar()) }
    catch { toast.error('Error al cargar') } finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Cliente) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ClienteRequest, idExistente?: number) => {
    try {
      if (editando) {
        await clienteService.actualizar(editando.id_cliente, datos)
        toast.success('Cliente actualizado')
      } else if (idExistente) {
        // El usuario buscó un DNI que ya existe y editó los datos → actualizar
        await clienteService.actualizar(idExistente, datos)
        toast.success('Cliente actualizado')
      } else {
        await clienteService.crear(datos)
        toast.success('Cliente creado')
      }
      cerrar(); cargar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al guardar')
    }
  }

  const cambiarEstado = async (item: Cliente) => {
    try {
      if (item.activo) { await clienteService.desactivar(item.id_cliente); toast.success('Desactivado') }
      else { await clienteService.reactivar(item.id_cliente); toast.success('Reactivado') }
      cargar()
    } catch { toast.error('Error') }
  }

  const eliminar = async (item: Cliente) => {
    if (!confirm(`Eliminar "${item.nombre} ${item.apellido ?? ''}"?`)) return
    try { await clienteService.eliminar(item.id_cliente); toast.success('Eliminado'); cargar() }
    catch { toast.error('Error') }
  }

  const filtrados = items.filter(c => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      (c.apellido ?? '').toLowerCase().includes(q) ||
      (c.numero_documento ?? '').includes(busqueda) ||
      (c.celular ?? '').includes(busqueda)
    )
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Nuevo Cliente</button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o celular..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
          />
        </div>

        {mostrarForm && <ClienteForm inicial={editando} onGuardar={guardar} onCancelar={cerrar} />}

        {cargando ? <p className="text-slate-400">Cargando...</p> : (
          <ClienteTabla
            items={filtrados}
            onEditar={abrirEditar}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminar}
            onVerHistorial={setHistorialCliente}
            onRegistrarVisita={setVisitaCliente}
          />
        )}

        {historialCliente && (
          <ClienteHistorial
            cliente={historialCliente}
            onCerrar={() => setHistorialCliente(null)}
          />
        )}

        {visitaCliente && (
          <ClienteVisitaDialog
            cliente={visitaCliente}
            onCerrar={() => setVisitaCliente(null)}
            onGuardado={() => { setVisitaCliente(null); cargar() }}
          />
        )}
      </main>
    </div>
  )
}