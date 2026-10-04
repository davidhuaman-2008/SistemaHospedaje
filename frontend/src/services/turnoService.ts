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

  async crear(datos: TurnoRequest) {
    const { data } = await api.post("/turnos", datos)
    return data.data || data
  },

  async actualizar(id: number, datos: Partial<TurnoRequest>) {
    const { data } = await api.put(`/turnos/${id}`, datos)
    return data.data || data
  },

  async desactivar(id: number): Promise<Turno> {
    const { data } = await api.patch(`/turnos/${id}/desactivar`)
    return data.data || data
  },

  async reactivar(id: number): Promise<Turno> {
    const { data } = await api.patch(`/turnos/${id}/reactivar`)
    return data.data || data
  },

  async eliminar(id: number) {
    const { data } = await api.delete(`/turnos/${id}`)
    return data
  },
}