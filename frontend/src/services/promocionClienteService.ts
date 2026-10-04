import api from './api'
import type { PromocionCliente, PromocionClienteRequest } from '@/types/promocion'

export const promocionClienteService = {
  listar: async (): Promise<PromocionCliente[]> => {
    const { data } = await api.get('/promociones-cliente')
    return data
  },

  listarPorCliente: async (idCliente: number): Promise<PromocionCliente[]> => {
    const { data } = await api.get(`/clientes/${idCliente}/promociones`)
    return data
  },

  listarPorPromocion: async (idPromocion: number): Promise<PromocionCliente[]> => {
    const { data } = await api.get(`/promociones/${idPromocion}/clientes`)
    return data
  },

  obtener: async (id: number): Promise<PromocionCliente> => {
    const { data } = await api.get(`/promociones-cliente/${id}`)
    return data
  },

  crear: async (datos: PromocionClienteRequest): Promise<PromocionCliente> => {
    const { data } = await api.post('/promociones-cliente', datos)
    return data.data
  },

  marcarUsado: async (id: number): Promise<PromocionCliente> => {
    const { data } = await api.patch(`/promociones-cliente/${id}/usar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/promociones-cliente/${id}`)
  },
}