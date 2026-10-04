import api from './api'
import type { Cliente, ClienteRequest } from '@/types/cliente'

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/clientes')
    return data
  },

  listarActivos: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/clientes/activos')
    return data
  },

  /**
   * Busca un cliente por DNI.
   * El backend devuelve: { existe: boolean, cliente: Cliente | null }
   * Este método devuelve solo el cliente (o null).
   */
  buscarPorDni: async (dni: string): Promise<Cliente | null> => {
    const { data } = await api.get('/clientes/buscar', { params: { dni } })
    if (data && data.existe && data.cliente) {
      return data.cliente
    }
    return null
  },

  obtener: async (id: number): Promise<Cliente> => {
    const { data } = await api.get(`/clientes/${id}`)
    return data
  },

  crear: async (datos: ClienteRequest): Promise<Cliente> => {
    const { data } = await api.post('/clientes', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<ClienteRequest>): Promise<Cliente> => {
    const { data } = await api.put(`/clientes/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Cliente> => {
    const { data } = await api.patch(`/clientes/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Cliente> => {
    const { data } = await api.patch(`/clientes/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`)
  },

  listarVisitas: async (idCliente: number) => {
    const { data } = await api.get(`/clientes/${idCliente}/visitas`)
    return data
  },

  crearVisita: async (idCliente: number, datos: any) => {
    const { data } = await api.post(`/clientes/${idCliente}/visitas`, datos)
    return data.data
  },
}