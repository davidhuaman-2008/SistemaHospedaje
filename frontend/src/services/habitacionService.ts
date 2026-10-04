import api from './api'
import type { Habitacion, HabitacionRequest } from '@/types/habitacion'

export const habitacionService = {
  listar: async (): Promise<Habitacion[]> => {
    const { data } = await api.get('/habitaciones')
    return data
  },

  listarActivas: async (): Promise<Habitacion[]> => {
    const { data } = await api.get('/habitaciones/activas')
    return data
  },

  listarPorPiso: async (idPiso: number): Promise<Habitacion[]> => {
    const { data } = await api.get(`/habitaciones/por-piso/${idPiso}`)
    return data
  },

  listarPorTipo: async (idTipo: number): Promise<Habitacion[]> => {
    const { data } = await api.get(`/habitaciones/por-tipo/${idTipo}`)
    return data
  },

  obtener: async (id: number): Promise<Habitacion> => {
    const { data } = await api.get(`/habitaciones/${id}`)
    return data
  },

  crear: async (datos: HabitacionRequest): Promise<Habitacion> => {
    const { data } = await api.post('/habitaciones', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<HabitacionRequest>): Promise<Habitacion> => {
    const { data } = await api.put(`/habitaciones/${id}`, datos)
    return data.data
  },

  desactivar: async (id: number): Promise<Habitacion> => {
    const { data } = await api.patch(`/habitaciones/${id}/desactivar`)
    return data.data
  },

  reactivar: async (id: number): Promise<Habitacion> => {
    const { data } = await api.patch(`/habitaciones/${id}/reactivar`)
    return data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/habitaciones/${id}`)
  },
}