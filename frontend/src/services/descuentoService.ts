import api from './api'
import type { DescuentoConfig, DescuentoManualesConfig } from '@/types/descuento'

/**
 * Servicio de descuentos.
 * R1: NADA hardcodeado. Todo viene de la BD.
 */
export const descuentoService = {
  /**
   * Obtiene las configuraciones de descuentos automaticos.
   * Endpoint: GET /api/descuentos/config
   */
  obtenerConfiguraciones: async (): Promise<DescuentoConfig> => {
    const { data } = await api.get<DescuentoConfig>('/descuentos/config')
    return data
  },

  /**
   * Obtiene las opciones de descuentos manuales disponibles.
   * Endpoint: GET /api/descuentos/manuales
   */
  obtenerManuales: async (): Promise<DescuentoManualesConfig> => {
    const { data } = await api.get<DescuentoManualesConfig>('/descuentos/manuales')
    return data
  },
}