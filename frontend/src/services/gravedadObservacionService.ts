import api from './api'
import type { GravedadObservacion, GravedadObservacionRequest } from '@/types/gravedadObservacion'

export const gravedadObservacionService = {
  listar: async (): Promise<GravedadObservacion[]> => {
    const { data } = await api.get('/gravedades-observacion')
    return data
  },

  listarActivos: async (): Promise<GravedadObservacion[]> => {
    const { data } = await api.get('/gravedades-observacion/activos')
    return data
  },

  obtener: async (id: number): Promise<GravedadObservacion> => {
    const { data } = await api.get(`/gravedades-observacion/${id}`)
    return data
  },

  crear: async (datos: GravedadObservacionRequest): Promise<GravedadObservacion> => {
    const { data } = await api.post('/gravedades-observacion', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<GravedadObservacionRequest>): Promise<GravedadObservacion> => {
    const { data } = await api.put(`/gravedades-observacion/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<GravedadObservacion> => {
    const { data } = await api.patch(`/gravedades-observacion/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<GravedadObservacion> => {
    const { data } = await api.patch(`/gravedades-observacion/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/gravedades-observacion/${id}`)
  },
}