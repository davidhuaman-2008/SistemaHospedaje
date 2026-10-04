import api from './api'
import type { Configuracion } from '@/types/reserva'

export const configuracionSistemaService = {
  listar: async (): Promise<Configuracion[]> => {
    const { data } = await api.get('/configuraciones')
    return data
  },

  porGrupo: async (grupo: string): Promise<Configuracion[]> => {
    const { data } = await api.get(`/configuraciones/grupo/${grupo}`)
    return data
  },

  actualizar: async (clave: string, valor: string): Promise<Configuracion> => {
    const { data } = await api.put(`/configuraciones/${clave}`, { valor })
    return data.data
  },
}