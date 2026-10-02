import api from './api'
import type { TipoObservacion, TipoObservacionRequest } from '@/types/tipoObservacion'

export const tipoObservacionService = {
  listar: async (): Promise<TipoObservacion[]> => {
    const { data } = await api.get('/tipos-observacion')
    return data
  },

  listarActivos: async (): Promise<TipoObservacion[]> => {
    const { data } = await api.get('/tipos-observacion/activos')
    return data
  },

  obtener: async (id: number): Promise<TipoObservacion> => {
    const { data } = await api.get(`/tipos-observacion/${id}`)
    return data
  },

  crear: async (datos: TipoObservacionRequest): Promise<TipoObservacion> => {
    const { data } = await api.post('/tipos-observacion', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<TipoObservacionRequest>): Promise<TipoObservacion> => {
    const { data } = await api.put(`/tipos-observacion/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<TipoObservacion> => {
    const { data } = await api.patch(`/tipos-observacion/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<TipoObservacion> => {
    const { data } = await api.patch(`/tipos-observacion/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tipos-observacion/${id}`)
  },
}