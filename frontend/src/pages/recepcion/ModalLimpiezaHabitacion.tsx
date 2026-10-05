import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { X, Play, Check, Clock, User, Sparkles, ListTodo } from "lucide-react"
import { limpiezaService } from "@/services/limpiezaService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import type { HabitacionMapa } from "@/types/reserva"
import type { Limpieza } from "@/types/limpieza"

interface Props {
  habitacion: HabitacionMapa
  onClose: () => void
  onRefresh: () => void
}

function formatearTiempo(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function minutosDesde(fecha: string | null): number {
  if (!fecha) return 0
  return Math.floor((new Date().getTime() - new Date(fecha).getTime()) / (1000 * 60))
}

export function ModalLimpiezaHabitacion({ habitacion, onClose, onRefresh }: Props) {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [limpieza, setLimpieza] = useState<Limpieza | null>(null)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeOperar = ["admin", "encargado", "limpieza"].includes(rolUsuario)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const todas = await limpiezaService.listar()
        // Buscar la limpieza activa de esta habitación
        const activa = todas.find(
          l => l.id_habitacion === habitacion.id_habitacion &&
               (l.estado === "PENDIENTE" || l.estado === "EN_PROCESO")
        )
        setLimpieza(activa || null)
      } catch {
        toast.error("Error al cargar limpieza")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [habitacion.id_habitacion])

  const iniciar = async () => {
    if (!limpieza) return
    setProcesando(true)
    try {
      await limpiezaService.iniciar(limpieza.id_limpieza)
      toast.success("Limpieza iniciada")
      onRefresh()
      onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  const finalizar = async () => {
    if (!limpieza) return
    if (!confirm("¿Confirmás que terminaste la limpieza de esta habitación?")) return
    setProcesando(true)
    try {
      await limpiezaService.finalizar(limpieza.id_limpieza)
      toast.success(`Habitación ${habitacion.numero} disponible ✅`)
      onRefresh()
      onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  const irAColaCompleta = () => {
    onClose()
    navigate("/limpieza")
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-cyan-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Habitación en Limpieza</h3>
              <p className="text-cyan-200 text-xs">
                🛏️ {habitacion.numero} · {habitacion.tipo_nombre || ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-cyan-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : !limpieza ? (
          <div className="p-6 text-center text-slate-400">
            No se encontró la limpieza activa
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Estado */}
            <div className={`p-3 rounded border ${
              limpieza.estado === "PENDIENTE"
                ? "bg-yellow-900/40 border-yellow-700"
                : "bg-blue-900/40 border-blue-700"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${
                  limpieza.estado === "PENDIENTE" ? "text-yellow-300" : "text-blue-300"
                }`}>
                  {limpieza.estado === "PENDIENTE" ? "🟡 PENDIENTE" : "🔵 EN PROCESO"}
                </span>
                {limpieza.tipo === "PROFUNDA" && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-semibold">
                    PROFUNDA
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock size={12} />
                  {limpieza.estado === "PENDIENTE" ? (
                    <span>
                      Solicitada hace {formatearTiempo(minutosDesde(limpieza.fecha_solicitud))}
                    </span>
                  ) : (
                    <span>
                      Iniciada hace {formatearTiempo(minutosDesde(limpieza.fecha_inicio))}
                    </span>
                  )}
                </div>

                {limpieza.usuario_asignado && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <User size={12} />
                    <span>
                      {limpieza.usuario_asignado.nombre} {limpieza.usuario_asignado.apellido}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Observaciones */}
            {limpieza.observaciones && (
              <div className="bg-slate-900 p-3 rounded">
                <p className="text-slate-400 text-xs mb-1">Observaciones:</p>
                <p className="text-slate-300 text-sm italic">"{limpieza.observaciones}"</p>
              </div>
            )}

            {/* Info del tipo de habitación */}
            <div className="bg-slate-900 p-3 rounded text-xs">
              <p className="text-slate-400 mb-1">Detalles de la habitación:</p>
              <p className="text-slate-300">
                {habitacion.piso_nombre} · {habitacion.tipo_nombre}
              </p>
            </div>

            {/* Botones de acción */}
            {puedeOperar ? (
              <div className="space-y-2 pt-2">
                {limpieza.estado === "PENDIENTE" && (
                  <button
                    onClick={iniciar}
                    disabled={procesando}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                  >
                    <Play size={16} /> {procesando ? "Iniciando..." : "Iniciar Limpieza"}
                  </button>
                )}

                {limpieza.estado === "EN_PROCESO" && (
                  <button
                    onClick={finalizar}
                    disabled={procesando}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> {procesando ? "Finalizando..." : "Finalizar Limpieza"}
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/60 p-3 rounded text-center text-slate-500 text-xs">
                Solo admin, encargado o personal de limpieza pueden operar
              </div>
            )}

            {/* Link a cola completa */}
            <button
              onClick={irAColaCompleta}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
            >
              <ListTodo size={14} /> Ver cola completa de limpieza
            </button>
          </div>
        )}
      </div>
    </div>
  )
}