import api from './api'
import type { Proveedor, ProveedorRequest } from '@/types/producto'

export const proveedorService = {
  listar: async (): Promise<Proveedor[]> => {
    const { data } = await api.get('/proveedores')
    return data
  },

  listarActivos: async (): Promise<Proveedor[]> => {
    const { data } = await api.get('/proveedores/activos')
    return data
  },

  obtener: async (id: number): Promise<Proveedor> => {
    const { data } = await api.get(`/proveedores/${id}`)
    return data
  },

  crear: async (datos: ProveedorRequest): Promise<Proveedor> => {
    const { data } = await api.post('/proveedores', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<ProveedorRequest>): Promise<Proveedor> => {
    const { data } = await api.put(`/proveedores/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Proveedor> => {
    const { data } = await api.patch(`/proveedores/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Proveedor> => {
    const { data } = await api.patch(`/proveedores/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/proveedores/${id}`)
  },
}