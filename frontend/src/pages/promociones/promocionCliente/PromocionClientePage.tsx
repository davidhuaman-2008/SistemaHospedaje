import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { promocionClienteService } from "@/services/promocionClienteService"
import { mensajeDeError } from "@/lib/errores"
import type { PromocionCliente } from "@/types/promocion"
import { PromocionClienteTabla } from "./PromocionClienteTabla"

export function PromocionClientePage() {
  const [items, setItems] = useState<PromocionCliente[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const datos = await promocionClienteService.listar()
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
    try { setItems(await promocionClienteService.listar()) }
    catch { toast.error("Error al recargar") }
  }

  const marcarUsado = async (item: PromocionCliente) => {
    if (!confirm(`Marcar como usado la promoción "${item.promocion?.nombre}"?`)) return
    try {
      await promocionClienteService.marcarUsado(item.id_promo_cliente)
      toast.success("Marcado como usado")
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: PromocionCliente) => {
    if (!confirm("Eliminar esta asignación?")) return
    try {
      await promocionClienteService.eliminar(item.id_promo_cliente)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Promociones Asignadas</h1>
      </div>
      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <PromocionClienteTabla items={items} onMarcarUsado={marcarUsado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}