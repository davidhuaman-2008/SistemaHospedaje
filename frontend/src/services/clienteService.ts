import api from './api'
import type {
  Cliente,
  ClienteRequest,
  ClienteVisita,
  ClienteVisitaRequest,
  ClienteObservacion,
  ClienteObservacionRequest,
  BuscarClienteResponse,
} from '@/types/cliente'

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/clientes')
    return data
  },

  listarActivos: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/clientes/activos')
    return data
  },

  buscarPorDni: async (dni: string): Promise<BuscarClienteResponse> => {
    const { data } = await api.get(`/clientes/buscar?dni=${encodeURIComponent(dni)}`)
    return data
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

  listarVisitas: async (idCliente: number): Promise<ClienteVisita[]> => {
    const { data } = await api.get(`/clientes/${idCliente}/visitas`)
    return data
  },

  crearVisita: async (idCliente: number, datos: ClienteVisitaRequest): Promise<ClienteVisita> => {
    const { data } = await api.post(`/clientes/${idCliente}/visitas`, datos)
    return data.data
  },

  listarObservaciones: async (idCliente: number): Promise<ClienteObservacion[]> => {
    const { data } = await api.get(`/clientes/${idCliente}/observaciones`)
    return data
  },

  crearObservacion: async (idCliente: number, datos: ClienteObservacionRequest): Promise<ClienteObservacion> => {
    const { data } = await api.post(`/clientes/${idCliente}/observaciones`, datos)
    return data.data
  },

  resolverObservacion: async (id: number): Promise<ClienteObservacion> => {
    const { data } = await api.patch(`/cliente-observaciones/${id}/resolver`)
    return data.data
  },

  eliminarObservacion: async (id: number): Promise<void> => {
    await api.delete(`/cliente-observaciones/${id}`)
  },
}