import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { RefreshCw, LayoutGrid, Zap, Wrench } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { habitacionMapaService } from "@/services/reservaService"
import { limpiezaService } from "@/services/limpiezaService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionMapa } from "@/types/reserva"
import { TarjetaHabitacion } from "./TarjetaHabitacion"
import { ModalHabitacionOcupada } from "./ModalHabitacionOcupada"
import { ModalLimpiezaHabitacion } from "./ModalLimpiezaHabitacion"
import { ModalMantenimientoHabitacion } from "./ModalMantenimientoHabitacion"
import { ReportarMantenimientoModal } from "./ReportarMantenimientoModal"

type FiltroEstado = "Todos" | "Disponible" | "Ocupada" | "PorVencer" | "Vencidas" | "Limpieza" | "Reservada" | "Mantenimiento" | "Inactiva"

export function RecepcionPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [habitaciones, setHabitaciones] = useState<HabitacionMapa[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalHabitacion, setModalHabitacion] = useState<HabitacionMapa | null>(null)
  const [modalLimpieza, setModalLimpieza] = useState<HabitacionMapa | null>(null)
  const [modalMantenimiento, setModalMantenimiento] = useState<HabitacionMapa | null>(null)
  const [filtro, setFiltro] = useState<FiltroEstado>("Todos")

  // Limpieza Rápida
  const [mostrarConfirmarRapida, setMostrarConfirmarRapida] = useState(false)
  const [procesandoRapida, setProcesandoRapida] = useState(false)

  // Reportar Mantenimiento
  const [mostrarReportar, setMostrarReportar] = useState(false)

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeOperarLimpieza = ["admin", "encargado", "limpieza"].includes(rolUsuario)
  const puedeReportarMantenimiento = ["admin", "encargado", "recepcionista"].includes(rolUsuario)

  const cargar = async () => {
    try {
      setCargando(true)
      const datos = await habitacionMapaService.listar()
      setHabitaciones(datos)
    } catch {
      toast.error("Error al cargar el mapa")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 15000)
    return () => clearInterval(intervalo)
  }, [])

  const handleClickHabitacion = (h: HabitacionMapa) => {
    if (h.estado === "Inactiva") {
      toast.error("Esta habitación está inactiva")
      return
    }
    if (h.estado === "Disponible") {
      navigate(`/recepcion/registrar/${h.id_habitacion}`)
      return
    }
    if (h.estado === "Ocupada" || h.estado === "Por vencer" || h.estado === "Vencida") {
      setModalHabitacion(h)
      return
    }
    if (h.estado === "Reservada") {
      toast.info("Esta habitación está reservada para una fecha futura")
      return
    }
    if (h.estado === "Limpieza") {
      setModalLimpieza(h)
      return
    }
    if (h.estado === "Mantenimiento") {
      setModalMantenimiento(h)
      return
    }
  }

  const handleLimpiezaRapida = async () => {
    setProcesandoRapida(true)
    try {
      const resultado = await limpiezaService.finalizarTodas("Limpieza rápida masiva")
      toast.success(`✅ ${resultado.total} habitaciones liberadas`)
      setMostrarConfirmarRapida(false)
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesandoRapida(false)
    }
  }

  // Contadores
  const contadores = {
    Todos: habitaciones.length,
    Disponible: habitaciones.filter(h => h.estado === "Disponible").length,
    Ocupada: habitaciones.filter(h =>
      h.estado === "Ocupada" || h.estado === "Por vencer" || h.estado === "Vencida"
    ).length,
    PorVencer: habitaciones.filter(h => h.estado === "Por vencer").length,
    Vencidas: habitaciones.filter(h => h.estado === "Vencida").length,
    Limpieza: habitaciones.filter(h => h.estado === "Limpieza").length,
    Mantenimiento: habitaciones.filter(h => h.estado === "Mantenimiento").length,
    Reservada: habitaciones.filter(h => h.estado === "Reservada").length,
    Inactiva: habitaciones.filter(h => h.estado === "Inactiva").length,
  }

  // Filtrado
  const habitacionesFiltradas = habitaciones.filter(h => {
    if (filtro === "Todos") return true
    if (filtro === "Ocupada") {
      return h.estado === "Ocupada" || h.estado === "Por vencer" || h.estado === "Vencida"
    }
    if (filtro === "PorVencer") {
      return h.estado === "Por vencer"
    }
    if (filtro === "Vencidas") {
      return h.estado === "Vencida"
    }
    return h.estado === filtro
  })

  const porPiso = habitacionesFiltradas.reduce((acc, h) => {
    if (!acc[h.id_piso]) {
      acc[h.id_piso] = { nombre: h.piso_nombre, items: [] }
    }
    acc[h.id_piso].items.push(h)
    return acc
  }, {} as Record<number, { nombre: string; items: HabitacionMapa[] }>)

  const filtros: Array<{ key: FiltroEstado; label: string; color: string; colorActivo: string; emoji: string }> = [
    { key: "Todos", label: "Todos", color: "bg-slate-700 hover:bg-slate-600 text-slate-200", colorActivo: "bg-slate-500 text-white border-slate-300", emoji: "📋" },
    { key: "Disponible", label: "Disponibles", color: "bg-green-900/40 hover:bg-green-900/60 text-green-300", colorActivo: "bg-green-600 text-white border-green-300", emoji: "🟢" },
    { key: "Ocupada", label: "Ocupadas", color: "bg-red-900/40 hover:bg-red-900/60 text-red-300", colorActivo: "bg-red-600 text-white border-red-300", emoji: "🔴" },
    { key: "PorVencer", label: "Por Vencer", color: "bg-yellow-900/40 hover:bg-yellow-900/60 text-yellow-300", colorActivo: "bg-yellow-600 text-white border-yellow-300", emoji: "🟡" },
    { key: "Vencidas", label: "Vencidas", color: "bg-red-800/60 hover:bg-red-800/80 text-red-200", colorActivo: "bg-red-700 text-white border-red-300", emoji: "⏰" },
    { key: "Limpieza", label: "Limpieza", color: "bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300", colorActivo: "bg-cyan-600 text-white border-cyan-300", emoji: "🔵" },
    { key: "Mantenimiento", label: "Mantenimiento", color: "bg-orange-900/40 hover:bg-orange-900/60 text-orange-300", colorActivo: "bg-orange-600 text-white border-orange-300", emoji: "🔧" },
    { key: "Reservada", label: "Reservadas", color: "bg-purple-900/40 hover:bg-purple-900/60 text-purple-300", colorActivo: "bg-purple-600 text-white border-purple-300", emoji: "🟣" },
    { key: "Inactiva", label: "Inactivas", color: "bg-slate-800 hover:bg-slate-700 text-slate-400", colorActivo: "bg-slate-600 text-white border-slate-400", emoji: "⚫" },
  ]

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <LayoutGrid size={24} /> Vista General — Recepción
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {contadores.Disponible} disponibles · {contadores.Ocupada} ocupadas
            {" · "}{contadores.Limpieza} en limpieza
            {contadores.Mantenimiento > 0 && ` · ${contadores.Mantenimiento} en mantenimiento`}
            {contadores.Reservada > 0 && ` · ${contadores.Reservada} reservadas`}
            {contadores.Inactiva > 0 && ` · ${contadores.Inactiva} inactivas`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {puedeOperarLimpieza && contadores.Limpieza > 0 && (
            <button
              onClick={() => setMostrarConfirmarRapida(true)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-medium text-white"
              title="Finalizar todas las limpiezas pendientes"
            >
              <Zap size={16} />
              Limpieza Rápida ({contadores.Limpieza})
            </button>
          )}
          {puedeReportarMantenimiento && (
            <button
              onClick={() => setMostrarReportar(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium text-white"
              title="Reportar problema de mantenimiento"
            >
              <Wrench size={16} />
              Reportar
            </button>
          )}
          <button
            onClick={cargar}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filtros.map(f => {
          const activo = filtro === f.key
          const count = contadores[f.key]

          return (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                activo ? f.colorActivo : f.color
              } ${count === 0 && f.key !== "Todos" ? "opacity-50" : ""}`}
            >
              <span className="mr-1">{f.emoji}</span>
              {f.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                activo ? "bg-black/30" : "bg-black/20"
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Mapa */}
      {cargando && habitaciones.length === 0 ? (
        <p className="text-slate-400">Cargando mapa...</p>
      ) : habitacionesFiltradas.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <p className="text-slate-400">
            No hay habitaciones con el estado "{filtro}"
          </p>
          <button
            onClick={() => setFiltro("Todos")}
            className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
          >
            Ver todas las habitaciones
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(porPiso).map(([idPiso, { nombre, items }]) => (
            <div key={idPiso}>
              <h2 className="text-lg font-semibold text-slate-300 mb-3">
                🏠 {nombre}
                <span className="text-slate-500 text-sm ml-2 font-normal">
                  ({items.length} {items.length === 1 ? "habitación" : "habitaciones"})
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {items.map(h => (
                  <TarjetaHabitacion
                    key={h.id_habitacion}
                    habitacion={h}
                    onClick={() => handleClickHabitacion(h)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      {modalHabitacion && (
        <ModalHabitacionOcupada
          habitacion={modalHabitacion}
          onClose={() => setModalHabitacion(null)}
          onRefresh={() => { setModalHabitacion(null); cargar() }}
        />
      )}

      {modalLimpieza && (
        <ModalLimpiezaHabitacion
          habitacion={modalLimpieza}
          onClose={() => setModalLimpieza(null)}
          onRefresh={() => { setModalLimpieza(null); cargar() }}
        />
      )}

      {modalMantenimiento && (
        <ModalMantenimientoHabitacion
          habitacion={modalMantenimiento}
          onClose={() => setModalMantenimiento(null)}
          onRefresh={() => { setModalMantenimiento(null); cargar() }}
        />
      )}

      {/* Modal Reportar Mantenimiento */}
      {mostrarReportar && (
        <ReportarMantenimientoModal
          onClose={() => setMostrarReportar(false)}
          onSuccess={() => { setMostrarReportar(false); cargar() }}
        />
      )}

      {/* Modal Limpieza Rápida */}
      {mostrarConfirmarRapida && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setMostrarConfirmarRapida(false)}>
          <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-cyan-900 p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-white" />
                <h3 className="text-lg font-bold text-white">Limpieza Rápida</h3>
              </div>
              <button onClick={() => setMostrarConfirmarRapida(false)} className="text-cyan-200 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-cyan-900/30 border border-cyan-700 p-3 rounded">
                <p className="text-cyan-200 text-sm">
                  ¿Finalizar las <strong>{contadores.Limpieza}</strong> limpiezas pendientes de una sola vez?
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded max-h-40 overflow-y-auto">
                <p className="text-slate-400 text-xs mb-2">Habitaciones a liberar:</p>
                <div className="flex flex-wrap gap-1">
                  {habitaciones
                    .filter(h => h.estado === "Limpieza")
                    .map(h => (
                      <span key={h.id_habitacion} className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded">
                        {h.numero}
                      </span>
                    ))}
                </div>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded">
                <p className="text-yellow-200 text-xs">
                  ⚠️ Todas las habitaciones pasarán a <strong>Disponible</strong> inmediatamente.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleLimpiezaRapida}
                  disabled={procesandoRapida}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
                >
                  {procesandoRapida ? "Procesando..." : "Confirmar Limpieza Rápida"}
                </button>
                <button
                  onClick={() => setMostrarConfirmarRapida(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
                >
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