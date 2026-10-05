export interface EstadoCuentaPagar {
  id_estado_cuenta: number
  nombre: string
  slug: string
  descripcion: string | null
  color: string | null
  icono: string | null
  es_estado_final: boolean
  orden: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface EstadoCuentaPagarRequest {
  nombre: string
  slug: string
  descripcion?: string | null
  color?: string | null
  icono?: string | null
  es_estado_final?: boolean
  orden?: number
  activo?: boolean
}

export interface PagoProveedor {
  id_pago_proveedor: number
  id_cuenta: number
  monto: number
  id_metodo_pago: number
  fecha_pago: string
  id_usuario: number
  referencia: string | null
  observaciones: string | null
  anulado: boolean
  id_usuario_anulacion: number | null
  fecha_anulacion: string | null
  motivo_anulacion: string | null
  metodo_pago?: {
    id_metodo: number
    nombre: string
    icono: string | null
    color: string | null
    es_de_caja: boolean
  }
  usuario?: { id: number; nombre: string; apellido: string }
}

export interface CuentaPagar {
  id_cuenta: number
  id_proveedor: number
  id_estado_cuenta: number
  id_reserva: number | null
  id_decoracion: number | null
  concepto: string
  monto: number
  monto_pagado: number
  saldo: number
  fecha_emision: string
  fecha_vencimiento: string | null
  id_usuario_creacion: number
  id_usuario_anulacion: number | null
  fecha_anulacion: string | null
  motivo_anulacion: string | null
  notas: string | null
  created_at?: string
  updated_at?: string

  proveedor?: {
    id_proveedor: number
    razon_social: string
    nombre_comercial: string | null
  }
  estado?: EstadoCuentaPagar
  reserva?: {
    id_reserva: number
    codigo_reserva: string
  }
  usuario_creacion?: { id: number; nombre: string; apellido: string }
  usuario_anulacion?: { id: number; nombre: string; apellido: string } | null
  pagos?: PagoProveedor[]
}

export interface CuentaPagarRequest {
  id_proveedor: number
  id_reserva?: number | null
  id_decoracion?: number | null
  concepto: string
  monto: number
  fecha_emision?: string
  fecha_vencimiento?: string
  notas?: string | null
}

export interface RegistrarPagoProveedorRequest {
  monto: number
  id_metodo_pago: number
  referencia?: string | null
  observaciones?: string | null
}