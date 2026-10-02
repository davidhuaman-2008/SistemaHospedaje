export interface TipoObservacion {
  id_tipo_observacion: number
  nombre: string
  slug: string
  icono: string | null
  color: string | null
  descripcion: string | null
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface TipoObservacionRequest {
  nombre: string
  slug: string
  icono?: string | null
  color?: string | null
  descripcion?: string | null
  orden?: number
  activo?: boolean
}