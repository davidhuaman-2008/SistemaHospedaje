import type { TipoDocumento, ClienteNivel } from './configuracion'
import type { TipoObservacion } from './tipoObservacion'
import type { GravedadObservacion } from './gravedadObservacion'

export interface Cliente {
  id_cliente: number
  nombre: string
  apellido: string | null
  id_tipo_documento: number | null
  numero_documento: string | null
  celular: string | null
  email: string | null
  fecha_nacimiento: string | null
  fecha_aniversario: string | null
  direccion: string | null
  visitas: number
  ultima_visita: string | null
  total_gastado: number
  id_nivel: number | null
  activo: boolean
  tipo_documento?: TipoDocumento
  nivel?: ClienteNivel
  observaciones_pendientes?: ClienteObservacion[]
  observaciones_pendientes_count?: number
  created_at?: string
  updated_at?: string
}

export interface ClienteRequest {
  nombre: string
  apellido?: string | null
  id_tipo_documento?: number | null
  numero_documento?: string | null
  celular?: string | null
  email?: string | null
  fecha_nacimiento?: string | null
  fecha_aniversario?: string | null
  direccion?: string | null
  id_nivel?: number | null
  activo?: boolean
}

export interface ClienteVisita {
  id_visita: number
  id_cliente: number
  id_reserva: number | null
  id_habitacion: number | null
  fecha_entrada: string
  fecha_salida: string | null
  monto_gastado: number
  created_at?: string
}

export interface ClienteVisitaRequest {
  id_reserva?: number | null
  id_habitacion?: number | null
  fecha_entrada: string
  fecha_salida?: string | null
  monto_gastado?: number
}

export interface ClienteObservacion {
  id_observacion: number
  id_cliente: number
  id_tipo_observacion: number
  id_gravedad: number
  motivo: string
  monto_deuda: number | null
  resuelto: boolean
  fecha_resolucion: string | null
  id_usuario_creacion: number
  tipo?: TipoObservacion
  gravedad?: GravedadObservacion
  created_at?: string
  updated_at?: string
}

export interface ClienteObservacionRequest {
  id_tipo_observacion: number
  id_gravedad: number
  motivo: string
  monto_deuda?: number | null
}

export interface BuscarClienteResponse {
  existe: boolean
  cliente: Cliente | null
  reserva_activa?: ReservaActiva | null
}
export interface ReservaActiva {
  id_reserva: number
  codigo_reserva: string
  id_estado: number
  id_cliente: number
  id_habitacion: number
  id_tarifa: number
  fecha_entrada: string
  fecha_salida_prevista: string
  horas_base: number
  total: number
  pagado: number
  saldo: number
  habitacion?: {
    id_habitacion: number
    numero: string
    id_piso: number
    id_tipo: number
    piso?: { nombre: string }
    tipo?: { nombre: string }
  }
  tarifa?: {
    id_tarifa: number
    horas: number
    monto: number
  }
}