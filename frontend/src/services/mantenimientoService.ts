import api from './api'
import type {
  Mantenimiento,
  MantenimientoRequest,
  MantenimientoPendientesResponse,
} from '@/types/mantenimiento'

export const mantenimientoService = {
  listar: async (): Promise<Mantenimiento[]> => {
    const { data } = await api.get('/mantenimiento')
    return data
  },

  listarPendientes: async (): Promise<MantenimientoPendientesResponse> => {
    const { data } = await api.get('/mantenimiento/pendientes')
    return data
  },

  porHabitacion: async (idHabitacion: number): Promise<Mantenimiento[]> => {
    const { data } = await api.get(`/mantenimiento/habitacion/${idHabitacion}`)
    return data
  },

  obtener: async (id: number): Promise<Mantenimiento> => {
    const { data } = await api.get(`/mantenimiento/${id}`)
    return data
  },

  crear: async (datos: MantenimientoRequest): Promise<Mantenimiento> => {
    const { data } = await api.post('/mantenimiento', datos)
    return data.data
  },

  iniciar: async (id: number): Promise<Mantenimiento> => {
    const { data } = await api.patch(`/mantenimiento/${id}/iniciar`)
    return data.data
  },

  resolver: async (id: number, observaciones?: string): Promise<Mantenimiento> => {
    const { data } = await api.patch(`/mantenimiento/${id}/resolver`, { observaciones })
    return data.data
  },

  cancelar: async (id: number, motivo: string): Promise<Mantenimiento> => {
    const { data } = await api.patch(`/mantenimiento/${id}/cancelar`, { motivo })
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/mantenimiento/${id}`)
  },
}