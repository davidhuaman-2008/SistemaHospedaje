import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { X, Wrench, Play, Check, User, Clock, ListTodo } from "lucide-react"
import { mantenimientoService } from "@/services/mantenimientoService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import { IconoDinamico } from "@/components/IconoDinamico"
import type { HabitacionMapa } from "@/types/reserva"
import type { Mantenimiento } from "@/types/mantenimiento"

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

export function ModalMantenimientoHabitacion({ habitacion, onClose, onRefresh }: Props) {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [mantenimiento, setMantenimiento] = useState<Mantenimiento | null>(null)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeOperar = ["admin", "encargado", "recepcionista"].includes(rolUsuario)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        if (habitacion.id_mantenimiento) {
          const m = await mantenimientoService.obtener(habitacion.id_mantenimiento)
          setMantenimiento(m)
        }
      } catch {
        toast.error("Error al cargar mantenimiento")
      } finally {
        setCargando(false)
      }
    }
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitacion.id_mantenimiento])

  const iniciar = async () => {
    if (!mantenimiento) return
    setProcesando(true)
    try {
      await mantenimientoService.iniciar(mantenimiento.id_mantenimiento)
      toast.success("Mantenimiento iniciado")
      onRefresh(); onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  const resolver = async () => {
    if (!mantenimiento) return
    if (!confirm("¿Confirmás que el mantenimiento está resuelto?\n\nSe creará una limpieza automática.")) return
    setProcesando(true)
    try {
      await mantenimientoService.resolver(mantenimiento.id_mantenimiento)
      toast.success("Mantenimiento resuelto. Se creó limpieza automática.")
      onRefresh(); onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  const irAListaCompleta = () => {
    onClose()
    navigate("/mantenimiento")
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="bg-orange-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Habitación en Mantenimiento</h3>
              <p className="text-orange-200 text-xs">
                🛏️ {habitacion.numero} · {habitacion.tipo_nombre || ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-orange-200 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : !mantenimiento ? (
          <div className="p-6 text-center text-slate-400">No se encontró el mantenimiento</div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Estado */}
            <div className={`p-3 rounded border ${
              mantenimiento.estado === "REPORTADO" ? "bg-yellow-900/40 border-yellow-700" : "bg-orange-900/40 border-orange-700"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${
                  mantenimiento.estado === "REPORTADO" ? "text-yellow-300" : "text-orange-300"
                }`}>
                  {mantenimiento.estado === "REPORTADO" ? "🟡 REPORTADO" : "🔧 EN PROCESO"}
                </span>
                {mantenimiento.prioridad && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-semibold text-white"
                    style={{ background: mantenimiento.prioridad.color || "#64748b" }}
                  >
                    {mantenimiento.prioridad.nombre.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock size={12} />
                  <span>Reportado hace {formatearTiempo(minutosDesde(mantenimiento.fecha_reporte))}</span>
                </div>
                {mantenimiento.usuario_asignado && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <User size={12} />
                    <span>{mantenimiento.usuario_asignado.nombre} {mantenimiento.usuario_asignado.apellido}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tipo */}
            {mantenimiento.tipo && (
              <div className="bg-slate-900 p-3 rounded flex items-center gap-3">
                {mantenimiento.tipo.icono && (
                  <IconoDinamico
                    nombre={mantenimiento.tipo.icono}
                    size={24}
                    style={{ color: mantenimiento.tipo.color || "#fff" }}
                  />
                )}
                <div>
                  <p className="text-slate-400 text-xs">Tipo de problema:</p>
                  <p className="text-white font-medium text-sm">{mantenimiento.tipo.nombre}</p>
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-400 text-xs mb-1">Descripción:</p>
              <p className="text-slate-200 text-sm">{mantenimiento.descripcion}</p>
            </div>

            {/* Observaciones */}
            {mantenimiento.observaciones && (
              <div className="bg-slate-900 p-3 rounded">
                <p className="text-slate-400 text-xs mb-1">Observaciones:</p>
                <p className="text-slate-300 text-sm italic">{mantenimiento.observaciones}</p>
              </div>
            )}

            {/* Reportado por */}
            {mantenimiento.usuario_reporta && (
              <div className="text-xs text-slate-500 text-center">
                Reportado por {mantenimiento.usuario_reporta.nombre} {mantenimiento.usuario_reporta.apellido}
              </div>
            )}

            {/* Botones */}
            {puedeOperar && (
              <div className="space-y-2 pt-2">
                {mantenimiento.estado === "REPORTADO" && (
                  <button
                    onClick={iniciar}
                    disabled={procesando}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                  >
                    <Play size={16} /> {procesando ? "Iniciando..." : "Iniciar Mantenimiento"}
                  </button>
                )}

                {mantenimiento.estado === "EN_PROCESO" && (
                  <button
                    onClick={resolver}
                    disabled={procesando}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> {procesando ? "Resolviendo..." : "Marcar como Resuelto"}
                  </button>
                )}
              </div>
            )}

            {!puedeOperar && (
              <div className="bg-slate-900/60 p-3 rounded text-center text-slate-500 text-xs">
                Solo admin, encargado o recepcionista pueden operar
              </div>
            )}

            <button
              onClick={irAListaCompleta}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
            >
              <ListTodo size={14} /> Ver todos los mantenimientos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}