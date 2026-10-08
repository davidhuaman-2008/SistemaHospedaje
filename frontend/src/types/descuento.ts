// ============================================================================
// Tipos para el sistema de descuentos automaticos y manuales
// R1: Los valores vienen del backend, no hardcodeados
// ============================================================================

export interface DescuentoConfig {
  descuento_cumpleanos_porcentaje: number
  descuento_aniversario_porcentaje: number
  descuento_cumpleanos_activo: boolean
  descuento_aniversario_activo: boolean
  descuento_aplica_a: 'mayor' | 'suma'
}

export interface ResultadoDescuento {
  porcentaje: number
  motivo: string | null
  monto: number
  tipo: string | null
}

export interface DescuentoManualOpcion {
  tipo: 'aniversario' | 'cumpleanos'
  label: string
  emoji: string
  porcentaje: number
  descripcion: string
}

export interface DescuentoManualesConfig {
  habilitado: boolean
  motivo_requerido: boolean
  max_porcentaje: number
  opciones: DescuentoManualOpcion[]
}