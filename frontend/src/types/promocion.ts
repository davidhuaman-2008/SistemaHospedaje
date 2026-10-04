import type { TipoHabitacion } from './configuracion'

export interface CategoriaPromocion {
  id_categoria_promocion: number
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

export interface CategoriaPromocionRequest {
  nombre: string
  slug: string
  descripcion?: string | null
  icono?: string | null
  color?: string | null
  orden?: number
  activo?: boolean
}

export type TipoPromocion = 'PORCENTAJE' | 'MONTO_FIJO' | 'NOCHE_GRATIS' | 'OTRO'

export interface Promocion {
  id_promocion: number
  nombre: string
  descripcion: string | null
  id_categoria_promocion: number | null
  tipo: TipoPromocion
  valor: number
  fecha_inicio: string | null
  fecha_fin: string | null
  dias_semana: string | null
  hora_inicio: string | null
  hora_fin: string | null
  id_tipo_habitacion: number | null
  monto_minimo: number | null
  requiere_codigo: boolean
  codigo: string | null
  limite_uso: number | null
  usos_actuales: number
  limite_por_cliente: number | null
  acumulable: boolean
  activo: boolean
  categoria?: CategoriaPromocion
  tipo_habitacion?: TipoHabitacion
  created_at?: string
  updated_at?: string
}

export interface PromocionRequest {
  nombre: string
  descripcion?: string | null
  id_categoria_promocion?: number | null
  tipo: TipoPromocion
  valor: number
  fecha_inicio?: string | null
  fecha_fin?: string | null
  dias_semana?: string | null
  hora_inicio?: string | null
  hora_fin?: string | null
  id_tipo_habitacion?: number | null
  monto_minimo?: number | null
  requiere_codigo?: boolean
  codigo?: string | null
  limite_uso?: number | null
  limite_por_cliente?: number | null
  acumulable?: boolean
  activo?: boolean
}

export interface PromocionCliente {
  id_promo_cliente: number
  id_promocion: number
  id_cliente: number
  codigo_personalizado: string | null
  fecha_vencimiento: string | null
  usado: boolean
  fecha_uso: string | null
  promocion?: Promocion
  cliente?: any
  created_at?: string
  updated_at?: string
}

export interface PromocionClienteRequest {
  id_promocion: number
  id_cliente: number
  codigo_personalizado?: string | null
  fecha_vencimiento?: string | null
}