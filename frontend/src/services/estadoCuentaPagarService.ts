import api from './api'
import type {
  EstadoCuentaPagar,
  EstadoCuentaPagarRequest,
} from '@/types/cuentaPagar'

export const estadoCuentaPagarService = {
  listar: async (): Promise<EstadoCuentaPagar[]> => {
    const { data } = await api.get('/estados-cuenta-pagar')
    return data
  },

  listarActivos: async (): Promise<EstadoCuentaPagar[]> => {
    const { data } = await api.get('/estados-cuenta-pagar/activos')
    return data
  },

  obtener: async (id: number): Promise<EstadoCuentaPagar> => {
    const { data } = await api.get(`/estados-cuenta-pagar/${id}`)
    return data
  },

  crear: async (datos: EstadoCuentaPagarRequest): Promise<EstadoCuentaPagar> => {
    const { data } = await api.post('/estados-cuenta-pagar', datos)
    return data.data
  },

  actualizar: async (
    id: number,
    datos: Partial<EstadoCuentaPagarRequest>
  ): Promise<EstadoCuentaPagar> => {
    const { data } = await api.put(`/estados-cuenta-pagar/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<EstadoCuentaPagar> => {
    const { data } = await api.patch(`/estados-cuenta-pagar/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<EstadoCuentaPagar> => {
    const { data } = await api.patch(`/estados-cuenta-pagar/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/estados-cuenta-pagar/${id}`)
  },
}