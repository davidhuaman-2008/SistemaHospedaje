import api from './api'
import type { TipoMantenimiento, TipoMantenimientoRequest } from '@/types/mantenimiento'

export const tipoMantenimientoService = {
  listar: async (): Promise<TipoMantenimiento[]> => {
    const { data } = await api.get('/tipos-mantenimiento')
    return data
  },
  listarActivos: async (): Promise<TipoMantenimiento[]> => {
    const { data } = await api.get('/tipos-mantenimiento/activos')
    return data
  },
  obtener: async (id: number): Promise<TipoMantenimiento> => {
    const { data } = await api.get(`/tipos-mantenimiento/${id}`)
    return data
  },
  crear: async (datos: TipoMantenimientoRequest): Promise<TipoMantenimiento> => {
    const { data } = await api.post('/tipos-mantenimiento', datos)
    return data.data
  },
  actualizar: async (id: number, datos: Partial<TipoMantenimientoRequest>): Promise<TipoMantenimiento> => {
    const { data } = await api.put(`/tipos-mantenimiento/${id}`, datos)
    return data.data
  },
  desactivar: async (id: number): Promise<TipoMantenimiento> => {
    const { data } = await api.patch(`/tipos-mantenimiento/${id}/desactivar`)
    return data.data
  },
  reactivar: async (id: number): Promise<TipoMantenimiento> => {
    const { data } = await api.patch(`/tipos-mantenimiento/${id}/reactivar`)
    return data.data
  },
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tipos-mantenimiento/${id}`)
  },
}