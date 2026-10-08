import type { Cliente } from "./cliente"
import type { Habitacion } from "./habitacion"
import type { Tarifa } from "./tarifa"


export interface EstadoReserva {
  id_estado: number
  nombre: string
  slug: string
  color: string | null
  descripcion: string | null
  orden: number
  activo: boolean
}

export type TipoReserva = "NORMAL" | "CON_DECORACION"

export interface Reserva {
  id_reserva: number
  codigo_reserva: string
  tipo_reserva: TipoReserva
  id_estado: number
  id_cliente: number
  id_habitacion: number
  id_tarifa: number
  id_usuario_creacion: number
  cantidad_personas: number
  fecha_entrada: string
  fecha_salida_prevista: string
  fecha_salida_real: string | null
  horas_base: number
  horas_extra: number
  horas_totales: number
  monto_habitacion: number
  monto_horas_extra: number
  monto_consumos: number
  monto_ajustes: number
  descuento: number
  descuento_porcentaje: number
  total: number
  pagado: number
  saldo: number
  vuelto_entregado: number
  telefono: string | null
  notas: string | null
  observaciones: string | null
  id_usuario_anulacion: number | null
  fecha_anulacion: string | null
  motivo_anulacion: string | null
  created_at?: string
  updated_at?: string
  cliente?: Cliente
  habitacion?: Habitacion
  tarifa?: Tarifa
  estado?: EstadoReserva
  usuario_creacion?: { id: number; nombre: string }
  registro_estadia?: RegistroEstadia | null
  consumos?: ReservaConsumo[]
  extensiones?: ExtensionReserva[]
  pagos?: PagoReserva[]
  ajustes?: ReservaAjuste[]
}

export interface ReservaConsumo {
  id_consumo: number
  id_reserva: number
  id_producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  pagado: boolean
  id_metodo_pago: number | null
  id_usuario: number
  fecha_consumo: string
  observaciones: string | null
  producto?: {
    id_producto: number
    nombre: string
    precio_venta: number
    stock_actual: number
    unidad_medida: string | null
  }
  metodo_pago?: {
    id_metodo: number
    nombre: string
    icono: string | null
    color: string | null
    es_de_caja: boolean
  }
}

export interface ReservaAjuste {
  id_ajuste: number
  id_reserva: number
  tipo: "CAMBIO_HABITACION" | "AJUSTE_MANUAL"
  monto_anterior: number
  monto_nuevo: number
  diferencia: number
  id_usuario: number
  fecha_ajuste: string
  notas: string | null
}

export interface AgregarConsumoRequest {
  id_producto: number
  cantidad: number
  pagado: boolean
  id_metodo_pago?: number | null
  observaciones?: string | null
}

export interface CambiarHabitacionRequest {
  id_nueva_habitacion: number
  modo_diferencia: "AHORA" | "AL_FINAL"
  id_metodo_pago?: number | null
}

export interface PagoMixto {
  id_metodo_pago: number
  monto: number
}

export interface WalkInRequest {
  id_cliente: number
  id_habitacion: number
  id_tarifa: number
  cantidad_personas?: number
  fecha_entrada?: string
  adelanto?: number
  id_metodo_pago?: number
  pagos?: PagoMixto[]
  telefono?: string
  notas?: string
  observaciones?: string
}

export interface ReservaRequest {
  id_cliente: number
  id_habitacion: number
  id_tarifa: number
  cantidad_personas?: number
  fecha_entrada: string
  adelanto?: number
  id_metodo_pago?: number
  pagos?: PagoMixto[]
  telefono?: string
  notas?: string
  observaciones?: string
}

export interface RegistroEstadia {
  id_registro: number
  id_reserva: number
  fecha_entrada: string
  fecha_salida: string | null
  horas_reales: number | null
  id_usuario_checkin: number
  id_usuario_checkout: number | null
  monto_final: number | null
  observaciones: string | null
}

export interface HabitacionMapa {
  id_habitacion: number
  numero: string
  id_piso: number
  piso_nombre: string
  id_tipo: number
  tipo_nombre: string
  estado: "Disponible" | "Ocupada" | "Reservada" | "Con-Decoracion" | "Reservada-Urgente" | "Por vencer" | "Vencida" | "Limpieza" | "Mantenimiento" | "Inactiva"
  color: string
  cliente: string | null
  id_reserva: number | null
  fecha_entrada: string | null
  fecha_salida_prevista: string | null
  minutos_transcurridos: number | null
  minutos_totales: number | null
  minutos_restantes: number | null
  minutos_extra: number | null
  horas_base: number | null
  pagado: number
  total: number
  id_mantenimiento: number | null
  mantenimiento_tipo: string | null
  mantenimiento_descripcion: string | null
  mantenimiento_prioridad: string | null
  mantenimiento_prioridad_color: string | null
  mantenimiento_estado: string | null
  mantenimiento_fecha_reporte: string | null
  mantenimiento_asignado: string | null
}

