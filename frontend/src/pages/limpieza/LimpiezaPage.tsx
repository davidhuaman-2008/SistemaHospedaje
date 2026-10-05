import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RefreshCw, Plus, Filter } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { limpiezaService } from "@/services/limpiezaService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import type { Limpieza, LimpiezaPendientesResponse } from "@/types/limpieza"
import { TarjetaLimpieza } from "./TarjetaLimpieza"
import { NuevaLimpiezaModal } from "./NuevaLimpiezaModal"

export function LimpiezaPage() {
  const { usuario } = useAuth()
  const [data, setData] = useState<LimpiezaPendientesResponse>({
    pendientes: [],
    completadas_hoy: [],
    total_pendientes: 0,
  })
  const [cargando, setCargando] = useState(true)
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [filtroPiso, setFiltroPiso] = useState<string>("todos")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")

  // Detectar rol del usuario
  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeOperar = ["admin", "encargado", "limpieza"].includes(rolUsuario)

  const cargar = async (silencioso = false) => {
    try {
      if (!silencioso) setCargando(true)
      const resp = await limpiezaService.listarPendientes()
      setData(resp)
    } catch {
      if (!silencioso) toast.error("Error al cargar limpiezas")
    } finally {
      if (!silencioso) setCargando(false)
    }
  }

  // Cargar al inicio
  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh cada 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        cargar(true)
      }
    }, 20000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const iniciar = async (id: number) => {
    try {
      await limpiezaService.iniciar(id)
      toast.success("Limpieza iniciada")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const finalizar = async (id: number) => {
    if (!confirm("¿Confirmás que terminaste la limpieza?")) return
    try {
      await limpiezaService.finalizar(id)
      toast.success("Limpieza completada. Habitación disponible ✅")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  // Aplicar filtros
  const aplicarFiltros = (lista: Limpieza[]) => {
    return lista.filter(l => {
      if (filtroPiso !== "todos" && l.habitacion?.piso?.nombre !== filtroPiso) return false
      if (filtroTipo !== "todos" && l.tipo !== filtroTipo) return false
      return true
    })
  }

  const pendientesFiltradas = aplicarFiltros(data.pendientes).filter(l => l.estado === "PENDIENTE")
  const enProcesoFiltradas = aplicarFiltros(data.pendientes).filter(l => l.estado === "EN_PROCESO")
  const completadasFiltradas = aplicarFiltros(data.completadas_hoy)

  // Pisos únicos
  const pisosUnicos = Array.from(
    new Set(data.pendientes.map(l => l.habitacion?.piso?.nombre).filter(Boolean))
  ) as string[]

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">🧹 Cola de Limpieza</h1>
          <p className="text-slate-400 text-sm mt-1">
            <span className="text-yellow-400 font-semibold">{pendientesFiltradas.length}</span> pendientes ·{" "}
            <span className="text-blue-400 font-semibold">{enProcesoFiltradas.length}</span> en proceso ·{" "}
            <span className="text-green-400 font-semibold">{completadasFiltradas.length}</span> completadas hoy
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => cargar()}
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
            title="Actualizar"
          >
            <RefreshCw size={16} />
          </button>
          {puedeOperar && (
            <button
              onClick={() => setMostrarNueva(true)}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium"
            >
              <Plus size={16} /> Nueva Limpieza
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800 p-3 rounded-lg mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-slate-400 text-xs">Filtros:</span>
        </div>

        <select
          value={filtroPiso}
          onChange={e => setFiltroPiso(e.target.value)}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700"
        >
          <option value="todos">Todos los pisos</option>
          {pisosUnicos.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700"
        >
          <option value="todos">Todos los tipos</option>
          <option value="NORMAL">Normal</option>
          <option value="PROFUNDA">Profunda</option>
        </select>
      </div>

      {cargando ? (
        <p className="text-slate-400 text-center py-8">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* COLUMNA IZQUIERDA: Pendientes */}
          <div>
            <h2 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              🟡 PENDIENTES ({pendientesFiltradas.length})
            </h2>
            {pendientesFiltradas.length === 0 ? (
              <div className="bg-slate-800 p-4 rounded text-center text-slate-500 text-sm">
                No hay tareas pendientes ✅
              </div>
            ) : (
              <div className="space-y-3">
                {pendientesFiltradas.map(l => (
                  <TarjetaLimpieza
                    key={l.id_limpieza}
                    limpieza={l}
                    onIniciar={iniciar}
                    puedeOperar={puedeOperar}
                  />
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: En proceso + Completadas */}
          <div className="space-y-6">
            <div>
              <h2 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                🔵 EN PROCESO ({enProcesoFiltradas.length})
              </h2>
              {enProcesoFiltradas.length === 0 ? (
                <div className="bg-slate-800 p-4 rounded text-center text-slate-500 text-sm">
                  Ninguna tarea en proceso
                </div>
              ) : (
                <div className="space-y-3">
                  {enProcesoFiltradas.map(l => (
                    <TarjetaLimpieza
                      key={l.id_limpieza}
                      limpieza={l}
                      onFinalizar={finalizar}
                      puedeOperar={puedeOperar}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                ✅ COMPLETADAS HOY ({completadasFiltradas.length})
              </h2>
              {completadasFiltradas.length === 0 ? (
                <div className="bg-slate-800 p-4 rounded text-center text-slate-500 text-sm">
                  Aún no hay tareas completadas hoy
                </div>
              ) : (
                <div className="space-y-2">
                  {completadasFiltradas.map(l => (
                    <TarjetaLimpieza
                      key={l.id_limpieza}
                      limpieza={l}
                      puedeOperar={puedeOperar}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarNueva && (
        <NuevaLimpiezaModal
          onClose={() => setMostrarNueva(false)}
          onSuccess={() => { setMostrarNueva(false); cargar() }}
        />
      )}
    </AppLayout>
  )
}