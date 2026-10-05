import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { clienteService } from "@/services/clienteService"
import { mensajeDeError } from "@/lib/errores"
import type { Cliente, ClienteRequest } from "@/types/cliente"
import { ClienteForm } from "./ClienteForm"
import { ClienteTabla } from "./ClienteTabla"
import { ClienteHistorial } from "./ClienteHistorial"
import { ClienteVisitaDialog } from "./ClienteVisitaDialog"
import { AgregarObservacionModal } from "./AgregarObservacionModal"

export function ClientePage() {
  const [items, setItems] = useState<Cliente[]>([])
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [historialCliente, setHistorialCliente] = useState<Cliente | null>(null)
  const [visitaCliente, setVisitaCliente] = useState<Cliente | null>(null)
  const [observacionCliente, setObservacionCliente] = useState<Cliente | null>(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await clienteService.listar()
        if (!cancelado) setItems(datos)
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const recargar = async () => {
    try { setItems(await clienteService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Cliente) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ClienteRequest, idExistente?: number) => {
    try {
      if (editando) {
        await clienteService.actualizar(editando.id_cliente, datos)
        toast.success("Actualizado")
      } else if (idExistente) {
        await clienteService.actualizar(idExistente, datos)
        toast.success("Actualizado")
      } else {
        await clienteService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Cliente) => {
    try {
      if (item.activo) {
        await clienteService.desactivar(item.id_cliente)
        toast.success("Desactivado")
      } else {
        await clienteService.reactivar(item.id_cliente)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Cliente) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await clienteService.eliminar(item.id_cliente)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const filtrados = items.filter(c => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      (c.apellido ?? "").toLowerCase().includes(q) ||
      (c.numero_documento ?? "").includes(busqueda) ||
      (c.celular ?? "").includes(busqueda)
    )
  })

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Clientes</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Cliente
        </button>
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

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <ClienteTabla
          items={filtrados}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={eliminar}
          onVerHistorial={setHistorialCliente}
          onRegistrarVisita={setVisitaCliente}
          onAgregarObservacion={setObservacionCliente}
        />
      )}

      {historialCliente && (
        <ClienteHistorial cliente={historialCliente} onCerrar={() => setHistorialCliente(null)} />
      )}

      {visitaCliente && (
        <ClienteVisitaDialog
          cliente={visitaCliente}
          onCerrar={() => setVisitaCliente(null)}
          onGuardado={() => { setVisitaCliente(null); recargar() }}
        />
      )}

      {observacionCliente && (
        <AgregarObservacionModal
          idCliente={observacionCliente.id_cliente}
          nombreCliente={`${observacionCliente.nombre} ${observacionCliente.apellido ?? ""}`.trim()}
          onClose={() => setObservacionCliente(null)}
          onSuccess={() => { setObservacionCliente(null); recargar() }}
        />
      )}
    </AppLayout>
  )
}