import api from './api'
import type { Limpieza, LimpiezaPendientesResponse, CrearLimpiezaRequest } from '@/types/limpieza'

export const limpiezaService = {
  /**
   * Lista todas las limpiezas.
   */
  listar: async (): Promise<Limpieza[]> => {
    const { data } = await api.get('/limpieza')
    return data
  },

  /**
   * Lista pendientes + en proceso + completadas hoy.
   */
  listarPendientes: async (): Promise<LimpiezaPendientesResponse> => {
    const { data } = await api.get('/limpieza/pendientes')
    return data
  },

  /**
   * Crea una limpieza manual (ej: profunda).
   */
  crear: async (datos: CrearLimpiezaRequest): Promise<Limpieza> => {
    const { data } = await api.post('/limpieza', datos)
    return data.data
  },

  /**
   * Inicia una limpieza (PENDIENTE → EN_PROCESO).
   */
  iniciar: async (id: number): Promise<Limpieza> => {
    const { data } = await api.patch(`/limpieza/${id}/iniciar`)
    return data.data
  },

  /**
   * Finaliza una limpieza (EN_PROCESO → COMPLETADA).
   */
  finalizar: async (id: number, observaciones?: string): Promise<Limpieza> => {
    const { data } = await api.patch(`/limpieza/${id}/finalizar`, {
      observaciones,
    })
    return data.data
  },

  /**
   * Finaliza TODAS las limpiezas activas de una vez (Limpieza Rápida).
   */
  finalizarTodas: async (observaciones?: string): Promise<{ total: number; ids: number[] }> => {
    const { data } = await api.patch('/limpieza/finalizar-todas', {
      observaciones,
    })
    return data.data
  },
}