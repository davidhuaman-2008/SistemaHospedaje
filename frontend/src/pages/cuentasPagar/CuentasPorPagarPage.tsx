import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { RefreshCw, Plus, Wallet, Eye, DollarSign, X } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { cuentaPagarService } from "@/services/cuentaPagarService"
import { useAuth } from "@/hooks/useAuth"

import { IconoDinamico } from "@/components/IconoDinamico"
import type { CuentaPagar } from "@/types/cuentaPagar"
import { NuevaCuentaPagarModal } from "./NuevaCuentaPagarModal"
import { RegistrarPagoProveedorModal } from "./RegistrarPagoProveedorModal"
import { AnularCuentaModal } from "./AnularCuentaModal"

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleDateString("es-PE")
}

function esVencida(cuenta: CuentaPagar): boolean {
  if (!cuenta.fecha_vencimiento) return false
  if (cuenta.estado?.slug === "pagada" || cuenta.estado?.slug === "anulada") return false
  return new Date(cuenta.fecha_vencimiento) < new Date()
}

export function CuentasPorPagarPage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [cuentas, setCuentas] = useState<CuentaPagar[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>("activas")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [cuentaPagar, setCuentaPagar] = useState<CuentaPagar | null>(null)
  const [cuentaAnular, setCuentaAnular] = useState<CuentaPagar | null>(null)

  const rolUsuario = usuario?.rol?.nombre || ""
  const puedeCrear = ["admin", "encargado"].includes(rolUsuario)
  const puedePagar = ["admin", "encargado", "cajero"].includes(rolUsuario)

  const cargar = async (silencioso = false) => {
    try {
      if (!silencioso) setCargando(true)
      const datos = await cuentaPagarService.listar()
      setCuentas(datos)
    } catch {
      if (!silencioso) toast.error("Error al cargar cuentas")
    } finally {
      if (!silencioso) setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") cargar(true)
    }, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtros
  const filtradas = cuentas.filter(c => {
    // Filtro por estado
    if (filtroEstado === "activas") {
      if (!["pendiente", "parcial"].includes(c.estado?.slug || "")) return false
    } else if (filtroEstado === "vencidas") {
      if (!esVencida(c)) return false
    } else if (filtroEstado !== "todas") {
      if (c.estado?.slug !== filtroEstado) return false
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim()
      return (
        c.concepto.toLowerCase().includes(q) ||
        (c.proveedor?.razon_social || "").toLowerCase().includes(q) ||
        (c.proveedor?.nombre_comercial || "").toLowerCase().includes(q)
      )
    }
    return true
  })

  // Contadores
  const contadores = {
    activas: cuentas.filter(c => ["pendiente", "parcial"].includes(c.estado?.slug || "")).length,
    vencidas: cuentas.filter(c => esVencida(c)).length,
    pendientes: cuentas.filter(c => c.estado?.slug === "pendiente").length,
    parciales: cuentas.filter(c => c.estado?.slug === "parcial").length,
    pagadas: cuentas.filter(c => c.estado?.slug === "pagada").length,
    anuladas: cuentas.filter(c => c.estado?.slug === "anulada").length,
    todas: cuentas.length,
  }

  // Totales
  const totalPendiente = cuentas
    .filter(c => ["pendiente", "parcial"].includes(c.estado?.slug || ""))
    .reduce((acc, c) => acc + Number(c.saldo || 0), 0)

  const filtros = [
    { key: "activas", label: "Activas", count: contadores.activas },
    { key: "vencidas", label: "Vencidas", count: contadores.vencidas, danger: true },
    { key: "pendiente", label: "Pendientes", count: contadores.pendientes },
    { key: "parcial", label: "Parciales", count: contadores.parciales },
    { key: "pagada", label: "Pagadas", count: contadores.pagadas },
    { key: "anulada", label: "Anuladas", count: contadores.anuladas },
    { key: "todas", label: "Todas", count: contadores.todas },
  ]

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Wallet size={24} /> Cuentas por Pagar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            <span className="text-yellow-400 font-semibold">S/ {totalPendiente.toFixed(2)}</span> pendiente de pago a proveedores
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => cargar()}
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
          {puedeCrear && (
            <button
              onClick={() => setMostrarNueva(true)}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded text-sm font-medium"
            >
              <Plus size={16} /> Nueva Cuenta
            </button>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por concepto o proveedor..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filtros.map(f => {
          const activo = filtroEstado === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFiltroEstado(f.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                activo
                  ? f.danger
                    ? "bg-red-600 text-white border-red-300"
                    : "bg-slate-500 text-white border-slate-300"
                  : f.danger && f.count > 0
                  ? "bg-red-900/40 hover:bg-red-900/60 text-red-300 border-red-800"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent"
              }`}
            >
              {f.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${activo ? "bg-black/30" : "bg-black/20"}`}>
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lista */}
      {cargando && cuentas.length === 0 ? (
        <p className="text-slate-400 text-center py-8">Cargando...</p>
      ) : filtradas.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <p className="text-slate-400">No hay cuentas con este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map(c => {
            const vencida = esVencida(c)
            const colorBorde =
              c.estado?.slug === "pagada" ? "border-l-green-600" :
              c.estado?.slug === "anulada" ? "border-l-slate-500" :
              vencida ? "border-l-red-600" :
              c.estado?.slug === "parcial" ? "border-l-blue-500" :
              "border-l-yellow-500"

            return (
              <div key={c.id_cuenta} className={`bg-slate-800 rounded-lg p-4 border-l-4 ${colorBorde}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-bold">
                        #{c.id_cuenta} · {c.proveedor?.razon_social || c.proveedor?.nombre_comercial}
                      </h3>
                      {c.estado && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-semibold text-white flex items-center gap-1"
                          style={{ background: c.estado.color || "#64748b" }}
                        >
                          {c.estado.icono && (
                            <IconoDinamico nombre={c.estado.icono} size={10} style={{ color: "#fff" }} />
                          )}
                          {c.estado.nombre.toUpperCase()}
                        </span>
                      )}
                      {vencida && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-red-900 text-red-200">
                          ⚠️ VENCIDA
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm">{c.concepto}</p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span>Emitida: {formatearFecha(c.fecha_emision)}</span>
                      {c.fecha_vencimiento && (
                        <span className={vencida ? "text-red-400 font-semibold" : ""}>
                          Vence: {formatearFecha(c.fecha_vencimiento)}
                        </span>
                      )}
                      {c.reserva && (
                        <span>Reserva: {c.reserva.codigo_reserva}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-slate-400">Monto:</span>
                      <span className="text-white font-semibold ml-2">S/ {Number(c.monto || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-400">Pagado:</span>
                      <span className="text-green-400 font-semibold ml-2">S/ {Number(c.monto_pagado || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-slate-400">Saldo:</span>
                      <span className={`font-bold ml-2 ${c.saldo > 0 ? "text-yellow-400" : "text-green-400"}`}>
                        S/ {Number(c.saldo || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => navigate(`/cuentas-por-pagar/${c.id_cuenta}`)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        title="Ver detalle"
                      >
                        <Eye size={12} /> Detalle
                      </button>
                      {puedePagar && c.saldo > 0.01 && !["pagada", "anulada"].includes(c.estado?.slug || "") && (
                        <button
                          onClick={() => setCuentaPagar(c)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <DollarSign size={12} /> Pagar
                        </button>
                      )}
                      {puedeCrear && !["pagada", "anulada"].includes(c.estado?.slug || "") && (
                        <button
                          onClick={() => setCuentaAnular(c)}
                          className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <X size={12} /> Anular
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modales */}
      {mostrarNueva && (
        <NuevaCuentaPagarModal
          onClose={() => setMostrarNueva(false)}
          onSuccess={() => { setMostrarNueva(false); cargar() }}
        />
      )}

      {cuentaPagar && (
        <RegistrarPagoProveedorModal
          cuenta={cuentaPagar}
          onClose={() => setCuentaPagar(null)}
          onSuccess={() => { setCuentaPagar(null); cargar() }}
        />
      )}

      {cuentaAnular && (
        <AnularCuentaModal
          cuenta={cuentaAnular}
          onClose={() => setCuentaAnular(null)}
          onSuccess={() => { setCuentaAnular(null); cargar() }}
        />
      )}
    </AppLayout>
  )
}