import api from './api'
import type {
  ClienteObservacion,
  ClienteObservacionRequest,
} from '@/types/cliente'

export const clienteObservacionService = {
  porCliente: async (idCliente: number): Promise<ClienteObservacion[]> => {
    const { data } = await api.get(`/clientes/${idCliente}/observaciones`)
    return data
  },

  listar: async (): Promise<ClienteObservacion[]> => {
    const { data } = await api.get('/cliente-observaciones')
    return data
  },

  obtener: async (id: number): Promise<ClienteObservacion> => {
    const { data } = await api.get(`/cliente-observaciones/${id}`)
    return data
  },

  crear: async (
    idCliente: number,
    datos: ClienteObservacionRequest
  ): Promise<ClienteObservacion> => {
    const { data } = await api.post(`/clientes/${idCliente}/observaciones`, datos)
    return data.data
  },

  resolver: async (id: number): Promise<ClienteObservacion> => {
    const { data } = await api.patch(`/cliente-observaciones/${id}/resolver`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/cliente-observaciones/${id}`)
  },
}