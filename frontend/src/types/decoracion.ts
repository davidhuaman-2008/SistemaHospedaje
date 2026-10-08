

import type { Reserva } from "./reserva"
import type { PaqueteDecoracion } from "./paqueteDecoracion"
import type { CuentaPagar } from "./cuentaPagar"

export type EstadoDecoracion = "programada" | "en-proceso" | "finalizada" | "cancelada"

export interface EstadoDecoracionInfo {
  nombre: string
  color: string
  icono: string
}

export const ESTADOS_DECORACION: Record<EstadoDecoracion, EstadoDecoracionInfo> = {
  programada: { nombre: "Programada", color: "#f59e0b", icono: "calendar-clock" },
  "en-proceso": { nombre: "En proceso", color: "#eab308", icono: "loader" },
  finalizada: { nombre: "Finalizada", color: "#10b981", icono: "check-check" },
  cancelada: { nombre: "Cancelada", color: "#64748b", icono: "x-circle" },
}

export interface Decoracion {
  id_decoracion: number
  id_reserva: number
  id_paquete: number
  id_proveedor: number | null
  estado: EstadoDecoracion
  fecha_programada: string
  fecha_inicio_preparacion: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  precio_total: number
  ganancia_local: number
  ganancia_proveedor: number
  adelanto: number
  saldo: number
  frase_personalizada: string | null
  musica: string | null
  notas: string | null
  id_cuenta_pagar: number | null
  id_usuario_creacion: number
  id_usuario_anulacion: number | null
  fecha_anulacion: string | null
  motivo_anulacion: string | null
  created_at?: string
  updated_at?: string

  // Relaciones
  reserva?: Reserva
  paquete?: PaqueteDecoracion
  proveedor?: { id_proveedor: number; razon_social: string; nombre_comercial: string | null } | null
  cuenta_pagar?: CuentaPagar | null
  usuario_creacion?: { id: number; nombre: string }
  usuario_anulacion?: { id: number; nombre: string } | null
}

export interface DecoracionRequest {
  id_reserva: number
  id_paquete: number
  fecha_programada?: string | null
  adelanto?: number
  frase_personalizada?: string | null
  musica?: string | null
  notas?: string | null
}