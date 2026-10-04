import { useState } from "react"
import type { Producto, ProductoRequest, CategoriaProducto, Proveedor } from "@/types/producto"

interface Props {
  inicial: Producto | null
  categorias: CategoriaProducto[]
  proveedores: Proveedor[]
  onGuardar: (datos: ProductoRequest) => void
  onCancelar: () => void
}

export function ProductoForm({ inicial, categorias, proveedores, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || "")
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || "")
  const [idCategoria, setIdCategoria] = useState<number | null>(inicial?.id_categoria_producto ?? null)
  const [idProveedor, setIdProveedor] = useState<number | null>(inicial?.id_proveedor ?? null)
  const [codigoBarra, setCodigoBarra] = useState(inicial?.codigo_barra || "")
  const [precioCompra, setPrecioCompra] = useState(inicial?.precio_compra || 0)
  const [precioVenta, setPrecioVenta] = useState(inicial?.precio_venta || 0)
  const [stockActual, setStockActual] = useState(inicial?.stock_actual || 0)
  const [stockMinimo, setStockMinimo] = useState(inicial?.stock_minimo || 10)
  const [unidadMedida, setUnidadMedida] = useState(inicial?.unidad_medida || "unidad")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || precioVenta <= 0) return
    onGuardar({
      nombre,
      descripcion: descripcion || null,
      id_categoria_producto: idCategoria,
      id_proveedor: idProveedor,
      codigo_barra: codigoBarra || null,
      precio_compra: precioCompra,
      precio_venta: precioVenta,
      stock_actual: stockActual,
      stock_minimo: stockMinimo,
      unidad_medida: unidadMedida,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Categoría</label>
          <select
            value={idCategoria ?? ""}
            onChange={e => setIdCategoria(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-slate-900 text-white p-2 rounded"
          >
            <option value="">— Sin categoría —</option>
            {categorias.map(c => (
              <option key={c.id_categoria_producto} value={c.id_categoria_producto}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Proveedor</label>
          <select
            value={idProveedor ?? ""}
            onChange={e => setIdProveedor(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-slate-900 text-white p-2 rounded"
          >
            <option value="">— Sin proveedor —</option>
            {proveedores.map(p => (
              <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Código de barras</label>
          <input value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio compra (S/)</label>
          <input type="number" step="0.01" min={0} value={precioCompra} onChange={e => setPrecioCompra(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Precio venta (S/) *</label>
          <input type="number" step="0.01" min={0} value={precioVenta} onChange={e => setPrecioVenta(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Stock actual</label>
          <input type="number" min={0} value={stockActual} onChange={e => setStockActual(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Stock mínimo</label>
          <input type="number" min={0} value={stockMinimo} onChange={e => setStockMinimo(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Unidad de medida</label>
          <input value={unidadMedida} onChange={e => setUnidadMedida(e.target.value)} placeholder="unidad, botella, pack..." className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? "Actualizar" : "Crear"}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}