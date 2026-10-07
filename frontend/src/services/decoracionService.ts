import api from './api'
import type { Decoracion, DecoracionRequest, EstadoDecoracion } from '@/types/decoracion'

export const decoracionService = {
  listar: async (): Promise<Decoracion[]> => {
    const { data } = await api.get('/decoraciones')
    return data
  },

  listarActivas: async (): Promise<Decoracion[]> => {
    const { data } = await api.get('/decoraciones/activas')
    return data
  },

  listarProximas: async (): Promise<Decoracion[]> => {
    const { data } = await api.get('/decoraciones/proximas')
    return data
  },

  listarPorReserva: async (idReserva: number): Promise<Decoracion[]> => {
    const { data } = await api.get(`/decoraciones/por-reserva/${idReserva}`)
    return data
  },

  listarPorProveedor: async (idProveedor: number): Promise<Decoracion[]> => {
    const { data } = await api.get(`/decoraciones/por-proveedor/${idProveedor}`)
    return data
  },

  obtener: async (id: number): Promise<Decoracion> => {
    const { data } = await api.get(`/decoraciones/${id}`)
    return data
  },

  crear: async (datos: DecoracionRequest): Promise<Decoracion> => {
    const { data } = await api.post('/decoraciones', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<DecoracionRequest>): Promise<Decoracion> => {
    const { data } = await api.put(`/decoraciones/${id}`, datos)
    return data.data
  },

  cambiarEstado: async (
    id: number,
    estado: EstadoDecoracion,
    observaciones?: string
  ): Promise<Decoracion> => {
    const { data } = await api.patch(`/decoraciones/${id}/estado`, { estado, observaciones })
    return data.data
  },

  registrarAdelanto: async (
    id: number,
    monto: number,
    idMetodoPago: number
  ): Promise<Decoracion> => {
    const { data } = await api.post(`/decoraciones/${id}/adelanto`, {
      monto,
      id_metodo_pago: idMetodoPago,
    })
    return data.data
  },

  anular: async (id: number, motivo: string): Promise<Decoracion> => {
    const { data } = await api.patch(`/decoraciones/${id}/anular`, { motivo })
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/decoraciones/${id}`)
  },
}