import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Reserva } from "@/types/reserva"
import { AgregarConsumoModal } from "./AgregarConsumoModal"
import { ModalExtensionTiempo } from "../recepcion/ModalExtensionTiempo"
import { AgregarObservacionModal } from "../clientes/cliente/AgregarObservacionModal"
import { AgregarPagoModal } from "./AgregarPagoModal"
import { EntregarVueltoModal } from "./EntregarVueltoModal"
import { ConfirmarVueltoModal } from "./ConfirmarVueltoModal"
import { ConfirmarDeudaModal } from "./ConfirmarDeudaModal"
import { IconoDinamico } from "@/components/IconoDinamico"
import { AlertOctagon, CreditCard } from "lucide-react"

export function CheckoutPage() {
  const { idReserva } = useParams<{ idReserva: string }>()
  const navigate = useNavigate()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [cargando, setCargando] = useState(true)
  const [montoFinal, setMontoFinal] = useState(0)
  const [mostrarAgregarConsumo, setMostrarAgregarConsumo] = useState(false)
  const [mostrarExtension, setMostrarExtension] = useState(false)
  const [mostrarObservacion, setMostrarObservacion] = useState(false)
  const [mostrarAgregarPago, setMostrarAgregarPago] = useState(false)
  const [mostrarEntregarVuelto, setMostrarEntregarVuelto] = useState(false)
  const [mostrarConfirmarVuelto, setMostrarConfirmarVuelto] = useState(false)
  const [mostrarConfirmarDeuda, setMostrarConfirmarDeuda] = useState(false)

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
    // Si hay vuelto pendiente → abrir modal
    if (vueltoFinal > 0.01) {
      setMostrarConfirmarVuelto(true)
      return
    }
    // Si hay deuda pendiente → abrir modal
    if (vueltoFinal < -0.01) {
      setMostrarConfirmarDeuda(true)
      return
    }
    // Todo cuadra → finalizar directo
    await ejecutarCheckoutSimple()
  }

  const ejecutarCheckoutSimple = async () => {
    try {
      await reservaService.checkOut(Number(idReserva), montoFinal)
      toast.success("Check-out realizado")
      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const ejecutarCheckoutConVuelto = async (datos: {
    decision_tipo: "ENTREGADO" | "NO_RECLAMADO" | "OTRO"
    id_metodo_pago?: number | null
    observaciones?: string | null
  }) => {
    try {
      await reservaService.checkOutConVuelto(Number(idReserva), {
        monto_final: montoFinal,
        decision_tipo: datos.decision_tipo,
        id_metodo_pago: datos.id_metodo_pago,
        observaciones: datos.observaciones,
      })
      toast.success("Check-out realizado correctamente")
      setMostrarConfirmarVuelto(false)
      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
      throw e  // relanzar para que el modal no cierre
    }
  }

  const ejecutarCheckoutConDeuda = async (datos: {
    decision_tipo: "PAGO" | "NO_PAGO"
    monto_pago?: number
    id_metodo_pago?: number
    id_gravedad?: number
    motivo?: string
  }) => {
    try {
      await reservaService.checkOutConDeuda(Number(idReserva), {
        monto_final: montoFinal,
        decision_tipo: datos.decision_tipo,
        monto_pago: datos.monto_pago,
        id_metodo_pago: datos.id_metodo_pago,
        id_gravedad: datos.id_gravedad,
        motivo: datos.motivo,
      })
      toast.success("Check-out realizado correctamente")
      setMostrarConfirmarDeuda(false)
      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
      throw e  // relanzar para que el modal no cierre
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
  // const saldo = Number(reserva.saldo)  // no usado

  // Vuelto final = pagado - total
  const vueltoFinal = pagado - total

  // Detectar si la reserva ya esta cerrada
  const estadoSlug = reserva.estado?.slug
  const esCerrada = ["finalizada", "cancelada", "anulada"].includes(estadoSlug ?? "")
  const esFinalizada = estadoSlug === "finalizada"
  const esCancelada = estadoSlug === "cancelada"
  const esAnulada = estadoSlug === "anulada"

  // ⚠️ NUEVO: verificar si tiene check-in activo
  const tieneCheckIn = reserva.registro_estadia !== null && reserva.registro_estadia !== undefined
  const sinCheckIn = !tieneCheckIn && !esCerrada

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
                <div className="bg-yellow-900/40 border border-yellow-700 p-3 rounded space-y-2">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ Excedió {horasExtra} hora(s) — cobrar extra
                  </p>
                  <button
                    onClick={() => setMostrarExtension(true)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium text-sm"
                  >
                    ⏱️ Aplicar Extensión de Tiempo
                  </button>
                </div>
              )}

              {/* Botón para agregar observación al cliente */}
              <div className="bg-red-900/30 border border-red-700 p-3 rounded">
                <button
                  onClick={() => setMostrarObservacion(true)}
                  className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2"
                >
                  <AlertOctagon size={16} /> Agregar Observación al Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Pagos registrados */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard size={18} /> Pagos registrados
              </h2>
              <button
                onClick={() => setMostrarAgregarPago(true)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
              >
                <Plus size={14} /> Agregar pago
              </button>
            </div>

            {!reserva.pagos || reserva.pagos.length === 0 ? (
              <p className="text-slate-500 text-sm">Sin pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {reserva.pagos
                  .filter(p => !p.anulado)
                  .map(p => (
                    <div key={p.id_pago} className="flex justify-between items-center bg-slate-900 p-2 rounded">
                      <div className="flex-1">
                        <p className="text-white text-sm flex items-center gap-2">
                          {p.metodo_pago?.icono ? (
                            <IconoDinamico
                              nombre={p.metodo_pago.icono}
                              size={16}
                              style={{ color: p.metodo_pago.color || "#64748b" }}
                            />
                          ) : (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: p.metodo_pago?.color || "#64748b" }}
                            />
                          )}
                          {p.metodo_pago?.nombre || "Método desconocido"}
                          {p.es_adelanto && (
                            <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">
                              ADELANTO
                            </span>
                          )}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {new Date(p.fecha_pago).toLocaleString("es-PE")}
                          {p.observaciones && ` · ${p.observaciones}`}
                        </p>
                      </div>
                      <span className="text-cyan-400 font-semibold text-sm">
                        S/ {Number(p.monto).toFixed(2)}
                      </span>
                    </div>
                  ))}
                <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                  <span className="text-slate-400 text-sm font-semibold">Total pagado</span>
                  <span className="text-green-400 font-bold text-lg">
                    S/ {Number(reserva.pagado).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
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
                <span className="text-slate-400">
                  Horas extra
                  {reserva.extensiones && reserva.extensiones.length > 0 && (
                    <span className="text-slate-500 text-xs ml-1">
                      ({reserva.extensiones.length} extensión{reserva.extensiones.length !== 1 ? "es" : ""})
                    </span>
                  )}
                </span>
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

          {sinCheckIn ? (
            <div className="mt-5 p-4 rounded border-2 bg-yellow-950/40 border-yellow-700">
              <p className="font-bold text-lg mb-2 text-yellow-300">
                ⚠️ Esta reserva NO tiene check-in hecho
              </p>
              <p className="text-yellow-100 text-sm">
                El cliente aún no ha llegado o no se ha registrado su ingreso.
                <br />
                Debes hacer el <strong>Check-In</strong> primero, o <strong>Anular</strong> la reserva si el cliente no llegó.
              </p>
              <button
                onClick={() => navigate("/recepcion")}
                className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-medium"
              >
                Volver al mapa
              </button>
            </div>
          ) : esCerrada ? (
            <div className={`mt-5 p-4 rounded border-2 ${
              esFinalizada ? "bg-green-950/40 border-green-700" :
              esCancelada ? "bg-slate-900 border-slate-700" :
              "bg-red-950/40 border-red-700"
            }`}>
              <p className={`font-bold text-lg mb-2 ${
                esFinalizada ? "text-green-300" :
                esCancelada ? "text-slate-300" :
                "text-red-300"
              }`}>
                {esFinalizada && "✅ Esta reserva YA FUE FINALIZADA"}
                {esCancelada && "❌ Esta reserva fue CANCELADA"}
                {esAnulada && "⚠️ Esta reserva fue ANULADA"}
              </p>
              <p className="text-slate-400 text-sm">
                {esFinalizada && `Check-out realizado: ${reserva.fecha_salida_real ? new Date(reserva.fecha_salida_real).toLocaleString("es-PE") : "—"}`}
                {esCancelada && "El cliente canceló la reserva. No se puede hacer check-out."}
                {esAnulada && `Motivo: ${reserva.motivo_anulacion ?? "Sin motivo registrado"}`}
              </p>
              <button
                onClick={() => navigate("/recepcion")}
                className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-medium"
              >
                Volver al mapa
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {mostrarAgregarConsumo && (
        <AgregarConsumoModal
          idReserva={Number(idReserva)}
          onClose={() => setMostrarAgregarConsumo(false)}
          onSuccess={() => { setMostrarAgregarConsumo(false); cargar() }}
        />
      )}

      {mostrarExtension && (
        <ModalExtensionTiempo
          idReserva={Number(idReserva)}
          idCliente={reserva.cliente?.id_cliente}
          nombreCliente={`${reserva.cliente?.nombre ?? ""} ${reserva.cliente?.apellido ?? ""}`.trim()}
          onClose={() => setMostrarExtension(false)}
          onSuccess={() => { setMostrarExtension(false); cargar() }}
        />
      )}

      {mostrarObservacion && reserva.cliente && (
        <AgregarObservacionModal
          idCliente={reserva.cliente.id_cliente}
          nombreCliente={`${reserva.cliente.nombre} ${reserva.cliente.apellido ?? ""}`.trim()}
          onClose={() => setMostrarObservacion(false)}
          onSuccess={() => { setMostrarObservacion(false); toast.success("Observación guardada") }}
        />
      )}

      {mostrarAgregarPago && (
        <AgregarPagoModal
          idReserva={Number(idReserva)}
          montoSugerido={vueltoFinal < 0 ? Math.abs(vueltoFinal) : undefined}
          onClose={() => setMostrarAgregarPago(false)}
          onSuccess={() => { setMostrarAgregarPago(false); cargar() }}
        />
      )}

      {mostrarEntregarVuelto && vueltoFinal > 0 && (
        <EntregarVueltoModal
          idReserva={Number(idReserva)}
          vueltoPendiente={vueltoFinal}
          onClose={() => setMostrarEntregarVuelto(false)}
          onSuccess={() => { setMostrarEntregarVuelto(false); cargar() }}
        />
      )}

      {mostrarConfirmarVuelto && reserva && vueltoFinal > 0 && (
        <ConfirmarVueltoModal
          idReserva={Number(idReserva)}
          vueltoPendiente={vueltoFinal}
          nombreCliente={`${reserva.cliente?.nombre ?? ""} ${reserva.cliente?.apellido ?? ""}`.trim()}
          habitacion={reserva.habitacion?.numero ?? ""}
          onClose={() => setMostrarConfirmarVuelto(false)}
          onConfirmar={ejecutarCheckoutConVuelto}
        />
      )}

      {mostrarConfirmarDeuda && reserva && vueltoFinal < 0 && (
        <ConfirmarDeudaModal
          idReserva={Number(idReserva)}
          deudaPendiente={Math.abs(vueltoFinal)}
          nombreCliente={`${reserva.cliente?.nombre ?? ""} ${reserva.cliente?.apellido ?? ""}`.trim()}
          habitacion={reserva.habitacion?.numero ?? ""}
          onClose={() => setMostrarConfirmarDeuda(false)}
          onConfirmar={ejecutarCheckoutConDeuda}
        />
      )}
    </AppLayout>
  )
}