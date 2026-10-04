import api from './api'
import type { CategoriaPromocion, CategoriaPromocionRequest } from '@/types/promocion'

export const categoriaPromocionService = {
  listar: async (): Promise<CategoriaPromocion[]> => {
    const { data } = await api.get('/categorias-promocion')
    return data
  },

  listarActivos: async (): Promise<CategoriaPromocion[]> => {
    const { data } = await api.get('/categorias-promocion/activos')
    return data
  },

  obtener: async (id: number): Promise<CategoriaPromocion> => {
    const { data } = await api.get(`/categorias-promocion/${id}`)
    return data
  },

  crear: async (datos: CategoriaPromocionRequest): Promise<CategoriaPromocion> => {
    const { data } = await api.post('/categorias-promocion', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<CategoriaPromocionRequest>): Promise<CategoriaPromocion> => {
    const { data } = await api.put(`/categorias-promocion/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<CategoriaPromocion> => {
    const { data } = await api.patch(`/categorias-promocion/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<CategoriaPromocion> => {
    const { data } = await api.patch(`/categorias-promocion/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/categorias-promocion/${id}`)
  },
}