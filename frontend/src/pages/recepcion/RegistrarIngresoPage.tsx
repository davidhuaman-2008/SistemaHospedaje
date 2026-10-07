import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import { Search, ArrowLeft, Plus, Trash2, DollarSign, CreditCard, Ban } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { habitacionService } from "@/services/habitacionService"
import { clienteService } from "@/services/clienteService"
import { clienteObservacionService } from "@/services/clienteObservacionService"
import { tarifaService } from "@/services/tarifaService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { tipoDocumentoService } from "@/services/tipoDocumentoService"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Habitacion } from "@/types/habitacion"
import type { Cliente, ClienteObservacion } from "@/types/cliente"
import type { Tarifa } from "@/types/tarifa"
import type { MetodoPago, TipoDocumento } from "@/types/configuracion"
import { AlertaClienteObservaciones } from "@/pages/clientes/cliente/AlertaClienteObservaciones"

interface PagoItem {
  id: number
  id_metodo_pago: number | null
  monto: number
}

type ModoCobro = "unico" | "varios"

export function RegistrarIngresoPage() {
  const { idHabitacion } = useParams<{ idHabitacion: string }>()
  const navigate = useNavigate()

  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [tarifas, setTarifas] = useState<Tarifa[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [cargando, setCargando] = useState(true)

  // Tipo de documento
  const [idTipoDocumento, setIdTipoDocumento] = useState<number | null>(null)

  // Búsqueda de cliente
  const [dni, setDni] = useState("")
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [observacionesPendientes, setObservacionesPendientes] = useState<ClienteObservacion[]>([])
  const [alertaAceptada, setAlertaAceptada] = useState(false)
  const [reservaActiva, setReservaActiva] = useState<any>(null)

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
  const [notas, setNotas] = useState("")
  const [enviando, setEnviando] = useState(false)

  // COBRO
  const [modoCobro, setModoCobro] = useState<ModoCobro>("unico")
  const [montoUnico, setMontoUnico] = useState(0)
  const [idMetodoPagoUnico, setIdMetodoPagoUnico] = useState<number | null>(null)
  const [pagosMixtos, setPagosMixtos] = useState<PagoItem[]>([
    { id: 1, id_metodo_pago: null, monto: 0 },
  ])
  const [contadorPago, setContadorPago] = useState(2)

  // Vuelto
  const [entregarVueltoAhora, setEntregarVueltoAhora] = useState(false)
  const [metodoVuelto, setMetodoVuelto] = useState<number | null>(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      // FIX #26: validar que idHabitacion exista
      if (!idHabitacion) {
        toast.error("ID de habitación no válido")
        navigate("/recepcion")
        return
      }
      try {
        setCargando(true)
        const id = Number(idHabitacion)
        const [hab, mps, tipos] = await Promise.all([
          habitacionService.obtener(id),
          metodoPagoService.listarActivos(),
          tipoDocumentoService.listarActivos(),
        ])
        if (cancelado) return

        setHabitacion(hab)
        setMetodosPago(mps)
        setTiposDocumento(tipos)

        // Preseleccionar DNI
        const dniTipo = tipos.find(t => t.abreviatura === "DNI")
        if (dniTipo) setIdTipoDocumento(dniTipo.id_documento)
        else if (tipos.length > 0) setIdTipoDocumento(tipos[0].id_documento)

        // Preseleccionar Efectivo
        const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
        if (efectivo) {
          setIdMetodoPagoUnico(efectivo.id_metodo)
          setMetodoVuelto(efectivo.id_metodo)
        } else if (mps.length > 0) {
          setIdMetodoPagoUnico(mps[0].id_metodo)
          setMetodoVuelto(mps[0].id_metodo)
        }

        if (efectivo) {
          setPagosMixtos([{ id: 1, id_metodo_pago: efectivo.id_metodo, monto: 0 }])
        }

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
  }, [idHabitacion, navigate])

  const buscarCliente = async () => {
    if (!idTipoDocumento) {
      toast.error("Seleccione un tipo de documento")
      return
    }
    if (!dni.trim()) {
      toast.error("Ingrese un número de documento")
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

  const tarifaSeleccionada = tarifas.find(t => t.id_tarifa === idTarifa)
  const totalHabitacion = tarifaSeleccionada ? Number(tarifaSeleccionada.monto) : 0

  const clientePaga = modoCobro === "unico"
    ? montoUnico
    : pagosMixtos.reduce((acc, p) => acc + (p.monto || 0), 0)

  const diferencia = clientePaga - totalHabitacion
  const vuelto = diferencia > 0 ? diferencia : 0
  const clienteDebe = diferencia < 0 ? Math.abs(diferencia) : 0

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

  const registrarIngreso = async () => {
    if (!habitacion) return
    if (!cliente && !clienteNuevo.nombre.trim()) {
      toast.error("Debe registrar un cliente")
      return
    }

    if (!cliente && dni.trim()) {
      try {
        const verificacion = await clienteService.buscarPorDni(dni)
        if (verificacion.cliente) {
          toast.error("Este DNI ya esta registrado. Presione la lupa para cargar los datos.")
          return
        }
      } catch {
        // Ignorar
      }
    }
    if (!idTarifa) {
      toast.error("Seleccione una tarifa")
      return
    }
    if (enviando) return

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

    if (vuelto > 0 && entregarVueltoAhora && !metodoVuelto) {
      toast.error("Seleccioná un método para entregar el vuelto")
      return
    }

    try {
      setEnviando(true)
      let idCliente = cliente?.id_cliente

      if (!idCliente) {
        const nuevo = await clienteService.crear({
          nombre: clienteNuevo.nombre,
          apellido: clienteNuevo.apellido,
          id_tipo_documento: idTipoDocumento,
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

      const reserva = await reservaService.crearWalkIn(payload)

      if (vuelto > 0 && entregarVueltoAhora && metodoVuelto) {
        await reservaService.entregarVuelto(reserva.id_reserva, {
          monto: vuelto,
          id_metodo_pago: metodoVuelto,
        })
        toast.success(`¡Ingreso registrado! Vuelto de S/ ${vuelto.toFixed(2)} entregado.`)
      } else if (vuelto > 0) {
        toast.success(`¡Ingreso registrado! Vuelto de S/ ${vuelto.toFixed(2)} guardado como saldo a favor.`)
      } else {
        toast.success("¡Ingreso registrado!")
      }

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
        {/* DATOS DEL CLIENTE */}
        <div className="bg-slate-800 p-5 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Datos del Cliente</h2>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 text-sm block mb-1">
                Tipo de documento *
              </label>
              <select
                value={idTipoDocumento ?? ""}
                onChange={e => setIdTipoDocumento(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-900 text-white p-2 rounded"
              >
                <option value="">— Seleccionar —</option>
                {tiposDocumento.map(t => (
                  <option key={t.id_documento} value={t.id_documento}>
                    {t.nombre} ({t.abreviatura})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1">
                N° de documento *
              </label>
              <div className="flex gap-2">
                <input
                  value={dni}
                  onChange={e => {
                    const valor = e.target.value
                    setDni(valor)
                    const tipo = tiposDocumento.find(t => t.id_documento === idTipoDocumento)
                    const longitud = tipo?.longitud ?? 8
                    if (valor.trim().length >= longitud) {
                      clearTimeout((window as any).__dniTimer)
                      ;(window as any).__dniTimer = setTimeout(() => {
                        buscarCliente()
                      }, 600)
                    }
                  }}
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
                  Doc: {cliente.numero_documento} · {cliente.visitas ?? 0} visita{(cliente.visitas ?? 0) !== 1 ? "s" : ""}
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
                    <h3 className="text-red-200 font-bold text-lg">
                      🚫 CLIENTE CON RESERVA ACTIVA
                    </h3>
                    <p className="text-red-100 text-sm mt-1">
                      <strong>{cliente.nombre} {cliente.apellido}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-red-900/50 p-3 rounded">
                  <p className="text-red-100 text-sm mb-2">Ya está hospedado en:</p>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-2xl">🏨</span>
                    <div>
                      <p className="font-bold text-lg">
                        Habitación {reservaActiva.habitacion?.numero || "—"}
                      </p>
                      <p className="text-red-200 text-xs">
                        {reservaActiva.habitacion?.tipo?.nombre} · {reservaActiva.habitacion?.piso?.nombre}
                      </p>
                    </div>
                  </div>
                  <p className="text-red-200 text-xs mt-2">
                    Entrada: {new Date(reservaActiva.fecha_entrada).toLocaleString("es-PE")}
                  </p>
                  <p className="text-red-200 text-xs">
                    Código: {reservaActiva.codigo_reserva}
                  </p>
                </div>

                <div className="bg-red-900/40 p-3 rounded border border-red-700">
                  <p className="text-red-100 text-sm">
                    💡 <strong>Solución:</strong> Si necesitás otra habitación,
                    registrala a nombre de <strong>otra persona</strong> (familiar).
                  </p>
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

        {/* DATOS DEL ALQUILER */}
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
                    Total: S/ {totalHabitacion.toFixed(2)}
                  </p>
                </div>

                {/* COBRO */}
                <div className="bg-slate-900 p-4 rounded space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    <p className="text-slate-200 font-semibold">Cobro</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => cambiarModo("unico")}
                      className={`flex-1 p-2 rounded text-sm font-medium transition ${
                        modoCobro === "unico"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      💵 Un solo método
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarModo("varios")}
                      className={`flex-1 p-2 rounded text-sm font-medium transition ${
                        modoCobro === "varios"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
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
                          className="w-full bg-slate-800 text-white p-2 rounded text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm block mb-1">Método de pago</label>
                        <select
                          value={idMetodoPagoUnico ?? ""}
                          onChange={e => setIdMetodoPagoUnico(e.target.value ? Number(e.target.value) : null)}
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
                            className="flex-1 bg-slate-800 text-white p-2 rounded text-sm"
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
                            className="w-24 bg-slate-800 text-white p-2 rounded text-sm"
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
                      <span className="text-slate-400">Total habitación:</span>
                      <span className="text-white font-semibold">S/ {totalHabitacion.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cliente paga:</span>
                      <span className="text-blue-400 font-semibold">S/ {clientePaga.toFixed(2)}</span>
                    </div>

                    {vuelto > 0 && (
                      <div className="bg-green-900/40 border border-green-700 p-2 rounded flex justify-between">
                        <span className="text-green-300 font-semibold">💵 VUELTO:</span>
                        <span className="text-green-300 font-bold text-lg">S/ {vuelto.toFixed(2)}</span>
                      </div>
                    )}

                    {clienteDebe > 0 && (
                      <div className="bg-red-900/40 border border-red-700 p-2 rounded">
                        <div className="flex justify-between">
                          <span className="text-red-300 font-semibold">🔴 CLIENTE DEBE:</span>
                          <span className="text-red-300 font-bold text-lg">S/ {clienteDebe.toFixed(2)}</span>
                        </div>
                        <p className="text-red-200 text-xs mt-1">
                          El cliente entra debiendo. Deberá pagar al check-out.
                        </p>
                      </div>
                    )}

                    {diferencia === 0 && clientePaga > 0 && (
                      <div className="bg-slate-800 p-2 rounded text-center text-slate-300 text-sm">
                        ✅ Pago exacto
                      </div>
                    )}
                  </div>

                  {vuelto > 0 && (
                    <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded space-y-2">
                      <p className="text-yellow-200 text-sm font-medium">¿Qué hacer con el vuelto?</p>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!entregarVueltoAhora}
                          onChange={() => setEntregarVueltoAhora(false)}
                        />
                        <span className="text-slate-200 text-sm">
                          Guardar como saldo a favor <span className="text-yellow-400">(recomendado)</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={entregarVueltoAhora}
                          onChange={() => setEntregarVueltoAhora(true)}
                        />
                        <span className="text-slate-200 text-sm">
                          Entregar ahora al cliente
                        </span>
                      </label>

                      {entregarVueltoAhora && (
                        <div>
                          <label className="text-slate-300 text-xs block mb-1">Método de devolución</label>
                          <select
                            value={metodoVuelto ?? ""}
                            onChange={e => setMetodoVuelto(e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-slate-900 text-white p-2 rounded text-sm"
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
              disabled={!idTarifa || enviando || !!reservaActiva || (observacionesPendientes.length > 0 && !alertaAceptada)}
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