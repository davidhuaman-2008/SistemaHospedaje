import type { TipoHabitacion } from './configuracion'

export interface Tarifa {
  id_tarifa: number
  id_tipo: number
  horas: number
  monto: number
  precio_hora_extra: number
  max_horas_extra: number
  precio_turno_adicional: number
  activo: boolean
  tipo?: TipoHabitacion
  created_at?: string
  updated_at?: string
}

export interface TarifaRequest {
  id_tipo: number
  horas: number
  monto: number
  precio_hora_extra: number
  max_horas_extra?: number
  precio_turno_adicional: number
  activo?: boolean
}