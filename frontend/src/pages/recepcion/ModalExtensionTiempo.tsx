import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, AlertTriangle, Check, History } from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import type { CalculoExtension, OpcionExtension } from "@/types/reserva"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  idReserva: number
  onClose: () => void
  onSuccess: () => void
}

function formatearMinutos(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function ModalExtensionTiempo({ idReserva, onClose, onSuccess }: Props) {
  const [calculo, setCalculo] = useState<CalculoExtension | null>(null)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionExtension | null>(null)
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [cargarACuenta, setCargarACuenta] = useState(true)
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [observaciones, setObservaciones] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [calc, mps] = await Promise.all([
          reservaService.calculoExtension(idReserva),
          metodoPagoService.listarActivos(),
        ])
        setCalculo(calc)
        setMetodosPago(mps)
        const sugerida = calc.opciones.find(o => o.sugerida)
        if (sugerida) setOpcionSeleccionada(sugerida)
        else if (calc.opciones.length > 0) setOpcionSeleccionada(calc.opciones[1] || calc.opciones[0])
      } catch (e) {
        console.error(e)
        toast.error("Error al calcular la extensión")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [idReserva])

  const aplicar = async () => {
    if (!opcionSeleccionada) return
    if (opcionSeleccionada.monto === 0 && !observaciones.trim()) {
      toast.error("Debe ingresar una observación para no cobrar")
      return
    }
    if (!cargarACuenta && opcionSeleccionada.monto > 0 && !idMetodoPago) {
      toast.error("Seleccione un método de pago")
      return
    }
    setEnviando(true)
    try {
      await reservaService.agregarExtension(idReserva, {
        horas_extra: opcionSeleccionada.horas,
        es_turno_adicional: opcionSeleccionada.es_turno_adicional,
        cargar_a_cuenta: cargarACuenta,
        id_metodo_pago: cargarACuenta ? null : idMetodoPago,
        observaciones: observaciones || null,
      })
      toast.success("Extensión aplicada")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-slate-300">Calculando...</p>
        </div>
      </div>
    )
  }

  if (!calculo) return null

  // Caso: está dentro de tolerancia Y no hay nada pendiente
  if (calculo.dentro_tolerancia && calculo.minutos_exceso_pendiente === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-slate-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
          <div className="bg-green-900 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-white" />
              <h3 className="text-lg font-bold text-white">Sin exceso</h3>
            </div>
            <button onClick={onClose} className="text-green-200 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-4">
            <p className="text-slate-300 text-sm">
              El cliente está dentro de la tolerancia de {calculo.tolerancia_minutos} minutos.
            </p>
            <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded mt-4">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-yellow-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Extensión de Tiempo</h3>
              <p className="text-yellow-200 text-xs">
                Exceso total: {formatearMinutos(calculo.minutos_exceso_total)} (base {calculo.horas_base}h)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-yellow-200 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">

          {/* Info tiempo */}
          <div className="bg-slate-900 p-4 rounded grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-slate-400 text-xs">Transcurrido</p>
              <p className="text-white font-bold text-sm">{formatearMinutos(calculo.minutos_transcurridos)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Contratado</p>
              <p className="text-white font-bold text-sm">{calculo.horas_base}h</p>
            </div>
            <div>
              <p className="text-yellow-400 text-xs">Exceso total</p>
              <p className="text-yellow-300 font-bold text-sm">
                {formatearMinutos(calculo.minutos_exceso_total)}
              </p>
            </div>
          </div>

          {/* Historial de extensiones ya aplicadas */}
          {(calculo.horas_extra_ya_aplicadas > 0 || calculo.turnos_adicionales_aplicados > 0) && (
            <div className="bg-slate-900 p-4 rounded border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <History size={16} className="text-blue-400" />
                <p className="text-blue-300 text-sm font-semibold">Ya aplicado anteriormente</p>
              </div>
              <div className="space-y-1 text-sm">
                {calculo.horas_extra_ya_aplicadas > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horas extra:</span>
                    <span className="text-white">{calculo.horas_extra_ya_aplicadas}h</span>
                  </div>
                )}
                {calculo.turnos_adicionales_aplicados > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Turnos adicionales:</span>
                    <span className="text-white">{calculo.turnos_adicionales_aplicados}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-700 pt-1">
                  <span className="text-slate-400">Monto aplicado:</span>
                  <span className="text-cyan-400 font-semibold">
                    S/ {calculo.monto_ya_aplicado.toFixed(2)}
                  </span>
                </div>
                {calculo.monto_ya_pagado > 0 && (
                  <div className="flex justify-between pl-3">
                    <span className="text-green-400 text-xs">├─ Ya pagado:</span>
                    <span className="text-green-400 text-xs">
                      S/ {calculo.monto_ya_pagado.toFixed(2)}
                    </span>
                  </div>
                )}
                {calculo.monto_cargado_a_cuenta > 0 && (
                  <div className="flex justify-between pl-3">
                    <span className="text-yellow-400 text-xs">└─ A cuenta:</span>
                    <span className="text-yellow-400 text-xs">
                      S/ {calculo.monto_cargado_a_cuenta.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info pendiente */}
          {calculo.minutos_exceso_pendiente > 0 && calculo.dentro_tolerancia && (
            <div className="bg-green-900/40 border border-green-700 p-3 rounded">
              <p className="text-green-300 text-sm font-semibold">
                ✅ El exceso restante está dentro de la tolerancia
              </p>
              <p className="text-green-200 text-xs mt-1">
                Exceso pendiente: {formatearMinutos(calculo.minutos_exceso_pendiente)} (tolera {calculo.tolerancia_minutos} min)
              </p>
            </div>
          )}

          {/* Info tarifa */}
          <div className="bg-slate-900 p-3 rounded text-xs text-slate-400 flex flex-wrap gap-3">
            <span>Tolerancia: {calculo.tolerancia_minutos} min</span>
            <span>·</span>
            <span>Precio hora extra: S/ {calculo.precio_hora_extra.toFixed(2)}</span>
            <span>·</span>
            <span>Máx: {calculo.max_horas_extra}h</span>
            <span>·</span>
            <span>Turno adicional: S/ {calculo.precio_turno_adicional.toFixed(2)}</span>
          </div>

          {/* Excede máximo */}
          {calculo.excede_maximo && (
            <div className="bg-red-900/40 border border-red-700 p-3 rounded">
              <p className="text-red-300 text-sm font-semibold">
                ⚠️ Excede el máximo de {calculo.max_horas_extra}h extra
              </p>
              <p className="text-red-200 text-xs mt-1">
                Se recomienda cobrar turno adicional completo
              </p>
            </div>
          )}

          {/* Opciones */}
          {calculo.opciones.length > 0 && (
            <div>
              <p className="text-slate-300 text-sm font-medium mb-2">
                Nueva extensión a aplicar:
              </p>
              <div className="space-y-2">
                {calculo.opciones.map((op, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
                      opcionSeleccionada === op ? "bg-blue-900/40 border border-blue-600" : "bg-slate-900 hover:bg-slate-800"
                    } ${op.advertencia ? "border-l-4 border-l-yellow-500" : ""}`}
                  >
                    <input
                      type="radio"
                      checked={opcionSeleccionada === op}
                      onChange={() => setOpcionSeleccionada(op)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <span className={`text-sm ${op.advertencia ? "text-yellow-300" : "text-white"}`}>{op.label}</span>
                        {op.sugerida && (
                          <span className="ml-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded">SUGERIDA</span>
                        )}
                      </div>
                      <span className="text-cyan-400 font-semibold">
                        {op.monto === 0 ? "—" : `+ S/ ${op.monto.toFixed(2)}`}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Forma de pago */}
          {opcionSeleccionada && opcionSeleccionada.monto > 0 && (
            <div className="bg-slate-900 p-4 rounded space-y-3">
              <p className="text-slate-300 text-sm font-medium">Forma de pago:</p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={cargarACuenta} onChange={() => setCargarACuenta(true)} className="w-4 h-4" />
                <span className="text-slate-200 text-sm">
                  Cargar a la cuenta <span className="text-yellow-400">(paga al retirarse)</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!cargarACuenta} onChange={() => setCargarACuenta(false)} className="w-4 h-4" />
                <span className="text-slate-200 text-sm">
                  Pagar ahora <span className="text-green-400">(entra a caja si aplica)</span>
                </span>
              </label>

              {!cargarACuenta && (
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Método de pago</label>
                  <select
                    value={idMetodoPago ?? ""}
                    onChange={e => setIdMetodoPago(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-slate-800 text-white p-2 rounded"
                  >
                    <option value="">— Seleccionar —</option>
                    {metodosPago.map(mp => (
                      <option key={mp.id_metodo} value={mp.id_metodo}>
                        {mp.nombre} {mp.es_de_caja ? "(Caja)" : "(Dueña)"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="text-slate-300 text-sm block mb-1">
              Observaciones
              {opcionSeleccionada?.monto === 0 && <span className="text-red-400 ml-2">(obligatorio si no cobra)</span>}
            </label>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Ej: Cliente frecuente, se le perdona la hora extra"
              className="w-full bg-slate-900 text-white p-2 rounded"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={aplicar}
              disabled={!opcionSeleccionada || enviando}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Aplicando..." : "Aplicar Extensión"}
            </button>
            <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}