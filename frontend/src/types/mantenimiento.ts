export interface TipoMantenimiento {
  id_tipo_mantenimiento: number
  nombre: string
  slug: string
  descripcion: string | null
  icono: string | null
  color: string | null
  orden: number
  activo: boolean
}

export interface TipoMantenimientoRequest {
  nombre: string
  slug: string
  descripcion?: string | null
  icono?: string | null
  color?: string | null
  orden?: number
  activo?: boolean
}

export interface PrioridadMantenimiento {
  id_prioridad: number
  nombre: string
  slug: string
  color: string | null
  orden: number
  activo: boolean
}

export interface PrioridadMantenimientoRequest {
  nombre: string
  slug: string
  color?: string | null
  orden?: number
  activo?: boolean
}

export interface Mantenimiento {
  id_mantenimiento: number
  id_habitacion: number
  id_tipo_mantenimiento: number
  id_prioridad: number
  id_usuario_reporta: number
  id_usuario_asignado: number | null
  descripcion: string
  estado: "REPORTADO" | "EN_PROCESO" | "RESUELTO" | "CANCELADO"
  fecha_reporte: string
  fecha_inicio: string | null
  fecha_resolucion: string | null
  observaciones: string | null
  motivo_cancelacion: string | null
  created_at?: string
  updated_at?: string

  habitacion?: {
    id_habitacion: number
    numero: string
    id_piso: number
    id_tipo: number
    piso?: { nombre: string }
    tipo?: { nombre: string }
  }
  tipo?: TipoMantenimiento
  prioridad?: PrioridadMantenimiento
  usuario_reporta?: { id: number; nombre: string; apellido: string }
  usuario_asignado?: { id: number; nombre: string; apellido: string } | null
}

export interface MantenimientoRequest {
  id_habitacion: number
  id_tipo_mantenimiento: number
  id_prioridad: number
  descripcion: string
  observaciones?: string | null
}

export interface MantenimientoPendientesResponse {
  pendientes: Mantenimiento[]
  total_pendientes: number
}