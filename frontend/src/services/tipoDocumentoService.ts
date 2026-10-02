import api from './api'
import type { TipoDocumento, TipoDocumentoRequest } from '@/types/configuracion'

export const tipoDocumentoService = {
  listar: async (): Promise<TipoDocumento[]> => {
    const { data } = await api.get('/tipos-documento')
    return data
  },

  listarActivos: async (): Promise<TipoDocumento[]> => {
    const { data } = await api.get('/tipos-documento/activos')
    return data
  },

  obtener: async (id: number): Promise<TipoDocumento> => {
    const { data } = await api.get(`/tipos-documento/${id}`)
    return data
  },

  crear: async (datos: TipoDocumentoRequest): Promise<TipoDocumento> => {
    const { data } = await api.post('/tipos-documento', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<TipoDocumentoRequest>): Promise<TipoDocumento> => {
    const { data } = await api.put(`/tipos-documento/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<TipoDocumento> => {
    const { data } = await api.patch(`/tipos-documento/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<TipoDocumento> => {
    const { data } = await api.patch(`/tipos-documento/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tipos-documento/${id}`)
  },
}