export interface PagoReserva {
  id_pago: number
  id_reserva: number
  id_metodo_pago: number
  monto: number
  es_adelanto: boolean
  fecha_pago: string
  id_usuario: number
  observaciones: string | null
  anulado: boolean
  metodo_pago?: {
    id_metodo: number
    nombre: string
    icono: string | null
    color: string | null
    es_de_caja: boolean
  }
  usuario?: { id: number; nombre: string }
}

// ============================================================================
// EXTENSIONES DE TIEMPO
// ============================================================================

export interface OpcionExtension {
  horas: number
  monto: number
  es_turno_adicional: boolean
  label: string
  sugerida: boolean
  advertencia?: boolean
}

export interface CalculoExtension {
  horas_base: number
  minutos_transcurridos: number
  minutos_base: number
  minutos_exceso_total: number
  horas_exceso_total: number
  horas_extra_ya_aplicadas: number
  monto_ya_aplicado: number
  monto_ya_pagado: number
  monto_cargado_a_cuenta: number
  turnos_adicionales_aplicados: number
  minutos_exceso_pendiente: number
  minutos_ya_cubiertos: number
  horas_extra_sugeridas_nuevas: number
  monto_sugerido_nuevo: number
  tolerancia_minutos: number
  dentro_tolerancia: boolean
  excede_maximo: boolean
  max_horas_extra: number
  precio_hora_extra: number
  precio_turno_adicional: number
  opciones: OpcionExtension[]
}

export interface AgregarExtensionRequest {
  horas_extra: number
  cargar_a_cuenta: boolean
  id_metodo_pago?: number | null
  es_turno_adicional?: boolean
  observaciones?: string | null
}

export interface ExtensionReserva {
  id_extension: number
  id_reserva: number
  horas_extra: number
  monto: number
  es_turno_adicional: boolean
  minutos_exceso: number
  precio_hora_extra_aplicado: number
  tolerancia_minutos: number
  pagado_inmediato: boolean
  cargado_a_cuenta: boolean
  id_metodo_pago: number | null
  id_usuario: number
  fecha_extension: string
  observaciones: string | null
  metodo_pago?: {
    id_metodo: number
    nombre: string
    icono: string | null
    color: string | null
    es_de_caja: boolean
  }
  usuario?: { id: number; nombre: string }
}

// ============================================================================
// CONFIGURACIONES
// ============================================================================

export interface Configuracion {
  id_configuracion: number
  clave: string
  valor: string
  tipo: "INT" | "DECIMAL" | "STRING" | "BOOLEAN"
  descripcion: string | null
  grupo: string
  created_at?: string
  updated_at?: string
}
// ============================================================================
// MODULO 09B — RESERVAS FUTURAS
// ============================================================================

export interface HabitacionLibre {
  id_habitacion: number
  numero: string
  id_piso: number
  id_tipo: number
  orden: number
  activo: boolean
  piso?: { id_piso: number; nombre: string }
  tipo?: { id_tipo: number; nombre: string; capacidad: number }
}

export interface HabitacionConConflicto {
  id_habitacion: number
  numero: string
  piso_nombre: string | null
  tipo_nombre: string | null
  motivo: string
  ocupacion: {
    id_ocupacion: number
    fecha_inicio: string
    fecha_fin: string
    estado: string
    cliente: string | null
    estado_reserva: string | null
  }
}

export interface ReservaDisponiblesResponse {
  fecha_inicio: string
  fecha_fin: string
  horas: number
  total_libres: number
  total_conflicto: number
  libres: HabitacionLibre[]
  con_conflicto: HabitacionConConflicto[]
}

export interface ReservaProxima {
  id_reserva: number
  codigo_reserva: string
  cliente: string
  telefono: string | null
  habitacion: {
    id_habitacion: number | null
    numero: string | null
    piso: string | null
    tipo: string | null
  }
  fecha_entrada: string
  minutos_para_entrada: number
  estado_reserva: string | null
  alerta_reserva_ocupada: boolean
  cliente_actual: string | null
  id_reserva_actual: number | null
  fecha_fin_ocupacion_actual: string | null
}

export interface ReservaProximasResponse {
  total: number
  reservas: ReservaProxima[]
}

export interface ReservaHoyResponse {
  total: number
  reservas: Reserva[]
}

export interface ReservaFuturaEnMapa {
  id_reserva: number
  codigo: string
  cliente: string | null
  fecha_entrada: string
  minutos_para_entrada: number
  horas_antes_bloqueo: number
}
// ============================================================================
// CHECK-IN DE RESERVA FUTURA
// ============================================================================

export interface InfoCheckIn {
  reserva: Reserva
  observaciones_pendientes: Array<{
    id_observacion: number
    motivo: string
    monto_deuda: number | null
    tipo?: { id_tipo_observacion: number; nombre: string; icono: string | null; color: string | null }
    gravedad?: { id_gravedad: number; nombre: string; color: string | null; prioridad: number }
  }>
  puede_check_in: boolean
  motivo_bloqueo: string | null
  ya_tiene_check_in: boolean
  es_confirmada: boolean
  es_activa: boolean
  es_cerrada: boolean
  habitacion_disponible: boolean
  ocupacion_actual: {
    id_reserva: number | null
    codigo_reserva: string | null
    cliente: string | null
    fecha_fin: string | null
  } | null
  saldo_pendiente: number
}