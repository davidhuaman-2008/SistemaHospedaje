import api from './api'
import type { ClienteNivel, ClienteNivelRequest } from '@/types/configuracion'

export const clienteNivelService = {
  listar: async (): Promise<ClienteNivel[]> => {
    const { data } = await api.get('/clientes-niveles')
    return data
  },

  listarActivos: async (): Promise<ClienteNivel[]> => {
    const { data } = await api.get('/clientes-niveles/activos')
    return data
  },

  obtener: async (id: number): Promise<ClienteNivel> => {
    const { data } = await api.get(`/clientes-niveles/${id}`)
    return data
  },

  crear: async (datos: ClienteNivelRequest): Promise<ClienteNivel> => {
    const { data } = await api.post('/clientes-niveles', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<ClienteNivelRequest>): Promise<ClienteNivel> => {
    const { data } = await api.put(`/clientes-niveles/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<ClienteNivel> => {
    const { data } = await api.patch(`/clientes-niveles/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<ClienteNivel> => {
    const { data } = await api.patch(`/clientes-niveles/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/clientes-niveles/${id}`)
  },
}