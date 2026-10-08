import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  X, Search, ShoppingCart, Tag, Plus, Trash2,

} from "lucide-react"
import { reservaService } from "@/services/reservaService"
import { productoService } from "@/services/productoService"
import { categoriaProductoService } from "@/services/categoriaProductoService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { mensajeDeError } from "@/lib/errores"
import { IconoDinamico } from "@/components/IconoDinamico"
import type { Producto, CategoriaProducto } from "@/types/producto"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  idReserva: number
  onClose: () => void
  onSuccess: () => void
}

interface ItemCarrito {
  id: number
  producto: Producto
  cantidad: number
}

interface PagoItem {
  id: number
  id_metodo_pago: number | null
  monto: number
}

type ModoCobro = "a_cuenta" | "unico" | "parcial"

let nextItemId = 1
let nextPagoId = 1

export function AgregarConsumoModal({ idReserva, onClose, onSuccess }: Props) {
  // Datos
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [cargando, setCargando] = useState(true)

  // Filtros
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null)

  // Carrito
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])

  // Cantidad temporal por producto
  const [cantidadTemporal, setCantidadTemporal] = useState<Record<number, number>>({})

  // Modo de cobro
  const [modoCobro, setModoCobro] = useState<ModoCobro>("a_cuenta")

  // Pago único
  const [montoUnico, setMontoUnico] = useState<string>("")
  const [idMetodoPagoUnico, setIdMetodoPagoUnico] = useState<number | null>(null)

  // Pagos parciales/mixtos
  const [pagos, setPagos] = useState<PagoItem[]>([
    { id: nextPagoId++, id_metodo_pago: null, monto: 0 },
  ])

  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [prods, cats, mps] = await Promise.all([
          productoService.listarActivos(),
          categoriaProductoService.listarActivos(),
          metodoPagoService.listarActivos(),
        ])
        setProductos(prods)
        setCategorias(cats)
        setMetodosPago(mps)

        const efectivo = mps.find(m => m.nombre.toLowerCase().includes("efectivo"))
        if (efectivo) {
          setIdMetodoPagoUnico(efectivo.id_metodo)
          setPagos([{ id: nextPagoId++, id_metodo_pago: efectivo.id_metodo, monto: 0 }])
        } else if (mps.length > 0) {
          setIdMetodoPagoUnico(mps[0].id_metodo)
          setPagos([{ id: nextPagoId++, id_metodo_pago: mps[0].id_metodo, monto: 0 }])
        }
      } catch {
        toast.error("Error al cargar productos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      if (filtroCategoria && p.id_categoria_producto !== filtroCategoria) return false
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim()
        return p.nombre.toLowerCase().includes(q) || (p.codigo_barra ?? "").toLowerCase().includes(q)
      }
      return true
    })
  }, [productos, filtroCategoria, busqueda])

  // Contadores por categoría
  const contadores = useMemo(() => {
    const map: Record<number, number> = {}
    categorias.forEach(c => {
      map[c.id_categoria_producto] = productos.filter(
        p => p.id_categoria_producto === c.id_categoria_producto
      ).length
    })
    return map
  }, [productos, categorias])

  // Total carrito
  const totalCarrito = useMemo(() => {
    return carrito.reduce((acc, item) => {
      return acc + Number(item.producto.precio_venta) * item.cantidad
    }, 0)
  }, [carrito])

  // Total pagos (modo parcial)
  const totalPagos = useMemo(() => {
    return pagos.reduce((acc, p) => acc + (p.monto || 0), 0)
  }, [pagos])

  // Saldo según modo
  const saldoPendiente = useMemo(() => {
    if (modoCobro === "a_cuenta") return totalCarrito
    if (modoCobro === "unico") return Math.max(0, totalCarrito - Number(montoUnico || 0))
    return Math.max(0, totalCarrito - totalPagos)
  }, [modoCobro, totalCarrito, montoUnico, totalPagos])

  // ============================================================================
  // CARRITO
  // ============================================================================

  const getCantidadTemporal = (idProducto: number): number => {
    return cantidadTemporal[idProducto] ?? 1
  }

  const setCantidad = (idProducto: number, cantidad: number) => {
    setCantidadTemporal(prev => ({ ...prev, [idProducto]: Math.max(1, cantidad) }))
  }

  const agregarAlCarrito = (producto: Producto) => {
    const cantidad = getCantidadTemporal(producto.id_producto)

    // Verificar stock considerando lo que ya hay en el carrito
    const enCarrito = carrito.find(i => i.producto.id_producto === producto.id_producto)
    const cantidadTotal = (enCarrito?.cantidad ?? 0) + cantidad

    if (cantidadTotal > producto.stock_actual) {
      toast.error(`Stock insuficiente. Disponible: ${producto.stock_actual}`)
      return
    }

    if (enCarrito) {
      setCarrito(carrito.map(i =>
        i.producto.id_producto === producto.id_producto
          ? { ...i, cantidad: i.cantidad + cantidad }
          : i
      ))
    } else {
      setCarrito([...carrito, {
        id: nextItemId++,
        producto,
        cantidad,
      }])
    }

    // Resetear cantidad temporal
    setCantidadTemporal(prev => ({ ...prev, [producto.id_producto]: 1 }))

    toast.success(`Agregado: ${producto.nombre} x${cantidad}`)
  }

  const quitarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(i => i.id !== id))
  }

  const cambiarCantidadCarrito = (id: number, delta: number) => {
    setCarrito(carrito.map(item => {
      if (item.id !== id) return item
      const nueva = item.cantidad + delta
      if (nueva < 1) return item
      if (nueva > item.producto.stock_actual) {
        toast.error(`Stock máximo: ${item.producto.stock_actual}`)
        return item
      }
      return { ...item, cantidad: nueva }
    }))
  }

  // ============================================================================
  // PAGOS
  // ============================================================================

  const agregarPago = () => {
    const efectivo = metodosPago.find(m => m.nombre.toLowerCase().includes("efectivo"))
    setPagos([...pagos, {
      id: nextPagoId++,
      id_metodo_pago: efectivo?.id_metodo ?? null,
      monto: 0,
    }])
  }

  const eliminarPago = (id: number) => {
    if (pagos.length <= 1) {
      toast.error("Debe haber al menos un pago")
      return
    }
    setPagos(pagos.filter(p => p.id !== id))
  }

  const actualizarPago = (id: number, campo: "id_metodo_pago" | "monto", valor: number | null) => {
    setPagos(pagos.map(p => (p.id === id ? { ...p, [campo]: valor } : p)))
  }

  // ============================================================================
  // GUARDAR
  // ============================================================================

  const guardar = async () => {
    if (carrito.length === 0) {
      return toast.error("Agregá al menos un producto al carrito")
    }

    // Validaciones según modo
    if (modoCobro === "unico") {
      const monto = Number(montoUnico)
      if (!monto || monto <= 0) return toast.error("Ingresá el monto a cobrar")
      if (monto > totalCarrito + 0.01) {
        return toast.error(`El monto excede el total (S/ ${totalCarrito.toFixed(2)})`)
      }
      if (!idMetodoPagoUnico) return toast.error("Seleccioná un método de pago")
    }

    if (modoCobro === "parcial") {
      const pagosValidos = pagos.filter(p => p.id_metodo_pago && p.monto > 0)
      if (pagosValidos.length === 0) return toast.error("Agregá al menos un pago válido")
      if (totalPagos > totalCarrito + 0.01) {
        return toast.error(`Los pagos exceden el total (S/ ${totalCarrito.toFixed(2)})`)
      }
    }

    setEnviando(true)
    try {
      // Armar payload
      const payload: any = {
        consumos: carrito.map(item => ({
          id_producto: item.producto.id_producto,
          cantidad: item.cantidad,
        })),
        cargar_a_cuenta: true, // siempre true, el backend valida el saldo
      }

      if (modoCobro === "unico" && Number(montoUnico) > 0) {
        payload.pagos = [{
          id_metodo_pago: idMetodoPagoUnico,
          monto: Number(montoUnico),
        }]
      } else if (modoCobro === "parcial") {
        payload.pagos = pagos
          .filter(p => p.id_metodo_pago && p.monto > 0)
          .map(p => ({
            id_metodo_pago: p.id_metodo_pago!,
            monto: p.monto,
          }))
      }
      // Si modoCobro === "a_cuenta" → no se manda pagos

      await reservaService.agregarConsumosMultiple(idReserva, payload)
      toast.success(`${carrito.length} producto(s) agregados`)
      onSuccess()
      onClose()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Agregar Consumos</h3>
            {carrito.length > 0 && (
              <span className="bg-cyan-900 text-cyan-200 text-xs px-2 py-0.5 rounded">
                {carrito.length} en carrito
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">

              {/* COLUMNA IZQUIERDA: Catálogo */}
              <div className="space-y-3">
                <h4 className="text-slate-300 text-sm font-medium">Catálogo</h4>

                {/* Buscador */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full bg-slate-900 text-white p-2 pl-9 rounded border border-slate-700 text-sm"
                  />
                </div>

                {/* Chips de categorías */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFiltroCategoria(null)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition border ${
                      filtroCategoria === null
                        ? "bg-slate-500 text-white border-slate-300"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <Tag size={10} className="inline mr-0.5" />
                    Todas
                  </button>

                  {categorias.map(cat => {
                    const activo = filtroCategoria === cat.id_categoria_producto
                    const count = contadores[cat.id_categoria_producto] || 0
                    const sinProductos = count === 0

                    return (
                      <button
                        key={cat.id_categoria_producto}
                        type="button"
                        onClick={() => setFiltroCategoria(activo ? null : cat.id_categoria_producto)}
                        disabled={sinProductos}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition border flex items-center gap-1 ${
                          activo
                            ? "text-white border-white"
                            : sinProductos
                            ? "opacity-40 cursor-not-allowed text-slate-500 border-slate-700"
                            : "text-slate-300 border-slate-700 hover:border-slate-500"
                        }`}
                        style={{
                          background: activo ? (cat.color || "#64748b") : "transparent",
                        }}
                      >
                        {cat.icono && (
                          <IconoDinamico
                            nombre={cat.icono}
                            size={10}
                            style={{ color: activo ? "#fff" : cat.color || "#94a3b8" }}
                          />
                        )}
                        {cat.nombre} ({count})
                      </button>
                    )
                  })}
                </div>

                {/* Lista de productos */}
                <div className="bg-slate-900 rounded max-h-64 overflow-y-auto">
                  {productosFiltrados.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs">
                      Sin productos
                    </div>
                  ) : (
                    productosFiltrados.map(p => {
                      const sinStock = p.stock_actual <= 0
                      const enCarrito = carrito.find(i => i.producto.id_producto === p.id_producto)
                      const cantidadDisp = p.stock_actual - (enCarrito?.cantidad ?? 0)
                      const cantTemp = getCantidadTemporal(p.id_producto)

                      return (
                        <div
                          key={p.id_producto}
                          className={`p-2.5 border-b border-slate-800 last:border-0 ${
                            sinStock ? "opacity-40" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <div className="flex-1">
                              <p className="text-white text-xs font-medium">{p.nombre}</p>
                              <p className={`text-[10px] ${
                                sinStock ? "text-red-400" : cantidadDisp <= p.stock_minimo ? "text-yellow-400" : "text-slate-500"
                              }`}>
                                Stock: {p.stock_actual} {p.unidad_medida || ""}
                                {enCarrito && ` · En carrito: ${enCarrito.cantidad}`}
                              </p>
                            </div>
                            <span className="text-cyan-400 font-semibold text-xs shrink-0">
                              S/ {Number(p.precio_venta).toFixed(2)}
                            </span>
                          </div>

                          {!sinStock && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setCantidad(p.id_producto, cantTemp - 1)}
                                className="bg-slate-800 hover:bg-slate-700 text-white w-6 h-6 rounded text-xs"
                              >−</button>
                              <input
                                type="number"
                                min={1}
                                max={cantidadDisp}
                                value={cantTemp}
                                onChange={e => setCantidad(p.id_producto, Number(e.target.value))}
                                className="w-12 bg-slate-800 text-white p-0.5 rounded text-center text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setCantidad(p.id_producto, cantTemp + 1)}
                                className="bg-slate-800 hover:bg-slate-700 text-white w-6 h-6 rounded text-xs"
                              >+</button>
                              <button
                                type="button"
                                onClick={() => agregarAlCarrito(p)}
                                disabled={cantidadDisp < cantTemp}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-1 rounded text-[10px] font-medium"
                              >
                                + Agregar
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA: Carrito + Cobro */}
              <div className="space-y-3">

                {/* CARRITO */}
                <div className="bg-slate-900 rounded p-3">
                  <h4 className="text-slate-300 text-sm font-medium mb-2 flex justify-between items-center">
                    🛒 Carrito
                    {carrito.length > 0 && (
                      <button
                        onClick={() => setCarrito([])}
                        className="text-red-400 hover:text-red-300 text-[10px]"
                      >
                        Vaciar
                      </button>
                    )}
                  </h4>

                  {carrito.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-4">
                      Agregá productos del catálogo
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {carrito.map(item => (
                        <div
                          key={item.id}
                          className="bg-slate-800 p-2 rounded flex items-center gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs truncate">{item.producto.nombre}</p>
                            <p className="text-slate-500 text-[10px]">
                              S/ {Number(item.producto.precio_venta).toFixed(2)} c/u
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => cambiarCantidadCarrito(item.id, -1)}
                              className="bg-slate-700 hover:bg-slate-600 text-white w-5 h-5 rounded text-[10px]"
                            >−</button>
                            <span className="text-white text-xs w-6 text-center">{item.cantidad}</span>
                            <button
                              onClick={() => cambiarCantidadCarrito(item.id, 1)}
                              className="bg-slate-700 hover:bg-slate-600 text-white w-5 h-5 rounded text-[10px]"
                            >+</button>
                          </div>
                          <span className="text-cyan-400 text-xs font-semibold w-16 text-right shrink-0">
                            S/ {(Number(item.producto.precio_venta) * item.cantidad).toFixed(2)}
                          </span>
                          <button
                            onClick={() => quitarDelCarrito(item.id)}
                            className="text-red-400 hover:text-red-300 shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {carrito.length > 0 && (
                    <div className="flex justify-between items-center border-t border-slate-700 mt-2 pt-2">
                      <span className="text-slate-300 text-sm font-medium">Subtotal</span>
                      <span className="text-cyan-400 font-bold text-lg">
                        S/ {totalCarrito.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* COBRO */}
                {carrito.length > 0 && (
                  <div className="bg-slate-900 rounded p-3 space-y-3">
                    <h4 className="text-slate-300 text-sm font-medium">¿Cómo se cobra?</h4>

                    {/* Modos */}
                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-800">
                        <input
                          type="radio"
                          checked={modoCobro === "a_cuenta"}
                          onChange={() => setModoCobro("a_cuenta")}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-white text-xs font-medium">Todo a la cuenta</p>
                          <p className="text-slate-500 text-[10px]">Paga al retirarse</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-800">
                        <input
                          type="radio"
                          checked={modoCobro === "unico"}
                          onChange={() => {
                            setModoCobro("unico")
                            setMontoUnico(totalCarrito.toFixed(2))
                          }}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-white text-xs font-medium">Pago único</p>
                          <p className="text-slate-500 text-[10px]">1 solo método</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-800">
                        <input
                          type="radio"
                          checked={modoCobro === "parcial"}
                          onChange={() => setModoCobro("parcial")}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-white text-xs font-medium">Pago parcial / mixto</p>
                          <p className="text-slate-500 text-[10px]">Varios métodos o pago incompleto</p>
                        </div>
                      </label>
                    </div>

                    {/* Pago único */}
                    {modoCobro === "unico" && (
                      <div className="space-y-2 bg-slate-800 p-2 rounded">
                        <div>
                          <label className="text-slate-300 text-[10px] block mb-1">Monto</label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={totalCarrito}
                            value={montoUnico}
                            onChange={e => setMontoUnico(e.target.value)}
                            className="w-full bg-slate-900 text-white p-1.5 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 text-[10px] block mb-1">Método</label>
                          <select
                            value={idMetodoPagoUnico ?? ""}
                            onChange={e => setIdMetodoPagoUnico(e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-slate-900 text-white p-1.5 rounded text-sm"
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

                    {/* Pago parcial/mixto */}
                    {modoCobro === "parcial" && (
                      <div className="space-y-2">
                        {pagos.map((pago, idx) => (
                          <div key={pago.id} className="flex gap-1.5 items-center">
                            <span className="text-slate-500 text-[10px] w-4">#{idx + 1}</span>
                            <select
                              value={pago.id_metodo_pago ?? ""}
                              onChange={e => actualizarPago(pago.id, "id_metodo_pago", e.target.value ? Number(e.target.value) : null)}
                              className="flex-1 bg-slate-800 text-white p-1.5 rounded text-[10px]"
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
                              onChange={e => actualizarPago(pago.id, "monto", Number(e.target.value))}
                              placeholder="0.00"
                              className="w-20 bg-slate-800 text-white p-1.5 rounded text-[10px]"
                            />
                            <button
                              onClick={() => eliminarPago(pago.id)}
                              className="text-red-400 hover:text-red-300 p-0.5"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={agregarPago}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[10px]"
                        >
                          <Plus size={10} /> Agregar otro pago
                        </button>
                      </div>
                    )}

                    {/* Resumen */}
                    <div className="border-t border-slate-700 pt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="text-white font-medium">S/ {totalCarrito.toFixed(2)}</span>
                      </div>

                      {modoCobro === "unico" && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cobrado ahora:</span>
                          <span className="text-green-400">S/ {Number(montoUnico || 0).toFixed(2)}</span>
                        </div>
                      )}

                      {modoCobro === "parcial" && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cobrado ahora:</span>
                          <span className="text-green-400">S/ {totalPagos.toFixed(2)}</span>
                        </div>
                      )}

                      {saldoPendiente > 0.01 && (
                        <div className="flex justify-between border-t border-slate-700 pt-1">
                          <span className="text-yellow-300">Queda a cuenta:</span>
                          <span className="text-yellow-300 font-bold">S/ {saldoPendiente.toFixed(2)}</span>
                        </div>
                      )}

                      {saldoPendiente <= 0.01 && modoCobro !== "a_cuenta" && (
                        <div className="flex justify-between border-t border-slate-700 pt-1">
                          <span className="text-green-400 font-medium">✅ Todo pagado</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex gap-2 shrink-0">
          <button
            onClick={guardar}
            disabled={carrito.length === 0 || enviando || cargando}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded font-medium"
          >
            {enviando
              ? "Agregando..."
              : carrito.length === 0
              ? "Agregar Consumos"
              : `Agregar ${carrito.length} Producto${carrito.length !== 1 ? "s" : ""}`
            }
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}