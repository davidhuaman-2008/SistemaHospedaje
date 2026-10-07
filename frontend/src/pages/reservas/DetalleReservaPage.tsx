import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Reserva } from "@/types/reserva"
import { ModalCancelarReserva } from "./ModalCancelarReserva"
import { ModalAnularReserva } from "./ModalAnularReserva"
import { AgregarDecoracionModal } from "./AgregarDecoracionModal"
import { Sparkles } from "lucide-react"

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function DetalleReservaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [cargando, setCargando] = useState(true)
  const [mostrarCancelar, setMostrarCancelar] = useState(false)
  const [mostrarAnular, setMostrarAnular] = useState(false)
  const [mostrarDecoracion, setMostrarDecoracion] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const cargar = async () => {
    if (!id) return
    try {
      setCargando(true)
      const r = await reservaService.obtener(Number(id))
      setReserva(r)
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [id])

  const hacerCheckIn = async () => {
    if (!reserva) return
    try {
      setProcesando(true)
      await reservaService.checkIn(reserva.id_reserva)
      toast.success("Check-in realizado")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  if (cargando) {
    return (
      <AppLayout>
        <p className="text-slate-400">Cargando...</p>
      </AppLayout>
    )
  }

  if (!reserva) {
    return (
      <AppLayout>
        <p className="text-red-400">Reserva no encontrada</p>
      </AppLayout>
    )
  }

  if (mostrarCancelar) {
    return (
      <ModalCancelarReserva
        idReserva={reserva.id_reserva}
        onClose={() => setMostrarCancelar(false)}
        onSuccess={() => {
          setMostrarCancelar(false)
          cargar()
        }}
      />
    )
  }

  if (mostrarAnular) {
    return (
      <ModalAnularReserva
        idReserva={reserva.id_reserva}
        onClose={() => setMostrarAnular(false)}
        onSuccess={() => {
          setMostrarAnular(false)
          cargar()
        }}
      />
    )
  }

  if (mostrarDecoracion) {
    return (
      <AgregarDecoracionModal
        idReserva={reserva.id_reserva}
        idTipoHabitacion={reserva.habitacion?.id_tipo ?? 0}
        onClose={() => setMostrarDecoracion(false)}
        onSuccess={() => {
          setMostrarDecoracion(false)
          cargar()
        }}
      />
    )
  }

  const esConfirmada = reserva.estado?.slug === "confirmada" || reserva.estado?.slug === "pendiente"
  const esCancelada = reserva.estado?.slug === "cancelada" || reserva.estado?.slug === "anulada"

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/reservas")}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Reserva {reserva.codigo_reserva}</h1>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
            style={{
              background: (reserva.estado?.color ?? "#64748b") + "30",
              color: reserva.estado?.color ?? "#94a3b8",
            }}
          >
            {reserva.estado?.nombre}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Info */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded">
            <h2 className="text-lg font-bold text-white mb-3">👤 Cliente</h2>
            <p className="text-white">
              {reserva.cliente?.nombre} {reserva.cliente?.apellido}
            </p>
            <p className="text-slate-400 text-sm">DNI: {reserva.cliente?.numero_documento}</p>
            {reserva.telefono && (
              <p className="text-slate-400 text-sm">Tel: {reserva.telefono}</p>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <h2 className="text-lg font-bold text-white mb-3">🏨 Habitación</h2>
            <p className="text-white text-2xl font-bold">{reserva.habitacion?.numero ?? "—"}</p>
            <p className="text-slate-400 text-sm">
              {reserva.habitacion?.tipo?.nombre ?? ""}
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <h2 className="text-lg font-bold text-white mb-3">📅 Fechas</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Entrada:</span>
                <span className="text-white">{formatearFecha(reserva.fecha_entrada)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Salida prevista:</span>
                <span className="text-white">{formatearFecha(reserva.fecha_salida_prevista)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dinero + acciones */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded">
            <h2 className="text-lg font-bold text-white mb-3">💰 Dinero</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total:</span>
                <span className="text-white font-bold">S/ {Number(reserva.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pagado:</span>
                <span className="text-green-400 font-bold">S/ {Number(reserva.pagado).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2">
                <span className="text-slate-400">Saldo:</span>
                <span className={Number(reserva.saldo) > 0 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                  S/ {Number(reserva.saldo).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {esConfirmada && (
            <div className="bg-slate-800 p-4 rounded space-y-2">
              <h2 className="text-lg font-bold text-white mb-3">⚡ Acciones</h2>

              <button
                onClick={hacerCheckIn}
                disabled={procesando}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                Hacer Check-in (cliente llegó)
              </button>

              <button
                onClick={() => setMostrarDecoracion(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Agregar Decoración
              </button>

              <button
                onClick={() => setMostrarCancelar(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Cancelar Reserva (cliente canceló)
              </button>

              <button
                onClick={() => setMostrarAnular(true)}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                <AlertTriangle size={18} />
                Anular Reserva (error)
              </button>
            </div>
          )}

          {esCancelada && (
            <div className="bg-red-950/40 border border-red-800 p-4 rounded text-red-300 text-sm">
              {reserva.estado?.slug === "cancelada" ? "❌ Esta reserva fue cancelada." : "⚠️ Esta reserva fue anulada."}
              {reserva.motivo_anulacion && (
                <p className="mt-1">Motivo: {reserva.motivo_anulacion}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}