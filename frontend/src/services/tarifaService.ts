import api from './api'
import type { Tarifa, TarifaRequest } from '@/types/tarifa'

export const tarifaService = {
  listar: async (): Promise<Tarifa[]> => {
    const { data } = await api.get('/tarifas')
    return data
  },

  listarActivos: async (): Promise<Tarifa[]> => {
    const { data } = await api.get('/tarifas/activos')
    return data
  },

  listarPorTipo: async (idTipo: number): Promise<Tarifa[]> => {
    const { data } = await api.get(`/tarifas/por-tipo/${idTipo}`)
    return data
  },

  obtener: async (id: number): Promise<Tarifa> => {
    const { data } = await api.get(`/tarifas/${id}`)
    return data
  },

  crear: async (datos: TarifaRequest): Promise<Tarifa> => {
    const { data } = await api.post('/tarifas', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<TarifaRequest>): Promise<Tarifa> => {
    const { data } = await api.put(`/tarifas/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Tarifa> => {
    const { data } = await api.patch(`/tarifas/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Tarifa> => {
    const { data } = await api.patch(`/tarifas/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tarifas/${id}`)
  },
}