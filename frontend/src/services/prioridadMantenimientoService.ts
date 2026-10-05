import api from './api'
import type { PrioridadMantenimiento, PrioridadMantenimientoRequest } from '@/types/mantenimiento'

export const prioridadMantenimientoService = {
  listar: async (): Promise<PrioridadMantenimiento[]> => {
    const { data } = await api.get('/prioridades-mantenimiento')
    return data
  },
  listarActivos: async (): Promise<PrioridadMantenimiento[]> => {
    const { data } = await api.get('/prioridades-mantenimiento/activos')
    return data
  },
  obtener: async (id: number): Promise<PrioridadMantenimiento> => {
    const { data } = await api.get(`/prioridades-mantenimiento/${id}`)
    return data
  },
  crear: async (datos: PrioridadMantenimientoRequest): Promise<PrioridadMantenimiento> => {
    const { data } = await api.post('/prioridades-mantenimiento', datos)
    return data.data
  },
  actualizar: async (id: number, datos: Partial<PrioridadMantenimientoRequest>): Promise<PrioridadMantenimiento> => {
    const { data } = await api.put(`/prioridades-mantenimiento/${id}`, datos)
    return data.data
  },
  desactivar: async (id: number): Promise<PrioridadMantenimiento> => {
    const { data } = await api.patch(`/prioridades-mantenimiento/${id}/desactivar`)
    return data.data
  },
  reactivar: async (id: number): Promise<PrioridadMantenimiento> => {
    const { data } = await api.patch(`/prioridades-mantenimiento/${id}/reactivar`)
    return data.data
  },
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/prioridades-mantenimiento/${id}`)
  },
}