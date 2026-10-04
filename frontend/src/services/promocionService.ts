import api from './api'
import type { Promocion, PromocionRequest } from '@/types/promocion'

export const promocionService = {
  listar: async (): Promise<Promocion[]> => {
    const { data } = await api.get('/promociones')
    return data
  },

  listarActivas: async (): Promise<Promocion[]> => {
    const { data } = await api.get('/promociones/activas')
    return data
  },

  listarVigentes: async (): Promise<Promocion[]> => {
    const { data } = await api.get('/promociones/vigentes')
    return data
  },

  listarPorCategoria: async (idCategoria: number): Promise<Promocion[]> => {
    const { data } = await api.get(`/promociones/por-categoria/${idCategoria}`)
    return data
  },

  obtener: async (id: number): Promise<Promocion> => {
    const { data } = await api.get(`/promociones/${id}`)
    return data
  },

  crear: async (datos: PromocionRequest): Promise<Promocion> => {
    const { data } = await api.post('/promociones', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<PromocionRequest>): Promise<Promocion> => {
    const { data } = await api.put(`/promociones/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Promocion> => {
    const { data } = await api.patch(`/promociones/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Promocion> => {
    const { data } = await api.patch(`/promociones/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/promociones/${id}`)
  },
}