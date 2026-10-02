import api from './api'
import type { Piso, PisoRequest } from '@/types/configuracion'

export const pisoService = {
  listar: async (): Promise<Piso[]> => {
    const { data } = await api.get('/pisos')
    return data
  },

  listarActivos: async (): Promise<Piso[]> => {
    const { data } = await api.get('/pisos/activos')
    return data
  },

  obtener: async (id: number): Promise<Piso> => {
    const { data } = await api.get(`/pisos/${id}`)
    return data
  },

  crear: async (datos: PisoRequest): Promise<Piso> => {
    const { data } = await api.post('/pisos', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<PisoRequest>): Promise<Piso> => {
    const { data } = await api.put(`/pisos/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Piso> => {
    const { data } = await api.patch(`/pisos/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Piso> => {
    const { data } = await api.patch(`/pisos/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/pisos/${id}`)
  },
}