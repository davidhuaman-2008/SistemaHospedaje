import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import { Search, ArrowLeft } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { habitacionService } from "@/services/habitacionService"
import { clienteService } from "@/services/clienteService"
import { tarifaService } from "@/services/tarifaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Habitacion } from "@/types/habitacion"
import type { Cliente } from "@/types/cliente"
import type { Tarifa } from "@/types/tarifa"
import type { MetodoPago } from "@/types/configuracion"

export function RegistrarIngresoPage() {
  const { idHabitacion } = useParams<{ idHabitacion: string }>()
  const navigate = useNavigate()

  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [tarifas, setTarifas] = useState<Tarifa[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [cargando, setCargando] = useState(true)

  // Búsqueda de cliente
  const [dni, setDni] = useState("")
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)
  const [buscando, setBuscando] = useState(false)

  // Cliente nuevo
  const [clienteNuevo, setClienteNuevo] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    email: "",
  })

  // Alquiler
  const [idTarifa, setIdTarifa] = useState<number | null>(null)
  const [cantidadPersonas, setCantidadPersonas] = useState(2)
  const [telefono, setTelefono] = useState("")
  const [adelanto, setAdelanto] = useState(0)
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [notas, setNotas] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const id = Number(idHabitacion)
        const [hab, mps] = await Promise.all([
          habitacionService.obtener(id),
          metodoPagoService.listarActivos(),
        ])
        if (cancelado) return
        setHabitacion(hab)
        setMetodosPago(mps)
        if (hab.id_tipo) {
          const ts = await tarifaService.listarPorTipo(hab.id_tipo)
          if (!cancelado) setTarifas(ts.filter(t => t.activo))
        }
      } catch {
        if (!cancelado) toast.error("Error al cargar datos")
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [idHabitacion])

  const buscarCliente = async () => {
    if (!dni.trim()) {
      toast.error("Ingrese un DNI primero")
      return
    }
    setBuscando(true)
    setBusquedaRealizada(true)
    try {
      const encontrado = await clienteService.buscarPorDni(dni)
      if (encontrado) {
        setCliente(encontrado)
        setTelefono(encontrado.celular ?? "")
        toast.success(`Cliente encontrado: ${encontrado.nombre}`)
      } else {
        setCliente(null)
        setClienteNuevo({ nombre: "", apellido: "", fecha_nacimiento: "", email: "" })
        toast.info("Cliente nuevo. Complete los datos.")
      }
    } catch (e) {
      setCliente(null)
      console.error(e)
      toast.info("Cliente nuevo. Complete los datos.")
    } finally {
      setBuscando(false)
    }
  }

  const tarifaSeleccionada = tarifas.find(t => t.id_tarifa === idTarifa)
  const total = tarifaSeleccionada ? Number(tarifaSeleccionada.monto) : 0
  const vuelto = adelanto > total ? adelanto - total : 0
  const saldoPendiente = adelanto > total ? 0 : total - adelanto

  const registrarIngreso = async () => {
    if (!habitacion) return
    if (!cliente && !clienteNuevo.nombre.trim()) {
      toast.error("Debe registrar un cliente")
      return
    }
    if (!idTarifa) {
      toast.error("Seleccione una tarifa")
      return
    }
    if (enviando) return

    try {
      setEnviando(true)
      let idCliente = cliente?.id_cliente

      if (!idCliente) {
        const nuevo = await clienteService.crear({
          nombre: clienteNuevo.nombre,
          apellido: clienteNuevo.apellido,
          numero_documento: dni,
          celular: telefono || null,
          email: clienteNuevo.email || null,
          fecha_nacimiento: clienteNuevo.fecha_nacimiento || null,
          activo: true,
        })
        idCliente = nuevo.id_cliente
      }

      await reservaService.crearWalkIn({
        id_cliente: idCliente,
        id_habitacion: habitacion.id_habitacion,
        id_tarifa: idTarifa,
        cantidad_personas: cantidadPersonas,
        adelanto: adelanto > 0 ? adelanto : undefined, 
       id_metodo_pago: adelanto > 0 && idMetodoPago ? idMetodoPago : undefined,
        telefono: telefono || undefined,
        notas: notas || undefined,
      })

      toast.success("¡Ingreso registrado!")
      navigate("/recepcion")
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <AppLayout>
        <p className="text-slate-400">Cargando...</p>
      </AppLayout>
    )
  }

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
          Registrar Ingreso — Habitación {habitacion?.numero}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {habitacion?.tipo?.nombre} · {habitacion?.piso?.nombre}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============ DATOS DEL CLIENTE ============ */}
        <div className="bg-slate-800 p-5 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Datos del Cliente</h2>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 text-sm block mb-1">DNI</label>
              <div className="flex gap-2">
                <input
                  value={dni}
                  onChange={e => setDni(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && buscarCliente()}
                  placeholder="Ingrese documento"
                  className="flex-1 bg-slate-900 text-white p-2 rounded"
                />
                <button
                  onClick={buscarCliente}
                  disabled={buscando}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 rounded"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cliente encontrado */}
            {cliente && (
              <div className="bg-slate-900 p-3 rounded border border-green-700">
                <p className="text-green-400 text-sm font-medium">
                  ✅ {cliente.nombre} {cliente.apellido}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  DNI: {cliente.numero_documento} · {cliente.visitas ?? 0} visita{(cliente.visitas ?? 0) !== 1 ? "s" : ""}
                </p>
                {cliente.nivel && (
                  <p className="text-cyan-400 text-xs mt-1">
                    Nivel: {cliente.nivel.nombre} ({cliente.nivel.descuento}% descuento)
                  </p>
                )}
              </div>
            )}

            {/* Cliente nuevo */}
            {busquedaRealizada && !cliente && (
              <div className="space-y-3 border-l-2 border-cyan-500 pl-3 bg-slate-900/50 p-3 rounded">
                <p className="text-cyan-400 text-sm font-medium">Cliente nuevo. Complete los datos:</p>
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Nombre *</label>
                  <input
                    value={clienteNuevo.nombre}
                    onChange={e => setClienteNuevo({ ...clienteNuevo, nombre: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2 rounded"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Apellido</label>
                  <input
                    value={clienteNuevo.apellido}
                    onChange={e => setClienteNuevo({ ...clienteNuevo, apellido: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1">
                    Fecha de nacimiento
                    <span className="text-cyan-400 text-xs ml-2">(para promociones de cumpleaños)</span>
                  </label>
                  <input
                    type="date"
                    value={clienteNuevo.fecha_nacimiento}
                    onChange={e => setClienteNuevo({ ...clienteNuevo, fecha_nacimiento: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Email</label>
                  <input
                    type="email"
                    value={clienteNuevo.email}
                    onChange={e => setClienteNuevo({ ...clienteNuevo, email: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2 rounded"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 text-sm block mb-1">Cantidad de personas</label>
              <input
                type="number"
                min={1}
                value={cantidadPersonas}
                onChange={e => setCantidadPersonas(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Teléfono / Celular
                <span className="text-slate-500 text-xs ml-2">(opcional)</span>
              </label>
              <input
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                placeholder="Ej: 987654321"
                className="w-full bg-slate-900 text-white p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* ============ DATOS DEL ALQUILER ============ */}
        <div className="bg-slate-800 p-5 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Datos del Alquiler</h2>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 text-sm block mb-1">Tarifa *</label>
              <select
                value={idTarifa ?? ""}
                onChange={e => setIdTarifa(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded"
              >
                <option value="">— Seleccionar tarifa —</option>
                {tarifas.map(t => (
                  <option key={t.id_tarifa} value={t.id_tarifa}>
                    {t.horas}h — S/ {Number(t.monto).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {tarifaSeleccionada && (
              <>
                <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded">
                  <div>
                    <p className="text-slate-400 text-xs">Tiempo</p>
                    <p className="text-white font-semibold">{tarifaSeleccionada.horas} horas</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Precio base</p>
                    <p className="text-white font-semibold">S/ {Number(tarifaSeleccionada.monto).toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-lg text-white font-bold">
                    Total: S/ {total.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 text-sm block mb-1">Adelanto (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={adelanto}
                    onChange={e => setAdelanto(Number(e.target.value))}
                    className="w-full bg-slate-900 text-white p-2 rounded text-lg"
                  />
                </div>

                {adelanto > 0 && (
                  <div>
                    <label className="text-slate-300 text-sm block mb-1">Método de pago</label>
                    <select
                      value={idMetodoPago ?? ""}
                      onChange={e => setIdMetodoPago(e.target.value ? Number(e.target.value) : null)}
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
                )}

                {/* Resumen de pago */}
                <div className="space-y-2 bg-slate-900 p-3 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-white font-semibold">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Adelanto:</span>
                    <span className="text-blue-400">S/ {adelanto.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between">
                    {vuelto > 0 ? (
                      <>
                        <span className="text-yellow-300 font-semibold">💵 Vuelto:</span>
                        <span className="text-yellow-300 font-bold text-lg">S/ {vuelto.toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400 font-semibold">Saldo pendiente:</span>
                        <span className={saldoPendiente > 0 ? "text-yellow-300 font-bold text-lg" : "text-green-400 font-bold text-lg"}>
                          S/ {saldoPendiente.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm block mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 text-white p-2 rounded"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={registrarIngreso}
              disabled={!idTarifa || enviando}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded font-medium"
            >
              {enviando ? "Registrando..." : "Registrar Ingreso"}
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
    </AppLayout>
  )
}