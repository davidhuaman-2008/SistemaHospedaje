import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { productoService } from "@/services/productoService"
import { categoriaProductoService } from "@/services/categoriaProductoService"
import { proveedorService } from "@/services/proveedorService"
import { mensajeDeError } from "@/lib/errores"
import type { Producto, ProductoRequest, CategoriaProducto, Proveedor } from "@/types/producto"
import { ProductoForm } from "./ProductoForm"
import { ProductoTabla } from "./ProductoTabla"

export function ProductoPage() {
  const [items, setItems] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [editando, setEditando] = useState<Producto | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        setCargando(true)
        const [prods, cats, provs] = await Promise.all([
          productoService.listar(),
          categoriaProductoService.listarActivos(),
          proveedorService.listarActivos(),
        ])
        if (!cancelado) {
          setItems(prods)
          setCategorias(cats)
          setProveedores(provs)
        }
      } catch {
        if (!cancelado) toast.error("Error al cargar")
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [])

  const recargar = async () => {
    try {
      const [prods, cats, provs] = await Promise.all([
        productoService.listar(),
        categoriaProductoService.listarActivos(),
        proveedorService.listarActivos(),
      ])
      setItems(prods)
      setCategorias(cats)
      setProveedores(provs)
    } catch { toast.error("Error al recargar") }
  }

  const abrirCrear = () => { setEditando(null); setMostrarForm(true) }
  const abrirEditar = (item: Producto) => { setEditando(item); setMostrarForm(true) }
  const cerrar = () => { setMostrarForm(false); setEditando(null) }

  const guardar = async (datos: ProductoRequest) => {
    try {
      if (editando) {
        await productoService.actualizar(editando.id_producto, datos)
        toast.success("Actualizado")
      } else {
        await productoService.crear(datos)
        toast.success("Creado")
      }
      cerrar(); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const cambiarEstado = async (item: Producto) => {
    try {
      if (item.activo) {
        await productoService.desactivar(item.id_producto)
        toast.success("Desactivado")
      } else {
        await productoService.reactivar(item.id_producto)
        toast.success("Reactivado")
      }
      recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const eliminar = async (item: Producto) => {
    if (!confirm(`Eliminar "${item.nombre}"?`)) return
    try {
      await productoService.eliminar(item.id_producto)
      toast.success("Eliminado"); recargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    }
  }

  const filtrados = items.filter(p => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      (p.codigo_barra ?? "").includes(busqueda)
    )
  })

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">Productos</h1>
        <button onClick={abrirCrear} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
          + Nuevo Producto
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o código de barras..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
        />
      </div>

      {mostrarForm && (
        <ProductoForm
          inicial={editando}
          categorias={categorias}
          proveedores={proveedores}
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <ProductoTabla items={filtrados} onEditar={abrirEditar} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />
      )}
    </AppLayout>
  )
}