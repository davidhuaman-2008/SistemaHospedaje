import api from './api'
import type { Usuario, CrearUsuarioRequest } from '@/types'

export const usuarioService = {
  listar: async (): Promise<Usuario[]> => {
    const { data } = await api.get('/usuarios')
    return data
  },

  listarActivos: async (): Promise<Usuario[]> => {
    const { data } = await api.get('/usuarios/activos')
    return data
  },

  obtener: async (id: number): Promise<Usuario> => {
    const { data } = await api.get(`/usuarios/${id}`)
    return data
  },

  crear: async (datos: CrearUsuarioRequest): Promise<Usuario> => {
    const { data } = await api.post('/usuarios', datos)
    return data.data || data
  },

  actualizar: async (id: number, datos: Partial<CrearUsuarioRequest>): Promise<Usuario> => {
    const { data } = await api.put(`/usuarios/${id}`, datos)
    return data.data || data
  },

  desactivar: async (id: number): Promise<Usuario> => {
    const { data } = await api.patch(`/usuarios/${id}/desactivar`)
    return data.data || data
  },

  reactivar: async (id: number): Promise<Usuario> => {
    const { data } = await api.patch(`/usuarios/${id}/reactivar`)
    return data.data || data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`)
  },
}