import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, DollarSign, Trash2 } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { cuentaPagarService } from "@/services/cuentaPagarService"
import { useAuth } from "@/hooks/useAuth"
import { mensajeDeError } from "@/lib/errores"
import { IconoDinamico } from "@/components/IconoDinamico"
import type { CuentaPagar } from "@/types/cuentaPagar"
import { RegistrarPagoProveedorModal } from "./RegistrarPagoProveedorModal"

function formatearFechaHora(fecha: string | null): string {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleString("es-PE")
}

export function CuentaPagarDetallePage() {
  const { idCuenta } = useParams<{ idCuenta: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [cuenta, setCuenta] = useState<CuentaPagar | null>(null)
  const [cargando, setCargando] = useState(true)
  const [mostrarPago, setMostrarPago] = useState(false)

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedePagar = ["admin", "encargado", "cajero"].includes(rolUsuario)

  const cargar = async () => {
    try {
      setCargando(true)
      const c = await cuentaPagarService.obtener(Number(idCuenta))
      setCuenta(c)
    } catch {
      toast.error("Error al cargar cuenta")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCuenta])

  const anularPago = async (idPago: number) => {
    if (!confirm("¿Anular este pago?")) return
    const motivo = prompt("Motivo de anulación:")
    if (!motivo) return
    try {
      await cuentaPagarService.anularPago(Number(idCuenta), idPago, motivo)
      toast.success("Pago anulado")
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

  if (!cuenta) {
    return (
      <AppLayout>
        <p className="text-red-400">Cuenta no encontrada</p>
      </AppLayout>
    )
  }

  const pagosActivos = (cuenta.pagos || []).filter(p => !p.anulado)
  const totalPagado = pagosActivos.reduce((acc, p) => acc + Number(p.monto || 0), 0)

  return (
    <AppLayout>
      <button
        onClick={() => navigate("/cuentas-por-pagar")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2 flex-wrap">
          Cuenta #{cuenta.id_cuenta}
          {cuenta.estado && (
            <span
              className="text-xs px-2 py-1 rounded font-semibold text-white flex items-center gap-1"
              style={{ background: cuenta.estado.color || "#64748b" }}
            >
              {cuenta.estado.icono && (
                <IconoDinamico nombre={cuenta.estado.icono} size={12} style={{ color: "#fff" }} />
              )}
              {cuenta.estado.nombre.toUpperCase()}
            </span>
          )}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {cuenta.proveedor?.razon_social || cuenta.proveedor?.nombre_comercial}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Información</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Concepto</span>
                <span className="text-white text-right">{cuenta.concepto}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Fecha emisión</span>
                <span className="text-white">{formatearFechaHora(cuenta.fecha_emision)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Fecha vencimiento</span>
                <span className="text-white">{formatearFechaHora(cuenta.fecha_vencimiento)}</span>
              </div>
              {cuenta.reserva && (
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Reserva</span>
                  <span className="text-white">{cuenta.reserva.codigo_reserva}</span>
                </div>
              )}
              {cuenta.usuario_creacion && (
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Creada por</span>
                  <span className="text-white">
                    {cuenta.usuario_creacion.nombre} {cuenta.usuario_creacion.apellido}
                  </span>
                </div>
              )}
              {cuenta.fecha_anulacion && (
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Anulada</span>
                  <span className="text-red-400">{formatearFechaHora(cuenta.fecha_anulacion)}</span>
                </div>
              )}
              {cuenta.motivo_anulacion && (
                <div className="bg-red-900/30 border border-red-700 p-3 rounded">
                  <p className="text-red-200 text-xs mb-1">Motivo de anulación:</p>
                  <p className="text-red-100 text-sm">{cuenta.motivo_anulacion}</p>
                </div>
              )}
              {cuenta.notas && (
                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-slate-400 text-xs mb-1">Notas:</p>
                  <p className="text-slate-300 text-sm">{cuenta.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagos */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pagos</h2>
              {puedePagar && cuenta.saldo > 0.01 && !["pagada", "anulada"].includes(cuenta.estado?.slug || "") && (
                <button
                  onClick={() => setMostrarPago(true)}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                >
                  <DollarSign size={14} /> Registrar pago
                </button>
              )}
            </div>

            {pagosActivos.length === 0 ? (
              <p className="text-slate-500 text-sm">Sin pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {pagosActivos.map(p => (
                  <div key={p.id_pago_proveedor} className="bg-slate-900 p-3 rounded flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <p className="text-white text-sm flex items-center gap-2">
                        {p.metodo_pago?.icono && (
                          <IconoDinamico nombre={p.metodo_pago.icono} size={14} style={{ color: p.metodo_pago.color || "#fff" }} />
                        )}
                        {p.metodo_pago?.nombre || "—"}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {formatearFechaHora(p.fecha_pago)}
                        {p.usuario && ` · ${p.usuario.nombre}`}
                        {p.referencia && ` · Ref: ${p.referencia}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-green-400 font-semibold text-sm">
                        + S/ {Number(p.monto || 0).toFixed(2)}
                      </span>
                      {puedePagar && (
                        <button
                          onClick={() => anularPago(p.id_pago_proveedor)}
                          className="text-red-400 hover:text-red-300"
                          title="Anular pago"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-slate-800 p-5 rounded-lg h-fit">
          <h2 className="text-lg font-semibold mb-4">Resumen</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Monto total</span>
              <span className="text-white font-bold text-lg">S/ {Number(cuenta.monto || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Total pagado</span>
              <span className="text-green-400 font-semibold">S/ {Number(totalPagado || 0).toFixed(2)}</span>
            </div>
            <div className={`p-3 rounded ${cuenta.saldo > 0.01 ? "bg-yellow-900/40 border border-yellow-700" : "bg-green-900/40 border border-green-700"}`}>
              {cuenta.saldo > 0.01 ? (
                <div className="flex justify-between">
                  <span className="text-yellow-300 font-semibold">💰 Saldo pendiente</span>
                  <span className="text-yellow-300 font-bold text-lg">S/ {Number(cuenta.saldo || 0).toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-green-300 text-center font-semibold">
                  ✅ Cuenta pagada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mostrarPago && (
        <RegistrarPagoProveedorModal
          cuenta={cuenta}
          onClose={() => setMostrarPago(false)}
          onSuccess={() => { setMostrarPago(false); cargar() }}
        />
      )}
    </AppLayout>
  )
}