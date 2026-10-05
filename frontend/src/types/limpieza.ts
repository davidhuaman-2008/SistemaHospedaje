export interface Limpieza {
  id_limpieza: number
  id_habitacion: number
  id_reserva: number | null
  id_usuario_asignado: number | null
  estado: "PENDIENTE" | "EN_PROCESO" | "COMPLETADA"
  tipo: "NORMAL" | "PROFUNDA"
  fecha_solicitud: string
  fecha_inicio: string | null
  fecha_fin: string | null
  observaciones: string | null
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
  reserva?: {
    id_reserva: number
    codigo_reserva: string
  }
  usuario_asignado?: {
    id: number
    nombre: string
    apellido: string
    rol?: { nombre: string }
  }
}

export interface LimpiezaPendientesResponse {
  pendientes: Limpieza[]
  completadas_hoy: Limpieza[]
  total_pendientes: number
}

export interface CrearLimpiezaRequest {
  id_habitacion: number
  id_reserva?: number | null
  tipo?: "NORMAL" | "PROFUNDA"
  observaciones?: string | null
}