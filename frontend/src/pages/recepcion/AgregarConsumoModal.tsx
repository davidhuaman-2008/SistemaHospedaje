import { useEffect, useState, useMemo } from "react"
import { toast } from "sonner"
import { X, Search, Plus, Minus } from "lucide-react"
import { productoService } from "@/services/productoService"
import { metodoPagoService } from "@/services/metodoPagoService"
import { reservaService } from "@/services/reservaService"
import { mensajeDeError } from "@/lib/errores"
import type { Producto } from "@/types/producto"
import type { MetodoPago } from "@/types/configuracion"

interface Props {
  idReserva: number
  onClose: () => void
  onSuccess: () => void
}

export function AgregarConsumoModal({ idReserva, onClose, onSuccess }: Props) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [idProducto, setIdProducto] = useState<number | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [pagado, setPagado] = useState(false)
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const [prods, mps] = await Promise.all([
          productoService.listarActivos(),
          metodoPagoService.listarActivos(),
        ])
        setProductos(prods)
        setMetodosPago(mps)
      } catch {
        toast.error("Error al cargar productos")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productos
    const q = busqueda.toLowerCase().trim()
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.codigo_barra && p.codigo_barra.toLowerCase().includes(q))
    )
  }, [busqueda, productos])

  const productoSeleccionado = productos.find(p => p.id_producto === idProducto)

  const agregar = async () => {
    if (!idProducto) {
      toast.error("Seleccione un producto")
      return
    }
    if (cantidad <= 0) {
      toast.error("La cantidad debe ser mayor a 0")
      return
    }
    if (pagado && !idMetodoPago) {
      toast.error("Seleccione un método de pago")
      return
    }
    if (productoSeleccionado && productoSeleccionado.stock_actual < cantidad) {
      toast.error(`Stock insuficiente. Disponible: ${productoSeleccionado.stock_actual}`)
      return
    }

    setEnviando(true)
    try {
      await reservaService.agregarConsumo(idReserva, {
        id_producto: idProducto,
        cantidad,
        pagado,
        id_metodo_pago: pagado ? idMetodoPago : null,
      })
      toast.success("Consumo agregado")
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
          <p className="text-slate-300">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0">
          <h3 className="text-lg font-bold text-white">🥤 Agregar Consumo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar producto por nombre o código..."
              className="w-full bg-slate-900 text-white p-2 pl-9 rounded"
            />
          </div>

          {/* Lista de productos */}
          <div className="max-h-64 overflow-y-auto bg-slate-900 rounded">
            {productosFiltrados.length === 0 ? (
              <p className="text-slate-500 text-sm p-4 text-center">No hay productos</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {productosFiltrados.map(p => (
                  <button
                    key={p.id_producto}
                    onClick={() => {
                      setIdProducto(p.id_producto)
                      setCantidad(1)
                    }}
                    className={`w-full text-left p-3 hover:bg-slate-800 transition flex justify-between items-center ${
                      idProducto === p.id_producto ? "bg-blue-900/40 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <div>
                      <p className="text-white font-medium">{p.nombre}</p>
                      <p className="text-slate-500 text-xs">
                        Stock: {p.stock_actual} {p.unidad_medida ?? ""}
                      </p>
                    </div>
                    <p className="text-cyan-400 font-semibold">
                      S/ {Number(p.precio_venta).toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selector de cantidad y opciones */}
          {productoSeleccionado && (
            <>
              <div className="bg-slate-900 p-4 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Cantidad</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={productoSeleccionado.stock_actual}
                      value={cantidad}
                      onChange={e => setCantidad(Math.max(1, Number(e.target.value)))}
                      className="bg-slate-800 text-white w-16 text-center p-1 rounded"
                    />
                    <button
                      onClick={() => setCantidad(Math.min(productoSeleccionado.stock_actual, cantidad + 1))}
                      className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                  <span className="text-slate-300 text-sm">Subtotal</span>
                  <span className="text-white font-bold text-lg">
                    S/ {(Number(productoSeleccionado.precio_venta) * cantidad).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded space-y-3">
                <p className="text-slate-300 text-sm font-medium">¿Cómo se cobra?</p>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!pagado}
                    onChange={() => setPagado(false)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-200 text-sm">
                    Agregar a la cuenta (paga al retirarse)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={pagado}
                    onChange={() => setPagado(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-200 text-sm">
                    Pagar ahora
                  </span>
                </label>

                {pagado && (
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
            </>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={agregar}
              disabled={!idProducto || enviando}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {enviando ? "Agregando..." : "Agregar Consumo"}
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
    </div>
  )
}