import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Reserva } from "@/types/reserva"
import { AgregarConsumoModal } from "./AgregarConsumoModal"

export function CheckoutPage() {
  const { idReserva } = useParams<{ idReserva: string }>()
  const navigate = useNavigate()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [cargando, setCargando] = useState(true)
  const [montoFinal, setMontoFinal] = useState(0)
  const [mostrarAgregarConsumo, setMostrarAgregarConsumo] = useState(false)

  const cargar = async () => {
    try {
      setCargando(true)
      const r = await reservaService.obtener(Number(idReserva))
      setReserva(r)
      setMontoFinal(0)
    } catch {
      toast.error("Error al cargar reserva")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [idReserva])

  const finalizarCheckout = async () => {
    try {
      await reservaService.checkOut(Number(idReserva), montoFinal)
      toast.success("Check-out realizado")
      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminarConsumo = async (idConsumo: number) => {
    if (!confirm("¿Eliminar este consumo? Se devolverá al stock.")) return
    try {
      await reservaService.eliminarConsumo(Number(idReserva), idConsumo)
      toast.success("Consumo eliminado")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
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

  const fechaEntrada = new Date(reserva.fecha_entrada)
  const ahora = new Date()
  const minutosTranscurridos = Math.floor((ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60))
  const horasTranscurridas = Math.floor(minutosTranscurridos / 60)
  const minutosRestantes = minutosTranscurridos % 60
  const horasContratadas = reserva.horas_base
  const horasExtra = Math.max(0, horasTranscurridas - horasContratadas)

  // Cálculos
  const montoHabitacion = Number(reserva.monto_habitacion)
  const montoConsumos = Number(reserva.monto_consumos)
  const montoHorasExtra = Number(reserva.monto_horas_extra)
  const montoAjustes = Number(reserva.monto_ajustes)
  const descuento = Number(reserva.descuento)
  const total = Number(reserva.total)
  const pagado = Number(reserva.pagado)
  const saldo = Number(reserva.saldo)

  // Vuelto final = pagado - total
  const vueltoFinal = pagado - total

  return (
    <AppLayout>
      <button
        onClick={() => navigate("/recepcion")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Volver al mapa
      </button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">
          Check-out — Habitación {reserva.habitacion?.numero}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Reserva {reserva.codigo_reserva}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info + Consumos */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Información</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Cliente</span>
                <span className="text-white">{reserva.cliente?.nombre} {reserva.cliente?.apellido}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Documento</span>
                <span className="text-white">{reserva.cliente?.numero_documento ?? "—"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Habitación</span>
                <span className="text-white">{reserva.habitacion?.numero} ({reserva.habitacion?.tipo?.nombre})</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Hora entrada</span>
                <span className="text-white">{fechaEntrada.toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Tiempo transcurrido</span>
                <span className="text-yellow-300 font-semibold">
                  {horasTranscurridas}h {minutosRestantes}m
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Horas contratadas</span>
                <span className="text-white">{horasContratadas}h</span>
              </div>
              {horasExtra > 0 && (
                <div className="bg-yellow-900/40 border border-yellow-700 p-2 rounded">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ Excedió {horasExtra} hora(s) — cobrar extra
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Consumos */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Consumos</h2>
              <button
                onClick={() => setMostrarAgregarConsumo(true)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
              >
                <Plus size={14} /> Agregar
              </button>
            </div>

            {!reserva.consumos || reserva.consumos.length === 0 ? (
              <p className="text-slate-500 text-sm">Sin consumos registrados</p>
            ) : (
              <div className="space-y-2">
                {reserva.consumos.map(c => (
                  <div key={c.id_consumo} className="flex justify-between items-center bg-slate-900 p-2 rounded">
                    <div className="flex-1">
                      <p className="text-white text-sm">{c.producto?.nombre}</p>
                      <p className="text-slate-500 text-xs">
                        {c.cantidad} × S/ {Number(c.precio_unitario).toFixed(2)}
                        {c.pagado && <span className="text-green-400 ml-2">(pagado)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-semibold text-sm">
                        S/ {Number(c.subtotal).toFixed(2)}
                      </span>
                      <button
                        onClick={() => eliminarConsumo(c.id_consumo)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pago */}
        <div className="bg-slate-800 p-5 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Resumen de Pago</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Habitación</span>
              <span className="text-white">S/ {montoHabitacion.toFixed(2)}</span>
            </div>
            {montoConsumos > 0 && (
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Consumos</span>
                <span className="text-white">S/ {montoConsumos.toFixed(2)}</span>
              </div>
            )}
            {montoHorasExtra > 0 && (
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Horas extra</span>
                <span className="text-white">S/ {montoHorasExtra.toFixed(2)}</span>
              </div>
            )}
            {montoAjustes !== 0 && (
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Ajustes</span>
                <span className="text-white">S/ {montoAjustes.toFixed(2)}</span>
              </div>
            )}
            {descuento > 0 && (
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Descuento ({reserva.descuento_porcentaje}%)</span>
                <span className="text-green-400">-S/ {descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-slate-600 pt-2">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-bold text-lg">S/ {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Pagado</span>
              <span className="text-blue-400">S/ {pagado.toFixed(2)}</span>
            </div>

            {/* Vuelto final */}
            <div className={`p-3 rounded ${vueltoFinal > 0 ? "bg-yellow-900/40 border border-yellow-700" : vueltoFinal < 0 ? "bg-red-900/40 border border-red-700" : "bg-green-900/40 border border-green-700"}`}>
              {vueltoFinal > 0 ? (
                <div className="flex justify-between">
                  <span className="text-yellow-300 font-semibold">💵 Vuelto a entregar</span>
                  <span className="text-yellow-300 font-bold text-lg">S/ {vueltoFinal.toFixed(2)}</span>
                </div>
              ) : vueltoFinal < 0 ? (
                <div className="flex justify-between">
                  <span className="text-red-300 font-semibold">💰 Cliente debe</span>
                  <span className="text-red-300 font-bold text-lg">S/ {Math.abs(vueltoFinal).toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-green-300 text-center font-semibold">
                  ✅ Todo pagado
                </div>
              )}
            </div>

            <div className="pt-3">
              <label className="text-slate-300 text-sm block mb-1">
                Monto final a cobrar (si corresponde)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={montoFinal}
                onChange={e => setMontoFinal(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded text-lg"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={finalizarCheckout}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
            >
              Finalizar Check-out
            </button>
            <button
              onClick={() => navigate("/recepcion")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {mostrarAgregarConsumo && (
        <AgregarConsumoModal
          idReserva={Number(idReserva)}
          onClose={() => setMostrarAgregarConsumo(false)}
          onSuccess={() => { setMostrarAgregarConsumo(false); cargar() }}
        />
      )}
    </AppLayout>
  )
}