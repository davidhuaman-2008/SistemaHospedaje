import api from './api'
import type { CategoriaMovimiento, CategoriaMovimientoRequest, TipoMovimiento } from '@/types/configuracion'

export const categoriaMovimientoService = {
  listar: async (tipo?: TipoMovimiento): Promise<CategoriaMovimiento[]> => {
    const url = tipo ? `/categorias-movimiento?tipo=${tipo}` : '/categorias-movimiento'
    const { data } = await api.get(url)
    return data
  },

  listarActivos: async (): Promise<CategoriaMovimiento[]> => {
    const { data } = await api.get('/categorias-movimiento/activos')
    return data
  },

  obtener: async (id: number): Promise<CategoriaMovimiento> => {
    const { data } = await api.get(`/categorias-movimiento/${id}`)
    return data
  },

  crear: async (datos: CategoriaMovimientoRequest): Promise<CategoriaMovimiento> => {
    const { data } = await api.post('/categorias-movimiento', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<CategoriaMovimientoRequest>): Promise<CategoriaMovimiento> => {
    const { data } = await api.put(`/categorias-movimiento/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<CategoriaMovimiento> => {
    const { data } = await api.patch(`/categorias-movimiento/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<CategoriaMovimiento> => {
    const { data } = await api.patch(`/categorias-movimiento/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/categorias-movimiento/${id}`)
  },
}