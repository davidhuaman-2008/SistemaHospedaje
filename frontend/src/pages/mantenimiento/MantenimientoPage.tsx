import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RefreshCw, Plus, Wrench, Play, Check, X } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { mantenimientoService } from "@/services/mantenimientoService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import { IconoDinamico } from "@/components/IconoDinamico"
import type { Mantenimiento } from "@/types/mantenimiento"
import { ReportarMantenimientoModal } from "@/pages/recepcion/ReportarMantenimientoModal"

function tiempoRelativo(fecha: string | null): string {
  if (!fecha) return "—"
  const ahora = new Date().getTime()
  const entonces = new Date(fecha).getTime()
  const diffMin = Math.floor((ahora - entonces) / (1000 * 60))
  if (diffMin < 1) return "hace menos de 1 min"
  if (diffMin < 60) return `hace ${diffMin} min`
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  if (m === 0) return `hace ${h}h`
  return `hace ${h}h ${m}m`
}

export function MantenimientoPage() {
  const { usuario } = useAuth()
  const [items, setItems] = useState<Mantenimiento[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState<string>("activos")
  const [cancelando, setCancelando] = useState<Mantenimiento | null>(null)
  const [motivoCancel, setMotivoCancel] = useState("")

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeOperar = ["admin", "encargado", "recepcionista"].includes(rolUsuario)

  const cargar = async (silencioso = false) => {
    try {
      if (!silencioso) setCargando(true)
      const datos = await mantenimientoService.listar()
      setItems(datos)
    } catch {
      if (!silencioso) toast.error("Error al cargar")
    } finally {
      if (!silencioso) setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") cargar(true)
    }, 20000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const iniciar = async (m: Mantenimiento) => {
    try {
      await mantenimientoService.iniciar(m.id_mantenimiento)
      toast.success("Mantenimiento iniciado")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const resolver = async (m: Mantenimiento) => {
    if (!confirm(`¿Resolver mantenimiento de la hab. ${m.habitacion?.numero}?\n\nSe creará una limpieza automática.`)) return
    try {
      await mantenimientoService.resolver(m.id_mantenimiento)
      toast.success("Mantenimiento resuelto. Se creó limpieza automática.")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cancelar = async () => {
    if (!cancelando) return
    if (!motivoCancel.trim()) return toast.error("Ingresá el motivo")
    try {
      await mantenimientoService.cancelar(cancelando.id_mantenimiento, motivoCancel.trim())
      toast.success("Mantenimiento cancelado")
      setCancelando(null); setMotivoCancel("")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const filtrados = items.filter(m => {
    if (filtroEstado === "activos") return ["REPORTADO", "EN_PROCESO"].includes(m.estado)
    if (filtroEstado === "todos") return true
    return m.estado === filtroEstado
  })

  const contadores = {
    activos: items.filter(m => ["REPORTADO", "EN_PROCESO"].includes(m.estado)).length,
    reportados: items.filter(m => m.estado === "REPORTADO").length,
    enProceso: items.filter(m => m.estado === "EN_PROCESO").length,
    resueltos: items.filter(m => m.estado === "RESUELTO").length,
    cancelados: items.filter(m => m.estado === "CANCELADO").length,
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Wrench size={24} /> Mantenimiento
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            <span className="text-yellow-400 font-semibold">{contadores.reportados}</span> reportados ·{" "}
            <span className="text-orange-400 font-semibold">{contadores.enProceso}</span> en proceso ·{" "}
            <span className="text-green-400 font-semibold">{contadores.resueltos}</span> resueltos
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => cargar()}
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
          >
            <RefreshCw size={16} />
          </button>
          {puedeOperar && (
            <button
              onClick={() => setMostrarNuevo(true)}
              className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium"
            >
              <Plus size={16} /> Nuevo Reporte
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "activos", label: "Activos", count: contadores.activos },
          { key: "REPORTADO", label: "Reportados", count: contadores.reportados },
          { key: "EN_PROCESO", label: "En Proceso", count: contadores.enProceso },
          { key: "RESUELTO", label: "Resueltos", count: contadores.resueltos },
          { key: "CANCELADO", label: "Cancelados", count: contadores.cancelados },
          { key: "todos", label: "Todos", count: items.length },
        ].map(f => {
          const activo = filtroEstado === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFiltroEstado(f.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                activo
                  ? "bg-slate-500 text-white border-slate-300"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent"
              }`}
            >
              {f.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${activo ? "bg-black/30" : "bg-black/20"}`}>
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {cargando ? (
        <p className="text-slate-400 text-center py-8">Cargando...</p>
      ) : filtrados.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <p className="text-slate-400">No hay mantenimientos con este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(m => {
            const colorEstado =
              m.estado === "REPORTADO" ? "border-l-yellow-500" :
              m.estado === "EN_PROCESO" ? "border-l-orange-500" :
              m.estado === "RESUELTO" ? "border-l-green-500" :
              "border-l-slate-500"

            return (
              <div key={m.id_mantenimiento} className={`bg-slate-800 rounded-lg p-4 border-l-4 ${colorEstado}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-bold">
                        🛏️ Hab. {m.habitacion?.numero || "—"}
                      </h3>
                      <span className="text-slate-500 text-xs">
                        {m.habitacion?.piso?.nombre} · {m.habitacion?.tipo?.nombre}
                      </span>
                      {m.tipo?.icono && (
                        <IconoDinamico
                          nombre={m.tipo.icono}
                          size={16}
                          style={{ color: m.tipo.color || "#fff" }}
                        />
                      )}
                      <span className="text-slate-400 text-xs">{m.tipo?.nombre}</span>
                      {m.prioridad && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-semibold text-white"
                          style={{ background: m.prioridad.color || "#64748b" }}
                        >
                          {m.prioridad.nombre.toUpperCase()}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        m.estado === "REPORTADO" ? "bg-yellow-900 text-yellow-200" :
                        m.estado === "EN_PROCESO" ? "bg-orange-900 text-orange-200" :
                        m.estado === "RESUELTO" ? "bg-green-900 text-green-200" :
                        "bg-slate-700 text-slate-300"
                      }`}>
                        {m.estado}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mt-2">{m.descripcion}</p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span>Reportado {tiempoRelativo(m.fecha_reporte)}</span>
                      {m.usuario_reporta && (
                        <span>Por: {m.usuario_reporta.nombre} {m.usuario_reporta.apellido}</span>
                      )}
                      {m.usuario_asignado && (
                        <span>Asignado: {m.usuario_asignado.nombre} {m.usuario_asignado.apellido}</span>
                      )}
                      {m.fecha_resolucion && (
                        <span>Resuelto: {new Date(m.fecha_resolucion).toLocaleString("es-PE")}</span>
                      )}
                    </div>
                  </div>

                  {puedeOperar && (
                    <div className="flex flex-col gap-1 shrink-0">
                      {m.estado === "REPORTADO" && (
                        <button
                          onClick={() => iniciar(m)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
                        >
                          <Play size={12} /> Iniciar
                        </button>
                      )}
                      {m.estado === "EN_PROCESO" && (
                        <button
                          onClick={() => resolver(m)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
                        >
                          <Check size={12} /> Resolver
                        </button>
                      )}
                      {["REPORTADO", "EN_PROCESO"].includes(m.estado) && (
                        <button
                          onClick={() => setCancelando(m)}
                          className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
                        >
                          <X size={12} /> Cancelar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Nuevo Reporte */}
      {mostrarNuevo && (
        <ReportarMantenimientoModal
          onClose={() => setMostrarNuevo(false)}
          onSuccess={() => { setMostrarNuevo(false); cargar() }}
        />
      )}

      {/* Modal Cancelar */}
      {cancelando && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={() => setCancelando(null)}>
          <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Cancelar Mantenimiento</h3>
              <button onClick={() => setCancelando(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-slate-300 text-sm">
                ¿Cancelar el mantenimiento de la hab. <strong>{cancelando.habitacion?.numero}</strong>?
              </p>
              <div>
                <label className="text-slate-300 text-sm block mb-1">Motivo *</label>
                <textarea
                  value={motivoCancel}
                  onChange={e => setMotivoCancel(e.target.value)}
                  rows={3}
                  placeholder="Ej: No era nada, el huésped no supo usar el jacuzzi"
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={cancelar} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium">
                  Confirmar Cancelación
                </button>
                <button onClick={() => setCancelando(null)} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}