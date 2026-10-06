import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Search, ArrowLeft, Plus, Trash2, DollarSign, CreditCard, Ban, Calendar, Clock, Timer } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { clienteService } from "@/services/clienteService"
import { clienteObservacionService } from "@/services/clienteObservacionService"
import { tarifaService } from "@/services/tarifaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import { SelectorDisponibilidad } from "@/components/SelectorDisponibilidad"
import { SelectorFechaHora } from "@/components/SelectorFechaHora"
import type { Cliente, ClienteObservacion } from "@/types/cliente"
import type { Tarifa } from "@/types/tarifa"
import type { MetodoPago } from "@/types/configuracion"
import type { HabitacionLibre } from "@/types/reserva"
import { AlertaClienteObservaciones } from "@/pages/clientes/cliente/AlertaClienteObservaciones"

interface PagoItem {
  id: number
  id_metodo_pago: number | null
  monto: number
}

type ModoCobro = "unico" | "varios"

const DURACIONES = [4, 6, 8, 12]

export function NuevaReservaPage() {
  const navigate = useNavigate()

  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])

  // Búsqueda de cliente
  const [dni, setDni] = useState("")
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [observacionesPendientes, setObservacionesPendientes] = useState<ClienteObservacion[]>([])
  const [alertaAceptada, setAlertaAceptada] = useState(false)
  const [reservaActiva, setReservaActiva] = useState<any>(null)

  const [clienteNuevo, setClienteNuevo] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    email: "",
  })

  // Fecha y duración
  const [fechaEntrada, setFechaEntrada] = useState("")
  const [horas, setHoras] = useState<number>(6)
  const [cantidadPersonas, setCantidadPersonas] = useState(2)
  const [telefono, setTelefono] = useState("")
  const [notas, setNotas] = useState("")

  // Habitación + tarifa
  const [habitacion, setHabitacion] = useState<HabitacionLibre | null>(null)
  const [tarifas, setTarifas] = useState<Tarifa[]>([])
  const [idTarifa, setIdTarifa] = useState<number | null>(null)

  // Adelanto
  const [modoCobro, setModoCobro] = useState<ModoCobro>("unico")
  const [montoUnico, setMontoUnico] = useState(0)
  const [idMetodoPagoUnico, setIdMetodoPagoUnico] = useState<number | null>(null)
  const [pagosMixtos, setPagosMixtos] = useState<PagoItem[]>([
    { id: 1, id_metodo_pago: null, monto: 0 },
  ])
  const [contadorPago, setContadorPago] = useState(2)

  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const mps = await metodoPagoService.listarActivos()
        setMetodosPago(mps)

        const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
        if (efectivo) {
          setIdMetodoPagoUnico(efectivo.id_metodo)
          setPagosMixtos([{ id: 1, id_metodo_pago: efectivo.id_metodo, monto: 0 }])
        } else if (mps.length > 0) {
          setIdMetodoPagoUnico(mps[0].id_metodo)
          setPagosMixtos([{ id: 1, id_metodo_pago: mps[0].id_metodo, monto: 0 }])
        }
      } catch {
        toast.error("Error al cargar métodos de pago")
      }
    }
    cargar()
  }, [])

  const buscarCliente = async () => {
    if (!dni.trim()) {
      toast.error("Ingrese un DNI primero")
      return
    }
    setBuscando(true)
    setBusquedaRealizada(true)
    try {
      const resultado = await clienteService.buscarPorDni(dni)

      if (resultado.cliente) {
        const encontrado = resultado.cliente
        setCliente(encontrado)
        setTelefono(encontrado.celular ?? "")
        setAlertaAceptada(false)
        setReservaActiva(resultado.reservaActiva)

        try {
          const obs = await clienteObservacionService.porCliente(encontrado.id_cliente)
          const pendientes = obs.filter(o => !o.resuelto)
          setObservacionesPendientes(pendientes)
          if (pendientes.length > 0) {
            toast.warning(`${encontrado.nombre} tiene ${pendientes.length} observación(es) pendiente(s)`)
          } else if (resultado.reservaActiva) {
            toast.error(`${encontrado.nombre} ya tiene reserva activa`)
          } else {
            toast.success(`Cliente encontrado: ${encontrado.nombre}`)
          }
        } catch {
          setObservacionesPendientes([])
          if (resultado.reservaActiva) {
            toast.error(`${encontrado.nombre} ya tiene reserva activa`)
          } else {
            toast.success(`Cliente encontrado: ${encontrado.nombre}`)
          }
        }
      } else {
        setCliente(null)
        setObservacionesPendientes([])
        setReservaActiva(null)
        setAlertaAceptada(false)
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

  // Al seleccionar habitación, cargar SUS tarifas filtradas por la duración elegida
  const seleccionarHabitacion = async (h: HabitacionLibre) => {
    setHabitacion(h)
    setTarifas([])
    setIdTarifa(null)

    try {
      const todasTarifas = await tarifaService.listarPorTipo(h.id_tipo)
      const filtradas = todasTarifas.filter(t => t.activo && t.horas === horas)
      setTarifas(filtradas)

      if (filtradas.length === 0) {
        toast.error(`${h.numero} no tiene tarifa de ${horas}h. Elegí otra duración u otra habitación.`)
      } else if (filtradas.length === 1) {
        // Auto-seleccionar si solo hay una
        setIdTarifa(filtradas[0].id_tarifa)
      }
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  // Cambiar duración → limpiar habitación y tarifa
  const cambiarDuracion = (h: number) => {
    setHoras(h)
    setHabitacion(null)
    setTarifas([])
    setIdTarifa(null)
  }

  const tarifaSeleccionada = tarifas.find((t) => t.id_tarifa === idTarifa)
  const totalHabitacion = tarifaSeleccionada ? Number(tarifaSeleccionada.monto) : 0

  const clientePaga = modoCobro === "unico"
    ? montoUnico
    : pagosMixtos.reduce((acc, p) => acc + (p.monto || 0), 0)

  const saldoPendiente = Math.max(0, totalHabitacion - clientePaga)

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

  const crearReserva = async () => {
    if (!cliente && !clienteNuevo.nombre.trim()) {
      toast.error("Debe registrar un cliente")
      return
    }
    if (!fechaEntrada) {
      toast.error("Seleccione fecha y hora de entrada")
      return
    }
    if (new Date(fechaEntrada) <= new Date()) {
      toast.error("La fecha debe ser futura")
      return
    }
    if (!habitacion) {
      toast.error("Seleccione una habitación")
      return
    }
    if (!idTarifa) {
      toast.error("Seleccione una tarifa")
      return
    }

    if (modoCobro === "unico") {
      if (montoUnico > 0 && !idMetodoPagoUnico) {
        toast.error("Seleccione un método de pago")
        return
      }
    } else {
      const pagosValidos = pagosMixtos.filter(p => p.id_metodo_pago && p.monto > 0)
      if (clientePaga > 0 && pagosValidos.length === 0) {
        toast.error("Agregue al menos un pago válido")
        return
      }
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

      const payload: any = {
        id_cliente: idCliente,
        id_habitacion: habitacion.id_habitacion,
        id_tarifa: idTarifa,
        cantidad_personas: cantidadPersonas,
        fecha_entrada: fechaEntrada,
        telefono: telefono || undefined,
        notas: notas || undefined,
      }

      if (modoCobro === "unico") {
        if (montoUnico > 0) {
          payload.adelanto = montoUnico
          payload.id_metodo_pago = idMetodoPagoUnico
        }
      } else {
        const pagosValidos = pagosMixtos.filter(p => p.id_metodo_pago && p.monto > 0)
        if (pagosValidos.length > 0) {
          payload.adelanto = pagosValidos.reduce((acc, p) => acc + p.monto, 0)
          payload.pagos = pagosValidos.map(p => ({
            id_metodo_pago: p.id_metodo_pago,
            monto: p.monto,
          }))
        }
      }

      const reserva = await reservaService.crearReserva(payload)
      toast.success(`¡Reserva creada! Código: ${reserva.codigo_reserva}`)
      navigate(`/reservas/${reserva.id_reserva}`)
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AppLayout>
      <button
        onClick={() => navigate("/reservas")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Volver a Reservas
      </button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">📅 Nueva Reserva Futura</h1>
        <p className="text-slate-400 text-sm mt-1">
          Creá una reserva para una fecha futura. La habitación quedará bloqueada automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-4">

          {/* 1. CLIENTE */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">1. Cliente</h2>

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

              {cliente && !reservaActiva && (
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

              {cliente && reservaActiva && (
                <div className="bg-red-950 border-2 border-red-600 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Ban size={28} className="text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-red-200 font-bold text-lg">🚫 CLIENTE CON RESERVA ACTIVA</h3>
                      <p className="text-red-100 text-sm mt-1">
                        <strong>{cliente.nombre} {cliente.apellido}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-900/50 p-3 rounded">
                    <p className="text-red-100 text-sm mb-2">Ya está hospedado en:</p>
                    <p className="font-bold text-lg text-white">
                      Habitación {reservaActiva.habitacion?.numero || "—"}
                    </p>
                    <p className="text-red-200 text-xs mt-2">Código: {reservaActiva.codigo_reserva}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCliente(null)
                      setReservaActiva(null)
                      setDni("")
                    }}
                    className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded font-medium"
                  >
                    Entendido — Limpiar y buscar otro DNI
                  </button>
                </div>
              )}

              {cliente && observacionesPendientes.length > 0 && (
                <AlertaClienteObservaciones
                  observaciones={observacionesPendientes}
                  mostrarBotones={!alertaAceptada}
                  onContinuar={() => setAlertaAceptada(true)}
                  onCancelar={() => {
                    setCliente(null)
                    setObservacionesPendientes([])
                    setAlertaAceptada(false)
                  }}
                />
              )}

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
                      Fecha de nacimiento <span className="text-cyan-400 text-xs">(opcional)</span>
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
                  Teléfono / Celular <span className="text-slate-500 text-xs">(opcional)</span>
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

          {/* 2. FECHA Y HORA */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} /> 2. Fecha y hora de entrada
            </h2>

            <SelectorFechaHora
              fechaEntrada={fechaEntrada}
              horas={horas}
              onChangeFecha={setFechaEntrada}
              onChangeHoras={setHoras}
            />
          </div>

          {/* 3. DURACIÓN */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Timer size={18} /> 3. Duración
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {DURACIONES.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => cambiarDuracion(h)}
                  className={`p-3 rounded-lg text-center transition border-2 font-bold ${
                    horas === h
                      ? "bg-green-600 text-white border-green-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:border-green-500 hover:text-white"
                  }`}
                >
                  <p className="text-xl">{h}h</p>
                </button>
              ))}
            </div>

            <p className="text-slate-400 text-xs mt-3">
              💡 El sistema mostrará solo las habitaciones con tarifa de <strong>{horas}h</strong>.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-4">

          {/* 4. HABITACIÓN DISPONIBLE */}
          <div className="bg-slate-800 p-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} /> 4. Habitación disponible
            </h2>

            <SelectorDisponibilidad
              fecha={fechaEntrada}
              horas={horas}
              idHabitacionSeleccionada={habitacion?.id_habitacion ?? null}
              onSeleccionar={seleccionarHabitacion}
            />
          </div>

          {/* 5. TARIFA */}
          {habitacion && (
            <div className="bg-slate-800 p-5 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">5. Tarifa</h2>

              {tarifas.length === 0 ? (
                <div className="bg-red-950/40 border border-red-800 p-3 rounded text-red-300 text-sm">
                  ⚠️ Esta habitación no tiene tarifa de <strong>{horas}h</strong>.
                  Cambiá la duración o elegí otra habitación.
                </div>
              ) : (
                <div className="space-y-2">
                  {tarifas.map(t => (
                    <button
                      key={t.id_tarifa}
                      type="button"
                      onClick={() => setIdTarifa(t.id_tarifa)}
                      className={`w-full p-3 rounded border-2 text-left transition ${
                        idTarifa === t.id_tarifa
                          ? "bg-green-600 border-green-400"
                          : "bg-slate-900 border-slate-700 hover:border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${idTarifa === t.id_tarifa ? "text-white" : "text-slate-200"}`}>
                          {t.horas}h
                        </span>
                        <span className={`font-bold ${idTarifa === t.id_tarifa ? "text-white" : "text-cyan-400"}`}>
                          S/ {Number(t.monto).toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. ADELANTO */}
          {tarifaSeleccionada && (
            <div className="bg-slate-800 p-5 rounded-lg space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign size={18} /> 6. Adelanto <span className="text-slate-500 text-sm font-normal">(opcional)</span>
              </h2>

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
                  <CreditCard size={14} className="inline mr-1" /> Varios métodos
                </button>
              </div>

              {modoCobro === "unico" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-300 text-sm block mb-1">Monto</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={montoUnico || ""}
                      onChange={e => setMontoUnico(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-slate-900 text-white p-2 rounded text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-1">Método de pago</label>
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
                    <Plus size={14} /> Agregar otro método
                  </button>
                </div>
              )}

              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total reserva:</span>
                  <span className="text-white font-semibold">S/ {totalHabitacion.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Adelanto:</span>
                  <span className="text-blue-400 font-semibold">S/ {clientePaga.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
                  <span className="text-slate-400">Saldo al llegar:</span>
                  <span className={saldoPendiente > 0 ? "text-yellow-400 font-bold" : "text-green-400 font-bold"}>
                    S/ {saldoPendiente.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1">Notas</label>
                <textarea
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 text-white p-2 rounded"
                  placeholder="Ej: Cliente llamó por teléfono, pidió decoración"
                />
              </div>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex gap-2">
            <button
              onClick={crearReserva}
              disabled={
                enviando ||
                !fechaEntrada ||
                !habitacion ||
                !idTarifa ||
                (!cliente && !clienteNuevo.nombre.trim()) ||
                !!reservaActiva ||
                (observacionesPendientes.length > 0 && !alertaAceptada)
              }
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold"
            >
              {enviando ? "Creando..." : "📅 Crear Reserva"}
            </button>
            <button
              onClick={() => navigate("/reservas")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}