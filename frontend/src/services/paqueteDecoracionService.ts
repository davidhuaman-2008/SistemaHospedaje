import api from './api'
import type { PaqueteDecoracion, PaqueteDecoracionRequest } from '@/types/paqueteDecoracion'

export const paqueteDecoracionService = {
  listar: async (): Promise<PaqueteDecoracion[]> => {
    const { data } = await api.get('/paquetes-decoracion')
    return data
  },

  listarActivos: async (): Promise<PaqueteDecoracion[]> => {
    const { data } = await api.get('/paquetes-decoracion/activos')
    return data
  },

  listarPorCategoria: async (categoria: string): Promise<PaqueteDecoracion[]> => {
    const { data } = await api.get(`/paquetes-decoracion/por-categoria/${categoria}`)
    return data
  },

  obtener: async (id: number): Promise<PaqueteDecoracion> => {
    const { data } = await api.get(`/paquetes-decoracion/${id}`)
    return data
  },

  crear: async (datos: PaqueteDecoracionRequest): Promise<PaqueteDecoracion> => {
    const { data } = await api.post('/paquetes-decoracion', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<PaqueteDecoracionRequest>): Promise<PaqueteDecoracion> => {
    const { data } = await api.put(`/paquetes-decoracion/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<PaqueteDecoracion> => {
    const { data } = await api.patch(`/paquetes-decoracion/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<PaqueteDecoracion> => {
    const { data } = await api.patch(`/paquetes-decoracion/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/paquetes-decoracion/${id}`)
  },
}