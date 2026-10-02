// ============================================================================
// Tipos para el módulo de Configuración Base
// ============================================================================

// ---------- Piso ----------
export interface Piso {
  id_piso: number
  nombre: string
  descripcion: string | null
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface PisoRequest {
  nombre: string
  descripcion?: string | null
  orden?: number
  activo?: boolean
}

// ---------- Tipo de Habitación ----------
export interface TipoHabitacion {
  id_tipo: number
  nombre: string
  slug: string
  descripcion: string | null
  capacidad: number
  camas: number
  tiene_jacuzzi: boolean
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface TipoHabitacionRequest {
  nombre: string
  slug: string
  descripcion?: string | null
  capacidad?: number
  camas?: number
  tiene_jacuzzi?: boolean
  activo?: boolean
}

// ---------- Tipo de Documento ----------
export interface TipoDocumento {
  id_documento: number
  nombre: string
  abreviatura: string
  longitud: number | null
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface TipoDocumentoRequest {
  nombre: string
  abreviatura: string
  longitud?: number | null
  activo?: boolean
}

// ---------- Método de Pago ----------
export interface MetodoPago {
  id_metodo: number
  nombre: string
  descripcion: string | null
  es_de_caja: boolean
  icono: string | null
  color: string | null
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface MetodoPagoRequest {
  nombre: string
  descripcion?: string | null
  es_de_caja: boolean
  icono?: string | null
  color?: string | null
  orden?: number
  activo?: boolean
}

// ---------- Categoría de Movimiento ----------
export type TipoMovimiento = 'Ingreso' | 'Egreso'

export interface CategoriaMovimiento {
  id_categoria: number
  nombre: string
  tipo: TipoMovimiento
  descripcion: string | null
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface CategoriaMovimientoRequest {
  nombre: string
  tipo: TipoMovimiento
  descripcion?: string | null
  orden?: number
  activo?: boolean
}

// ---------- Nivel de Cliente ----------
export interface ClienteNivel {
  id_nivel: number
  nombre: string
  visitas_min: number
  visitas_max: number | null
  descuento: number
  color: string | null
  icono: string | null
  beneficios: string | null
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface ClienteNivelRequest {
  nombre: string
  visitas_min: number
  visitas_max?: number | null
  descuento: number
  color?: string | null
  icono?: string | null
  beneficios?: string | null
  activo?: boolean
}