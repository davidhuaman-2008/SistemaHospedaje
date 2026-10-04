export interface CategoriaProducto {
  id_categoria_producto: number
  nombre: string
  slug: string
  descripcion: string | null
  icono: string | null
  color: string | null
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface CategoriaProductoRequest {
  nombre: string
  slug: string
  descripcion?: string | null
  icono?: string | null
  color?: string | null
  orden?: number
  activo?: boolean
}

export interface Proveedor {
  id_proveedor: number
  razon_social: string
  nombre_comercial: string | null
  ruc: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  contacto: string | null
  tipo: string | null
  notas: string | null
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface ProveedorRequest {
  razon_social: string
  nombre_comercial?: string | null
  ruc?: string | null
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  contacto?: string | null
  tipo?: string | null
  notas?: string | null
  activo?: boolean
}

export interface Producto {
  id_producto: number
  nombre: string
  descripcion: string | null
  id_categoria_producto: number | null
  id_proveedor: number | null
  codigo_barra: string | null
  precio_compra: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  unidad_medida: string | null
  imagen: string | null
  activo: boolean
  categoria?: CategoriaProducto
  proveedor?: Proveedor
  created_at?: string
  updated_at?: string
}

export interface ProductoRequest {
  nombre: string
  descripcion?: string | null
  id_categoria_producto?: number | null
  id_proveedor?: number | null
  codigo_barra?: string | null
  precio_compra?: number
  precio_venta: number
  stock_actual?: number
  stock_minimo?: number
  unidad_medida?: string | null
  imagen?: string | null
  activo?: boolean
}