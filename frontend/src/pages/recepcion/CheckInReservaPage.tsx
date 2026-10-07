import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Ban, Clock,
  Plus, Trash2, DollarSign, CreditCard, XCircle,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { reservaService } from "@/services/reservaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { InfoCheckIn } from "@/types/reserva"
import type { MetodoPago } from "@/types/configuracion"
import { AlertaClienteObservaciones } from "@/pages/clientes/cliente/AlertaClienteObservaciones"
import { AgregarConsumoModal } from "./AgregarConsumoModal"
import { ModalAnularReservaCheckIn } from "./ModalAnularReservaCheckIn"

interface PagoItem {
  id: number
  id_metodo_pago: number | null
  monto: number
}

type ModoCobro = "unico" | "varios"

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

function formatearHora(fecha: string | null): string {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function minutosTarde(fechaReserva: string): number {
  const reserva = new Date(fechaReserva).getTime()
  const ahora = Date.now()
  return Math.floor((ahora - reserva) / (1000 * 60))
}

function formatearDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos}m`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function CheckInReservaPage() {
  const { idReserva } = useParams<{ idReserva: string }>()
  const navigate = useNavigate()

  const [info, setInfo] = useState<InfoCheckIn | null>(null)
  const [cargando, setCargando] = useState(true)
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [procesando, setProcesando] = useState(false)
  const [mostrarConsumos, setMostrarConsumos] = useState(false)
  const [mostrarAnular, setMostrarAnular] = useState(false)

  // Cobro del saldo
  const [modoCobro, setModoCobro] = useState<ModoCobro>("unico")
  const [montoUnico, setMontoUnico] = useState(0)
  const [idMetodoPagoUnico, setIdMetodoPagoUnico] = useState<number | null>(null)
  const [pagosMixtos, setPagosMixtos] = useState<PagoItem[]>([
    { id: 1, id_metodo_pago: null, monto: 0 },
  ])
  const [contadorPago, setContadorPago] = useState(2)

  const cargar = async () => {
    if (!idReserva) return
    try {
      setCargando(true)
      const [dataInfo, mps] = await Promise.all([
        reservaService.infoCheckIn(Number(idReserva)),
        metodoPagoService.listarActivos(),
      ])
      setInfo(dataInfo)
      setMetodosPago(mps)

      const saldo = Number(dataInfo.saldo_pendiente)
      if (saldo > 0) setMontoUnico(saldo)

      const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
      if (efectivo) {
        setIdMetodoPagoUnico(efectivo.id_metodo)
        setPagosMixtos([{ id: 1, id_metodo_pago: efectivo.id_metodo, monto: saldo }])
      } else if (mps.length > 0) {
        setIdMetodoPagoUnico(mps[0].id_metodo)
        setPagosMixtos([{ id: 1, id_metodo_pago: mps[0].id_metodo, monto: saldo }])
      }
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idReserva])

  const cambiarModo = (nuevoModo: ModoCobro) => {
    if (nuevoModo === modoCobro) return

    if (nuevoModo === "varios" && modoCobro === "unico" && montoUnico > 0) {
      setPagosMixtos([
        { id: 1, id_metodo_pago: idMetodoPagoUnico, monto: montoUnico },
        { id: 2, id_metodo_pago: null, monto: 0 },
      ])
      setContadorPago(3)
    } else if (nuevoModo === "unico" && modoCobro === "varios") {
      const suma = pagosMixtos.reduce((acc, p) => acc + (p.monto || 0), 0)
      setMontoUnico(suma)
      const primerMetodo = pagosMixtos.find(p => p.id_metodo_pago)?.id_metodo_pago
      if (primerMetodo) setIdMetodoPagoUnico(primerMetodo)
    }

    setModoCobro(nuevoModo)
  }

  const agregarPagoMixto = () => {
    setPagosMixtos([...pagosMixtos, { id: contadorPago, id_metodo_pago: null, monto: 0 }])
    setContadorPago(contadorPago + 1)
  }

  const eliminarPagoMixto = (id: number) => {
    if (pagosMixtos.length <= 1) {
      toast.error("Debe haber al menos un pago")
      return
    }
    setPagosMixtos(pagosMixtos.filter(p => p.id !== id))
  }

  const actualizarPagoMixto = (id: number, campo: "id_metodo_pago" | "monto", valor: number | null) => {
    setPagosMixtos(pagosMixtos.map(p => (p.id === id ? { ...p, [campo]: valor } : p)))
  }

  const confirmarCheckIn = async () => {
    if (!info) return
    if (!info.puede_check_in) {
      toast.error(info.motivo_bloqueo || "No se puede hacer check-in")
      return
    }
    if (procesando) return

    const clientePaga = modoCobro === "unico"
      ? montoUnico
      : pagosMixtos.reduce((acc, p) => acc + (p.monto || 0), 0)

    if (clientePaga > 0) {
      if (modoCobro === "unico" && !idMetodoPagoUnico) {
        toast.error("Seleccione un método de pago")
        return
      }
      if (modoCobro === "varios") {
        const validos = pagosMixtos.filter(p => p.id_metodo_pago && p.monto > 0)
        if (validos.length === 0) {
          toast.error("Agregue al menos un pago válido")
          return
        }
      }
    }

    try {
      setProcesando(true)

      // 1. Registrar pagos si hay
      if (clientePaga > 0) {
        if (modoCobro === "unico" && idMetodoPagoUnico) {
          await reservaService.agregarPago(Number(idReserva), {
            id_metodo_pago: idMetodoPagoUnico,
            monto: clientePaga,
            observaciones: "Cobro al hacer check-in",
          })
        } else if (modoCobro === "varios") {
          const validos = pagosMixtos.filter(p => p.id_metodo_pago && p.monto > 0)
          for (const p of validos) {
            await reservaService.agregarPago(Number(idReserva), {
              id_metodo_pago: p.id_metodo_pago!,
              monto: p.monto,
              observaciones: "Cobro al hacer check-in (mixto)",
            })
          }
        }
      }

      // 2. Hacer check-in validado
      await reservaService.checkInValidado(Number(idReserva))

      // Calcular tiempo restante para el toast
      if (reserva.fecha_salida_prevista) {
        const salida = new Date(reserva.fecha_salida_prevista)
        const restante = Math.max(0, Math.floor((salida.getTime() - Date.now()) / (1000 * 60)))
        toast.success(
          `✅ Check-in realizado. Sale a las ${formatearHora(reserva.fecha_salida_prevista)} (${formatearDuracion(restante)} restantes).`
        )
      } else {
        toast.success("✅ Check-in realizado")
      }

      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  if (cargando) {
    return (
      <AppLayout>
        <p className="text-slate-400">Cargando reserva...</p>
      </AppLayout>
    )
  }

  if (!info) {
    return (
      <AppLayout>
        <p className="text-red-400">Reserva no encontrada</p>
      </AppLayout>
    )
  }

  const { reserva } = info
  const saldo = Number(info.saldo_pendiente)
  const clientePaga = modoCobro === "unico"
    ? montoUnico
    : pagosMixtos.reduce((acc, p) => acc + (p.monto || 0), 0)
  const saldoRestante = Math.max(0, saldo - clientePaga)

  // Calcular tardanza
  const minutosTardeCliente = reserva.fecha_entrada ? minutosTarde(reserva.fecha_entrada) : 0
  const llegadaTarde = minutosTardeCliente > 0

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
          Check-In — Habitación {reserva.habitacion?.numero}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Reserva {reserva.codigo_reserva} · Cliente: {reserva.cliente?.nombre} {reserva.cliente?.apellido}
        </p>
      </div>

      {/* Banner: LLEGADA TARDE */}
      {llegadaTarde && info.puede_check_in && (
        <div className="mb-6 bg-yellow-950 border-2 border-yellow-600 rounded-lg p-4 flex items-start gap-3">
          <Clock size={28} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-yellow-200 font-bold text-lg">⏰ Cliente llegó {formatearDuracion(minutosTardeCliente)} tarde</h3>
            <p className="text-yellow-100 text-sm mt-1">
              La reserva fue para las <strong>{formatearHora(reserva.fecha_entrada)}</strong>.
              El tiempo se cuenta desde la reserva original (política del hospedaje).
            </p>
            <div className="mt-3 bg-yellow-900/50 p-3 rounded grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-yellow-200 text-xs">Hora de salida</p>
                <p className="text-white font-bold">{formatearHora(reserva.fecha_salida_prevista)}</p>
              </div>
              <div>
                <p className="text-yellow-200 text-xs">Tiempo restante</p>
                <p className="text-white font-bold">
                  {Math.max(0, Math.floor((new Date(reserva.fecha_salida_prevista).getTime() - Date.now()) / (1000 * 60))) > 0
                    ? formatearDuracion(Math.floor((new Date(reserva.fecha_salida_prevista).getTime() - Date.now()) / (1000 * 60)))
                    : "Excedido"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner: no se puede hacer check-in */}
      {!info.puede_check_in && (
        <div className="mb-6 bg-red-950 border-2 border-red-600 rounded-lg p-4 flex items-start gap-3">
          <Ban size={28} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-200 font-bold text-lg">🚫 NO SE PUEDE HACER CHECK-IN</h3>
            <p className="text-red-100 text-sm mt-1">{info.motivo_bloqueo}</p>
            {info.ocupacion_actual && (
              <div className="mt-3 bg-red-900/50 p-3 rounded">
                <p className="text-red-100 text-sm">
                  Actualmente ocupada por: <strong>{info.ocupacion_actual.cliente}</strong>
                </p>
                <p className="text-red-200 text-xs mt-1">
                  Reserva: {info.ocupacion_actual.codigo_reserva} · Sale: {formatearFecha(info.ocupacion_actual.fecha_fin)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banner: observaciones pendientes */}
      {info.observaciones_pendientes && info.observaciones_pendientes.length > 0 && (
        <div className="mb-6">
          <AlertaClienteObservaciones observaciones={info.observaciones_pendientes as any} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-4">

          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">👤 Cliente</h2>
            <p className="text-white text-lg">
              {reserva.cliente?.nombre} {reserva.cliente?.apellido}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              DNI: {reserva.cliente?.numero_documento ?? "—"}
            </p>
            {reserva.telefono && (
              <p className="text-slate-400 text-sm">Tel: {reserva.telefono}</p>
            )}
          </div>

          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">🏨 Habitación</h2>
            <p className="text-white text-2xl font-bold">{reserva.habitacion?.numero}</p>
            <p className="text-slate-400 text-sm">
              {reserva.habitacion?.tipo?.nombre} · {reserva.habitacion?.piso?.nombre}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-3">
              <div>
                <p className="text-slate-400 text-xs">Duración</p>
                <p className="text-white font-semibold">{reserva.horas_base}h</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Precio</p>
                <p className="text-white font-semibold">S/ {Number(reserva.monto_habitacion).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">📅 Fechas</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Entrada reservada:</span>
                <span className="text-white">{formatearFecha(reserva.fecha_entrada)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Salida prevista:</span>
                <span className="text-white font-bold">{formatearFecha(reserva.fecha_salida_prevista)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">🛒 Consumos</h2>
              <button
                onClick={() => setMostrarConsumos(true)}
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
                  <div key={c.id_consumo} className="flex justify-between items-center bg-slate-900 p-2 rounded text-sm">
                    <span className="text-white">{c.producto?.nombre} x{c.cantidad}</span>
                    <span className="text-cyan-400">S/ {Number(c.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-4">

          {/* Resumen de dinero */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">💰 Resumen de Pago</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total reserva:</span>
                <span className="text-white font-semibold">S/ {Number(reserva.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ya pagado (adelanto):</span>
                <span className="text-green-400 font-semibold">S/ {Number(reserva.pagado).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2">
                <span className="text-slate-400">Saldo pendiente:</span>
                <span className={saldo > 0 ? "text-yellow-400 font-bold text-lg" : "text-green-400 font-bold text-lg"}>
                  S/ {saldo.toFixed(2)}
                </span>
              </div>
            </div>

            {saldo > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <p className="text-slate-200 font-semibold">Cobrar saldo ahora</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => cambiarModo("unico")}
                    className={`flex-1 p-2 rounded text-sm font-medium transition ${
                      modoCobro === "unico" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    💵 Un solo método
                  </button>
                  <button
                    type="button"
                    onClick={() => cambiarModo("varios")}
                    className={`flex-1 p-2 rounded text-sm font-medium transition ${
                      modoCobro === "varios" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    <CreditCard size={14} className="inline mr-1" /> Varios
                  </button>
                </div>

                {modoCobro === "unico" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Monto a cobrar</label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={saldo}
                        value={montoUnico || ""}
                        onChange={e => setMontoUnico(Number(e.target.value))}
                        className="w-full bg-slate-900 text-white p-2 rounded text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Método</label>
                      <select
                        value={idMetodoPagoUnico ?? ""}
                        onChange={e => setIdMetodoPagoUnico(e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-slate-900 text-white p-2 rounded"
                      >
                        <option value="">— Seleccionar —</option>
                        {metodosPago.map(mp => (
                          <option key={mp.id_metodo} value={mp.id_metodo}>
                            {mp.nombre} {mp.es_de_caja ? "(Caja)" : "(Dueña)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {modoCobro === "varios" && (
                  <div className="space-y-2">
                    {pagosMixtos.map((pago, idx) => (
                      <div key={pago.id} className="flex gap-2 items-center">
                        <span className="text-slate-500 text-xs w-8">#{idx + 1}</span>
                        <select
                          value={pago.id_metodo_pago ?? ""}
                          onChange={e =>
                            actualizarPagoMixto(pago.id, "id_metodo_pago", e.target.value ? Number(e.target.value) : null)
                          }
                          className="flex-1 bg-slate-900 text-white p-2 rounded text-sm"
                        >
                          <option value="">— Método —</option>
                          {metodosPago.map(mp => (
                            <option key={mp.id_metodo} value={mp.id_metodo}>
                              {mp.nombre}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          value={pago.monto || ""}
                          onChange={e => actualizarPagoMixto(pago.id, "monto", Number(e.target.value))}
                          placeholder="0.00"
                          className="w-24 bg-slate-900 text-white p-2 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarPagoMixto(pago.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={agregarPagoMixto}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      <Plus size={14} /> Agregar otro
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cobrando ahora:</span>
                    <span className="text-green-400 font-semibold">S/ {clientePaga.toFixed(2)}</span>
                  </div>
                  {saldoRestante > 0.01 && (
                    <div className="flex justify-between">
                      <span className="text-yellow-300">Queda como deuda:</span>
                      <span className="text-yellow-300 font-bold">S/ {saldoRestante.toFixed(2)}</span>
                    </div>
                  )}
                  {saldoRestante <= 0.01 && clientePaga > 0 && saldo > 0 && (
                    <div className="bg-green-900/40 border border-green-700 p-2 rounded text-center">
                      <p className="text-green-300 text-sm font-semibold">
                        💵 Al cobrar S/ {clientePaga.toFixed(2)}, el saldo quedará en S/ 0.00
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {saldo <= 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 bg-green-900/30 border border-green-700 p-3 rounded text-center">
                <p className="text-green-300 font-semibold">✅ Reserva pagada completamente</p>
                <p className="text-green-200 text-xs mt-1">No hay saldo pendiente</p>
              </div>
            )}
          </div>

          {saldoRestante > 0.01 && clientePaga > 0 && (
            <div className="bg-yellow-950/40 border border-yellow-700 p-3 rounded">
              <p className="text-yellow-200 text-sm">
                ⚠️ El cliente entrará debiendo <strong>S/ {saldoRestante.toFixed(2)}</strong>.
                Se cobrará al hacer check-out.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={confirmarCheckIn}
                disabled={!info.puede_check_in || procesando}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                {procesando ? "Procesando..." : "✅ Confirmar Check-In"}
              </button>
              <button
                onClick={() => navigate("/recepcion")}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Volver
              </button>
            </div>

            {/* Botón Anular Reserva */}
            {info.es_confirmada && (
              <button
                onClick={() => setMostrarAnular(true)}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
              >
                <XCircle size={16} />
                ❌ Anular Reserva (cliente no llegó / canceló)
              </button>
            )}
          </div>

          {!info.puede_check_in && (
            <div className="bg-red-950/40 border border-red-800 p-3 rounded flex gap-2">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-xs">{info.motivo_bloqueo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal agregar consumos */}
      {mostrarConsumos && (
        <AgregarConsumoModal
          idReserva={Number(idReserva)}
          onClose={() => setMostrarConsumos(false)}
          onSuccess={() => { setMostrarConsumos(false); cargar() }}
        />
      )}

      {/* Modal anular reserva */}
      {mostrarAnular && (
        <ModalAnularReservaCheckIn
          idReserva={Number(idReserva)}
          codigoReserva={reserva.codigo_reserva}
          nombreCliente={`${reserva.cliente?.nombre ?? ""} ${reserva.cliente?.apellido ?? ""}`.trim()}
          onClose={() => setMostrarAnular(false)}
          onSuccess={() => {
            setMostrarAnular(false)
            navigate("/recepcion")
          }}
        />
      )}
    </AppLayout>
  )
}