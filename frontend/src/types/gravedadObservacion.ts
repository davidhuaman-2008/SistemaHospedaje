export interface GravedadObservacion {
  id_gravedad: number
  nombre: string
  slug: string
  color: string | null
  prioridad: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface GravedadObservacionRequest {
  nombre: string
  slug: string
  color?: string | null
  prioridad: number
  activo?: boolean
}