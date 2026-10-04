import api from './api'
import type { CategoriaProducto, CategoriaProductoRequest } from '@/types/producto'

export const categoriaProductoService = {
  listar: async (): Promise<CategoriaProducto[]> => {
    const { data } = await api.get('/categorias-producto')
    return data
  },

  listarActivos: async (): Promise<CategoriaProducto[]> => {
    const { data } = await api.get('/categorias-producto/activos')
    return data
  },

  obtener: async (id: number): Promise<CategoriaProducto> => {
    const { data } = await api.get(`/categorias-producto/${id}`)
    return data
  },

  crear: async (datos: CategoriaProductoRequest): Promise<CategoriaProducto> => {
    const { data } = await api.post('/categorias-producto', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<CategoriaProductoRequest>): Promise<CategoriaProducto> => {
    const { data } = await api.put(`/categorias-producto/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<CategoriaProducto> => {
    const { data } = await api.patch(`/categorias-producto/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<CategoriaProducto> => {
    const { data } = await api.patch(`/categorias-producto/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/categorias-producto/${id}`)
  },
}