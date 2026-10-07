import api from "@/services/api"
import type { Turno } from "@/types"

export interface TurnoRequest {
  nombre: string
  hora_inicio: string
  hora_fin: string
  descripcion?: string
  activo?: boolean
}

export const turnoService = {
  async listar(): Promise<Turno[]> {
    const { data } = await api.get<Turno[]>("/turnos")
    return data
  },

  async listarActivos(): Promise<Turno[]> {
    const { data } = await api.get<Turno[]>("/turnos/activos")
    return data
  },

  async obtener(id: number): Promise<Turno> {
    const { data } = await api.get<Turno>(`/turnos/${id}`)
    return data
  },

  async crear(datos: TurnoRequest): Promise<Turno> {
    const { data } = await api.post("/turnos", datos)
    return data.data
  },

  async actualizar(id: number, datos: Partial<TurnoRequest>): Promise<Turno> {
    const { data } = await api.put(`/turnos/${id}`, datos)
    return data.data
  },

  async desactivar(id: number): Promise<Turno> {
    const { data } = await api.patch(`/turnos/${id}/desactivar`)
    return data.data
  },

  async reactivar(id: number): Promise<Turno> {
    const { data } = await api.patch(`/turnos/${id}/reactivar`)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/turnos/${id}`)
  },
}