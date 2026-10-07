import type { TipoHabitacion } from "./configuracion"

export interface PaqueteDecoracion {
  id_paquete: number
  nombre: string
  slug: string
  descripcion: string | null
  precio_total: number
  ganancia_local: number
  ganancia_proveedor: number
  precio_hora_adicional: number
  id_proveedor: number | null
  id_tipo_habitacion: number | null
  imagen: string | null
  horas_incluidas: number
  incluye_jacuzzi: boolean
  incluye_vino: boolean
  incluye_decoracion: boolean
  incluye_sexshop: boolean
  incluye_netflix: boolean
  activo: boolean
  created_at?: string
  proveedor?: {
    id_proveedor: number
    razon_social: string
    nombre_comercial: string | null
  } | null
  tipo_habitacion?: TipoHabitacion | null
}

export interface PaqueteDecoracionRequest {
  nombre: string
  slug?: string
  descripcion?: string | null
  precio_total: number
  ganancia_local: number
  ganancia_proveedor: number
  precio_hora_adicional: number
  id_proveedor?: number | null
  id_tipo_habitacion?: number | null
  imagen?: string | null
  horas_incluidas?: number
  incluye_jacuzzi?: boolean
  incluye_vino?: boolean
  incluye_decoracion?: boolean
  incluye_sexshop?: boolean
  incluye_netflix?: boolean
  activo?: boolean
}