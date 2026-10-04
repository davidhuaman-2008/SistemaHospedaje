import type { Piso, TipoHabitacion } from "./configuracion"

export interface Habitacion {
  id_habitacion: number
  id_piso: number
  id_tipo: number
  numero: string
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
  piso?: Piso | null
  tipo?: TipoHabitacion | null
}

export interface HabitacionRequest {
  id_piso: number
  id_tipo: number
  numero: string
  orden?: number
  activo?: boolean
}