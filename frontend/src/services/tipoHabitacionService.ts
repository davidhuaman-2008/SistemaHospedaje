import api from './api'
import type { TipoHabitacion, TipoHabitacionRequest } from '@/types/configuracion'

export const tipoHabitacionService = {
  listar: async (): Promise<TipoHabitacion[]> => {
    const { data } = await api.get('/tipos-habitacion')
    return data
  },

  listarActivos: async (): Promise<TipoHabitacion[]> => {
    const { data } = await api.get('/tipos-habitacion/activos')
    return data
  },

  obtener: async (id: number): Promise<TipoHabitacion> => {
    const { data } = await api.get(`/tipos-habitacion/${id}`)
    return data
  },

  crear: async (datos: TipoHabitacionRequest): Promise<TipoHabitacion> => {
    const { data } = await api.post('/tipos-habitacion', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<TipoHabitacionRequest>): Promise<TipoHabitacion> => {
    const { data } = await api.put(`/tipos-habitacion/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<TipoHabitacion> => {
    const { data } = await api.patch(`/tipos-habitacion/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<TipoHabitacion> => {
    const { data } = await api.patch(`/tipos-habitacion/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tipos-habitacion/${id}`)
  },
}