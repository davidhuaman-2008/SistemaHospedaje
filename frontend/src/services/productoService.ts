import api from './api'
import type { Producto, ProductoRequest } from '@/types/producto'

export const productoService = {
  listar: async (): Promise<Producto[]> => {
    const { data } = await api.get('/productos')
    return data
  },

  listarActivos: async (): Promise<Producto[]> => {
    const { data } = await api.get('/productos/activos')
    return data
  },

  listarStockBajo: async (): Promise<Producto[]> => {
    const { data } = await api.get('/productos/stock-bajo')
    return data
  },

  listarPorCategoria: async (idCategoria: number): Promise<Producto[]> => {
    const { data } = await api.get(`/productos/por-categoria/${idCategoria}`)
    return data
  },

  obtener: async (id: number): Promise<Producto> => {
    const { data } = await api.get(`/productos/${id}`)
    return data
  },

  crear: async (datos: ProductoRequest): Promise<Producto> => {
    const { data } = await api.post('/productos', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<ProductoRequest>): Promise<Producto> => {
    const { data } = await api.put(`/productos/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Producto> => {
    const { data } = await api.patch(`/productos/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Producto> => {
    const { data } = await api.patch(`/productos/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`)
  },
}