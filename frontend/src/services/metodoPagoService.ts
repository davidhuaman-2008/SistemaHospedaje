import api from './api'
import type { MetodoPago, MetodoPagoRequest } from '@/types/configuracion'

export const metodoPagoService = {
  listar: async (): Promise<MetodoPago[]> => {
    const { data } = await api.get('/metodos-pago')
    return data
  },

  listarActivos: async (): Promise<MetodoPago[]> => {
    const { data } = await api.get('/metodos-pago/activos')
    return data
  },

  listarDeCaja: async (): Promise<MetodoPago[]> => {
    const { data } = await api.get('/metodos-pago/de-caja')
    return data
  },

  listarDeDuenia: async (): Promise<MetodoPago[]> => {
    const { data } = await api.get('/metodos-pago/de-duenia')
    return data
  },

  obtener: async (id: number): Promise<MetodoPago> => {
    const { data } = await api.get(`/metodos-pago/${id}`)
    return data
  },

  crear: async (datos: MetodoPagoRequest): Promise<MetodoPago> => {
    const { data } = await api.post('/metodos-pago', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<MetodoPagoRequest>): Promise<MetodoPago> => {
    const { data } = await api.put(`/metodos-pago/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<MetodoPago> => {
    const { data } = await api.patch(`/metodos-pago/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<MetodoPago> => {
    const { data } = await api.patch(`/metodos-pago/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/metodos-pago/${id}`)
  },
}